interface FilterSidebarProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  selectedNetwork: string | null;
  onSelectNetwork: (network: string | null) => void;
  maxPrice: number;
  onMaxPriceChange: (value: number) => void;
}

const categories = [
  { name: "Arte digital", count: 33 },
  { name: "Fotografia", count: 12 },
  { name: "Música", count: 65 },
  { name: "Arte 3D", count: 39 },
  { name: "Colecionáveis", count: 23 },
  { name: "Generativa", count: 17 },
  { name: "Jogos", count: 19 },
  { name: "Assinaturas", count: 13 },
  { name: "Utilidade", count: 18 },
];

const networks = [
  { name: "Ethereum", count: 119 },
  { name: "Polygon", count: 78 },
  { name: "Solana", count: 86 },
];

export function FilterSidebar({
  selectedCategory,
  onSelectCategory,
  selectedNetwork,
  onSelectNetwork,
  maxPrice,
  onMaxPriceChange,
}: FilterSidebarProps) {
  return (
    <aside className="w-full md:w-64 shrink-0 space-y-8">
      <div>
        <h2 className="font-bold mb-4">Coleções</h2>
        <ul className="space-y-2 text-sm">
          {categories.map((cat) => (
            <li key={cat.name}>
              <button
                onClick={() =>
                  onSelectCategory(
                    cat.name === selectedCategory ? null : cat.name,
                  )
                }
                className={`flex justify-between w-full text-left ${
                  cat.name === selectedCategory
                    ? "text-accent"
                    : "hover:text-accent"
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-text-muted">({cat.count})</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="font-bold mb-4">Faixa de preço</h2>
        <input
          type="range"
          min={0}
          max={13}
          step={0.1}
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(Number(e.target.value))}
          className="w-full accent-accent"
        />
        <p className="text-sm text-text-muted mt-2">
          Preço: 0,02 - {maxPrice.toFixed(2)} ETH
        </p>
      </div>

      <div>
        <h2 className="font-bold mb-4">Rede</h2>
        <ul className="space-y-2 text-sm">
          {networks.map((net) => (
            <li key={net.name}>
              <button
                onClick={() =>
                  onSelectNetwork(
                    net.name === selectedNetwork ? null : net.name,
                  )
                }
                className={`flex justify-between w-full text-left ${
                  net.name === selectedNetwork
                    ? "text-accent"
                    : "hover:text-accent"
                }`}
              >
                <span>{net.name}</span>
                <span className="text-text-muted">({net.count})</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
