import * as React from "react";
import cn from "classnames";
import { ICON_DEFAULTS, type IconProps } from "./configs";
import styles from "./Icon.module.scss";

const Icon: React.FC<React.PropsWithChildren<IconProps>> = ({
  children,
  color = ICON_DEFAULTS.COLOR,
  width = ICON_DEFAULTS.SIZE,
  height = ICON_DEFAULTS.SIZE,
  className,
  ...props
}) => {
  const colorKey = color
    ? `icon${color.charAt(0).toUpperCase() + color.slice(1)}`
    : null;

  const classes = cn(
    styles.icon,
    colorKey && styles[colorKey as keyof typeof styles],
    className,
  );

  return (
    <svg
      width={width}
      height={height}
      className={classes}
      viewBox={ICON_DEFAULTS.VIEW_BOX}
      fill="currentColor"
      {...props}
    >
      {children}
    </svg>
  );
};

export default Icon;
