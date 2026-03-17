"use client";

import React from "react";
import { observer } from "mobx-react-lite";
import cn from "classnames";
import cartStore from "@store/CartStore";
import { Button, QuantityControl } from "@components/index";
import { useCartActions } from "@store/hooks/useCartActions";
import { type FormattedProduct } from "@/app/api/types";
import { type ButtonVariant } from "@components/Button/configs";

import styles from "./ProductAction.module.scss";

interface ProductActionProps {
  product: FormattedProduct;
  className?: string;
  variant?: ButtonVariant;
}

const ProductAction: React.FC<ProductActionProps> = observer(
  ({ product, className, variant = "primary" }) => {
    const { handleAddToCart } = useCartActions();

    const labels = !product.isInStock
      ? { desktop: "Not Available", mobile: "Not" }
      : { desktop: "Add To Cart", mobile: "Add" };

    const cartItem = cartStore.items.find(
      (item) => item.product.documentId === product.documentId,
    );

    return (
      <div
        className={cn(styles.actionWrapper, className)}
        onClick={(e) => e.stopPropagation()}
      >
        {cartItem ? (
          <QuantityControl
            id={cartItem.product.id}
            quantity={cartItem.quantity}
          />
        ) : (
          <Button
            variant={variant}
            disabled={!product.isInStock}
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart(e, product);
            }}
            className={styles.button}
          >
            <span className={styles.desktopLabel}>{labels.desktop}</span>
            <span className={styles.mobileLabel}>{labels.mobile}</span>
          </Button>
        )}
      </div>
    );
  },
);

export default ProductAction;
