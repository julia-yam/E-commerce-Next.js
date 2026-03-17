"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { observer } from "mobx-react-lite";
import userStore from "@store/UserStore";
import { Button, Text } from "@components/index";
import styles from "./ProfilePage.module.scss";

const ProfilePageClient = observer(() => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (!userStore.isAuth) {
      router.push("/login-page");
    }
  }, [router]);

  if (!mounted || !userStore.user) return null;

  return (
    <div className={styles["profile-page"]}>
      <div className={styles["row-wrapper"]}>
        <div className={styles["grid-row"]}>
          <div className={styles["profile-card"]}>
            <div className={styles["profile-info"]}>
              <Text tag="h1" view="p-20">
                Hello, {userStore.user.username}!
              </Text>
              <Text view="p-16" color="secondary">
                Welcome to your personal account
              </Text>
            </div>

            <div className={styles["details"]}>
              <Text view="p-14" color="secondary">
                Email address
              </Text>
              <Text view="p-16" color="primary">
                {userStore.user.email}
              </Text>
            </div>

            <div className={styles["logout-wrapper"]}>
              <Button
                onClick={() => {
                  userStore.logout();
                  router.push("/");
                }}
              >
                Log out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ProfilePageClient;
