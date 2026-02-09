import { Info, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { NEW_GAMES, PRE_ORDERS } from "@/lib/mock-store-data";

interface CatalogProps {
  exchangeRate: number;
  currencySymbol: string;
  dataSource?: string;
}

export function PSStoreCatalog({ exchangeRate, currencySymbol, dataSource = "CBR" }: CatalogProps) {
  return (
    <div className="px-8 lg:px-12 py-10 bg-white min-h-screen text-[#1F1F1F] font-['Inter',system-ui,sans-serif]">
      <Section title="New games" games={NEW_GAMES} exchangeRate={exchangeRate} currencySymbol={currencySymbol} dataSource={dataSource} />
      <Section title="Pre-orders" games={PRE_ORDERS} exchangeRate={exchangeRate} currencySymbol={currencySymbol} dataSource={dataSource} />
    </div>
  );
}

function Section({ title, games, exchangeRate, currencySymbol, dataSource }: { title: string; games: any[]; exchangeRate: number; currencySymbol: string; dataSource: string }) {
  return (
    <div className="mb-14">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[22px] font-semibold text-[#1F1F1F] tracking-tight">{title}</h2>
        <button className="text-[13px] font-bold text-[#00439C] hover:underline underline-offset-4">View All</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
        {games.map((game) => (
          <ProductCard key={game.id} game={game} exchangeRate={exchangeRate} currencySymbol={currencySymbol} dataSource={dataSource} />
        ))}
      </div>
    </div>
  );
}

function ProductCard({ game, exchangeRate, currencySymbol, dataSource = "CBR" }: { game: any; exchangeRate: number; currencySymbol: string; dataSource?: string }) {
  const convertedPrice = game.price > 0 ? Math.floor(game.price * exchangeRate) : 0;

  return (
    <div className="group flex flex-col cursor-pointer" data-testid={`card-product-${game.id}`}>
      <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 relative mb-3 ring-1 ring-black/5 group-hover:ring-black/10 group-hover:shadow-lg group-hover:-translate-y-0.5 transition-all duration-200">
        <img
          src={game.image}
          alt={game.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {game.tag && (
          <div className="absolute top-2.5 left-2.5 bg-[#E35205] text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
            {game.tag}
          </div>
        )}
        {game.platform && (
          <div className="absolute bottom-2.5 left-2.5 bg-black/70 backdrop-blur-sm text-white text-[9px] font-semibold px-2 py-0.5 rounded">
            {game.platform}
          </div>
        )}
      </div>

      <h3 className="text-[13px] leading-[1.3] font-medium text-[#1F1F1F] line-clamp-2 mb-1.5 min-h-[34px]">
        {game.title}
      </h3>

      <div className="flex flex-col gap-1.5">
        {game.price === 0 ? (
          <span className="text-[14px] font-semibold text-[#1F1F1F]">Free</span>
        ) : (
          <span className="text-[14px] font-semibold text-[#1F1F1F]">${game.price}</span>
        )}

        {game.price > 0 && exchangeRate > 0 && (
          <Popover>
            <PopoverTrigger asChild>
              <button
                className="flex items-center gap-1.5 bg-gradient-to-r from-[#EBF0FF] to-[#F0F4FA] hover:from-[#DDE5FF] hover:to-[#E5EBFA] border border-[#C5D4F5] rounded-lg px-2.5 py-[5px] w-fit transition-all duration-150 hover:shadow-sm active:scale-95 group/badge"
                onClick={(e) => e.stopPropagation()}
                data-testid={`badge-price-${game.id}`}
              >
                <span className="text-[12px] font-bold text-[#00439C] leading-none">
                  ≈ {convertedPrice.toLocaleString()} {currencySymbol}
                </span>
                <Info className="h-3 w-3 text-[#00439C]/50 group-hover/badge:text-[#00439C]/80 transition-colors" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-[260px] p-0 bg-white border border-gray-200/80 shadow-xl shadow-black/8 rounded-xl overflow-hidden text-black z-50" align="start">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-[#FAFBFF] to-white">
                <span className="font-bold text-[10px] uppercase tracking-[0.1em] text-gray-400">Conversion</span>
                <Badge variant="secondary" className="text-[9px] bg-[#00439C] text-white hover:bg-[#003580] h-[18px] border-none px-2 rounded-full font-bold">LIVE</Badge>
              </div>
              <div className="p-4 space-y-2.5">
                <div className="flex justify-between items-center text-[12px]">
                  <span className="text-gray-500 font-medium">Rate</span>
                  <span className="font-mono text-gray-600 tabular-nums">1 USD = {exchangeRate.toFixed(2)} {currencySymbol}</span>
                </div>
                <div className="flex justify-between items-center text-[12px]">
                  <span className="text-gray-500 font-medium">Source</span>
                  <span className="text-gray-600 font-medium">{dataSource === "CBR" ? "CBR (Bank of Russia)" : "Frankfurter (ECB)"}</span>
                </div>
                <div className="h-px bg-gray-100 my-1" />
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900 text-[13px]">Total</span>
                  <span className="font-bold text-[18px] text-[#00439C] tabular-nums">{convertedPrice.toLocaleString()} {currencySymbol}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-medium pt-1">
                  <TrendingDown className="h-3 w-3" />
                  Live rate from {dataSource}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
}
