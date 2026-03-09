"use client";

import React from "react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { Card, ProductAction, Text } from "@components/index";
import { type FormattedProduct } from "@api/types";

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
            <Text view="title" weight="bold">
              Related Items
            </Text>
          </div>

          <div className={styles.relatedItemsGrid}>
            {items.map((item) => (
              <Card
                key={item.documentId}
                image={item.image as string}
                title={item.title}
                subtitle={item.description}
                captionSlot={item.category}
                contentSlot={`$${item.price}`}
                onClick={() =>
                  router.push(ROUTES.PRODUCT_CARD(item.documentId))
                }
                actionSlot={<ProductAction product={item} />}
              />
            ))}
          </div>
        </div>
      </section>
    );
  },
);

export default RelatedItemList;
