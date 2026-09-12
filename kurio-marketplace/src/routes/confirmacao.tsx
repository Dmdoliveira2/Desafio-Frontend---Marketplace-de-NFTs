import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/confirmacao")({
  component: Confirmacao,
  validateSearch: (search: Record<string, unknown>) => ({
    orderId: (search.orderId as string) ?? "",
  }),
});

function Confirmacao() {
  const { orderId } = Route.useSearch();

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-surface text-center">
      <h1 className="text-xl font-bold">
        Seus NFTs agora estão na sua carteira
      </h1>

      <div className="mt-6 text-left border-t border-b border-background py-4">
        <p className="text-sm text-text-muted">ID da transação</p>
        <p className="font-medium">{orderId}</p>
      </div>

      <p className="mt-6 text-sm text-text-muted">
        Transação confirmada. A propriedade foi transferida para sua carteira
        conectada e registrada na simulação.
      </p>

      <Link
        to="/"
        className="block mt-8 bg-accent text-background py-3 font-medium"
      >
        Voltar ao início
      </Link>
    </div>
  );
}
