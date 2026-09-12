# Kurio Marketplace

NFT Marketplace desenvolvido como desafio técnico para a vaga de Frontend Developer na Jungle Gaming.

**Aplicação publicada:** https://kurio-marketplace-six.vercel.app/

## Stack utilizada

- React 19 + TypeScript
- Vite
- TanStack Router (rotas file-based)
- TanStack Query (estado remoto/cache)
- Axios (cliente HTTP)
- Tailwind CSS v4
- MSW (Mock Service Worker) — simula toda a API REST
- Socket.IO (tempo real)
- Playwright (testes E2E)

## Como rodar o projeto localmente

Pré-requisitos: Node.js 18+ instalado.

```bash
# 1. Clonar o repositório
git clone <url-do-repositorio>
cd kurio-marketplace

# 2. Instalar dependências
npm install

# 3. Rodar em modo desenvolvimento
npm run dev
```

Acesse `http://localhost:5173`.

## Variáveis de ambiente

Não é necessário configurar nenhuma variável de ambiente. Toda a API é simulada via MSW, sem dependência de serviços externos ou chaves de API.

## Credenciais de teste

Não existem usuários pré-cadastrados. Para testar o fluxo completo, crie uma conta nova através da tela de **Cadastro** (`/cadastro`) com qualquer e-mail e senha (mínimo 6 caracteres). Os dados de conta ficam salvos no `localStorage` do navegador.

## Scripts disponíveis

| Comando                      | Descrição                                               |
| ---------------------------- | ------------------------------------------------------- |
| `npm run dev`                | Roda o projeto em modo desenvolvimento                  |
| `npm run build`              | Gera o build de produção (checagem de tipos + build)    |
| `npm run preview`            | Serve o build de produção localmente para teste         |
| `npx playwright test`        | Executa os testes E2E (sobe o servidor automaticamente) |
| `npx playwright show-report` | Abre o relatório HTML do último teste rodado            |

## Resetando os dados simulados

Como o "banco de dados" da aplicação é mockado e persistido no `localStorage` do navegador (para sobreviver a atualizações de página), para resetar completamente o estado (usuários, sessão, carrinho, pedidos) para um cenário limpo:

1. Abra o DevTools do navegador (F12)
2. Vá em **Application** (ou **Armazenamento**) → **Local Storage**
3. Remova as chaves que começam com `kurio-mock-` (ou limpe todo o Local Storage do domínio)
4. Recarregue a página

## Reproduzindo o fluxo de compra completo

1. Acesse a Home e clique em qualquer NFT do catálogo
2. Na página de detalhe, clique em **COMPRAR**
3. Acesse o **Carrinho** pelo menu superior
4. Clique em **Conectar e finalizar**
5. Se não estiver logado, você será solicitado a criar uma conta/entrar antes de prosseguir
6. Na tela de Checkout, clique em **Confirmar compra**
7. Você será redirecionado para a tela de Confirmação, com o ID do pedido

## Testes automatizados

Os testes E2E cobrem o fluxo principal de compra (cadastro → catálogo → detalhe → carrinho → checkout → confirmação), executados em dois perfis: Desktop Chrome e Mobile Chrome (emulação Pixel 5).

```bash
npx playwright test
```

O Playwright sobe o servidor de desenvolvimento automaticamente (não é necessário rodar `npm run dev` manualmente antes).

## Limitações conhecidas

Ver [ARCHITECTURE.md](./ARCHITECTURE.md) para detalhes técnicos e decisões de arquitetura.
