import { api } from "./axiosClient";
import type { CartItem } from "./cart";

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: "pending" | "confirmed";
  createdAt: string;
}

export async function createOrder(): Promise<Order> {
  const { data } = await api.post<Order>("/api/orders");
  return data;
}
