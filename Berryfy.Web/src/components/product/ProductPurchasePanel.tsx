"use client";

import { useState } from "react";
import Link from "next/link";
import AddToCartForm from "../cart/AddToCartForm";

interface ProductPurchasePanelProps {
  productId: number;
  price: number;
  stockQuantity: number;
  reservedStock: number;
  lowStockThreshold: number;
  isActive: boolean;
  /**
   * WishlistButton fetches the current user/wishlist state server-side, so it
   * has to be rendered by the (Server Component) page and passed in here
   * rather than imported directly into this client component.
   */
  wishlistSlot: React.ReactNode;
}

export default function ProductPurchasePanel({
  productId,
  price,
  stockQuantity,
  reservedStock,
  lowStockThreshold,
  isActive,
  wishlistSlot,
}: ProductPurchasePanelProps) {
  // Quantity added to the cart from this page so far this session, so the
  // Availability/Stock badges below decrement instantly on "Add to Cart"
  // instead of waiting on a server round-trip / page reload.
  const [pendingAdded, setPendingAdded] = useState(0);

  const displayStockQuantity = Math.max(0, stockQuantity - pendingAdded);
  const availableStock = stockQuantity - reservedStock;
  const displayAvailableStock = Math.max(0, availableStock - pendingAdded);
  const isInStock = isActive && availableStock > 0;

  const stockStatus =
    displayStockQuantity <= lowStockThreshold
      ? "danger"
      : displayStockQuantity <= lowStockThreshold * 2
      ? "warning"
      : "success";

  const stockIcon =
    stockStatus === "danger"
      ? "bi-exclamation-triangle-fill"
      : stockStatus === "warning"
      ? "bi-exclamation-circle-fill"
      : "bi-check-circle-fill";

  return (
    <>
      <div className="mb-4">
        <div className="row">
          <div className="col-sm-6">
            <h6>Availability</h6>
            <span className={`badge bg-${stockStatus} fs-6`}>
              <i className={`bi ${stockIcon} me-1`}></i>
              {stockStatus === "success"
                ? "In Stock"
                : `Only ${displayStockQuantity} left`}
            </span>
          </div>
          <div className="col-sm-6">
            <h6>Stock</h6>
            <span className="badge bg-secondary fs-6">
              <i className="bi bi-box-seam me-1"></i>
              {displayAvailableStock} available
            </span>
          </div>
        </div>
      </div>

      <div className="d-grid gap-2">
        <AddToCartForm
          productId={productId}
          availableStock={availableStock}
          isInStock={isInStock}
          unitPrice={price}
          onPendingQuantityChange={setPendingAdded}
          showQuantitySelector={true}
          buttonSize="lg"
          className="btn btn-primary w-100"
        />

        <div className="row g-2">
          <div className="col">{wishlistSlot}</div>
          <div className="col">
            <Link href="#" className="btn btn-outline-info w-100">
              <i className="bi bi-share me-2"></i>Share
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
