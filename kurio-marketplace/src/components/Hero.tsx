import heroImage from "../assets/hero.png";

export function Hero() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-8 py-12">
      <div>
        <p className="text-accent text-sm mb-2">Bem-vindo à Kurio</p>
        <h1 className="text-3xl md:text-4xl font-bold leading-tight">
          SEJA DONO DO FUTURO DA ARTE DIGITAL
        </h1>
        <p className="text-text-muted mt-4">
          Descubra NFTs selecionados de criadores emergentes e consagrados.
          Colecione arte digital rara, apoie artistas e tenha uma parte da
          cultura da internet.
        </p>
        <button className="mt-6 bg-accent text-background px-6 py-3 font-medium">
          EXPLORAR
        </button>
      </div>

      <img
        src={heroImage}
        alt="NFT em destaque"
        className="w-full aspect-square object-cover"
      />
    </section>
  );
}
