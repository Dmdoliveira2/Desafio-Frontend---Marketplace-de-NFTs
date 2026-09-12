interface FilterSidebarProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const categories = [
  { name: "Arte digital", count: 33 },
  { name: "Fotografia", count: 12 },
  { name: "Música", count: 65 },
  { name: "Arte 3D", count: 39 },
  { name: "Colecionáveis", count: 23 },
];

export function FilterSidebar({
  selectedCategory,
  onSelectCategory,
}: FilterSidebarProps) {
  return (
    <aside className="w-full md:w-64 shrink-0">
      <h3 className="font-bold mb-4">Coleções</h3>
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
    </aside>
  );
}
