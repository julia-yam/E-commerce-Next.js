"use client";

import { type SyntheticEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { observer } from "mobx-react-lite";
import userStore from "@store/UserStore";
import { AuthService } from "@services/AuthService";
import { Button, Input, Text } from "@components/index";
import styles from "../register-page/Auth.module.scss";

const LoginPageClient = observer(() => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = await AuthService.login(email, password);
      userStore.setAuth(data.user, data.jwt);
      router.push("/profile-page");
    } catch {
      setError("Incorrect login or password");
    }
  };

  return (
    <div className={styles.authContainer}>
      <Text tag="h1" view="p-20">
        Вход
      </Text>

      <form onSubmit={handleLogin} className={styles.form}>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(value) => setEmail(value)}
        />
        <Input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(value) => setPassword(value)}
        />
        {error && <Text>{error}</Text>}
        <Button type="submit">Войти</Button>
      </form>

      <div className={styles.footer}>
        <Text view="p-16" color="secondary">
          {"Don't have an account? "}
          <Link href="/register-page" className={styles.link}>
            Register
          </Link>
        </Text>
      </div>
    </div>
  );
});

export default LoginPageClient;
