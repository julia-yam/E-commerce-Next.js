"use client";

import { observer } from "mobx-react-lite";
import cn from "classnames";

import cartStore from "@store/CartStore";
import { Text } from "@components/index";

import styles from "./QuantityControl.module.scss";

interface QuantityControlProps {
  id: string | number;
  quantity: number;
  className?: string;
}

const QuantityControl = observer(
  ({ id, quantity, className }: QuantityControlProps) => {
    return (
      <div
        className={cn(styles.quantity, className)}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className={styles.quantityControlBtn}
          onClick={(e) => {
            e.stopPropagation();
            cartStore.changeQuantity(id, -1);
          }}
        >
          −
        </button>

        <Text
          tag="span"
          view="p-16"
          color="primary"
          className={styles.quantityValue}
        >
          {quantity}
        </Text>

        <button
          className={styles.quantityControlBtn}
          onClick={(e) => {
            e.stopPropagation();
            cartStore.changeQuantity(id, 1);
          }}
        >
          +
        </button>
      </div>
    );
  },
);

export default QuantityControl;
