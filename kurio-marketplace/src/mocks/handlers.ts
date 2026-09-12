import { http, HttpResponse } from "msw";
import { nfts } from "./data/nfts";
import type { Nft } from "../types/nft";

interface CartItem {
  nft: Nft;
  quantity: number;
}

// Estado do carrinho em memória (simula um "banco de dados" simples)
let cart: CartItem[] = [];

export const handlers = [
  http.get("/api/nfts", () => {
    return HttpResponse.json({ items: nfts, total: nfts.length });
  }),

  http.get("/api/nfts/:id", ({ params }) => {
    const nft = nfts.find((n) => n.id === params.id);

    if (!nft) {
      return HttpResponse.json(
        { message: "NFT não encontrado" },
        { status: 404 },
      );
    }

    return HttpResponse.json(nft);
  }),

  // GET /api/cart — ver carrinho atual
  http.get("/api/cart", () => {
    return HttpResponse.json({ items: cart });
  }),

  // POST /api/cart — adicionar item ao carrinho
  http.post("/api/cart", async ({ request }) => {
    const body = (await request.json()) as { nftId: string; quantity: number };
    const nft = nfts.find((n) => n.id === body.nftId);

    if (!nft) {
      return HttpResponse.json(
        { message: "NFT não encontrado" },
        { status: 404 },
      );
    }

    const existing = cart.find((item) => item.nft.id === body.nftId);
    if (existing) {
      existing.quantity += body.quantity;
    } else {
      cart.push({ nft, quantity: body.quantity });
    }

    return HttpResponse.json({ items: cart });
  }),

  // PATCH /api/cart/:id — alterar quantidade
  http.patch("/api/cart/:id", async ({ params, request }) => {
    const body = (await request.json()) as { quantity: number };
    const item = cart.find((item) => item.nft.id === params.id);

    if (!item) {
      return HttpResponse.json(
        { message: "Item não encontrado no carrinho" },
        { status: 404 },
      );
    }

    item.quantity = body.quantity;
    return HttpResponse.json({ items: cart });
  }),

  // DELETE /api/cart/:id — remover item
  http.delete("/api/cart/:id", ({ params }) => {
    cart = cart.filter((item) => item.nft.id !== params.id);
    return HttpResponse.json({ items: cart });
  }),
];
