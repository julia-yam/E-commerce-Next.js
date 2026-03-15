"use client";

import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import cartStore from "@store/CartStore";
import { BackButton, Loader, Text } from "@components/index";

import { CartItem } from "./components/CartItem";
import { CartSummary } from "./components/CartSummary";

import styles from "./CartPage.module.scss";

const CartPageClient = observer(() => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const hasItems = (cartStore.items?.length || 0) > 0;

  const handleItemClick = (documentId: string) => {
    router.push(`/product-detail-page/${documentId}`);
  };

  const handleBack = () => {
    router.back();
  };

  if (!isMounted) {
    return (
      <div className={styles.loaderWrapper}>
        <Loader size="l" />
      </div>
    );
  }

  return (
    <div className={styles.cartContainer}>
      <div className={styles.back}>
        <BackButton onClick={handleBack} className={styles.backButton}>
          Back
        </BackButton>
      </div>
      <div className={styles.content}>
        <Text tag="h1" view="title" color="primary" className={styles.title}>
          Cart
        </Text>

        <div className={styles.items}>
          {hasItems ? (
            <>
              <div className={styles.itemsList}>
                {cartStore.items.map((item) => (
                  <CartItem
                    key={item.product.documentId || item.product.id}
                    item={item}
                    onClick={() => handleItemClick(item.product.documentId)}
                  />
                ))}
              </div>
              <CartSummary />
            </>
          ) : (
            <div className={styles.emptyCart}>
              <Text tag="h3" view="p-18" color="secondary">
                Cart is empty
              </Text>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default CartPageClient;
