import { useState, useEffect } from "react";
import { RefreshCw, Eye, TrendingUp } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CurrencyService, DataSource } from "@/lib/currency-service";

const CURRENCIES = [
  { code: "RUB", symbol: "₽" },
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "TRY", symbol: "₺" },
  { code: "INR", symbol: "₹" },
  { code: "JPY", symbol: "¥" },
  { code: "CNY", symbol: "¥" },
  { code: "BRL", symbol: "R$" },
];

interface PopupProps {
  onCurrencyChange: (currency: string) => void;
  onSourceChange: (source: DataSource) => void;
  currentSource: DataSource;
}

export function ExtensionPopup({ onCurrencyChange, onSourceChange, currentSource }: PopupProps) {
  const [isEnabled, setIsEnabled] = useState(true);
  const [liveRates, setLiveRates] = useState<Array<{ code: string; rate: number; name: string }>>([]);
  const [ratesLoading, setRatesLoading] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("RUB");

  useEffect(() => {
    const fetchRates = async () => {
      setRatesLoading(true);
      const rates = await CurrencyService.getPopularRates(currentSource, selectedCurrency);
      setLiveRates(rates);
      setRatesLoading(false);
    };
    fetchRates();
  }, [currentSource, selectedCurrency]);

  const sym = CURRENCIES.find((c) => c.code === selectedCurrency)?.symbol || selectedCurrency;

  return (
    <div className="w-[340px] bg-[#0C0C12] border border-white/[0.06] rounded-xl flex flex-col overflow-hidden shadow-2xl shadow-black/60 font-sans text-left text-[#F3F4F6]">
      <div className="h-[52px] border-b border-white/[0.06] flex items-center justify-between px-3.5 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-[30px] h-[30px] rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-600/30">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[13px] leading-tight tracking-tight">PS Store Atlas</span>
            <span className="text-[10px] text-[#6B7280] font-medium">PlayStation Store</span>
          </div>
        </div>
        <span className="text-[10px] text-[#6B7280] bg-white/[0.03] border border-white/[0.06] rounded px-1.5 py-0.5 font-semibold" data-testid="text-language">EN</span>
      </div>

      <div className="flex-1 p-3.5 flex flex-col gap-3">
        <div className="flex items-center justify-between p-3 bg-white/[0.03] border border-white/[0.06] rounded-[10px] hover:border-white/[0.12] transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/[0.12] flex items-center justify-center">
              <Eye className="h-4 w-4 text-blue-400" />
            </div>
            <div className="flex flex-col gap-px">
              <span className="text-[13px] font-semibold">Enable Extension</span>
              <span className="text-[10px] text-[#6B7280]">Show converted prices</span>
            </div>
          </div>
          <Switch checked={isEnabled} onCheckedChange={setIsEnabled} data-testid="switch-enable-extension" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-[0.08em]">Data Source</label>
          <Select value={currentSource} onValueChange={(v) => onSourceChange(v as DataSource)}>
            <SelectTrigger className="w-full bg-[#0C0C12] border-white/[0.06] text-[12px] h-9 hover:border-white/[0.12] transition-colors" data-testid="select-data-source">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#0C0C12] border-white/[0.06]">
              <SelectItem value="CBR" className="text-[12px]">CBR (Central Bank of Russia)</SelectItem>
              <SelectItem value="FRANKFURTER" className="text-[12px]">Frankfurter (ECB)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-[0.08em]">Target Currency</label>
          <Select defaultValue="RUB" onValueChange={(v) => { setSelectedCurrency(v); onCurrencyChange(v); }}>
            <SelectTrigger className="w-full bg-[#0C0C12] border-white/[0.06] text-[12px] h-9 hover:border-white/[0.12] transition-colors" data-testid="select-target-currency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#0C0C12] border-white/[0.06]">
              {CURRENCIES.map((c) => (
                <SelectItem key={c.code} value={c.code} className="text-[12px]">
                  {c.code} — {c.symbol}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="h-px bg-white/[0.06] my-0.5" />

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-[0.08em]">Live Rates</label>
            <span className="inline-flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold bg-emerald-500/[0.12] px-2 py-0.5 rounded-full">
              <span className="w-[5px] h-[5px] rounded-full bg-emerald-400 animate-pulse" />
              {currentSource}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1">
            {ratesLoading ? (
              <div className="col-span-2 py-4 text-center text-[11px] text-[#6B7280]">Loading rates...</div>
            ) : liveRates.length > 0 ? (
              liveRates.slice(0, 6).map((r) => (
                <div key={r.code} className="flex justify-between items-center p-2 bg-white/[0.03] border border-white/[0.06] rounded-lg hover:border-white/[0.12] hover:bg-white/[0.06] transition-all" data-testid={`rate-${r.code}`}>
                  <span className="text-[11px] text-[#6B7280] font-semibold">{r.code}</span>
                  <span className="text-[12px] font-mono font-semibold tabular-nums">{r.rate.toLocaleString()} {sym}</span>
                </div>
              ))
            ) : (
              <div className="col-span-2 py-4 text-center text-[11px] text-[#6B7280]">No rates available</div>
            )}
          </div>
          {!ratesLoading && liveRates.length > 0 && (
            <p className="text-[9px] text-[#6B7280] text-right">Updated just now</p>
          )}
        </div>
      </div>

      <div className="h-9 border-t border-white/[0.06] flex items-center justify-between px-3.5 shrink-0 text-[10px] text-[#6B7280]">
        <span className="font-medium" data-testid="text-version">v1.0.0</span>
        <span className="font-medium hover:text-blue-400 cursor-pointer transition-colors" data-testid="link-open-ps-store">Open PS Store</span>
      </div>
    </div>
  );
}
