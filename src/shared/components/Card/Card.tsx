import React from "react";
import cn from "classnames";
import Image from "next/image";
import { SkeletonBlock, Text } from "@components/index";
import { CARD_TEXT_CONFIG, type CardProps } from "./configs";
import styles from "./Card.module.scss";

const Card: React.FC<CardProps> = ({
  className,
  image,
  captionSlot,
  title,
  subtitle,
  contentSlot,
  onClick,
  actionSlot,
  isLoading,
}) => {
  const classes = cn(
    styles.card,
    { [styles.cardClickable]: !!onClick && !isLoading },
    className,
  );

  if (isLoading) {
    return (
      <div className={classes}>
        <div className={styles.cardHeader}>
          <SkeletonBlock height="100%" />
        </div>

        <div className={styles.cardBody}>
          <div className={styles.cardBodyMain}>
            <SkeletonBlock width="65%" height={18} />
            <SkeletonBlock width="100%" height={43} />

            <SkeletonBlock width="100%" height={14} />
            <SkeletonBlock width="100%" height={14} />
            <SkeletonBlock width="100%" height={14} />
          </div>
        </div>

        <div className={styles.cardFooter}>
          <div />
          <SkeletonBlock width={149} height={52} />
        </div>
      </div>
    );
  }

  const imageAlt = typeof title === "string" ? title : "";
  const handleActionClick = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      className={classes}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className={styles.cardHeader}>
        <Image
          src={image!}
          alt={imageAlt}
          width={360}
          height={0}
          className={styles.cardImage}
        />
      </div>

      <div className={styles.cardBody}>
        <div className={styles.cardBodyMain}>
          {captionSlot && (
            <Text {...CARD_TEXT_CONFIG.caption}>{captionSlot}</Text>
          )}
          <div data-testid="text">
            <Text {...CARD_TEXT_CONFIG.title}>{title}</Text>
          </div>
          <div data-testid="text">
            <Text {...CARD_TEXT_CONFIG.subtitle}>{subtitle}</Text>
          </div>
        </div>
      </div>

      <div className={styles.cardFooter}>
        {contentSlot && (
          <Text {...CARD_TEXT_CONFIG.content}>{contentSlot}</Text>
        )}
        {actionSlot && (
          <div className={styles.cardAction} onClick={handleActionClick}>
            {actionSlot}
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
