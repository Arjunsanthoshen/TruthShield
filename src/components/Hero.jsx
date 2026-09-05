import { ShieldCheck, ArrowRight, CheckCircle2, Lock, Eye, Sparkles, Upload, ScanSearch, BarChart2, Share2 } from 'lucide-react';

const workflowSteps = [
  {
    icon: Upload,
    number: '1',
    title: 'Upload',
    desc: 'Upload a suspicious image'
  },
  {
    icon: ScanSearch,
    number: '2',
    title: 'Analyze',
    desc: 'TruthShield sends it to Gemini AI for visual analysis'
  },
  {
    icon: BarChart2,
    number: '3',
    title: 'Understand',
    desc: 'Get a confidence-based verdict with explained signals'
  },
  {
    icon: Share2,
    number: '4',
    title: 'Decide',
    desc: 'Make an informed decision before you share'
  }
];

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
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-300 font-normal leading-relaxed mb-12">
          TruthShield uses Google Gemini multimodal AI to analyze images for signs of AI generation or manipulation — and explains what it found in plain language.
        </p>

        {/* Primary CTA — large and centered */}
        <div className="flex justify-center mb-4">
          <button
            id="hero-analyze-btn"
            onClick={() => onNavigate('analyze')}
            aria-label="Analyze an Image in Media Verification Lab"
            className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-bold text-lg text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-[0_0_40px_-5px_rgba(16,185,129,0.6)] transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            <ShieldCheck className="w-6 h-6 text-slate-950" />
            <span>Analyze an Image</span>
            <ArrowRight className="w-5 h-5 text-slate-950" />
          </button>
        </div>

        <p className="text-xs text-slate-500 mb-14">JPG · PNG · WEBP · No account required</p>

        {/* ── Workflow steps directly beneath the CTA ── */}
        <div className="relative max-w-4xl mx-auto">
          {/* Connecting line on desktop */}
          <div className="absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent hidden md:block pointer-events-none" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {workflowSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="flex flex-col items-center text-center gap-3">
                  <div className="relative w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                    <Icon className="w-7 h-7 text-emerald-400" />
                    <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                      {step.number}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white mb-0.5">{step.title}</p>
                    <p className="text-xs text-slate-400 leading-snug">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trust attributes */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-16 pt-8 border-t border-slate-800/80 text-left">
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
