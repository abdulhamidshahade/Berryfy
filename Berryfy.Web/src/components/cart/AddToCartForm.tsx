"use client";

import { useEffect, useOptimistic, useRef, useState, useTransition } from "react";
import { addToCart } from '../../lib/actions/cart-actions';
import { useCart } from './CartProvider';

interface AddToCartFormProps {
  productId: number;
  availableStock: number;
  isInStock: boolean;
  unitPrice?: number;
  showQuantitySelector?: boolean;
  buttonText?: string;
  buttonSize?: 'sm' | 'lg';
  className?: string;
  onPendingQuantityChange?: (pendingQuantity: number) => void;
}

export default function AddToCartForm({
  productId,
  availableStock,
  isInStock,
  unitPrice = 0,
  showQuantitySelector = false,
  buttonText,
  buttonSize = 'lg',
  className = "btn btn-primary w-100",
  onPendingQuantityChange,
}: AddToCartFormProps) {
  const cart = useCart();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [confirmedQuantity, setConfirmedQuantity] = useState(0);
  const [pendingQuantity, addPendingQuantity] = useOptimistic(
    confirmedQuantity,
    (state: number, quantity: number) => state + quantity
  );

  const effectiveAvailable = Math.max(0, availableStock - pendingQuantity);
  const effectiveInStock = isInStock && effectiveAvailable > 0;

  const lastReportedRef = useRef<number | null>(null);
  useEffect(() => {
    if (lastReportedRef.current === pendingQuantity) return;
    lastReportedRef.current = pendingQuantity;
    onPendingQuantityChange?.(pendingQuantity);
  }, [pendingQuantity, onPendingQuantityChange]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const quantity = parseInt(formData.get("quantity") as string, 10) || 1;

    if (quantity > effectiveAvailable) {
      setError(`Only ${effectiveAvailable} left in stock`);
      return;
    }

    startTransition(async () => {
      addPendingQuantity(quantity);
      cart.addOptimistic(quantity, unitPrice * quantity);
      try {
        const updatedCart = await addToCart(formData);
        setConfirmedQuantity((prev) => prev + quantity);
        cart.confirm(updatedCart);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add item to cart");
      }
    });
  }

  const buttonClassName = `${className} ${buttonSize === 'lg' ? 'btn-lg' : buttonSize === 'sm' ? 'btn-sm' : ''}`;
  const buttonLabel = isPending
    ? 'Adding...'
    : (buttonText || (!effectiveInStock ? 'Out of Stock' : 'Add to Cart'));

  return (
    <form onSubmit={handleSubmit} className="w-100">
      <input type="hidden" name="productId" value={productId} />

      {showQuantitySelector && effectiveInStock ? (
        <div className="row g-2 mb-3">
          <div className="col-4">
            <label htmlFor={`quantity-${productId}`} className="form-label">Quantity:</label>
            <input
              type="number"
              name="quantity"
              id={`quantity-${productId}`}
              className="form-control"
              defaultValue={1}
              min={1}
              max={Math.max(1, Math.min(20, effectiveAvailable))}
            />
          </div>
          <div className="col-8 d-flex align-items-end">
            <button
              type="submit"
              className={buttonClassName}
              disabled={!effectiveInStock || isPending}
            >
              <i className="bi bi-cart-plus me-1"></i>
              {buttonLabel}
            </button>
          </div>
          {error && (
            <div className="col-12">
              <div className="text-danger small mt-1">{error}</div>
            </div>
          )}
        </div>
      ) : (
        <>
          <input type="hidden" name="quantity" value="1" />
          <button
            type="submit"
            className={buttonClassName}
            disabled={!effectiveInStock || isPending}
          >
            <i className="bi bi-cart-plus me-1"></i>
            {buttonLabel}
          </button>
          {error && <div className="text-danger small mt-1">{error}</div>}
        </>
      )}
    </form>
  );
}