import { api } from "./axiosClient";
import type { Nft } from "../types/nft";

export interface CartItem {
  nft: Nft;
  quantity: number;
}

interface CartResponse {
  items: CartItem[];
}

export async function fetchCart(): Promise<CartResponse> {
  const { data } = await api.get<CartResponse>("/api/cart");
  return data;
}

export async function addToCart(
  nftId: string,
  quantity: number,
): Promise<CartResponse> {
  const { data } = await api.post<CartResponse>("/api/cart", {
    nftId,
    quantity,
  });
  return data;
}

export async function updateCartItem(
  nftId: string,
  quantity: number,
): Promise<CartResponse> {
  const { data } = await api.patch<CartResponse>(`/api/cart/${nftId}`, {
    quantity,
  });
  return data;
}

export async function removeFromCart(nftId: string): Promise<CartResponse> {
  const { data } = await api.delete<CartResponse>(`/api/cart/${nftId}`);
  return data;
}
