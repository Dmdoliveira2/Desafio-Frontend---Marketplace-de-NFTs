import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCart, updateCartItem, removeFromCart } from "../api/cart";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/carrinho")({
  component: Carrinho,
});

function Carrinho() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      updateCartItem(id, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => removeFromCart(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  if (isLoading) return <div className="p-8">Carregando carrinho...</div>;

  const items = data?.items ?? [];

  if (items.length === 0) {
    return <div className="p-8">Seu carrinho está vazio.</div>;
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.nft.priceEth * item.quantity,
    0,
  );
  const networkFee = 0.016;
  const total = subtotal + networkFee;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Carrinho de NFTs</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.nft.id}
            className="flex items-center gap-4 bg-surface p-4"
          >
            <img
              src={item.nft.image}
              alt={item.nft.name}
              className="w-16 h-16 object-cover"
            />

            <div className="flex-1">
              <p className="font-medium">{item.nft.name}</p>
              <p className="text-sm text-text-muted">
                ID do token: {item.nft.tokenId}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  updateMutation.mutate({
                    id: item.nft.id,
                    quantity: Math.max(1, item.quantity - 1),
                  })
                }
                className="px-2 bg-background"
              >
                −
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() =>
                  updateMutation.mutate({
                    id: item.nft.id,
                    quantity: item.quantity + 1,
                  })
                }
                className="px-2 bg-background"
              >
                +
              </button>
            </div>

            <p className="w-24 text-right text-accent font-bold">
              {(item.nft.priceEth * item.quantity).toFixed(2)} ETH
            </p>

            <button
              onClick={() => removeMutation.mutate(item.nft.id)}
              className="text-text-muted hover:text-accent"
            >
              🗑
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 max-w-sm ml-auto bg-surface p-6">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>{subtotal.toFixed(2)} ETH</span>
        </div>
        <div className="flex justify-between text-sm mt-2">
          <span>Taxa de rede</span>
          <span>{networkFee.toFixed(3)} ETH</span>
        </div>
        <div className="flex justify-between font-bold mt-4 pt-4 border-t border-background">
          <span>Total</span>
          <span className="text-accent">{total.toFixed(3)} ETH</span>
        </div>

        <Link
          to="/checkout"
          className="block w-full mt-6 bg-accent text-background px-6 py-3 font-medium text-center"
        >
          Conectar e finalizar
        </Link>
      </div>
    </div>
  );
}
