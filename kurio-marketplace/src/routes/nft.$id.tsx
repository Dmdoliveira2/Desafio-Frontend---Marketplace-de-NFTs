import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNftById } from "../api/nfts";
import { addToCart } from "../api/cart";

export const Route = createFileRoute("/nft/$id")({
  component: NftDetail,
});

function NftDetail() {
  const { id } = Route.useParams();
  const queryClient = useQueryClient();

  const {
    data: nft,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["nft", id],
    queryFn: () => fetchNftById(id),
    retry: false,
  });

  const addToCartMutation = useMutation({
    mutationFn: () => addToCart(id, 1),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  if (isLoading) return <div className="p-8">Carregando...</div>;

  if (isError || !nft) {
    return (
      <div className="p-8">
        <p>NFT não encontrado.</p>
        <Link to="/" className="text-accent">
          Voltar ao início
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      <img
        src={nft.image}
        alt={nft.name}
        className="w-full aspect-square object-cover"
      />

      <div>
        <h1 className="text-2xl font-bold">{nft.name}</h1>
        <p className="text-accent text-xl font-bold mt-2">{nft.priceEth} ETH</p>
        <p className="text-text-muted mt-4">{nft.description}</p>
        <p className="mt-4 text-sm">ID do token: {nft.tokenId}</p>
        <p className="text-sm">Coleção: {nft.collection}</p>
        <p className="text-sm">Atributos: {nft.attributes.join(", ")}</p>

        <button
          onClick={() => addToCartMutation.mutate()}
          disabled={addToCartMutation.isPending}
          className="mt-6 bg-accent text-background px-6 py-3 font-medium disabled:opacity-50"
        >
          {addToCartMutation.isPending
            ? "ADICIONANDO..."
            : addToCartMutation.isSuccess
              ? "ADICIONADO ✓"
              : "COMPRAR"}
        </button>
      </div>
    </div>
  );
}
