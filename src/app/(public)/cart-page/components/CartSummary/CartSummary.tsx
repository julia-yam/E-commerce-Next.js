import { observer } from "mobx-react-lite";

import cartStore from "@store/CartStore";
import { Button, Text } from "@components/index";

import styles from "./CartSummary.module.scss";

const CartSummary = observer(() => {
  return (
    <aside className={styles.summary}>
      <Text tag="h3" view="p-16" color="primary">
        Total
      </Text>

      <div className={styles.summaryDetails}>
        {cartStore.items.map(({ product, quantity }) => (
          <div key={product.id} className={styles.summaryRow}>
            <Text tag="span" view="p-14" color="primary">
              {product.title} {quantity > 1 && `(${quantity})`}
            </Text>
            <Text tag="span" view="p-14" color="primary">
              ${(product.price * quantity).toFixed(2)}
            </Text>
          </div>
        ))}
      </div>

      <hr />

      <div className={styles.total}>
        <Text tag="span" view="p-16" color="primary">
          For payment:
        </Text>
        <Text
          tag="span"
          view="p-16"
          color="primary"
          className={styles.totalAmount}
        >
          ${cartStore.totalPrice}
        </Text>
      </div>

      <Button className={styles.checkoutBtn}>Place an order</Button>
    </aside>
  );
});

export default CartSummary;
