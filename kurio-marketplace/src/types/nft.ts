export interface Nft {
  id: string;
  tokenId: string;
  name: string;
  image: string;
  priceEth: number;
  originalPriceEth?: number;
  collection: string;
  category: string;
  network: "Ethereum" | "Polygon" | "Solana";
  edition: string;
  isRare?: boolean;
  attributes: string[];
  rating?: number;
  reviewsCount?: number;
  description: string;
}
