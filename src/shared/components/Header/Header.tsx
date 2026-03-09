import Link from "next/link";
import { BagIcon, Logo, Text, UserIcon } from "@components/index";
import { ACTION_ICONS_CONFIG, NAV_ITEMS } from "./configs";

import styles from "./Header.module.scss";

const Header = () => (
  <header className={styles.header}>
    <nav className={styles.nav}>
      <div>
        <Link href="/">
          <Logo className={styles.logo} />
        </Link>
      </div>
      <div className={styles.navList}>
        {NAV_ITEMS.map((item) => (
          <Text key={item.label} view={"p-18"} color={"primary"}>
            <Link href={item.href}>{item.label}</Link>
          </Text>
        ))}
      </div>
      <div className={styles.navActions}>
        <Link href="/cart-page">
          <BagIcon
            width={ACTION_ICONS_CONFIG.width}
            height={ACTION_ICONS_CONFIG.height}
            color={ACTION_ICONS_CONFIG.color}
          />
        </Link>
        <Link href="/cart-page">
          <UserIcon
            width={ACTION_ICONS_CONFIG.width}
            height={ACTION_ICONS_CONFIG.height}
            color={ACTION_ICONS_CONFIG.color}
          />
        </Link>
      </div>
    </nav>
  </header>
);

export default Header;
