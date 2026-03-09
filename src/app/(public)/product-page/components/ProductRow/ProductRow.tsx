"use client";

import React from "react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";

import { Card, ProductAction } from "@components/index";

import { type ProductRowProps, ROUTES } from "./configs";
import { type FormattedProduct } from "@/api/types";

import styles from "./ProductRow.module.scss";

const ProductRow = observer(({ index, store }: ProductRowProps) => {
  const router = useRouter();
  const { columnsCount, products } = store;

  const startIndex = index * columnsCount;
  const isRowLoaded = startIndex < products.length;
  const rowItems = products.slice(startIndex, startIndex + columnsCount);

  const skeletonItems = Array.from({ length: columnsCount });

  const handleCardClick = (documentId: string) => {
    router.push(ROUTES.PRODUCT_CARD(documentId));
  };

  return (
    <div className={styles.rowWrapper}>
      {!isRowLoaded ? (
        <div className={styles.gridRow}>
          {skeletonItems.map((_, i) => (
            <Card key={`skeleton-${index}-${i}`} isLoading={true} />
          ))}
        </div>
      ) : (
        <div className={styles.gridRow}>
          {rowItems.map((product: FormattedProduct) => {
            return (
              <Card
                key={product.documentId}
                image={product.image as string}
                title={product.title}
                subtitle={product.description}
                captionSlot={product.category}
                contentSlot={`$${product.price}`}
                onClick={() => handleCardClick(product.documentId)}
                actionSlot={
                  <div onClick={(e) => e.stopPropagation()}>
                    <ProductAction product={product} />
                  </div>
                }
              />
            );
          })}

          {rowItems.length < columnsCount &&
            Array.from({ length: columnsCount - rowItems.length }).map(
              (_, i) => <div key={`empty-${i}`} className={styles.emptySlot} />,
            )}
        </div>
      )}
    </div>
  );
});

export default ProductRow;
