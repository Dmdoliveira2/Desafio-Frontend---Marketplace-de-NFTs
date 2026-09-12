import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { login } from "../api/auth";
import { useAuth } from "../lib/AuthContext";

export const Route = createFileRoute("/entrar")({
  component: Entrar,
});

function Entrar() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: () => login(email, password),
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      navigate({ to: "/" });
    },
  });

  return (
    <div className="max-w-sm mx-auto mt-16 p-8 bg-surface">
      <h1 className="text-xl font-bold text-center mb-6">Entrar</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          loginMutation.mutate();
        }}
        className="space-y-4"
      >
        <div>
          <label htmlFor="email" className="block text-sm mb-1">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            placeholder="contato@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-background p-3 border border-text-muted/30"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm mb-1">
            Senha
          </label>
          <input
            id="password"
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-background p-3 border border-text-muted/30"
          />
        </div>

        {loginMutation.isError && (
          <p role="alert" className="text-red-400 text-sm">
            E-mail ou senha inválidos.
          </p>
        )}

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full bg-accent text-background py-3 font-medium rounded-lg disabled:opacity-50"
        >
          {loginMutation.isPending ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="text-center text-sm mt-6">
        Novo na Kurio?{" "}
        <Link to="/cadastro" className="text-accent">
          Crie uma conta
        </Link>
      </p>
    </div>
  );
}
