import { api } from "./axiosClient";

export interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

export async function register(
  username: string,
  email: string,
  password: string,
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/api/auth/register", {
    username,
    email,
    password,
  });
  return data;
}

export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/api/auth/login", {
    email,
    password,
  });
  return data;
}

export async function fetchSession(): Promise<{ user: User }> {
  const { data } = await api.get<{ user: User }>("/api/auth/session");
  return data;
}

export async function logout(): Promise<void> {
  await api.post("/api/auth/logout");
}
