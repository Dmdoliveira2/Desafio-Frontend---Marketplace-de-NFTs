import axios from "axios";

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
  const { data } = await axios.post<AuthResponse>("/api/auth/register", {
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
  const { data } = await axios.post<AuthResponse>("/api/auth/login", {
    email,
    password,
  });
  return data;
}

export async function fetchSession(token: string): Promise<{ user: User }> {
  const { data } = await axios.get<{ user: User }>("/api/auth/session", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function logout(token: string): Promise<void> {
  await axios.post("/api/auth/logout", null, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
