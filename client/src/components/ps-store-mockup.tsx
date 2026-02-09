import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingCart, Heart, Share2, Globe, Grid, Maximize2, Info, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExtensionPopup } from "./extension-popup";
import { PSStoreCatalog } from "./ps-store-catalog";
import { CurrencyService, DataSource } from "@/lib/currency-service";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function PSStoreMockup() {
  const [showPopup, setShowPopup] = useState(false);
  const [view, setView] = useState<"product" | "catalog">("catalog");

  const [targetCurrency, setTargetCurrency] = useState("RUB");
  const [dataSource, setDataSource] = useState<DataSource>("CBR");
  const [exchangeRate, setExchangeRate] = useState(0);
  const [rateLoading, setRateLoading] = useState(true);

  useEffect(() => {
    const fetchRate = async () => {
      setRateLoading(true);
      const rate = await CurrencyService.getRate("USD", targetCurrency, dataSource);
      setExchangeRate(rate);
      setRateLoading(false);
    };
    fetchRate();
  }, [targetCurrency, dataSource]);

  const originalPrice = 69.99;
  const convertedPrice = Math.floor(originalPrice * exchangeRate);
  const currencySymbol = targetCurrency === "RUB" ? "₽" : targetCurrency;

  return (
    <div className="min-h-screen bg-white font-['Inter',system-ui,sans-serif] text-[#1F1F1F] overflow-hidden relative selection:bg-blue-600 selection:text-white">
      <div className="fixed top-24 right-8 z-50">
        <button
          onClick={() => setShowPopup(!showPopup)}
          className="w-11 h-11 rounded-full bg-[#00439C] hover:bg-[#003580] shadow-xl shadow-blue-900/30 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 ring-2 ring-white/20"
          data-testid="button-extension-toggle"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
          </svg>
        </button>
        <AnimatePresence>
          {showPopup && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute top-14 right-0 z-50 origin-top-right"
            >
              <ExtensionPopup
                onCurrencyChange={setTargetCurrency}
                onSourceChange={setDataSource}
                currentSource={dataSource}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <header className="h-16 bg-white flex items-center px-6 lg:px-10 justify-between sticky top-0 z-40 border-b border-gray-100">
        <div className="flex items-center gap-5">
          <svg viewBox="0 0 50 50" className="w-9 h-9 shrink-0">
            <circle cx="25" cy="25" r="22" fill="#00439C" />
            <text x="25" y="31" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" fontFamily="system-ui">P</text>
          </svg>
          <nav className="flex items-center gap-1 text-[13px] font-medium">
            <button
              onClick={() => setView("product")}
              className={`h-8 px-4 rounded-full transition-all duration-150 ${view === "product" ? "bg-[#1F1F1F] text-white font-semibold" : "text-[#636363] hover:bg-gray-100"}`}
            >
              Game Page
            </button>
            <button
              onClick={() => setView("catalog")}
              className={`h-8 px-4 rounded-full transition-all duration-150 ${view === "catalog" ? "bg-[#1F1F1F] text-white font-semibold" : "text-[#636363] hover:bg-gray-100"}`}
            >
              Store Home
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-1.5">
          <button className="w-9 h-9 rounded-full text-[#636363] hover:bg-gray-100 flex items-center justify-center transition-colors">
            <Share2 className="h-[18px] w-[18px]" />
          </button>
          <button className="w-9 h-9 rounded-full text-[#636363] hover:bg-gray-100 flex items-center justify-center transition-colors">
            <ShoppingCart className="h-[18px] w-[18px]" />
          </button>
          <div className="ml-2 h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 ring-2 ring-gray-100" />
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto min-h-[700px] bg-white">
        {view === "catalog" ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
            <PSStoreCatalog exchangeRate={exchangeRate} currencySymbol={currencySymbol} dataSource={dataSource} />
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
            <div className="relative w-full overflow-hidden bg-[#1a1a1a]">
              <div className="relative h-[520px] lg:h-[580px]">
                <img
                  src="/games/nioh3-hero.png"
                  className="absolute inset-0 w-full h-full object-cover object-center opacity-50"
                  alt="Nioh 3"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-[#1a1a1a]/30" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a] via-[#1a1a1a]/50 to-transparent" />

                <div className="absolute bottom-0 left-0 p-10 lg:p-14 max-w-2xl text-white">
                  <div className="flex items-center gap-2.5 mb-5">
                    <img src="/games/nioh3.png" className="w-12 h-12 rounded-xl ring-1 ring-white/20 shadow-xl" alt="icon" />
                    <span className="text-[10px] font-bold tracking-[0.15em] uppercase bg-white/15 backdrop-blur-sm px-2.5 py-1 rounded-md">PS5</span>
                  </div>

                  <h1 className="text-5xl lg:text-6xl font-bold tracking-tight leading-none mb-4">NIOH 3</h1>
                  <p className="text-white/60 text-[15px] leading-relaxed max-w-md mb-8">
                    Experience the brutal conclusion to the Nioh saga. Master the way of the samurai and unleash your yokai powers.
                  </p>

                  <div className="flex items-end gap-5">
                    <div className="flex flex-col gap-2">
                      <span className="text-3xl font-bold text-white tracking-tight">$69.99</span>

                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 text-white px-3 py-1.5 rounded-lg w-fit cursor-pointer transition-all duration-150 hover:scale-[1.02] active:scale-95"
                            data-testid="button-price-badge"
                          >
                            <span className="font-bold text-[13px]">
                              {rateLoading ? "..." : `≈ ${convertedPrice.toLocaleString()} ${currencySymbol}`}
                            </span>
                            <Info className="h-3.5 w-3.5 opacity-60" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[260px] p-0 bg-[#1F1F1F] border border-white/10 shadow-2xl rounded-xl overflow-hidden text-white" side="bottom" align="start">
                          <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                            <span className="font-bold text-[10px] uppercase tracking-[0.1em] text-gray-400">Conversion</span>
                            <Badge variant="secondary" className="text-[9px] bg-blue-500 text-white hover:bg-blue-600 h-[18px] border-none px-2 rounded-full font-bold">LIVE</Badge>
                          </div>
                          <div className="p-4 space-y-2.5">
                            <div className="flex justify-between items-center text-[12px]">
                              <span className="text-gray-400">Rate</span>
                              <span className="font-mono text-gray-300 tabular-nums">1 USD = {exchangeRate.toFixed(2)} {currencySymbol}</span>
                            </div>
                            <div className="flex justify-between items-center text-[12px]">
                              <span className="text-gray-400">Source</span>
                              <span className="text-gray-300">{dataSource === "CBR" ? "CBR (Bank of Russia)" : "Frankfurter (ECB)"}</span>
                            </div>
                            <div className="h-px bg-white/5 my-1" />
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-white text-[13px]">Total</span>
                              <span className="font-bold text-[18px] text-blue-400 tabular-nums">{convertedPrice.toLocaleString()} {currencySymbol}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium pt-1">
                              <TrendingDown className="h-3 w-3" />
                              Live rate from {dataSource}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <Button size="lg" className="h-12 px-8 text-base font-bold rounded-full bg-[#E35205] hover:bg-[#C24503] text-white border-none shadow-xl shadow-orange-900/30 transition-all duration-150 hover:scale-[1.02] active:scale-95">
                      Add to Cart
                    </Button>
                    <button className="h-12 w-12 rounded-full bg-white/10 hover:bg-white/15 backdrop-blur-md flex items-center justify-center text-white border border-white/10 transition-all duration-150">
                      <Heart className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-[#1a1a1a] border-t border-white/5 px-10 lg:px-14 py-4 flex items-center gap-10 text-[13px] font-medium text-white/50">
                <div className="flex items-center gap-2">
                  <Grid className="h-4 w-4 text-white/70" />
                  <span>Action / RPG</span>
                </div>
                <div className="flex items-center gap-2">
                  <Maximize2 className="h-4 w-4 text-white/70" />
                  <span>PS5 Pro Enhanced</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-white/70" />
                  <span>Online Play Optional</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
