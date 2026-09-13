import { http, HttpResponse } from "msw";
import { nfts } from "./data/nfts";
import type { Nft } from "../types/nft";

interface CartItem {
  nft: Nft;
  quantity: number;
}

interface User {
  id: string;
  username: string;
  email: string;
  password: string;
}

interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: "pending" | "confirmed";
  createdAt: string;
}

interface Wallet {
  id: string;
  nickname: string;
  address: string;
  network: string;
  type: string;
  isPrimary: boolean;
}

// Funções auxiliares de persistência (localStorage)
function loadFromStorage<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : fallback;
}

function saveToStorage<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

let users: User[] = loadFromStorage("kurio-mock-users", []);
let sessions: Record<string, string> = loadFromStorage(
  "kurio-mock-sessions",
  {},
);

// Carrinho, pedidos, favoritos e carteiras são isolados POR USUÁRIO
// (chave = id do usuário, ou "guest" para quem ainda não está logado).
let cartByUser: Record<string, CartItem[]> = loadFromStorage(
  "kurio-mock-cart-by-user",
  {},
);
let ordersByUser: Record<string, Order[]> = loadFromStorage(
  "kurio-mock-orders-by-user",
  {},
);
let favoritesByUser: Record<string, string[]> = loadFromStorage(
  "kurio-mock-favorites-by-user",
  {},
);
let walletsByUser: Record<string, Wallet[]> = loadFromStorage(
  "kurio-mock-wallets-by-user",
  {},
);

function getUserFromToken(request: Request): User | null {
  const auth = request.headers.get("Authorization");
  const token = auth?.replace("Bearer ", "");
  if (!token || !sessions[token]) return null;
  return users.find((u) => u.id === sessions[token]) ?? null;
}

// Retorna a "chave" de isolamento: id do usuário logado, ou "guest"
function getCartKey(request: Request): string {
  const user = getUserFromToken(request);
  return user ? user.id : "guest";
}

function getCart(key: string): CartItem[] {
  if (!cartByUser[key]) cartByUser[key] = [];
  return cartByUser[key];
}

function getFavorites(key: string): string[] {
  if (!favoritesByUser[key]) favoritesByUser[key] = [];
  return favoritesByUser[key];
}

function getWallets(key: string): Wallet[] {
  if (!walletsByUser[key]) walletsByUser[key] = [];
  return walletsByUser[key];
}

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

  // GET /api/cart — ver carrinho do usuário atual (ou visitante)
  http.get("/api/cart", ({ request }) => {
    const key = getCartKey(request);
    return HttpResponse.json({ items: getCart(key) });
  }),

  // POST /api/cart — adicionar item ao carrinho do usuário atual
  http.post("/api/cart", async ({ request }) => {
    const key = getCartKey(request);
    const cart = getCart(key);
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

    saveToStorage("kurio-mock-cart-by-user", cartByUser);
    return HttpResponse.json({ items: cart });
  }),

  // PATCH /api/cart/:id — alterar quantidade no carrinho do usuário atual
  http.patch("/api/cart/:id", async ({ params, request }) => {
    const key = getCartKey(request);
    const cart = getCart(key);
    const body = (await request.json()) as { quantity: number };
    const item = cart.find((item) => item.nft.id === params.id);

    if (!item) {
      return HttpResponse.json(
        { message: "Item não encontrado no carrinho" },
        { status: 404 },
      );
    }

    item.quantity = body.quantity;
    saveToStorage("kurio-mock-cart-by-user", cartByUser);
    return HttpResponse.json({ items: cart });
  }),

  // DELETE /api/cart/:id — remover item do carrinho do usuário atual
  http.delete("/api/cart/:id", ({ params, request }) => {
    const key = getCartKey(request);
    cartByUser[key] = getCart(key).filter((item) => item.nft.id !== params.id);
    saveToStorage("kurio-mock-cart-by-user", cartByUser);
    return HttpResponse.json({ items: cartByUser[key] });
  }),

  // POST /api/cart/coupon — aplicar cupom
  http.post("/api/cart/coupon", async ({ request }) => {
    const body = (await request.json()) as { code: string };

    const validCoupons: Record<string, number> = {
      KURIO10: 0.1,
    };

    const discount = validCoupons[body.code.toUpperCase()];

    if (!discount) {
      return HttpResponse.json(
        { message: "Cupom inválido ou expirado" },
        { status: 400 },
      );
    }

    return HttpResponse.json({ discount });
  }),

  // GET /api/favorites — lista de ids favoritados do usuário atual
  http.get("/api/favorites", ({ request }) => {
    const key = getCartKey(request);
    return HttpResponse.json({ ids: getFavorites(key) });
  }),

  // POST /api/favorites — favoritar um NFT
  http.post("/api/favorites", async ({ request }) => {
    const key = getCartKey(request);
    const body = (await request.json()) as { nftId: string };
    const favorites = getFavorites(key);

    if (!favorites.includes(body.nftId)) {
      favorites.push(body.nftId);
    }

    saveToStorage("kurio-mock-favorites-by-user", favoritesByUser);
    return HttpResponse.json({ ids: favorites });
  }),

  // DELETE /api/favorites/:id — remover dos favoritos
  http.delete("/api/favorites/:id", ({ params, request }) => {
    const key = getCartKey(request);
    favoritesByUser[key] = getFavorites(key).filter((id) => id !== params.id);
    saveToStorage("kurio-mock-favorites-by-user", favoritesByUser);
    return HttpResponse.json({ ids: favoritesByUser[key] });
  }),

  // GET /api/wallets — listar carteiras do usuário atual
  http.get("/api/wallets", ({ request }) => {
    const key = getCartKey(request);
    return HttpResponse.json({ wallets: getWallets(key) });
  }),

  // POST /api/wallets — cadastrar carteira
  http.post("/api/wallets", async ({ request }) => {
    const key = getCartKey(request);
    const body = (await request.json()) as {
      nickname: string;
      address: string;
      network: string;
      type: string;
    };

    if (
      !body.address ||
      !body.address.startsWith("0x") ||
      body.address.length < 10
    ) {
      return HttpResponse.json(
        { message: "Endereço de carteira inválido" },
        { status: 400 },
      );
    }

    const wallets = getWallets(key);
    const wallet: Wallet = {
      id: `wallet-${Date.now()}`,
      nickname: body.nickname,
      address: body.address,
      network: body.network,
      type: body.type,
      isPrimary: wallets.length === 0,
    };

    wallets.push(wallet);
    saveToStorage("kurio-mock-wallets-by-user", walletsByUser);
    return HttpResponse.json({ wallets });
  }),

  // PATCH /api/wallets/:id — atualizar carteira
  http.patch("/api/wallets/:id", async ({ params, request }) => {
    const key = getCartKey(request);
    const wallets = getWallets(key);
    const wallet = wallets.find((w) => w.id === params.id);

    if (!wallet) {
      return HttpResponse.json(
        { message: "Carteira não encontrada" },
        { status: 404 },
      );
    }

    const body = (await request.json()) as Partial<Wallet>;
    Object.assign(wallet, body);

    saveToStorage("kurio-mock-wallets-by-user", walletsByUser);
    return HttpResponse.json({ wallets });
  }),

  // POST /api/auth/register
  http.post("/api/auth/register", async ({ request }) => {
    const body = (await request.json()) as {
      username: string;
      email: string;
      password: string;
    };

    if (users.some((u) => u.email === body.email)) {
      return HttpResponse.json(
        { message: "E-mail já cadastrado" },
        { status: 409 },
      );
    }

    const user: User = {
      id: String(users.length + 1),
      username: body.username,
      email: body.email,
      password: body.password,
    };
    users.push(user);

    const token = `token-${user.id}-${Date.now()}`;
    sessions[token] = user.id;

    saveToStorage("kurio-mock-users", users);
    saveToStorage("kurio-mock-sessions", sessions);

    return HttpResponse.json({
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  }),

  // POST /api/auth/login
  http.post("/api/auth/login", async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };
    const user = users.find(
      (u) => u.email === body.email && u.password === body.password,
    );

    if (!user) {
      return HttpResponse.json(
        { message: "E-mail ou senha inválidos" },
        { status: 401 },
      );
    }

    const token = `token-${user.id}-${Date.now()}`;
    sessions[token] = user.id;

    saveToStorage("kurio-mock-sessions", sessions);

    return HttpResponse.json({
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  }),

  // GET /api/auth/session
  http.get("/api/auth/session", ({ request }) => {
    const user = getUserFromToken(request);
    if (!user) {
      return HttpResponse.json({ message: "Sessão inválida" }, { status: 401 });
    }
    return HttpResponse.json({
      user: { id: user.id, username: user.username, email: user.email },
    });
  }),

  // POST /api/auth/logout
  http.post("/api/auth/logout", ({ request }) => {
    const auth = request.headers.get("Authorization");
    const token = auth?.replace("Bearer ", "");
    if (token) delete sessions[token];
    saveToStorage("kurio-mock-sessions", sessions);
    return HttpResponse.json({ success: true });
  }),

  // POST /api/orders — criar pedido (finalizar compra) do usuário atual
  http.post("/api/orders", async ({ request }) => {
    const key = getCartKey(request);
    const cart = getCart(key);

    if (cart.length === 0) {
      return HttpResponse.json({ message: "Carrinho vazio" }, { status: 400 });
    }

    // Cenário de teste: o NFT "Golden Signal #160" (id "9") está sempre
    // esgotado, para permitir testar o fluxo de erro de forma reproduzível
    const shouldFail = cart.some((item) => item.nft.id === "9");
    if (shouldFail) {
      return HttpResponse.json(
        {
          message:
            "Um dos itens do carrinho não está mais disponível. Revise seu carrinho.",
        },
        { status: 409 },
      );
    }

    const total =
      cart.reduce((sum, item) => sum + item.nft.priceEth * item.quantity, 0) +
      0.016;

    const order: Order = {
      id: `ORD-${Date.now()}`,
      items: cart,
      total,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    if (!ordersByUser[key]) ordersByUser[key] = [];
    ordersByUser[key].push(order);
    cartByUser[key] = [];

    saveToStorage("kurio-mock-orders-by-user", ordersByUser);
    saveToStorage("kurio-mock-cart-by-user", cartByUser);

    return HttpResponse.json(order);
  }),
];
