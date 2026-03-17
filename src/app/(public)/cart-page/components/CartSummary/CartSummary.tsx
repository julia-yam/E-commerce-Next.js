"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { observer } from "mobx-react-lite";

import cartStore from "@store/CartStore";
import { Button, Text } from "@components/index";

import styles from "./CartSummary.module.scss";

const CartSummary = observer(() => {
  const [isLoading, setIsLoading] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      if (typeof cartStore.clearCart === "function") {
        cartStore.clearCart();
      }
      router.replace(pathname);
    }
  }, [searchParams, router, pathname]);

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

  const handleCheckout = async () => {
    if (cartStore.items.length === 0) return;

    setIsLoading(true);
    try {
      const checkoutItems = cartStore.items.map(({ product, quantity }) => {
        const discount = product.discountPercent || 0;
        const discountedPrice =
          discount > 0
            ? Math.round(product.price * (1 - discount / 100))
            : product.price;

        return {
          name: product.title,
          price: discountedPrice,
          quantity: quantity,
        };
      });

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: checkoutItems }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("ЮКасса error:", data.error);
        alert(`Ошибка оплаты: ${data.error}`);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Произошла ошибка при попытке оформить заказ.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <aside className={styles.summary}>
      <Text tag="h3" view="p-16" color="primary">
        Total
      </Text>

      <div className={styles.summaryDetails}>
        {cartStore.items.map(({ product, quantity }) => {
          const discount = product.discountPercent || 0;
          const discountedPrice =
            discount > 0
              ? Math.round(product.price * (1 - discount / 100))
              : product.price;

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
              <Text tag="span" view="p-14" color="primary">
                ${(discountedPrice * quantity).toFixed(2)}
              </Text>
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
          <Text tag="span" view="p-16" color="secondary">
            -${totalSavings.toFixed(2)}
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

      <Button
        className={styles.checkoutBtn}
        onClick={handleCheckout}
        disabled={isLoading || cartStore.items.length === 0}
      >
        {isLoading ? "Loading..." : "Place an order"}
      </Button>
    </aside>
  );
});

export default CartSummary;
