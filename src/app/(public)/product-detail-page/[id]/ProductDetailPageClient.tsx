"use client";

import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";

import { type FormattedProduct } from "@/app/api/types";
import cartStore from "@store/CartStore";
import ProductDetailsStore from "@store/ProductDetailsStore";
import { BackButton, Button, Loader, Text } from "@components/index";
import { useCartActions } from "@store/hooks/useCartActions";

import { RelatedItemList } from "./components/RelatedItemList";
import { ProductMainInfo } from "./components/ProductMainInfo";
import styles from "./ProductDetailsPage.module.scss";

interface Props {
  id: string;
  initialData: FormattedProduct | null;
}

const ProductDetailPageClient = observer(({ id, initialData }: Props) => {
  const router = useRouter();
  const [store] = useState(() => new ProductDetailsStore());
  const { handleAddToCart } = useCartActions();

  useEffect(() => {
    if (id) {
      void store.fetchData(id, initialData);
    }
    return () => store.destroy();
  }, [id, store, initialData]);

  const handleBackClick = () => router.back();

  const handleBuyNow = async (
    e: React.MouseEvent,
    product: FormattedProduct,
  ) => {
    const isInCart = cartStore.items.some(
      (item) => item.product.documentId === product.documentId,
    );

    if (!isInCart) {
      await handleAddToCart(e, product);
    }
    router.push("/cart-page");
  };

  if (!store.isInitialized) {
    return (
      <div className={styles.loaderWrapper}>
        <Loader size="l" />
      </div>
    );
  }

  if (!store.product) {
    return (
      <div className={styles.productDetail}>
        <div className={styles.container}>
          <Text view="title" color="primary">
            Product not found
          </Text>
          <Button onClick={handleBackClick}>Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.productDetail}>
      <div className={styles.container}>
        <div className={styles.back}>
          <BackButton onClick={handleBackClick} className={styles.backButton}>
            Back
          </BackButton>
        </div>

        <div className={styles.productBody}>
          <ProductMainInfo
            product={store.product}
            onBuyNow={(e) => handleBuyNow(e, store.product!)}
          />
        </div>
      </div>

      <RelatedItemList items={store.relatedProducts} />
    </div>
  );
});

export default ProductDetailPageClient;
