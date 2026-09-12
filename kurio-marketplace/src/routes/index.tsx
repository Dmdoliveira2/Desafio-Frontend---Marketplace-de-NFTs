import { createFileRoute } from "@tanstack/react-router";
import { nfts } from "../mocks/data/nfts";
import { NftCard } from "../components/NftCard";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Todos os NFTs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {nfts.map((nft) => (
          <NftCard key={nft.id} nft={nft} />
        ))}
      </div>
    </div>
  );
}
