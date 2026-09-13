import { createFileRoute } from "@tanstack/react-router";
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
    q?: string;
    sort?: string;
    page?: number;
    view?: "all" | "new" | "trending";
  } => ({
    category: typeof search.category === "string" ? search.category : undefined,
    q: typeof search.q === "string" ? search.q : undefined,
    sort: typeof search.sort === "string" ? search.sort : undefined,
    page: typeof search.page === "number" ? search.page : 1,
    view: (search.view as "all" | "new" | "trending") ?? "all",
  }),
});

function Home() {
  const { category, q, sort, page = 1, view = "all" } = Route.useSearch();
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

  // 2. Filtro por aba (view)
  if (view === "new") {
    items = [...items].slice(-3); // últimos 3 do catálogo, simulando "novos"
  } else if (view === "trending") {
    items = [...items]
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
      .slice(0, 3);
  }

  // 3. Busca por nome
  if (q) {
    items = items.filter((nft) =>
      nft.name.toLowerCase().includes(q.toLowerCase()),
    );
  }

  // 4. Ordenação
  if (sort === "price_asc") {
    items = [...items].sort((a, b) => a.priceEth - b.priceEth);
  } else if (sort === "price_desc") {
    items = [...items].sort((a, b) => b.priceEth - a.priceEth);
  }
  // 'recent' (padrão) mantém a ordem original

  // 5. Paginação
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedItems = items.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <div>
      <Hero />

      <div className="flex flex-col md:flex-row gap-8 px-8 pb-12">
        <FilterSidebar
          selectedCategory={category ?? null}
          onSelectCategory={(cat) =>
            navigate({ search: { category: cat ?? undefined, page: 1 } })
          }
        />

        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-6 text-sm">
              <button
                onClick={() =>
                  navigate({ search: { category, view: "all", page: 1 } })
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
                  navigate({ search: { category, view: "new", page: 1 } })
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
                  navigate({ search: { category, view: "trending", page: 1 } })
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
            <div className="flex gap-2 justify-center mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() =>
                    navigate({ search: { category, q, sort, view, page: p } })
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
