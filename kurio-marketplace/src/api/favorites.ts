import { api } from "./axiosClient";

interface FavoritesResponse {
  ids: string[];
}

export async function fetchFavorites(): Promise<FavoritesResponse> {
  const { data } = await api.get<FavoritesResponse>("/api/favorites");
  return data;
}

export async function addFavorite(nftId: string): Promise<FavoritesResponse> {
  const { data } = await api.post<FavoritesResponse>("/api/favorites", {
    nftId,
  });
  return data;
}

export async function removeFavorite(
  nftId: string,
): Promise<FavoritesResponse> {
  const { data } = await api.delete<FavoritesResponse>(
    `/api/favorites/${nftId}`,
  );
  return data;
}
