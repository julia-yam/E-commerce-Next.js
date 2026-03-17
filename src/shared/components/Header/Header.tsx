"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { observer } from "mobx-react-lite";
import userStore from "@store/UserStore";
import { BagIcon, Logo, Text, ThemeToggle, UserIcon } from "@components/index";
import { ACTION_ICONS_CONFIG, NAV_ITEMS } from "./configs";
import styles from "./Header.module.scss";

const Header = observer(() => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const userPath =
    mounted && userStore.isAuth ? "/profile-page" : "/login-page";

  return (
    <header className={styles.header}>
      <nav className={styles.headerNav}>
        <div>
          <Link href="/">
            <Logo className={styles.headerLogo} />
          </Link>
        </div>
        <div className={styles.headerNavList}>
          {NAV_ITEMS.map((item) => (
            <Text key={item.label} view="p-18" color="primary">
              <Link href={item.href}>{item.label}</Link>
            </Text>
          ))}
        </div>
        <div className={styles.headerNavActions}>
          <Link href="/cart-page">
            <BagIcon
              width={ACTION_ICONS_CONFIG.width}
              height={ACTION_ICONS_CONFIG.height}
              color={ACTION_ICONS_CONFIG.color}
            />
          </Link>
          <Link href={userPath}>
            <UserIcon
              width={ACTION_ICONS_CONFIG.width}
              height={ACTION_ICONS_CONFIG.height}
              color={ACTION_ICONS_CONFIG.color}
            />
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
});

export default Header;
