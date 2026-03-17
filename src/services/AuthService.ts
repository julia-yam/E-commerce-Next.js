import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337/api";

const authApi = axios.create({
  baseURL: API_URL,
});

interface AuthResponse {
  jwt: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

export const AuthService = {
  async register(
    username: string,
    email: string,
    password: string,
  ): Promise<AuthResponse> {
    const { data } = await authApi.post<AuthResponse>("/auth/local/register", {
      username,
      email,
      password,
    });
    return data;
  },

  async login(identifier: string, password: string): Promise<AuthResponse> {
    const { data } = await authApi.post<AuthResponse>("/auth/local", {
      identifier,
      password,
    });
    return data;
  },
};
