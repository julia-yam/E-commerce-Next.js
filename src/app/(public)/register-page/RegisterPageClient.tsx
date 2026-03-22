"use client";

import { type SyntheticEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { observer } from "mobx-react-lite";
import userStore from "@store/UserStore";
import { AuthService } from "@services/AuthService";
import { Button, Input, Text } from "@components/index";
import styles from "./Auth.module.scss";

const RegisterPageClient = observer(() => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = await AuthService.register(
        form.username,
        form.email,
        form.password,
      );
      userStore.setAuth(data.user, data.jwt);
      router.push("/profile-page");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error?.message || "Registration failed");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className={styles.authContainer}>
      <Text tag="h1" view="p-20">
        Sign Up
      </Text>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          placeholder="Username"
          value={form.username}
          onChange={(value) => setForm({ ...form, username: value })}
        />
        <Input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(value) => setForm({ ...form, email: value })}
        />
        <Input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(value) => setForm({ ...form, password: value })}
        />

        {error && <Text>{error}</Text>}

        <Button type="submit">Create Account</Button>
      </form>

      <div className={styles.footer}>
        <Text view="p-16" color="secondary">
          {"Already have an account? "}
          <Link href="/login-page" className={styles.link}>
            Login
          </Link>
        </Text>
      </div>
    </div>
  );
});

export default RegisterPageClient;
