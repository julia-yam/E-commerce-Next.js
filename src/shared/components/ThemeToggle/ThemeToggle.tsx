"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@components/index";

import { type ThemeToggleProps, TOGGLE_CONFIG } from "./configs";
import styles from "./ThemeToggle.module.scss";

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`${styles.toggleBtn} ${styles.placeholder} ${className || ""}`}
      ></div>
    );
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className={`${styles.toggleBtn} ${className || ""}`}
      aria-label={TOGGLE_CONFIG.ARIA_LABEL}
    >
      {theme === "dark" ? (
        <SunIcon
          width={TOGGLE_CONFIG.ICON_SIZE}
          height={TOGGLE_CONFIG.ICON_SIZE}
          color={TOGGLE_CONFIG.ICON_COLOR}
        />
      ) : (
        <MoonIcon
          width={TOGGLE_CONFIG.ICON_SIZE}
          height={TOGGLE_CONFIG.ICON_SIZE}
          color={TOGGLE_CONFIG.ICON_COLOR}
        />
      )}
    </button>
  );
};

export default ThemeToggle;
