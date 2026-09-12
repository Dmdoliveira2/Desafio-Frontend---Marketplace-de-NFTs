import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/mercado")({
  component: Mercado,
});

function Mercado() {
  return <h1 className="p-8">Página Mercado (em construção)</h1>;
}
