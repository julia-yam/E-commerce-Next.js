import React from "react";
import cn from "classnames";

import { Loader, Text } from "@components/index";

import {
  BUTTON_LOADER_SIZE,
  BUTTON_TEXT_CONFIG,
  type ButtonProps,
} from "./configs";

import styles from "./Button.module.scss";

const Button: React.FC<ButtonProps> = ({
  loading = false,
  variant = "primary",
  children,
  className,
  disabled,
  ...props
}) => {
  const variantKey =
    `button${variant.charAt(0).toUpperCase() + variant.slice(1)}` as keyof typeof styles;

  const classes = cn(
    styles.button,
    styles[variantKey],
    {
      [styles.buttonLoading]: loading,
      [styles.buttonDisabled]: disabled || loading,
    },
    className,
  );

  return (
    <button {...props} disabled={loading || disabled} className={classes}>
      {loading && (
        <Loader size={BUTTON_LOADER_SIZE} className={styles.buttonLoader} />
      )}
      <Text {...BUTTON_TEXT_CONFIG}>{children}</Text>
    </button>
  );
};

export default Button;
