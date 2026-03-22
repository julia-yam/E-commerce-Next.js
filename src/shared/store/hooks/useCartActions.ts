import React, { useCallback } from "react";
import cartStore from "@store/CartStore";
import { type FormattedProduct } from "@/app/api/types";

export const useCartActions = () => {
  const handleAddToCart = useCallback(
    (e: React.MouseEvent, product: FormattedProduct) => {
      e.stopPropagation();
      e.preventDefault();

      cartStore.addToCart(product);
    },
    [],
  );

  return { handleAddToCart };
};
