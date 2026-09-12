import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { register } from "../api/auth";
import { useAuth } from "../lib/AuthContext";

export const Route = createFileRoute("/cadastro")({
  component: Cadastro,
});

function Cadastro() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const registerMutation = useMutation({
    mutationFn: () => register(username, email, password),
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      navigate({ to: "/" });
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setValidationError("");

    if (password !== confirmPassword) {
      setValidationError("As senhas não coincidem.");
      return;
    }

    registerMutation.mutate();
  }

  return (
    <div className="max-w-sm mx-auto mt-16 p-8 bg-surface">
      <h1 className="text-xl font-bold text-center mb-6">Criar conta</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm mb-1">
            Nome de usuário
          </label>
          <input
            id="username"
            type="text"
            placeholder="Nome de usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full bg-background p-3 border border-text-muted/30"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm mb-1">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            placeholder="Digite seu e-mail"
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
            minLength={6}
            className="w-full bg-background p-3 border border-text-muted/30"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm mb-1">
            Confirmar senha
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirmar senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full bg-background p-3 border border-text-muted/30"
          />
        </div>

        {(validationError || registerMutation.isError) && (
          <p role="alert" className="text-red-400 text-sm">
            {validationError || "E-mail já cadastrado."}
          </p>
        )}

        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full bg-accent text-background py-3 font-medium rounded-lg disabled:opacity-50"
        >
          {registerMutation.isPending ? "Criando..." : "Criar conta"}
        </button>
      </form>

      <p className="text-center text-sm mt-6">
        Já tem uma conta?{" "}
        <Link to="/entrar" className="text-accent">
          Entre
        </Link>
      </p>
    </div>
  );
}
