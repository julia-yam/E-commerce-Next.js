import React from "react";
import cn from "classnames";
import { type LogoProps, LogoSvg } from "./configs";
import styles from "./Logo.module.scss";

const Logo: React.FC<LogoProps> = ({ className, color = "primary" }) => {
  const colorKey = `logo-${color}`;

  const classes = cn(
    styles.logo,
    styles[colorKey as keyof typeof styles],
    className,
  );

  return (
    <div className={classes} data-testid="logo">
      <LogoSvg />
    </div>
  );
};

export default Logo;
