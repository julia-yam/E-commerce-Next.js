import Link from "next/link";
import { Button, Text } from "@components/index";
import styles from "./not-found.module.scss";

export default function NotFound() {
  return (
    <div className={styles.notFoundContainer}>
      <Text view="title" tag="h1">
        404
      </Text>
      <Text view="p-20" color="secondary">
        Oops! The page you are looking for doesn't exist.
      </Text>
      <Link href="/product-page" className={styles.button}>
        <Button>Back to Catalog</Button>
      </Link>
    </div>
  );
}
