import axios from "axios";
import type { Nft } from "../types/nft";

interface NftsResponse {
  items: Nft[];
  total: number;
}

export async function fetchNfts(): Promise<NftsResponse> {
  const { data } = await axios.get<NftsResponse>("/api/nfts");
  return data;
}

export async function fetchNftById(id: string): Promise<Nft> {
  const { data } = await axios.get<Nft>(`/api/nfts/${id}`);
  return data;
}
