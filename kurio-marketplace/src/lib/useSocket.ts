import { useEffect } from "react";
import { io, type Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import type { Nft } from "../types/nft";

interface NftUpdatedPayload {
  id: string;
  newPrice: number;
  available: boolean;
  version: number;
}

let socket: Socket | null = null;
let lastVersion = 0; // controla eventos antigos/duplicados

function getSocket() {
  if (!socket) {
    socket = io("/", { path: "/socket.io" });
  }
  return socket;
}

export function useSocket() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const s = getSocket();

    function handleNftUpdated(payload: NftUpdatedPayload) {
      // Ignora eventos antigos/fora de ordem (requisito do desafio)
      if (payload.version <= lastVersion) return;
      lastVersion = payload.version;

      // Atualiza diretamente o cache da lista de NFTs
      queryClient.setQueryData(
        ["nfts"],
        (old: { items: Nft[]; total: number } | undefined) => {
          if (!old) return old;
          return {
            ...old,
            items: old.items.map((nft) =>
              nft.id === payload.id
                ? { ...nft, priceEth: payload.newPrice }
                : nft,
            ),
          };
        },
      );

      // Atualiza o cache do detalhe individual, se existir
      queryClient.setQueryData(["nft", payload.id], (old: Nft | undefined) =>
        old ? { ...old, priceEth: payload.newPrice } : old,
      );

      // Avisa o carrinho que pode ter mudado
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    }

    function handleOrderUpdated() {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    }

    s.on("nft.updated", handleNftUpdated);
    s.on("order.updated", handleOrderUpdated);

    return () => {
      s.off("nft.updated", handleNftUpdated);
      s.off("order.updated", handleOrderUpdated);
    };
  }, [queryClient]);

  return getSocket();
}
