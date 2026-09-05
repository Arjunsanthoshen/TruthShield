import { UploadCloud, Binary, BrainCircuit, FileCheck, ArrowRight } from 'lucide-react';

export default function HowItWorks({ onNavigate }) {
  const steps = [
    {
      step: '01',
      title: 'Upload & Secure Ingestion',
      icon: UploadCloud,
      desc: 'Files are validated in-memory, checked for EXIF metadata markers, and assigned a cryptographic SHA-256 fingerprint.',
      tag: 'Zero Storage Retention'
    },
    {
      step: '02',
      title: 'Neural Forensic Detection',
      icon: Binary,
      desc: 'Media passes through deep learning forensic classifiers trained on diffusion models (Midjourney, DALL-E, Flux) and GAN artifacts.',
      tag: 'Hive AI Integration'
    },
    {
      step: '03',
      title: 'Contextual Source Tracing',
      icon: BrainCircuit,
      desc: 'Multimodal Gemini reasoning evaluates source context, historical circulation, reverse search provenance, and common disinformation narratives.',
      tag: 'Gemini Multimodal'
    },
    {
      step: '04',
      title: 'Explainable TruthScore',
      icon: FileCheck,
      desc: 'Receive a transparent verdict breaking down exact regions of manipulation, confidence metrics, and clear guidance before you share.',
      tag: 'Actionable Transparency'
    }
  ];

  return (
    <section id="how-it-works" className="py-24 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400 mb-4">
            <span>Verification Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            How TruthShield Verifies Media
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            A multi-stage defense against disinformation, deepfakes, and synthetic media engineered for journalists, researchers, and discerning users.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
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

        {/* Bottom Call to Action banner */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-slate-900 to-cyan-950/30 border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">
              Have an image you want to inspect right now?
            </h3>
            <p className="text-sm text-slate-400">
              Start with our Phase 1 image upload and validation testbed.
            </p>
          </div>
          <button
            onClick={() => onNavigate('analyze')}
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-lg shadow-emerald-500/20"
          >
            <span>Launch Analyze Page</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
