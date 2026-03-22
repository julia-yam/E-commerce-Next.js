"use client";

import React from "react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { Card, ProductAction, Text } from "@components/index";
import { type FormattedProduct } from "@/app/api/types";

import styles from "./RelatedItemList.module.scss";

interface RelatedItemListProps {
  items: FormattedProduct[];
}

export const ROUTES = {
  PRODUCT_CARD: (id: string) => `/product-detail-page/${id}`,
};

export const RelatedItemList: React.FC<RelatedItemListProps> = observer(
  ({ items }) => {
    const router = useRouter();

    if (!items || items.length === 0) return null;

    return (
      <section className={styles.relatedItems}>
        <div className={styles.container}>
          <div className={styles.relatedItemsTitle}>
            <Text view="title" weight="bold" color="primary">
              Related Items
            </Text>
          </div>

          <div className={styles.relatedItemsGrid}>
            {items.map((item) => {
              const discount = item.discountPercent || 0;
              const hasDiscount = discount > 0;

              const discountedPrice = hasDiscount
                ? Math.round(item.price * (1 - discount / 100))
                : item.price;

              const priceElement = hasDiscount ? (
                <span className={styles.priceWrapper}>
                  <Text
                    tag="span"
                    view="p-14"
                    color="secondary"
                    className={styles.priceOld}
                  >
                    ${item.price}
                  </Text>
                  <Text
                    tag="span"
                    view="p-20"
                    color="primary"
                    className={styles.priceActual}
                  >
                    ${discountedPrice}
                  </Text>
                </span>
              ) : (
                <Text tag="span">${item.price}</Text>
              );

              return (
                <Card
                  key={item.documentId}
                  image={item.image as string}
                  title={item.title}
                  subtitle={item.description}
                  captionSlot={item.category}
                  contentSlot={priceElement}
                  onClick={() =>
                    router.push(ROUTES.PRODUCT_CARD(item.documentId))
                  }
                  actionSlot={<ProductAction product={item} />}
                />
              );
            })}
          </div>
        </div>
      </section>
    );
  },
);

export default RelatedItemList;
