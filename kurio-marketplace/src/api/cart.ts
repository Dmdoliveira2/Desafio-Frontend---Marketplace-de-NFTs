import axios from "axios";
import type { Nft } from "../types/nft";

export interface CartItem {
  nft: Nft;
  quantity: number;
}

interface CartResponse {
  items: CartItem[];
}

export async function fetchCart(): Promise<CartResponse> {
  const { data } = await axios.get<CartResponse>("/api/cart");
  return data;
}

export async function addToCart(
  nftId: string,
  quantity: number,
): Promise<CartResponse> {
  const { data } = await axios.post<CartResponse>("/api/cart", {
    nftId,
    quantity,
  });
  return data;
}

export async function updateCartItem(
  nftId: string,
  quantity: number,
): Promise<CartResponse> {
  const { data } = await axios.patch<CartResponse>(`/api/cart/${nftId}`, {
    quantity,
  });
  return data;
}

export async function removeFromCart(nftId: string): Promise<CartResponse> {
  const { data } = await axios.delete<CartResponse>(`/api/cart/${nftId}`);
  return data;
}
