import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-4 border-b border-surface">
      <span className="font-bold text-lg tracking-wider">KURIO</span>

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
      </nav>

      <div className="flex items-center gap-4">
        <button className="bg-accent text-background px-4 py-2 rounded font-medium">
          Entrar
        </button>
      </div>
    </header>
  );
}
