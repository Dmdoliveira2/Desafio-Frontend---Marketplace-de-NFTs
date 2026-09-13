import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search, ShoppingCart, LogIn } from "lucide-react";
import { useAuth } from "../lib/AuthContext";
import { fetchCart } from "../api/cart";
import { Button } from "./ui/button";

export function Header() {
  const { user, clearAuth } = useAuth();
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const { data: cartData } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
  });

  const cartCount =
    cartData?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    navigate({ to: "/", search: { q: searchValue || undefined } });
    setSearchOpen(false);
  }

  return (
    <header className="flex items-center justify-between px-8 py-3 border-b border-surface">
      <Link to="/" className="font-bold text-lg tracking-widest">
        KURIO
      </Link>

      <nav className="flex gap-5 text-sm">
        <Link
          to="/"
          className="hover:text-accent"
          activeProps={{
            className: "text-accent border-b-2 border-accent pb-1",
          }}
        >
          Início
        </Link>
        <Link
          to="/mercado"
          className="hover:text-accent"
          activeProps={{
            className: "text-accent border-b-2 border-accent pb-1",
          }}
        >
          Mercado
        </Link>
        <span className="text-text-muted">Criadores</span>
        <span className="text-text-muted">Aprenda</span>
      </nav>

      <div className="flex items-center gap-4">
        {searchOpen ? (
          <form onSubmit={handleSearch}>
            <input
              autoFocus
              type="search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onBlur={() => !searchValue && setSearchOpen(false)}
              placeholder="Buscar NFT..."
              className="bg-surface p-1.5 border border-text-muted/30 text-sm w-40"
            />
          </form>
        ) : (
          <button onClick={() => setSearchOpen(true)} aria-label="Buscar">
            <Search size={18} className="text-text-muted hover:text-accent" />
          </button>
        )}

        <Link to="/carrinho" className="relative">
          <ShoppingCart size={20} />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-accent text-background text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>

        {user ? (
          <Button
            variant="ghost"
            onClick={() => clearAuth()}
            className="text-sm"
          >
            Sair ({user.username})
          </Button>
        ) : (
          <Link to="/entrar">
            <Button className="bg-accent text-background hover:bg-accent-hover rounded-lg flex items-center gap-1.5">
              <LogIn size={16} /> Entrar
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
