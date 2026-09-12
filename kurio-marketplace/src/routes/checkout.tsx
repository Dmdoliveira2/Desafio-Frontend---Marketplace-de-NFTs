import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCart } from "../api/cart";
import { createOrder } from "../api/orders";
import { useAuth } from "../lib/AuthContext";

export const Route = createFileRoute("/checkout")({
  component: Checkout,
});

function Checkout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
  });

  const orderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      navigate({ to: "/confirmacao", search: { orderId: order.id } });
    },
  });

  if (!user) {
    return (
      <div className="p-8">
        <p>Você precisa estar logado para finalizar a compra.</p>
        <Link to="/entrar" className="text-accent">
          Entrar
        </Link>
      </div>
    );
  }

  if (isLoading) return <div className="p-8">Carregando...</div>;

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
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-6">Perfil do colecionador</h1>
        <div className="space-y-4">
          <input
            defaultValue={user.username}
            placeholder="Nome de exibição"
            className="w-full bg-surface p-3 border border-text-muted/30"
          />
          <input
            defaultValue={user.email}
            placeholder="E-mail"
            className="w-full bg-surface p-3 border border-text-muted/30"
          />
          <select className="w-full bg-surface p-3 border border-text-muted/30">
            <option>MetaMask</option>
            <option>Coinbase Wallet</option>
            <option>WalletConnect</option>
          </select>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Resumo do pedido</h2>
        <div className="bg-surface p-6">
          {items.map((item) => (
            <div
              key={item.nft.id}
              className="flex justify-between text-sm mb-2"
            >
              <span>
                {item.nft.name} (x{item.quantity})
              </span>
              <span>{(item.nft.priceEth * item.quantity).toFixed(2)} ETH</span>
            </div>
          ))}
          <div className="flex justify-between text-sm mt-4 pt-4 border-t border-background">
            <span>Subtotal</span>
            <span>{subtotal.toFixed(2)} ETH</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span>Taxa de rede</span>
            <span>{networkFee.toFixed(3)} ETH</span>
          </div>
          <div className="flex justify-between font-bold mt-2">
            <span>Total</span>
            <span className="text-accent">{total.toFixed(3)} ETH</span>
          </div>

          {orderMutation.isError && (
            <p className="text-red-400 text-sm mt-4">
              Erro ao confirmar compra. Tente novamente.
            </p>
          )}

          <button
            onClick={() => orderMutation.mutate()}
            disabled={orderMutation.isPending}
            className="w-full mt-6 bg-accent text-background py-3 font-medium disabled:opacity-50"
          >
            {orderMutation.isPending ? "Processando..." : "Confirmar compra"}
          </button>
        </div>
      </div>
    </div>
  );
}
