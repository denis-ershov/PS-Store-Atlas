import { Button } from "@/components/ui/button";
import { Download, Chrome, Settings, Eye, Languages, ExternalLink, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function InstallPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans">
      <header className="border-b border-white/5 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00439C] flex items-center justify-center font-bold text-sm">PS</div>
            <span className="font-bold text-[15px] tracking-tight">Store Atlas</span>
          </div>
          <Link href="/" className="text-[13px] text-white/40 hover:text-white transition-colors flex items-center gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Demo
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/60 text-[11px] font-semibold uppercase tracking-wider mb-6" data-testid="status-badge">
            <Chrome className="w-3 h-3" />
            Chrome Extension
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3" data-testid="text-title">
            PS Store Atlas
          </h1>
          <p className="text-[15px] text-white/40 max-w-md mx-auto mb-8" data-testid="text-description">
            Convert PlayStation Store prices to your local currency with live exchange rates.
          </p>
          <a href="/api/extension/download" data-testid="button-download">
            <Button size="lg" className="h-12 px-7 text-[15px] font-semibold rounded-full bg-[#00439C] hover:bg-[#003580] border-none gap-2.5 shadow-lg shadow-blue-900/30">
              <Download className="w-4 h-4" />
              Download Extension
            </Button>
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-16">
          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3">
              <Eye className="w-4 h-4 text-blue-400" />
            </div>
            <h3 className="font-semibold text-[14px] mb-1.5">Live Conversion</h3>
            <p className="text-[12px] text-white/40 leading-relaxed">Converted prices appear directly on PS Store pages next to the original price.</p>
          </div>
          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-3">
              <Settings className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="font-semibold text-[14px] mb-1.5">Two Data Sources</h3>
            <p className="text-[12px] text-white/40 leading-relaxed">CBR (Central Bank of Russia) and Frankfurter (ECB) for accurate exchange rates.</p>
          </div>
          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center mb-3">
              <Languages className="w-4 h-4 text-purple-400" />
            </div>
            <h3 className="font-semibold text-[14px] mb-1.5">9 Languages</h3>
            <p className="text-[12px] text-white/40 leading-relaxed">Auto-detects your browser language. EN, RU, DE, FR, ES, PT, JA, ZH, TR.</p>
          </div>
        </div>

        <div className="max-w-lg mx-auto">
          <h2 className="text-[18px] font-bold mb-6 text-center tracking-tight">Installation</h2>
          <div className="space-y-5">
            <Step number={1} title="Download the extension">
              Click <strong>Download Extension</strong> above to get the ZIP file.
            </Step>
            <Step number={2} title="Unzip the file">
              Extract <code className="px-1.5 py-0.5 bg-white/10 rounded text-[11px]">ps-store-atlas.zip</code> to a folder.
            </Step>
            <Step number={3} title="Open Chrome Extensions">
              Navigate to <code className="px-1.5 py-0.5 bg-white/10 rounded text-[11px]">chrome://extensions</code> and enable <strong>Developer mode</strong>.
            </Step>
            <Step number={4} title="Load the extension">
              Click <strong>Load unpacked</strong> and select the extracted folder.
            </Step>
            <Step number={5} title="Visit PS Store">
              Go to{" "}
              <a href="https://store.playstation.com" target="_blank" className="text-blue-400 hover:underline underline-offset-2 inline-flex items-center gap-1">
                store.playstation.com <ExternalLink className="w-3 h-3" />
              </a>
              {" "}and converted prices will appear automatically.
            </Step>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/5 px-6 py-5 mt-12">
        <div className="max-w-3xl mx-auto flex items-center justify-between text-[11px] text-white/25">
          <span>PS Store Atlas v1.0.0</span>
          <Link href="/" className="hover:text-white/50 transition-colors">Back to Demo</Link>
        </div>
      </footer>
    </div>
  );
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4" data-testid={`step-${number}`}>
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-white/10 flex items-center justify-center font-bold text-[12px] text-white/70 mt-0.5">
        {number}
      </div>
      <div>
        <h3 className="font-semibold text-[14px] mb-0.5">{title}</h3>
        <p className="text-[12px] text-white/40 leading-relaxed">{children}</p>
      </div>
    </div>
  );
}
