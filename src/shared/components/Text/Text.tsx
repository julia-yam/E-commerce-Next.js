import * as React from "react";
import cn from "classnames";
import {getMaxLinesStyle, type TextProps} from "./configs";
import styles from "./Text.module.scss";

const Text: React.FC<TextProps> = ({
  className,
  maxLines,
  children,
  view,
  tag: Component = "p",
  weight,
  color,
}) => {
  const viewClass = view
    ? styles[`text-view-${view.replace("-", "")}` as keyof typeof styles] ||
      styles[
        `textView${view.replace("-", "").toUpperCase()}` as keyof typeof styles
      ]
    : undefined;

  const weightClass = weight
    ? styles[`text-weight-${weight}` as keyof typeof styles]
    : undefined;
  const colorClass = color
    ? styles[`text-color-${color}` as keyof typeof styles]
    : undefined;

  const classes = cn(
    styles.text,
    viewClass,
    weightClass,
    colorClass,
    className,
  );

  const style = getMaxLinesStyle(maxLines);

  return (
    <Component className={classes} style={style}>
      {children}
    </Component>
  );
};

export default Text;
