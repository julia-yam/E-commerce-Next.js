import React from "react";
import Image from "next/image";
import { observer } from "mobx-react-lite";

import cartStore from "@store/CartStore";
import { Button, QuantityControl, Text } from "@components/index";

import styles from "./CartItem.module.scss";

interface CartItemProps {
  item: {
    product: {
      id: string | number;
      documentId?: string;
      title: string;
      category: string;
      price: number;
      image: string;
      discountPercent?: number;
    };
    quantity: number;
  };
  onClick?: () => void;
}

const CartItem = observer(({ item, onClick }: CartItemProps) => {
  const { product } = item;

  const discount = product.discountPercent || 0;
  const hasDiscount = discount > 0;

  const discountedPrice = hasDiscount
    ? Math.round(product.price * (1 - discount / 100))
    : product.price;

  return (
    <div className={styles.cartItem} onClick={onClick}>
      <Image
        src={product.image}
        alt={product.title}
        width={100}
        height={100}
        className={styles.cartItemImage}
      />

      <div className={styles.cartItemInfo}>
        <Text tag="h3" view="p-18" color="primary">
          {product.title}
        </Text>
        <Text tag="p" view="p-18" color="secondary">
          {product.category}
        </Text>

        <div className={styles.priceWrapper}>
          {hasDiscount ? (
            <>
              <Text
                tag="span"
                view="p-14"
                color="secondary"
                className={styles.priceOld}
              >
                ${product.price}
              </Text>
              <Text tag="span" view="p-18" weight="bold" color="primary">
                ${discountedPrice}
              </Text>
            </>
          ) : (
            <Text tag="p" view="p-18" weight="bold" color="primary">
              ${product.price}
            </Text>
          )}
        </div>
      </div>

      <div
        className={styles.cartItemControls}
        onClick={(e) => e.stopPropagation()}
      >
        <QuantityControl id={product.id} quantity={item.quantity} />

        <Button onClick={() => cartStore.removeFromCart(product.id)}>
          Delete
        </Button>
      </div>
    </div>
  );
});

export default CartItem;
