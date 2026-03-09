import React from "react";
import cn from "classnames";

import { ArrowRightIcon, Text } from "@components/index";

import {
  BACK_BUTTON_TEXT_CONFIG,
  BACK_ICON_CONFIG,
  type BackButtonProps,
} from "./configs";

import styles from "./BackButton.module.scss";

const BackButton: React.FC<BackButtonProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button {...props} className={cn(styles.backButton, className)}>
      <ArrowRightIcon
        width={BACK_ICON_CONFIG.width}
        height={BACK_ICON_CONFIG.height}
        className={styles.back}
      />
      <Text className={styles.text} {...BACK_BUTTON_TEXT_CONFIG}>
        {children}
      </Text>
    </button>
  );
};

export default BackButton;
