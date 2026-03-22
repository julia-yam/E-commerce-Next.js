import React from "react";
import cn from "classnames";
import { LoaderIcon, type LoaderProps, SIZE_MAP } from "./configs";
import styles from "./Loader.module.scss";

const Loader: React.FC<LoaderProps> = ({ size = "l", className }) => {
  const dimension = SIZE_MAP[size];

  return (
    <div className={cn(styles.loader, className)} data-testid="loader">
      <LoaderIcon size={dimension} />
    </div>
  );
};

export default Loader;
