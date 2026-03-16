import {observer} from "mobx-react-lite";

import cartStore from "@store/CartStore";
import {Button, Text} from "@components/index";

import styles from "./CartSummary.module.scss";

const CartSummary = observer(() => {
  let totalOriginalPrice = 0;
  let totalDiscountedPrice = 0;

  cartStore.items.forEach(({ product, quantity }) => {
    const discount = product.discountPercent || 0;
    const discountedPrice =
      discount > 0
        ? Math.round(product.price * (1 - discount / 100))
        : product.price;

    totalOriginalPrice += product.price * quantity;
    totalDiscountedPrice += discountedPrice * quantity;
  });

  const totalSavings = totalOriginalPrice - totalDiscountedPrice;
  const hasSavings = totalSavings > 0;

  return (
    <aside className={styles.summary}>
      <Text tag="h3" view="p-16" color="primary">
        Total
      </Text>

      <div className={styles.summaryDetails}>
        {cartStore.items.map(({ product, quantity }) => {
          const discount = product.discountPercent || 0;
          const hasDiscount = discount > 0;

          const discountedPrice = hasDiscount
            ? Math.round(product.price * (1 - discount / 100))
            : product.price;

          const rowOriginalTotal = product.price * quantity;
          const rowDiscountedTotal = discountedPrice * quantity;

          return (
            <div key={product.id} className={styles.summaryRow}>
              <Text
                tag="span"
                view="p-14"
                color="primary"
                className={styles.productName}
              >
                {product.title} {quantity > 1 && `(${quantity})`}
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
                      ${rowOriginalTotal.toFixed(2)}
                    </Text>
                    <Text
                      tag="span"
                      view="p-14"
                      color="primary"
                      className={styles.priceActual}
                    >
                      ${rowDiscountedTotal.toFixed(2)}
                    </Text>
                  </>
                ) : (
                  <Text tag="span" view="p-14" color="primary">
                    ${rowOriginalTotal.toFixed(2)}
                  </Text>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <hr className={styles.divider} />

      {hasSavings && (
        <div className={styles.savingsRow}>
          <Text tag="span" view="p-16" color="secondary">
            Discount:
          </Text>
          <Text
            tag="span"
            view="p-16"
            color="secondary"
            className={styles.savingsAmount}
          >
            ${totalSavings.toFixed(2)}
          </Text>
        </div>
      )}

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
          ${totalDiscountedPrice.toFixed(2)}
        </Text>
      </div>

      <Button className={styles.checkoutBtn}>Place an order</Button>
    </aside>
  );
});

export default CartSummary;
