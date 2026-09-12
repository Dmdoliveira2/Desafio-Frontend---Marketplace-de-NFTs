import { Link } from "@tanstack/react-router";
import { useAuth } from "../lib/AuthContext";

export function Header() {
  const { user, clearAuth } = useAuth();

  return (
    <header className="flex items-center justify-between px-8 py-4 border-b border-surface">
      <Link to="/" className="font-bold text-lg tracking-wider">
        KURIO
      </Link>

      <nav className="flex gap-6">
        <Link
          to="/"
          className="hover:text-accent"
          activeProps={{ className: "text-accent" }}
        >
          Início
        </Link>
        <Link
          to="/mercado"
          className="hover:text-accent"
          activeProps={{ className: "text-accent" }}
        >
          Mercado
        </Link>
        <span className="text-text-muted">Criadores</span>
        <span className="text-text-muted">Aprenda</span>
        <Link
          to="/carrinho"
          className="hover:text-accent"
          activeProps={{ className: "text-accent" }}
        >
          🛒 Carrinho
        </Link>
      </nav>

      <div className="flex items-center gap-4">
        {user ? (
          <button
            onClick={() => clearAuth()}
            className="text-sm hover:text-accent"
          >
            Sair ({user.username})
          </button>
        ) : (
          <Link
            to="/entrar"
            className="bg-accent text-background px-4 py-2 font-medium"
          >
            Entrar
          </Link>
        )}
      </div>
    </header>
  );
}
