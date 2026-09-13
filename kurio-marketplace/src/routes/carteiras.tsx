import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWallets, addWallet } from "../api/wallets";
import { useAuth } from "../lib/AuthContext";

export const Route = createFileRoute("/carteiras")({
  component: Carteiras,
});

function Carteiras() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [nickname, setNickname] = useState("");
  const [address, setAddress] = useState("");
  const [network, setNetwork] = useState("Ethereum");
  const [type, setType] = useState("MetaMask");

  const { data } = useQuery({
    queryKey: ["wallets"],
    queryFn: fetchWallets,
    enabled: !!user,
  });

  const addWalletMutation = useMutation({
    mutationFn: () => addWallet({ nickname, address, network, type }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      setNickname("");
      setAddress("");
    },
  });

  if (!user) {
    return (
      <div className="p-8">
        <p>Você precisa estar logado para gerenciar carteiras.</p>
        <Link to="/entrar" className="text-accent">
          Entrar
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Carteiras</h1>

      {data?.wallets.map((wallet) => (
        <div key={wallet.id} className="bg-surface p-4 mb-3">
          <p className="font-medium">
            {wallet.isPrimary ? "Principal" : "Secundária"} — {wallet.nickname}
          </p>
          <p className="text-sm text-text-muted">
            {wallet.address} · Rede {wallet.network}
          </p>
        </div>
      ))}

      {(!data || data.wallets.length === 0) && (
        <p className="text-text-muted mb-6">
          Você ainda não adicionou uma carteira.
        </p>
      )}

      <h2 className="font-bold mt-8 mb-4">Adicionar carteira</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addWalletMutation.mutate();
        }}
        className="space-y-4"
      >
        <div>
          <label htmlFor="nickname" className="block text-sm mb-1">
            Apelido da carteira
          </label>
          <input
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
            className="w-full bg-surface p-3 border border-text-muted/30"
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm mb-1">
            Endereço da carteira
          </label>
          <input
            id="address"
            placeholder="0x..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="w-full bg-surface p-3 border border-text-muted/30"
          />
        </div>

        <div>
          <label htmlFor="network" className="block text-sm mb-1">
            Rede
          </label>
          <select
            id="network"
            value={network}
            onChange={(e) => setNetwork(e.target.value)}
            className="w-full bg-surface p-3 border border-text-muted/30"
          >
            <option>Ethereum</option>
            <option>Polygon</option>
            <option>Solana</option>
          </select>
        </div>

        <div>
          <label htmlFor="type" className="block text-sm mb-1">
            Tipo de carteira
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-surface p-3 border border-text-muted/30"
          >
            <option>MetaMask</option>
            <option>Coinbase Wallet</option>
            <option>WalletConnect</option>
          </select>
        </div>

        {addWalletMutation.isError && (
          <p role="alert" className="text-red-400 text-sm">
            Endereço de carteira inválido.
          </p>
        )}

        <button
          type="submit"
          disabled={addWalletMutation.isPending}
          className="bg-accent text-background px-6 py-3 font-medium rounded-lg disabled:opacity-50"
        >
          {addWalletMutation.isPending ? "Salvando..." : "Salvar carteira"}
        </button>
      </form>
    </div>
  );
}
