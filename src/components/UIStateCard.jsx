import { useEffect, useState } from 'react';
import { AlertCircle, AlertTriangle, RefreshCw, XCircle, ShieldCheck } from 'lucide-react';

const SCAN_MESSAGES = [
  'Uploading image securely...',
  'Analyzing visual patterns...',
  'Examining image characteristics...',
  'Generating assessment...',
  'Preparing your report...',
];

function LoadingState({ onReset }) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [scanPos, setScanPos] = useState(0);

  // Rotate status messages every 2.5s
  useEffect(() => {
    const t = setInterval(() => {
      setMsgIndex((i) => (i + 1) % SCAN_MESSAGES.length);
    }, 2500);
    return () => clearInterval(t);
  }, []);

  // Animate scan line position 0→100 smoothly
  useEffect(() => {
    let raf;
    let start = null;
    const duration = 2200;
    function step(ts) {
      if (!start) start = ts;
      const elapsed = (ts - start) % duration;
      setScanPos(elapsed / duration);
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/90 border border-emerald-500/30 shadow-2xl backdrop-blur-xl mb-8 animate-fade-in relative overflow-hidden">

      {/* Animated laser scan line across the card */}
      <div
        className="absolute inset-y-0 w-px bg-gradient-to-b from-transparent via-emerald-400/70 to-transparent pointer-events-none transition-none"
        style={{ left: `${scanPos * 100}%` }}
      />

      {/* Top edge glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent pointer-events-none" />

      <div className="flex flex-col items-center justify-center text-center space-y-6">

        {/* Pulsing shield icon */}
        <div className="relative flex items-center justify-center w-20 h-20">
          <div className="absolute inset-0 rounded-full bg-emerald-500/10 border border-emerald-500/30 animate-ping" />
          <div className="absolute inset-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 animate-ping [animation-delay:0.4s]" />
          <div className="relative w-14 h-14 rounded-full bg-slate-900 border border-emerald-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <ShieldCheck className="w-7 h-7 text-emerald-400" />
          </div>
        </div>

        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-300 mb-3">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Gemini Vision Analysis Active</span>
          </div>

          <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Analyzing image...
          </h4>

          {/* Rotating status message with fixed height to avoid layout shift */}
          <div className="h-6 mt-2 flex items-center justify-center">
            <p key={msgIndex} className="text-sm text-slate-400 animate-fade-in">
              {SCAN_MESSAGES[msgIndex]}
            </p>
          </div>
        </div>

        {/* Indeterminate scanning bar */}
        <div className="w-full max-w-sm space-y-2">
          <div className="relative w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            {/* Moving shimmer */}
            <div className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-[shimmer_1.8s_ease-in-out_infinite] rounded-full" />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-slate-500">
            <span>Secure in-memory processing</span>
            <span className="text-emerald-500">Running...</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="text-xs text-slate-500 hover:text-slate-300 underline underline-offset-4 transition-colors"
        >
          Cancel
        </button>

      </div>
    </div>
  );
}

export default function UIStateCard({ state, data, onReset, onRetry }) {
  if (!state || state === 'empty') return null;

  // Invalid File State
  if (state === 'invalid_file') {
    const isPhase2 = data?.type === 'PHASE_2_FORMAT';
    return (
      <div className={`p-6 rounded-2xl border mb-8 animate-fade-in ${
        isPhase2
          ? 'bg-cyan-950/20 border-cyan-500/40 text-cyan-200'
          : 'bg-rose-950/20 border-rose-500/40 text-rose-200'
      }`}>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl ${
            isPhase2 ? 'bg-cyan-500/10 text-cyan-400' : 'bg-rose-500/10 text-rose-400'
          }`}>
            {isPhase2 ? <AlertTriangle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-white mb-1">
                {data?.title || 'Invalid File'}
              </h4>
              <button type="button" onClick={onReset} className="text-xs underline text-slate-400 hover:text-white">
                Dismiss
              </button>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              {data?.message || 'The selected file cannot be processed.'}
            </p>
            {data?.fileName && (
              <div className="text-xs font-mono bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300 inline-block mb-3">
                Target: {data.fileName}
              </div>
            )}
            <button
              type="button"
              onClick={onReset}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide ${
                isPhase2
                  ? 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40'
                  : 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40'
              } transition-colors`}
            >
              Select Supported Image
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading / Processing State
  if (state === 'loading') {
    return <LoadingState onReset={onReset} />;
  }

  // Error State
  if (state === 'error') {
    return (
      <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-500/40 text-rose-200 mb-8 animate-fade-in">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h4 className="text-base font-bold text-white mb-1">
              Verification Failed
            </h4>
            <p className="text-sm text-slate-300 mb-3 leading-relaxed">
              {data?.error || 'Unable to complete media analysis. Please ensure the backend server and GEMINI_API_KEY are configured.'}
            </p>
            {data?.upstreamBody && (
              <details className="mb-4 text-xs bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-slate-300 font-mono">
                <summary className="cursor-pointer hover:text-white font-medium text-slate-400 select-none">
                  Diagnostic Information {data?.upstreamStatus ? `(HTTP ${data.upstreamStatus})` : ''}
                </summary>
                <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-[11px] text-rose-300/90 leading-tight">
                  {typeof data.upstreamBody === 'object' ? JSON.stringify(data.upstreamBody, null, 2) : String(data.upstreamBody)}
                </pre>
              </details>
            )}
            <div className="flex flex-wrap items-center gap-3">
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-500 hover:bg-rose-400 text-white transition-colors shadow-md"
                >
                  Retry Analysis
                </button>
              )}
              <button
                type="button"
                onClick={onReset}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
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
