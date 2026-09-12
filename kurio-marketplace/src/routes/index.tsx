import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchNfts } from "../api/nfts";
import { NftCard } from "../components/NftCard";
import { Hero } from "../components/Hero";
import { FilterSidebar } from "../components/FilterSidebar";

export const Route = createFileRoute("/")({
  component: Home,
  validateSearch: (search: Record<string, unknown>): { category?: string } => ({
    category: typeof search.category === "string" ? search.category : undefined,
  }),
});

function Home() {
  const { category } = Route.useSearch();
  const navigate = Route.useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["nfts"],
    queryFn: fetchNfts,
  });

  const filteredItems = category
    ? data?.items.filter((nft) => nft.category === category)
    : data?.items;

  return (
    <div>
      <Hero />

      <div className="flex flex-col md:flex-row gap-8 px-8 pb-12">
        <FilterSidebar
          selectedCategory={category ?? null}
          onSelectCategory={(cat) =>
            navigate({ search: { category: cat ?? undefined } })
          }
        />

        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-6">
            {category ? `NFTs — ${category}` : "Todos os NFTs"}
          </h2>
          {isLoading && <p>Carregando...</p>}
          {isError && <p>Erro ao carregar NFTs.</p>}

          {!isLoading && filteredItems?.length === 0 && (
            <p className="text-text-muted">
              Nenhum NFT encontrado nessa categoria.
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems?.map((nft) => (
              <NftCard key={nft.id} nft={nft} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
