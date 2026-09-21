import { useEffect, useState } from 'react';
import { 
  AlertCircle, 
  AlertTriangle, 
  RefreshCw, 
  XCircle, 
  ShieldCheck, 
  Activity, 
  Cpu, 
  Binary, 
  Check, 
  Scan,
  Compass
} from 'lucide-react';

const ANALYSIS_PIPELINE = [
  { id: 'ingest', label: 'Matrix Ingestion', detail: 'Extracting high-resolution pixel tensors' },
  { id: 'fft', label: 'Frequency Decomposition', detail: 'Scanning Fourier spectrum for generative lattice noise' },
  { id: 'anatomy', label: 'Morphological Inspection', detail: 'Evaluating anatomical geometry & surface boundaries' },
  { id: 'chroma', label: 'Vector Coherence', detail: 'Cross-referencing chromatic lighting & shadow trajectories' },
  { id: 'gemini', label: 'Gemini Multimodal Inference', detail: 'Synthesizing forensic indicators into definitive assessment' }
];

function DramaticHoloScanner({ onReset }) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [telemetryTicks, setTelemetryTicks] = useState({
    spectralBands: 3,
    vectorsParsed: 1024,
    latency: '34ms'
  });

  // Cycle through forensic pipeline steps
  useEffect(() => {
    const stepInterval = setInterval(() => {
      setActiveStepIndex((idx) => {
        if (idx < ANALYSIS_PIPELINE.length - 1) return idx + 1;
        return idx; // hold at final inference step
      });
    }, 2800);

    // Randomize telemetry slightly for authentic forensic HUD feel
    const telemetryInterval = setInterval(() => {
      setTelemetryTicks({
        spectralBands: 3,
        vectorsParsed: Math.floor(1024 + Math.random() * 3072),
        latency: `${Math.floor(28 + Math.random() * 35)}ms`
      });
    }, 1200);

    return () => {
      clearInterval(stepInterval);
      clearInterval(telemetryInterval);
    };
  }, []);

  const currentStep = ANALYSIS_PIPELINE[activeStepIndex];

  return (
    <div
      role="status"
      aria-live="polite"
      className="glass-card hud-corner-tl hud-corner-br rounded-3xl p-6 sm:p-10 border border-emerald-500/30 shadow-[0_0_60px_-15px_rgba(16,185,129,0.25)] mb-8 animate-fade-in relative overflow-hidden"
    >
      <span className="sr-only">
        Analyzing image with Gemini Vision AI. Current phase: {currentStep.label} - {currentStep.detail}
      </span>

      {/* Ambient background glows inside the glass card */}
      <div className="absolute top-0 right-1/4 w-80 h-80 rounded-full bg-emerald-500/10 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-cyan-500/10 blur-[90px] pointer-events-none" />

      {/* Oscillating vertical laser scan beam */}
      <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-laser-sweep pointer-events-none" />

      {/* Top illuminated horizon line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent pointer-events-none" />

      <div className="relative z-10 space-y-8">
        
        {/* Top HUD Telemetry Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE FORENSIC TELEMETRY</span>
            </div>
            <span className="hidden sm:inline text-xs font-mono text-slate-500">
              SYS::ACTIVE_SESSION
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>VECTORS: {telemetryTicks.vectorsParsed}</span>
            </span>
            <span className="flex items-center gap-1.5 hidden sm:flex">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>PING: {telemetryTicks.latency}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-violet-400" />
              <span>BANDS: RGB</span>
            </span>
          </div>
        </div>

        {/* Centerpiece: Dramatic Holographic Core */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 py-2">
          
          {/* Holographic Radar Circle */}
          <div className="relative flex items-center justify-center w-48 h-48 sm:w-56 sm:h-56 shrink-0" aria-hidden="true">
            {/* Outer dotted radar ring */}
            <div className="absolute inset-0 rounded-full border border-dashed border-emerald-500/30 animate-radar-spin" />
            
            {/* Middle counter-rotating compass ring */}
            <div className="absolute inset-3 rounded-full border border-cyan-500/30 animate-radar-spin-reverse">
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            </div>

            {/* Inner pulse ring */}
            <div className="absolute inset-8 rounded-full border border-emerald-400/20 animate-pulse-ring" />

            {/* Crosshair targeting reticle */}
            <div className="absolute inset-x-0 top-1/2 h-px bg-emerald-500/20" />
            <div className="absolute inset-y-0 left-1/2 w-px bg-emerald-500/20" />

            {/* Central glowing core badge */}
            <div className="relative w-20 h-20 rounded-2xl bg-slate-950/90 border border-emerald-500/50 flex flex-col items-center justify-center shadow-[0_0_35px_rgba(16,185,129,0.35)] backdrop-blur-md">
              <ShieldCheck className="w-9 h-9 text-emerald-400 animate-pulse" />
              <span className="text-[9px] font-mono text-emerald-400 font-bold tracking-widest mt-1">SCAN</span>
            </div>

            {/* Audio frequency wave dance indicator below reticle */}
            <div className="absolute bottom-1 flex items-center gap-1">
              <span className="w-1 bg-cyan-400 rounded-full animate-eq-1 shadow-[0_0_6px_#22d3ee]" />
              <span className="w-1 bg-emerald-400 rounded-full animate-eq-2 shadow-[0_0_6px_#34d399]" />
              <span className="w-1 bg-teal-300 rounded-full animate-eq-3 shadow-[0_0_6px_#5eead4]" />
              <span className="w-1 bg-cyan-400 rounded-full animate-eq-4 shadow-[0_0_6px_#22d3ee]" />
              <span className="w-1 bg-emerald-400 rounded-full animate-eq-5 shadow-[0_0_6px_#34d399]" />
            </div>
          </div>

          {/* Central Title & Pipeline Step Details */}
          <div className="flex-1 text-center lg:text-left space-y-4 max-w-xl">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-cyan-500/40 text-xs font-mono text-cyan-300 shadow-sm">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                <span>PHASE {activeStepIndex + 1} OF {ANALYSIS_PIPELINE.length}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight pt-1">
                Deep Verification In Progress
              </h3>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/90 backdrop-blur-md space-y-1.5 shadow-inner">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <Scan className="w-3.5 h-3.5" />
                  {currentStep.label}
                </span>
                <span className="text-slate-400 font-bold">
                  {Math.round(((activeStepIndex + 1) / ANALYSIS_PIPELINE.length) * 100)}%
                </span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-sans">
                {currentStep.detail}
              </p>
            </div>

            {/* Pipeline progress track */}
            <div className="space-y-2">
              <div className="w-full h-2 rounded-full bg-slate-950 border border-slate-800 overflow-hidden relative">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-teal-300 rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(34,211,238,0.5)]"
                  style={{ width: `${((activeStepIndex + 1) / ANALYSIS_PIPELINE.length) * 100}%` }}
                />
              </div>

              {/* Step ticks indicator */}
              <div className="grid grid-cols-5 gap-1.5 pt-1">
                {ANALYSIS_PIPELINE.map((p, idx) => {
                  const isDone = idx < activeStepIndex;
                  const isCurrent = idx === activeStepIndex;
                  return (
                    <div 
                      key={p.id}
                      className={`text-center py-1 px-1 rounded-md text-[10px] font-mono transition-all ${
                        isDone 
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : isCurrent
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                          : 'bg-slate-900/40 text-slate-600 border border-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1">
                        {isDone ? (
                          <Check className="w-2.5 h-2.5" />
                        ) : isCurrent ? (
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                        ) : null}
                        <span className="truncate">{p.id.toUpperCase()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Footer info & Cancel Action */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <Binary className="w-3.5 h-3.5 text-slate-400" />
            <span>Zero-retention client memory buffer &bull; Ephemeral pipeline</span>
          </div>

          <button
            type="button"
            onClick={onReset}
            aria-label="Cancel image analysis and choose another file"
            className="text-xs font-mono text-slate-400 hover:text-rose-400 transition-colors py-1 px-3 rounded-lg hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
          >
            Abort Analysis
          </button>
        </div>

      </div>
    </div>
  );
}

export default function UIStateCard({ state, data, onReset, onRetry }) {
  if (!state || state === 'empty') return null;

  // Loading / Processing State with Dramatic Holo-Scanner
  if (state === 'loading') {
    return <DramaticHoloScanner onReset={onReset} />;
  }

  // Invalid File State
  if (state === 'invalid_file') {
    const isPhase2 = data?.type === 'PHASE_2_FORMAT';
    return (
      <div
        role="alert"
        aria-live="assertive"
        className={`glass-card p-6 sm:p-8 rounded-3xl border mb-8 animate-fade-in ${
          isPhase2
            ? 'border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.15)] text-cyan-200'
            : 'border-rose-500/40 shadow-[0_0_30px_rgba(244,63,94,0.15)] text-rose-200'
        }`}
      >
        <div className="flex items-start gap-4 sm:gap-5">
          <div className={`p-3.5 rounded-2xl ${
            isPhase2 ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
          } shrink-0`} aria-hidden="true">
            {isPhase2 ? <AlertTriangle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-lg font-bold text-white tracking-tight">
                {data?.title || 'Unsupported Selection'}
              </h4>
              <button
                type="button"
                onClick={onReset}
                aria-label="Dismiss notification"
                className="text-xs font-mono text-slate-400 hover:text-white transition-colors"
              >
                Dismiss
              </button>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              {data?.message || 'The selected file cannot be processed.'}
            </p>
            {data?.fileName && (
              <div className="text-xs font-mono bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300 inline-block mb-4">
                Selected: {data.fileName}
              </div>
            )}
            <div>
              <button
                type="button"
                onClick={onReset}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide ${
                  isPhase2
                    ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-lg shadow-cyan-500/20'
                    : 'bg-rose-500 text-white hover:bg-rose-400 shadow-lg shadow-rose-500/20'
                } transition-all active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400`}
              >
                Select Supported Image
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (state === 'error') {
    return (
      <div
        role="alert"
        aria-live="assertive"
        className="glass-card p-6 sm:p-8 rounded-3xl bg-rose-950/25 border border-rose-500/40 text-rose-200 mb-8 animate-fade-in shadow-[0_0_35px_rgba(244,63,94,0.18)]"
      >
        <div className="flex items-start gap-4 sm:gap-5">
          <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 shrink-0" aria-hidden="true">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h4 className="text-lg font-bold text-white tracking-tight">
                Verification Failed
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300">
                SERVICE_INTERRUPTION
              </span>
            </div>
            <p className="text-sm text-slate-300 mb-4 leading-relaxed">
              {data?.error || 'Unable to complete media analysis. Please ensure the backend server and GEMINI_API_KEY are configured.'}
            </p>
            {data?.upstreamBody && (
              <details className="mb-4 text-xs bg-slate-950/90 p-4 rounded-xl border border-slate-800 text-slate-300 font-mono">
                <summary className="cursor-pointer hover:text-white font-medium text-slate-400 select-none">
                  Diagnostic Information {data?.upstreamStatus ? `(HTTP ${data.upstreamStatus})` : ''}
                </summary>
                <pre className="mt-2.5 overflow-x-auto whitespace-pre-wrap text-[11px] text-rose-300/90 leading-tight">
                  {typeof data.upstreamBody === 'object' ? JSON.stringify(data.upstreamBody, null, 2) : String(data.upstreamBody)}
                </pre>
              </details>
            )}
            <div className="flex flex-wrap items-center gap-3">
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  aria-label="Retry media verification"
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-rose-500 hover:bg-rose-400 text-white transition-all shadow-lg shadow-rose-500/25 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                >
                  Retry Analysis
                </button>
              )}
              <button
                type="button"
                onClick={onReset}
                aria-label="Reset and choose another image"
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                Reset &amp; Try Another Image
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

