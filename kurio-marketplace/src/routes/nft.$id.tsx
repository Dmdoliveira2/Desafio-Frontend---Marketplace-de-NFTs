import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNftById } from "../api/nfts";
import { addToCart } from "../api/cart";
import { Button } from "../components/ui/button";
import { fetchFavorites, addFavorite, removeFavorite } from "../api/favorites";

export const Route = createFileRoute("/nft/$id")({
  component: NftDetail,
});

function NftDetail() {
  const { id } = Route.useParams();
  const queryClient = useQueryClient();
  const { data: favoritesData } = useQuery({
    queryKey: ["favorites"],
    queryFn: fetchFavorites,
  });

  const isFavorited = favoritesData?.ids.includes(id) ?? false;

  const favoriteMutation = useMutation({
    mutationFn: () => (isFavorited ? removeFavorite(id) : addFavorite(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

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

        <div className="flex gap-3 mt-6">
          <Button
            onClick={() => addToCartMutation.mutate()}
            disabled={addToCartMutation.isPending}
            className="bg-accent text-background hover:bg-accent-hover"
          >
            {addToCartMutation.isPending
              ? "ADICIONANDO..."
              : addToCartMutation.isSuccess
                ? "ADICIONADO ✓"
                : "COMPRAR"}
          </Button>

          <Button
            onClick={() => favoriteMutation.mutate()}
            variant="outline"
            className="border-text-muted/30"
          >
            {isFavorited ? "❤️ Favoritado" : "🤍 Favoritar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
