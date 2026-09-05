import { UploadCloud, Sparkles, FileCheck, ArrowRight } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Upload Your Image',
    icon: UploadCloud,
    desc: 'Select a JPG, PNG, or WEBP image. It is processed in-memory and never stored on disk.',
    tag: 'Zero Storage'
  },
  {
    step: '02',
    title: 'Gemini Analyzes It',
    icon: Sparkles,
    desc: 'Google Gemini examines the image for visual indicators of AI generation, synthetic artifacts, and manipulation patterns.',
    tag: 'Gemini Vision AI'
  },
  {
    step: '03',
    title: 'Get an Assessment',
    icon: FileCheck,
    desc: 'Receive a confidence-based verdict — Likely Authentic, Likely AI-Generated, Potentially Manipulated, or Inconclusive — with the specific signals observed.',
    tag: 'Explainable Results'
  }
];

export default function HowItWorks({ onNavigate }) {
  return (
    <section id="how-it-works" className="py-24 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400 mb-4">
            <span>How It Works</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Three Steps to Verify Media
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Fast, explainable, AI-powered image authenticity assessment — no account required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700/80 text-emerald-400 group-hover:border-emerald-500/50 group-hover:text-emerald-300 transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-2xl font-bold text-slate-700 group-hover:text-slate-500 transition-colors">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/60">
                  <span className="text-[11px] font-mono font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
                    {item.tag}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Disclaimer */}
        <div className="mt-10 p-4 rounded-xl bg-amber-950/20 border border-amber-500/20 text-center">
          <p className="text-xs text-amber-300/80 leading-relaxed">
            <strong className="text-amber-300">Important:</strong> AI visual assessment is not definitive proof of authenticity or manipulation.
            Results are probabilistic and may produce false positives or false negatives. Always apply independent judgment before sharing or acting on media.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-slate-900 to-cyan-950/30 border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">
              Have an image you want to verify?
            </h3>
            <p className="text-sm text-slate-400">
              Upload it now and get a Gemini-powered authenticity assessment in seconds.
            </p>
          </div>
          <button
            onClick={() => onNavigate('analyze')}
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-lg shadow-emerald-500/20"
          >
            <span>Analyze an Image</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
