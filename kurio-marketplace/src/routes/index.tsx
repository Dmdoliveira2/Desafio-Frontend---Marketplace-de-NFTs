import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchNfts } from "../api/nfts";
import { NftCard } from "../components/NftCard";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["nfts"],
    queryFn: fetchNfts,
  });

  if (isLoading) return <div className="p-8">Carregando...</div>;
  if (isError) return <div className="p-8">Erro ao carregar NFTs.</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Todos os NFTs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.items.map((nft) => (
          <NftCard key={nft.id} nft={nft} />
        ))}
      </div>
    </div>
  );
}
