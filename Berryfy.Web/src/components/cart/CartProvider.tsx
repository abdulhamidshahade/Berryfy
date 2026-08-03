"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useOptimistic,
  useState,
} from "react";
import { CartDto } from "../../types/cart";

interface CartSummary {
  itemCount: number;
  total: number;
}

interface CartContextValue extends CartSummary {
  /**
   * Optimistically apply a pending change to the badge/total right away.
   * Must be called from inside a startTransition (e.g. the one wrapping the
   * addToCart server action call) so React can reconcile/roll it back
   * automatically once the transition settles.
   */
  addOptimistic: (quantity: number, priceDelta: number) => void;
  /**
   * Replace the summary with the authoritative cart returned by the server
   * action once it resolves successfully.
   */
  confirm: (cart: CartDto) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function summarize(cart: CartDto | null | undefined): CartSummary {
  if (!cart || !cart.cartItems) {
    return { itemCount: 0, total: 0 };
  }
  return {
    itemCount: cart.cartItems.reduce((sum, item) => sum + item.quantity, 0),
    total: cart.total || 0,
  };
}

export function CartProvider({
  initialItemCount = 0,
  initialTotal = 0,
  children,
}: {
  initialItemCount?: number;
  initialTotal?: number;
  children: React.ReactNode;
}) {
  const [cartSummary, setCartSummary] = useState<CartSummary>({
    itemCount: initialItemCount,
    total: initialTotal,
  });

  // The "real" summary above only changes once a server action resolves and
  // calls confirm(). Until then, any addOptimistic() calls layer a pending
  // delta on top. If the action fails and confirm() is never called, React
  // discards the pending delta as soon as the transition settles - giving us
  // rollback-on-error for free.
  const [optimisticSummary, applyOptimisticDelta] = useOptimistic(
    cartSummary,
    (state, delta: { quantity: number; priceDelta: number }): CartSummary => ({
      itemCount: state.itemCount + delta.quantity,
      total: state.total + delta.priceDelta,
    })
  );

  const addOptimistic = useCallback(
    (quantity: number, priceDelta: number) => {
      applyOptimisticDelta({ quantity, priceDelta });
    },
    [applyOptimisticDelta]
  );

  const confirm = useCallback((cart: CartDto) => {
    setCartSummary(summarize(cart));
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      itemCount: optimisticSummary.itemCount,
      total: optimisticSummary.total,
      addOptimistic,
      confirm,
    }),
    [optimisticSummary, addOptimistic, confirm]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
