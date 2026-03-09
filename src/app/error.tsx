"use client";

import {useEffect} from "react";
import {Button, Text} from "@components/index";
import styles from "./error.module.scss";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className={styles.errorContainer}>
      <Text view="title" tag="h2">
        Something went wrong!
      </Text>
      <Text view="p-16" color="secondary">
        We encountered an unexpected error. Please try again.
      </Text>
      <Button onClick={() => reset()} className={styles.retryButton}>
        Try again
      </Button>
    </div>
  );
}
