import React from "react";
import NextImage from "next/image";
import { type FormattedProduct } from "@api/types";
import { Button, ProductAction, Text } from "@components/index";
import styles from "./ProductMainInfo.module.scss";

interface ProductMainInfoProps {
  product: FormattedProduct;
  onBuyNow: (e: React.MouseEvent) => void;
}

export const ProductMainInfo = ({
  product,
  onBuyNow,
}: ProductMainInfoProps) => {
  return (
    <section className={styles.product}>
      <div className={styles.img}>
        {product.image ? (
          <NextImage
            src={product.image}
            alt={product.title}
            width={500}
            height={500}
            priority
            className={styles.cardImage}
          />
        ) : (
          <div className={styles.placeholder} />
        )}
      </div>

      <div className={styles.details}>
        <div className={styles.description}>
          <Text
            className={styles.title}
            weight="bold"
            maxLines={2}
            tag="h1"
            view="title"
            color="primary"
          >
            {product.title}
          </Text>
          <Text view="p-20" weight="normal" tag="p" color="secondary">
            {product.description}
          </Text>
        </div>

        <div className={styles.priceWrapper}>
          <Text
            weight="bold"
            className={styles.price}
            view="p-20"
            color="primary"
          >
            ${product.price}
          </Text>
        </div>

        <div className={styles.actionsBlock}>
          <Button
            disabled={!product.isInStock}
            onClick={onBuyNow}
            className={styles.buyNow}
          >
            {product.isInStock ? "Buy Now" : "Not Available"}
          </Button>

          <div className={styles.actionWrapper}>
            <ProductAction product={product} variant="transparent" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductMainInfo;
