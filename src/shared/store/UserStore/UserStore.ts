import { makeAutoObservable } from "mobx";

export interface User {
  id: number;
  username: string;
  email: string;
}

class UserStore {
  user: User | null = null;
  token: string | null = null;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
    this.loadFromStorage();
  }

  setAuth(user: User, token: string) {
    this.user = user;
    this.token = token;

    if (typeof window !== "undefined") {
      localStorage.setItem("jwt_token", token);
      localStorage.setItem("user_data", JSON.stringify(user));
    }
  }

  logout() {
    this.user = null;
    this.token = null;

    if (typeof window !== "undefined") {
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("user_data");
    }
  }

  private loadFromStorage() {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("jwt_token");
      const userData = localStorage.getItem("user_data");

      if (token && userData) {
        this.token = token;
        try {
          this.user = JSON.parse(userData);
        } catch (e) {
          console.error("Error", e);
        }
      }
    }
  }

  get isAuth() {
    return !!this.token;
  }
}

const userStore = new UserStore();
export default userStore;
