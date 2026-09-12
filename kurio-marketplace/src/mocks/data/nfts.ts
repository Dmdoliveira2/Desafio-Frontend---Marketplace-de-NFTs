import type { Nft } from "../../types/nft";

import emeraldApe from "../../assets/nfts/NFT Artwork 03.png";
import sageNomad from "../../assets/nfts/NFT Artwork 04.png";
import neonVessel from "../../assets/nfts/NFT Artwork 05.png";
import cosmicBloom from "../../assets/nfts/NFT Artwork 06.png";
import violetNomad from "../../assets/nfts/NFT Artwork 07.png";
import ivoryBaron from "../../assets/nfts/NFT Artwork 08.png";
import goldenBeat from "../../assets/nfts/NFT Artwork 09.png";
import goldenFrequency from "../../assets/nfts/NFT Artwork 10.png";
import goldenSignal from "../../assets/nfts/NFT Artwork 11.png";

export const nfts: Nft[] = [
  {
    id: "1",
    tokenId: "#0042",
    name: "Emerald Ape #042",
    image: emeraldApe,
    priceEth: 1.19,
    collection: "Kurio Apes",
    category: "Arte digital",
    network: "Ethereum",
    edition: "1/50",
    attributes: ["Óculos", "Esmeralda", "Raro"],
    rating: 4.8,
    reviewsCount: 19,
    description:
      "Um colecionável digital 1/50 finalizado à mão da coleção Kurio Editions, verificado na Ethereum, com arte desbloqueável e acesso para colecionadores.",
  },
  {
    id: "2",
    tokenId: "#0009",
    name: "Sage Nomad #009",
    image: sageNomad,
    priceEth: 1.69,
    collection: "Kurio Apes",
    category: "Arte digital",
    network: "Ethereum",
    edition: "1/1",
    attributes: ["Chapéu", "Nômade"],
    rating: 4.6,
    reviewsCount: 12,
    description:
      "Uma peça única (1/1) da coleção Kurio Editions, com arte desbloqueável e acesso exclusivo para colecionadores.",
  },
  {
    id: "3",
    tokenId: "#0552",
    name: "Neon Vessel #552",
    image: neonVessel,
    priceEth: 1.99,
    originalPriceEth: 2.29,
    collection: "Kurio Apes",
    category: "Arte digital",
    network: "Ethereum",
    edition: "1/10",
    isRare: true,
    attributes: ["Terno", "Raro"],
    rating: 4.9,
    reviewsCount: 27,
    description:
      "Edição limitada 1/10 da coleção Kurio Editions, com procedência verificada e alta demanda entre colecionadores.",
  },
  {
    id: "4",
    tokenId: "#0118",
    name: "Cosmic Bloom #118",
    image: cosmicBloom,
    priceEth: 1.29,
    collection: "Kurio Apes",
    category: "Arte digital",
    network: "Polygon",
    edition: "1/50",
    attributes: ["Moletom", "Cósmico"],
    rating: 4.5,
    reviewsCount: 8,
    description:
      "Peça 1/50 da coleção Kurio Editions, explorando temas cósmicos com acabamento artesanal digital.",
  },
  {
    id: "5",
    tokenId: "#0314",
    name: "Violet Nomad #314",
    image: violetNomad,
    priceEth: 1.39,
    collection: "Kurio Apes",
    category: "Arte digital",
    network: "Polygon",
    edition: "1/1",
    attributes: ["Fone de ouvido", "Violeta"],
    rating: 4.7,
    reviewsCount: 14,
    description:
      "Peça única (1/1) da coleção Kurio Editions, com direitos autorais garantidos ao criador original.",
  },
  {
    id: "6",
    tokenId: "#0088",
    name: "Ivory Baron #088",
    image: ivoryBaron,
    priceEth: 1.79,
    collection: "Kurio Apes",
    category: "Arte digital",
    network: "Ethereum",
    edition: "1/10",
    attributes: ["Terno", "Marfim"],
    rating: 4.8,
    reviewsCount: 21,
    description:
      "Edição 1/10 da coleção Kurio Editions, com elegância clássica e alta procura no mercado secundário.",
  },
  {
    id: "7",
    tokenId: "#0207",
    name: "Golden Beat #207",
    image: goldenBeat,
    priceEth: 0.99,
    collection: "Kurio Apes",
    category: "Música",
    network: "Solana",
    edition: "1/50",
    attributes: ["Fone de ouvido", "Dourado"],
    rating: 4.4,
    reviewsCount: 6,
    description:
      "Peça 1/50 da coleção Kurio Editions, com temática musical e acesso a conteúdo exclusivo do criador.",
  },
  {
    id: "8",
    tokenId: "#0071",
    name: "Golden Frequency #071",
    image: goldenFrequency,
    priceEth: 0.59,
    collection: "Kurio Apes",
    category: "Música",
    network: "Solana",
    edition: "1/50",
    attributes: ["Terno", "Frequência"],
    rating: 4.3,
    reviewsCount: 5,
    description:
      "Peça acessível da coleção Kurio Editions, ideal para colecionadores iniciantes.",
  },
  {
    id: "9",
    tokenId: "#0160",
    name: "Golden Signal #160",
    image: goldenSignal,
    priceEth: 0.39,
    collection: "Kurio Apes",
    category: "Música",
    network: "Solana",
    edition: "1/50",
    attributes: ["Fone de ouvido", "Sinal"],
    rating: 4.2,
    reviewsCount: 4,
    description:
      "Peça de entrada da coleção Kurio Editions, com boa relação custo-benefício para novos colecionadores.",
  },
];
