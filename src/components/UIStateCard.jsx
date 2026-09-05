import { AlertCircle, AlertTriangle, RefreshCw, XCircle, ShieldCheck } from 'lucide-react';

export default function UIStateCard({ state, data, onReset, onRetry }) {
  if (!state || state === 'empty') return null;

  // Invalid File State (e.g. video/audio dropped or unsupported format)
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
              <button
                type="button"
                onClick={onReset}
                className="text-xs underline text-slate-400 hover:text-white"
              >
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
            <div>
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
      </div>
    );
  }

  // Loading / Processing State (Indeterminate real scanning animation)
  if (state === 'loading') {
    return (
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/90 border border-emerald-500/30 shadow-2xl backdrop-blur-xl mb-8 animate-fade-in relative overflow-hidden">
        
        {/* Animated laser scan line */}
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent scan-line pointer-events-none" />

        <div className="flex flex-col items-center justify-center text-center space-y-5">
          
          {/* Animated radar scanning container */}
          <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30">
            <RefreshCw className="w-10 h-10 text-emerald-400 animate-spin" />
            <div className="absolute inset-0 rounded-full border-2 border-emerald-400/40 animate-ping pointer-events-none" />
          </div>

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-300 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Gemini Vision Analysis Active</span>
            </div>
            
            <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Analyzing image...
            </h4>
            
            <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
              Sending image to Gemini multimodal analysis... Checking for AI-generated patterns and manipulation indicators.
            </p>
          </div>

          {/* Indeterminate activity bar */}
          <div className="w-full max-w-sm space-y-2 pt-1 text-xs font-mono">
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 animate-pulse w-full rounded-full" />
            </div>
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span>Protocol: In-Memory Stream</span>
              <span className="text-emerald-400">Processing...</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={onReset}
              className="text-xs text-slate-400 hover:text-slate-200 underline underline-offset-4 transition-colors"
            >
              Cancel Analysis
            </button>
          </div>

        </div>
      </div>
    );
  }

  // Error State (Network, Auth, or Rate-limit failure)
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
                Reset & Try Another Image
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
