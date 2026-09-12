# Arquitetura — Kurio Marketplace

## Visão geral

Aplicação frontend em React + TypeScript que simula um marketplace de NFTs completo, com todos os dados e a API providos por mocks (MSW), sem backend real. O objetivo do desafio era demonstrar domínio da stack moderna de frontend (roteamento, estado remoto, tempo real, testes) dentro de um prazo curto (2 dias).

## Estrutura de pastas

```
src/
  api/          → funções que chamam a API simulada (via Axios)
  components/   → componentes reutilizáveis (Header, NftCard, Hero, FilterSidebar)
  components/ui → componentes do shadcn/ui
  lib/          → utilitários e Context (AuthContext, useSocket)
  mocks/        → handlers do MSW e dados mockados
  routes/       → páginas (rotas file-based do TanStack Router)
  types/        → tipos TypeScript compartilhados
```

## Decisões técnicas

### Estado remoto e cache

TanStack Query gerencia todo o estado vindo da API simulada (catálogo, detalhe, carrinho, sessão). Mutations (`useMutation`) são usadas para toda alteração de dados (adicionar ao carrinho, login, criar pedido), seguidas de invalidação de cache (`invalidateQueries`) ou escrita direta no cache (`setQueryData`, usada nos eventos de tempo real).

### Persistência dos dados mockados

Como o MSW roda inteiramente no navegador (não existe banco de dados real), o estado de usuários, sessões, carrinho e pedidos é persistido no `localStorage` dentro dos próprios handlers do MSW. Isso permite que a sessão do usuário e o conteúdo do carrinho sobrevivam a um refresh (F5) da página, cumprindo o requisito de recuperação de sessão.

**Limitação:** esse estado é local ao navegador do usuário — não há sincronização entre dispositivos ou usuários diferentes, como haveria com um backend real.

### Tempo real (Socket.IO)

O servidor Socket.IO é implementado como um plugin customizado do Vite (`socket-plugin.ts`), anexado ao mesmo servidor HTTP do `npm run dev`. Isso permite testar tempo real localmente sem precisar de um backend separado.

Eventos implementados:

- `nft.updated` — atualiza preço/disponibilidade de um NFT diretamente no cache do TanStack Query (catálogo e detalhe), com controle de versão para ignorar eventos duplicados ou fora de ordem.
- `order.updated` — sinaliza mudança de status de um pedido.

**Limitação importante:** esse plugin depende de um servidor Node contínuo, o que **não funciona em ambientes serverless como o Vercel**. Em produção, a conexão Socket.IO não é estabelecida (o app continua funcionando normalmente, já que os eventos de tempo real são um incremento, não uma dependência crítica dos fluxos principais). Essa é uma limitação conhecida, decorrente da arquitetura simplificada adotada dado o prazo do desafio — em um cenário de produção real, o ideal seria um servidor Socket.IO dedicado (ex: um serviço separado no Railway/Render, ou um provedor gerenciado).

**Nota sobre `order.updated`:** por simplicidade, esse evento é emitido pelo próprio cliente ao confirmar a compra (`checkout.tsx`), em vez de emitido pelo "servidor" — já que, nesta arquitetura, quem processa o pedido é o MSW (que roda no navegador), não haveria como o processo Socket.IO (que roda no Vite) saber da criação do pedido sem essa ponte.

### Autenticação

Sessão simples baseada em token, com o token guardado no `localStorage` e enviado via header `Authorization: Bearer <token>`. O `AuthContext` (Context API do React) expõe o usuário logado para toda a árvore de componentes. Rotas que exigem login (ex: checkout) verificam a presença do usuário e redirecionam/bloqueiam quando necessário.

### Componentes (shadcn/ui)

O projeto usa shadcn/ui (variante Base UI) para os componentes de botão em pontos-chave da interface (Header, ação de compra). Os demais elementos de formulário usam HTML nativo estilizado diretamente com Tailwind CSS, dado o tempo disponível para o desafio.

## Limitações conhecidas e melhorias futuras

- **Idempotência de pedidos:** não implementada. Cliques repetidos no botão de confirmar compra podem, em tese, gerar múltiplos pedidos. Em uma versão futura, seria implementada uma chave de idempotência enviada pelo cliente e validada pelo servidor.
- **Socket.IO em produção:** conforme descrito acima, não funciona no ambiente serverless do Vercel.
- **Cobertura de testes:** os testes E2E cobrem o fluxo principal de compra (o caminho mais crítico). Fluxos secundários (favoritos, edição de perfil, cenários de erro de rede) não possuem testes automatizados dedicados neste momento.
- **Fidelidade visual:** o layout segue a identidade visual do Figma (cores, tipografia, estrutura geral), mas não reproduz 100% dos detalhes visuais de cada tela, priorizando a implementação dos fluxos funcionais dentro do prazo do desafio.
