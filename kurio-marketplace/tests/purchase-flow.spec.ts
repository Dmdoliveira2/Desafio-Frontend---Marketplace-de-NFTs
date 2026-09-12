import { test, expect } from "@playwright/test";

test("fluxo completo de compra: catálogo → detalhe → carrinho → checkout → confirmação", async ({
  page,
}) => {
  // Cria um usuário único a cada execução do teste (evita "e-mail já cadastrado")
  const uniqueEmail = `teste-${Date.now()}@kurio.com`;

  await page.goto("/");

  // Confirma que o catálogo carregou
  await expect(page.getByText("Todos os NFTs")).toBeVisible();

  // Vai pro cadastro e cria uma conta
  await page.goto("/cadastro");
  await page.getByPlaceholder("Nome de usuário").fill("Usuário Teste");
  await page.getByPlaceholder("Digite seu e-mail").fill(uniqueEmail);
  await page.getByPlaceholder("Senha", { exact: true }).fill("senha123");
  await page.getByPlaceholder("Confirmar senha").fill("senha123");
  await page.getByRole("button", { name: "Criar conta" }).click();

  // Confirma que logou (Header muda pra "Sair (...)")
  await expect(page.getByText(/Sair \(/)).toBeVisible();

  // Clica no primeiro NFT do catálogo
  await page.goto("/");
  await page.locator('a[href^="/nft/"]').first().click();

  // Espera a imagem do NFT carregar completamente antes de interagir
  await page.waitForLoadState("networkidle");

  // Adiciona ao carrinho
  await page.getByRole("button", { name: "COMPRAR" }).scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "COMPRAR" }).click({ force: true });
  await expect(page.getByRole("button", { name: /ADICIONADO/ })).toBeVisible();

  // Vai pro carrinho e confirma que tem item
  await page.goto("/carrinho");
  await expect(page.getByText("Conectar e finalizar")).toBeVisible();

  // Vai pro checkout
  await page.getByText("Conectar e finalizar").click();
  await expect(page).toHaveURL(/\/checkout/);

  // Confirma a compra
  await page.getByRole("button", { name: "Confirmar compra" }).click();

  // Confirma que chegou na tela de confirmação
  await expect(page).toHaveURL(/\/confirmacao/);
  await expect(
    page.getByText("Seus NFTs agora estão na sua carteira"),
  ).toBeVisible();
});
