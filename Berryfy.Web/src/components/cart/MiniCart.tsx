"use client";

import Link from 'next/link';
import { formatCurrency } from '../../lib/utils/formatCurrency';
import { useCart } from './CartProvider';

export default function MiniCart() {
  const { itemCount, total } = useCart();
  const hasItems = itemCount > 0;
  const totalPrice = formatCurrency(total || 0);

  return (
    <Link href="/cart" className="btn btn-outline-light d-inline-flex align-items-center gap-2">
      <span className="position-relative d-inline-flex flex-column align-items-center lh-1">
        <i className="bi bi-cart3"></i>
        <small className="mt-1 fw-semibold">{totalPrice}</small>
        {hasItems && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        )}
      </span>
      <span className="d-none d-md-inline ms-2">
        Cart{hasItems && ` (${itemCount})`}
      </span>
    </Link>
  );
}