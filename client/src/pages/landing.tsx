import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Globe, TrendingUp, Wallet, ShieldCheck, Download, Zap, Languages, Sparkles, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PSStoreMockup } from "@/components/ps-store-mockup";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white selection:bg-blue-600 selection:text-white font-sans">

      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#00439C] rounded-lg flex items-center justify-center">
              <span className="font-bold text-sm text-white">PS</span>
            </div>
            <span className="font-bold text-[15px] tracking-tight">Store Atlas</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[13px] font-medium text-white/50">
            <a href="#features" className="hover:text-white transition-colors" data-testid="link-features">Features</a>
            <a href="#demo" className="hover:text-white transition-colors" data-testid="link-demo">Demo</a>
          </div>
          <Link href="/install">
            <Button className="h-9 px-5 rounded-full bg-white text-black hover:bg-gray-200 text-[13px] font-semibold gap-2" data-testid="button-install-nav">
              <Download className="h-3.5 w-3.5" />
              Install
            </Button>
          </Link>
        </div>
      </nav>

      <section className="relative pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,67,156,0.15),transparent_60%)] pointer-events-none" />

        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-[11px] font-semibold uppercase tracking-wider mb-8" data-testid="badge-chrome-extension">
              <Sparkles className="h-3 w-3 text-blue-400" />
              Chrome Extension
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-[1.1] mb-5 tracking-tight" data-testid="text-hero-title">
              See PS Store prices in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">your currency</span>
            </h1>
            <p className="text-[16px] md:text-[17px] text-white/50 mb-8 max-w-xl mx-auto leading-relaxed" data-testid="text-hero-description">
              Automatically converts PlayStation Store prices to your local currency using live exchange rates. Works on every game page.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/install">
                <Button size="lg" className="h-12 px-7 rounded-full text-[15px] font-semibold bg-[#00439C] hover:bg-[#003580] shadow-lg shadow-blue-900/30 gap-2" data-testid="button-install-hero">
                  <Download className="h-4 w-4" />
                  Install Extension
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-12 px-7 rounded-full text-[15px] font-medium bg-white/5 border-white/10 hover:bg-white/10 text-white" asChild data-testid="button-view-demo">
                <a href="#demo" data-testid="link-view-demo">View Demo</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="demo" className="py-16 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-4 md:px-6 mb-10 text-center">
          <h2 className="text-2xl font-bold mb-2 tracking-tight" data-testid="text-demo-title">See it in action</h2>
          <p className="text-[14px] text-white/40" data-testid="text-demo-description">Interact with the mockup below. Click the extension icon to open settings.</p>
        </div>

        <div className="max-w-6xl mx-auto px-2 md:px-6">
          <div className="rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 bg-[#0a0a0f] ring-1 ring-white/5">
            <div className="h-10 bg-[#161616] border-b border-white/5 flex items-center px-4 gap-4">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                <div className="w-3 h-3 rounded-full bg-[#28C840]" />
              </div>
              <div className="flex-1 max-w-xl mx-auto bg-[#0a0a0f] h-7 rounded-md flex items-center px-3 text-[11px] text-white/30 font-mono border border-white/5">
                store.playstation.com/en-us/product/UP9000-CUSA...
              </div>
            </div>
            <div className="h-[750px] overflow-y-auto overflow-x-hidden relative" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}>
              <PSStoreMockup />
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 relative">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-2 tracking-tight" data-testid="text-features-title">Everything you need</h2>
            <p className="text-[14px] text-white/40" data-testid="text-features-description">Simple, fast, and reliable price conversion</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FeatureCard
              icon={<Wallet className="h-5 w-5 text-blue-400" />}
              title="Live Conversion"
              description="Real-time prices using Central Bank of Russia or European Central Bank rates."
            />
            <FeatureCard
              icon={<Languages className="h-5 w-5 text-emerald-400" />}
              title="Multilingual"
              description="Extension UI automatically adapts to your browser language. 9 languages supported."
            />
            <FeatureCard
              icon={<Shield className="h-5 w-5 text-purple-400" />}
              title="Privacy First"
              description="No data collection. All settings stored locally in your browser. Open source."
            />
          </div>
        </div>
      </section>

      <footer className="py-8 border-t border-white/5" data-testid="footer">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between text-[12px] text-white/30">
          <span data-testid="text-footer-brand">PS Store Atlas</span>
          <span data-testid="text-footer-disclaimer">Not affiliated with Sony Interactive Entertainment</span>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  const cardId = title.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/10 transition-colors group" data-testid={`card-feature-${cardId}`}>
      <div className="mb-4 p-2.5 bg-white/5 rounded-lg w-fit group-hover:scale-105 transition-transform duration-200">
        {icon}
      </div>
      <h3 className="text-[15px] font-semibold mb-2" data-testid={`text-feature-title-${cardId}`}>{title}</h3>
      <p className="text-[13px] text-white/40 leading-relaxed" data-testid={`text-feature-description-${cardId}`}>{description}</p>
    </div>
  );
}
