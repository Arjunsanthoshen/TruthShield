import { ShieldCheck, ArrowRight, Sparkles, CheckCircle2, Lock, Eye } from 'lucide-react';

export default function Hero({ onNavigate }) {
  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[360px] bg-gradient-to-tr from-emerald-500/10 via-cyan-500/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute -top-10 right-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Verification Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-medium mb-8 shadow-inner shadow-emerald-500/10 animate-fade-in">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Verify before you trust. Share. Or amplify.</span>
        </div>

        {/* Primary Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.12]">
          Don&apos;t just trust it.{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            Verify it.
          </span>
        </h1>

        {/* Supporting Narrative */}
        <p className="max-w-3xl mx-auto text-lg sm:text-xl text-slate-300 font-normal leading-relaxed mb-10">
          TruthShield uses Google Gemini multimodal AI to analyze images for signs of AI generation or manipulation — and explains what it found in plain language.
        </p>

        {/* Workflow steps */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-1 text-sm text-slate-400 mb-10 flex-wrap">
          {['Upload image', 'Gemini analyzes it', 'Get confidence assessment', 'Understand why'].map((step, i, arr) => (
            <span key={step} className="flex items-center gap-1 sm:gap-2">
              <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono">{step}</span>
              {i < arr.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-slate-600 hidden sm:block" />}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            id="hero-analyze-btn"
            onClick={() => onNavigate('analyze')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-base text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-[0_0_30px_-5px_rgba(16,185,129,0.5)] transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <ShieldCheck className="w-5 h-5 text-slate-950" />
            <span>Analyze an Image</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>

          <button
            id="hero-how-it-works-btn"
            onClick={() => {
              document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-medium text-base text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 transition-all duration-200"
          >
            <span>How It Works</span>
          </button>
        </div>

        {/* Trust attributes */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-800/80 text-left">
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-mono font-semibold uppercase text-slate-400">Images</span>
            </div>
            <p className="text-sm font-medium text-slate-200">Active Now</p>
            <p className="text-xs text-slate-400 mt-0.5">JPG · PNG · WEBP</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <div className="flex items-center gap-2 text-cyan-400 mb-1">
              <Lock className="w-4 h-4" />
              <span className="text-xs font-mono font-semibold uppercase text-slate-400">Security</span>
            </div>
            <p className="text-sm font-medium text-slate-200">Ephemeral Processing</p>
            <p className="text-xs text-slate-400 mt-0.5">Media analyzed in-memory</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <div className="flex items-center gap-2 text-indigo-400 mb-1">
              <Eye className="w-4 h-4" />
              <span className="text-xs font-mono font-semibold uppercase text-slate-400">Clarity</span>
            </div>
            <p className="text-sm font-medium text-slate-200">Explained Signals</p>
            <p className="text-xs text-slate-400 mt-0.5">No black-box verdicts</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <div className="flex items-center gap-2 text-teal-400 mb-1">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-mono font-semibold uppercase text-slate-400">Powered By</span>
            </div>
            <p className="text-sm font-medium text-slate-200">Google Gemini</p>
            <p className="text-xs text-slate-400 mt-0.5">Multimodal vision AI</p>
          </div>
        </div>

      </div>
    </section>
  );
}
