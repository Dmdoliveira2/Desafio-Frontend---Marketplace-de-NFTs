import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchNfts } from "../api/nfts";
import { NftCard } from "../components/NftCard";
import { Hero } from "../components/Hero";
import { FilterSidebar } from "../components/FilterSidebar";

export const Route = createFileRoute("/")({
  component: Home,
  validateSearch: (
    search: Record<string, unknown>,
  ): {
    category?: string;
    network?: string;
    q?: string;
    sort?: string;
    page?: number;
    view?: "all" | "new" | "trending";
    maxPrice?: number;
  } => ({
    category: typeof search.category === "string" ? search.category : undefined,
    network: typeof search.network === "string" ? search.network : undefined,
    q: typeof search.q === "string" ? search.q : undefined,
    sort: typeof search.sort === "string" ? search.sort : undefined,
    page: typeof search.page === "number" ? search.page : 1,
    view: (search.view as "all" | "new" | "trending") ?? "all",
    maxPrice: typeof search.maxPrice === "number" ? search.maxPrice : 13,
  }),
});

function Home() {
  const {
    category,
    network,
    q,
    sort,
    page = 1,
    view = "all",
    maxPrice = 13,
  } = Route.useSearch();
  const navigate = Route.useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["nfts"],
    queryFn: fetchNfts,
  });

  const PAGE_SIZE = 6;

  let items = data?.items ?? [];

  // 1. Filtro por categoria
  if (category) {
    items = items.filter((nft) => nft.category === category);
  }

  // 2. Filtro por rede
  if (network) {
    items = items.filter((nft) => nft.network === network);
  }

  // 3. Filtro por faixa de preço
  items = items.filter((nft) => nft.priceEth <= maxPrice);

  // 4. Filtro por aba (view)
  if (view === "new") {
    items = [...items].slice(-3);
  } else if (view === "trending") {
    items = [...items]
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
      .slice(0, 3);
  }

  // 5. Busca por nome
  if (q) {
    items = items.filter((nft) =>
      nft.name.toLowerCase().includes(q.toLowerCase()),
    );
  }

  // 6. Ordenação
  if (sort === "price_asc") {
    items = [...items].sort((a, b) => a.priceEth - b.priceEth);
  } else if (sort === "price_desc") {
    items = [...items].sort((a, b) => b.priceEth - a.priceEth);
  }

  // 7. Paginação
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedItems = items.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const featuredNft = data?.items[0];

  return (
    <div>
      <Hero />

      <div className="flex flex-col md:flex-row gap-8 px-8 pb-12">
        <div className="w-full md:w-64 shrink-0 space-y-8">
          <FilterSidebar
            selectedCategory={category ?? null}
            onSelectCategory={(cat) =>
              navigate({
                search: { category: cat ?? undefined, network, page: 1 },
              })
            }
            selectedNetwork={network ?? null}
            onSelectNetwork={(net) =>
              navigate({
                search: { category, network: net ?? undefined, page: 1 },
              })
            }
            maxPrice={maxPrice}
            onMaxPriceChange={(value) =>
              navigate({
                search: { category, network, maxPrice: value, page: 1 },
              })
            }
          />

          {featuredNft && (
            <div className="bg-surface p-4">
              <p className="text-accent text-xs font-bold mb-1">
                NFT EM DESTAQUE
              </p>
              <p className="text-sm mb-3">OFERTA LIMITADA</p>
              <Link to="/nft/$id" params={{ id: featuredNft.id }}>
                <img
                  src={featuredNft.image}
                  alt={featuredNft.name}
                  className="w-full aspect-square object-cover rounded-lg"
                />
              </Link>
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-6 text-sm">
              <button
                onClick={() =>
                  navigate({
                    search: { category, network, view: "all", page: 1 },
                  })
                }
                className={
                  view === "all"
                    ? "text-accent border-b-2 border-accent pb-1"
                    : "text-text-muted"
                }
              >
                Todos os NFTs
              </button>
              <button
                onClick={() =>
                  navigate({
                    search: { category, network, view: "new", page: 1 },
                  })
                }
                className={
                  view === "new"
                    ? "text-accent border-b-2 border-accent pb-1"
                    : "text-text-muted"
                }
              >
                Novos lançamentos
              </button>
              <button
                onClick={() =>
                  navigate({
                    search: { category, network, view: "trending", page: 1 },
                  })
                }
                className={
                  view === "trending"
                    ? "text-accent border-b-2 border-accent pb-1"
                    : "text-text-muted"
                }
              >
                Em alta
              </button>
              {category && (
                <span className="text-text-muted ml-2">— {category}</span>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-text-muted">Ordenar por:</span>
              <select
                value={sort ?? "recent"}
                onChange={(e) =>
                  navigate({
                    search: {
                      category,
                      network,
                      q,
                      view,
                      sort: e.target.value,
                      page: 1,
                    },
                  })
                }
                className="bg-surface p-2 border border-text-muted/30 text-sm"
              >
                <option value="recent">Listados recentemente</option>
                <option value="price_asc">Menor preço</option>
                <option value="price_desc">Maior preço</option>
              </select>
            </div>
          </div>

          {isLoading && <p>Carregando...</p>}
          {isError && <p>Erro ao carregar NFTs.</p>}

          {!isLoading && paginatedItems.length === 0 && (
            <p className="text-text-muted">Nenhum NFT encontrado.</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedItems.map((nft) => (
              <NftCard key={nft.id} nft={nft} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex gap-2 justify-end mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() =>
                    navigate({
                      search: { category, network, q, sort, view, page: p },
                    })
                  }
                  className={`w-9 h-9 rounded-lg ${p === currentPage ? "bg-accent text-background" : "bg-surface"}`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
