import { api } from "./axiosClient";

export interface Wallet {
  id: string;
  nickname: string;
  address: string;
  network: string;
  type: string;
  isPrimary: boolean;
}

interface WalletsResponse {
  wallets: Wallet[];
}

export async function fetchWallets(): Promise<WalletsResponse> {
  const { data } = await api.get<WalletsResponse>("/api/wallets");
  return data;
}

export async function addWallet(input: {
  nickname: string;
  address: string;
  network: string;
  type: string;
}): Promise<WalletsResponse> {
  const { data } = await api.post<WalletsResponse>("/api/wallets", input);
  return data;
}
