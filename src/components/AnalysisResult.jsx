import { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  Eye,
  AlertOctagon,
  Info,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  FileCode,
  FileCheck,
  Clock
} from 'lucide-react';

/**
 * Derive verdict theme/styling based on Gemini verdict string.
 */
function getVerdictTheme(verdict) {
  switch (verdict) {
    case 'Likely Authentic':
      return {
        badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        bannerBg: 'from-emerald-950/40 via-slate-900 to-slate-900',
        borderColor: 'border-emerald-500/40',
        glow: 'shadow-[0_0_30px_rgba(16,185,129,0.15)]',
        icon: ShieldCheck,
        iconColor: 'text-emerald-400',
        iconBg: 'bg-emerald-500/20 border-emerald-500/40',
        barColor: 'bg-emerald-400',
        label: 'Likely Authentic'
      };
    case 'Potentially Manipulated':
      return {
        badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        bannerBg: 'from-amber-950/40 via-slate-900 to-slate-900',
        borderColor: 'border-amber-500/40',
        glow: 'shadow-[0_0_30px_rgba(245,158,11,0.15)]',
        icon: AlertTriangle,
        iconColor: 'text-amber-400',
        iconBg: 'bg-amber-500/20 border-amber-500/40',
        barColor: 'bg-amber-400',
        label: 'Potentially Manipulated'
      };
    case 'Likely AI-Generated':
      return {
        badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
        bannerBg: 'from-rose-950/40 via-slate-900 to-slate-900',
        borderColor: 'border-rose-500/40',
        glow: 'shadow-[0_0_30px_rgba(244,63,94,0.15)]',
        icon: ShieldAlert,
        iconColor: 'text-rose-400',
        iconBg: 'bg-rose-500/20 border-rose-500/40',
        barColor: 'bg-rose-500',
        label: 'Likely AI-Generated'
      };
    default: // Inconclusive
      return {
        badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
        bannerBg: 'from-slate-900 via-slate-900 to-cyan-950/30',
        borderColor: 'border-slate-700',
        glow: 'shadow-[0_0_30px_rgba(14,165,233,0.1)]',
        icon: HelpCircle,
        iconColor: 'text-cyan-400',
        iconBg: 'bg-cyan-500/20 border-cyan-500/40',
        barColor: 'bg-cyan-400',
        label: 'Inconclusive'
      };
  }
}

/**
 * Impact badge for a forensic signal.
 */
function ImpactBadge({ impact }) {
  if (impact === 'supports_ai') {
    return (
      <span className="shrink-0 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30">
        AI Indicator
      </span>
    );
  }
  if (impact === 'supports_authentic') {
    return (
      <span className="shrink-0 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
        Authentic Signal
      </span>
    );
  }
  return (
    <span className="shrink-0 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 border border-slate-600">
      Neutral
    </span>
  );
}

export default function AnalysisResult({ result, previewUrl, onReset }) {
  const [showRaw, setShowRaw] = useState(false);

  if (!result || !result.analysis) return null;

  const {
    verdict,
    confidence,
    summary,
    signals = [],
    visualObservations = [],
    manipulationIndicators = [],
    limitations = [],
    analyzedAt
  } = result.analysis;

  const file = result.file || {};
  const theme = getVerdictTheme(verdict);
  const VerdictIcon = theme.icon;
  const confidencePct = Math.round((confidence || 0) * 100);

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── 1. Verdict Banner ── */}
      <div className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-br ${theme.bannerBg} border ${theme.borderColor} ${theme.glow} backdrop-blur-xl relative overflow-hidden`}>
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-40 pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-5">
            <div className={`p-4 rounded-2xl ${theme.iconBg} border shrink-0`}>
              <VerdictIcon className={`w-8 h-8 sm:w-10 sm:h-10 ${theme.iconColor}`} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                <span className={`text-xs font-mono font-semibold uppercase tracking-wider px-3 py-1 rounded-full border ${theme.badge}`}>
                  Gemini Multimodal Analysis
                </span>
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Google Gemini Vision
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {verdict}
              </h2>

              <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl leading-relaxed">
                {summary}
              </p>

              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                {/* Confidence bar */}
                <div className="flex-1 max-w-xs">
                  <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1.5">
                    <span>Assessment Confidence</span>
                    <span className="text-white font-bold">{confidencePct}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${theme.barColor}`}
                      style={{ width: `${confidencePct}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
                <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                AI visual assessment only — not definitive proof of authenticity or manipulation
              </div>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-3 pt-1 lg:pt-0">
            <button
              id="analyze-another-btn"
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Analyze Another Image</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. File Info + Signals Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Thumbnail + File Meta */}
        <div className="lg:col-span-4 rounded-2xl bg-slate-900/60 border border-slate-800 p-5 flex flex-col justify-between">
          <div>
            <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center max-h-56 mb-4">
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt={file.name || 'Analyzed Image'}
                  className="max-h-56 w-auto max-w-full object-contain rounded-lg"
                />
              )}
            </div>

            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Analyzed Media
            </h4>
            <p className="text-sm font-mono text-white font-medium break-all mb-3">
              {file.name || 'Image'}
            </p>
          </div>

          <div className="space-y-1.5 text-xs font-mono text-slate-400 pt-3 border-t border-slate-800">
            <div className="flex justify-between">
              <span>MIME Type:</span>
              <span className="text-slate-200">{file.type || 'image/jpeg'}</span>
            </div>
            <div className="flex justify-between">
              <span>File Size:</span>
              <span className="text-slate-200">
                {file.size ? `${(file.size / 1024).toFixed(1)} KB` : 'Unknown'}
              </span>
            </div>
            {analyzedAt && (
              <div className="flex justify-between">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Analyzed:</span>
                <span className="text-slate-200">{new Date(analyzedAt).toLocaleTimeString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Engine:</span>
              <span className="text-cyan-300">Gemini Vision</span>
            </div>
          </div>
        </div>

        {/* Forensic Signals */}
        <div className="lg:col-span-8 rounded-2xl bg-slate-900/60 border border-slate-800 p-5">
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-4">
            <Eye className="w-4 h-4 text-cyan-400" /> Forensic Signals Detected
          </h3>

          {signals.length > 0 ? (
            <div className="space-y-3">
              {signals.map((signal, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <span className="text-sm font-semibold text-white leading-tight">{signal.name}</span>
                    <ImpactBadge impact={signal.impact} />
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{signal.observation}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 italic">No specific forensic signals identified.</p>
          )}
        </div>
      </div>

      {/* ── 3. Visual Observations + Manipulation Indicators ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Visual Observations */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-4">
            <FileCheck className="w-4 h-4 text-emerald-400" /> Visual Observations
          </h3>
          {visualObservations.length > 0 ? (
            <ul className="space-y-2">
              {visualObservations.map((obs, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                  {obs}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-400 italic">No notable visual observations.</p>
          )}
        </div>

        {/* Manipulation Indicators */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-4">
            <AlertOctagon className="w-4 h-4 text-rose-400" /> Possible Manipulation Indicators
          </h3>
          {manipulationIndicators.length > 0 ? (
            <ul className="space-y-2">
              {manipulationIndicators.map((ind, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                  {ind}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-emerald-400/80 text-sm italic">No specific manipulation indicators observed.</p>
          )}
        </div>
      </div>

      {/* ── 4. Limitations & Caveats ── */}
      <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/20">
        <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-2 mb-3">
          <Info className="w-4 h-4" /> Important Limitations
        </h3>
        <ul className="space-y-2">
          {limitations.map((lim, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-amber-200/80 leading-relaxed">
              <span className="mt-1.5 w-1 h-1 rounded-full bg-amber-400 shrink-0" />
              {lim}
            </li>
          ))}
        </ul>
      </div>

      {/* ── 5. Source Verification Placeholder ── */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/40 border border-slate-700/60 border-dashed">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 shrink-0">
            <Sparkles className="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-1">
              Source Verification — Coming Next
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Trace the origin, publication history, and supporting context of this media. Cross-reference with known databases of viral AI imagery and news archives.
            </p>
          </div>
        </div>
      </div>

      {/* ── 6. Raw JSON Accordion ── */}
      <div className="rounded-2xl bg-slate-900/30 border border-slate-800 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowRaw(!showRaw)}
          className="w-full p-4 flex items-center justify-between text-left text-xs font-mono text-slate-400 hover:text-white hover:bg-slate-900/50 transition-colors"
        >
          <span className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-emerald-400" />
            <span>Raw Gemini Response</span>
          </span>
          <span className="flex items-center gap-1">
            <span>{showRaw ? 'Hide' : 'Inspect'}</span>
            {showRaw ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </span>
        </button>

        {showRaw && (
          <div className="p-4 border-t border-slate-800 bg-slate-950 font-mono text-xs overflow-x-auto">
            <pre className="text-emerald-400 max-h-80 overflow-y-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>

    </div>
  );
}
