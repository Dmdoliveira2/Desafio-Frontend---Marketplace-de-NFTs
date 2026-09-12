import { Link } from "@tanstack/react-router";
import type { Nft } from "../types/nft";

interface NftCardProps {
  nft: Nft;
}

export function NftCard({ nft }: NftCardProps) {
  return (
    <Link to="/nft/$id" params={{ id: nft.id }} className="block">
      <div className="bg-surface overflow-hidden group cursor-pointer">
        <div className="relative aspect-square bg-[#eee5d3]">
          <img
            src={nft.image}
            alt={nft.name}
            className="w-full h-full object-cover"
          />
          {nft.isRare && (
            <span className="absolute top-2 left-2 bg-accent text-background text-xs font-bold px-2 py-1">
              RARO
            </span>
          )}
        </div>

        <div className="p-4">
          <p className="font-medium">{nft.name}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-accent font-bold">{nft.priceEth} ETH</span>
            {nft.originalPriceEth && (
              <span className="text-text-muted line-through text-sm">
                {nft.originalPriceEth} ETH
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
