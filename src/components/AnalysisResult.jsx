import { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  HelpCircle,
  Eye,
  AlertOctagon,
  Info,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  FileCode,
  Sparkles,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

/**
 * Map a Gemini verdict string to theme tokens.
 */
function getTheme(verdict) {
  switch (verdict) {
    case 'Likely Authentic':
      return {
        icon: ShieldCheck,
        iconColor: 'text-emerald-400',
        iconBg: 'bg-emerald-500/15 border-emerald-500/40',
        bannerBg: 'from-emerald-950/50 via-slate-900 to-slate-900',
        border: 'border-emerald-500/40',
        glow: 'shadow-[0_0_40px_-8px_rgba(16,185,129,0.25)]',
        badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        bar: 'from-emerald-500 to-teal-400',
        accent: 'text-emerald-400',
        tagline: 'No significant AI indicators detected'
      };
    case 'Potentially Manipulated':
      return {
        icon: AlertTriangle,
        iconColor: 'text-amber-400',
        iconBg: 'bg-amber-500/15 border-amber-500/40',
        bannerBg: 'from-amber-950/50 via-slate-900 to-slate-900',
        border: 'border-amber-500/40',
        glow: 'shadow-[0_0_40px_-8px_rgba(245,158,11,0.20)]',
        badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        bar: 'from-amber-500 to-yellow-400',
        accent: 'text-amber-400',
        tagline: 'Signs of possible editing or compositing'
      };
    case 'Likely AI-Generated':
      return {
        icon: ShieldAlert,
        iconColor: 'text-rose-400',
        iconBg: 'bg-rose-500/15 border-rose-500/40',
        bannerBg: 'from-rose-950/50 via-slate-900 to-slate-900',
        border: 'border-rose-500/40',
        glow: 'shadow-[0_0_40px_-8px_rgba(244,63,94,0.20)]',
        badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
        bar: 'from-rose-500 to-pink-400',
        accent: 'text-rose-400',
        tagline: 'Visual indicators suggest synthetic origin'
      };
    default: // Inconclusive
      return {
        icon: HelpCircle,
        iconColor: 'text-cyan-400',
        iconBg: 'bg-cyan-500/15 border-cyan-500/40',
        bannerBg: 'from-slate-900 via-slate-900 to-cyan-950/20',
        border: 'border-slate-700',
        glow: 'shadow-[0_0_30px_rgba(14,165,233,0.10)]',
        badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
        bar: 'from-cyan-500 to-sky-400',
        accent: 'text-cyan-400',
        tagline: 'Insufficient evidence for a clear verdict'
      };
  }
}

/** Confidence bar with gradient fill */
function ConfidenceBar({ confidence, bar }) {
  const pct = Math.round((confidence || 0) * 100);
  return (
    <div>
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Assessment Confidence</span>
        <span className="text-3xl font-extrabold font-mono text-white">{pct}%</span>
      </div>
      <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${bar} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-[11px] font-mono text-slate-500 mt-1.5">
        Reflects Gemini&apos;s confidence in the observable evidence — not objective truth
      </p>
    </div>
  );
}

/** Impact pill for a signal */
function ImpactPill({ impact }) {
  if (impact === 'supports_ai') {
    return <span className="shrink-0 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30">AI Indicator</span>;
  }
  if (impact === 'supports_authentic') {
    return <span className="shrink-0 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Authentic Signal</span>;
  }
  return <span className="shrink-0 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-700 text-slate-400 border border-slate-600">Neutral</span>;
}

/** Short guidance based on verdict */
function getGuidance(verdict) {
  switch (verdict) {
    case 'Likely Authentic':
      return {
        icon: CheckCircle2,
        color: 'text-emerald-400',
        bg: 'bg-emerald-950/30 border-emerald-500/20',
        text: 'No strong AI indicators were found. Still, consider verifying the original source, publication context, and whether the content matches other known reporting before sharing.'
      };
    case 'Likely AI-Generated':
      return {
        icon: ShieldAlert,
        color: 'text-rose-400',
        bg: 'bg-rose-950/30 border-rose-500/20',
        text: 'Visual signals suggest this image may be AI-generated. Treat it with caution. Investigate the source and context independently before sharing or acting on it.'
      };
    case 'Potentially Manipulated':
      return {
        icon: AlertTriangle,
        color: 'text-amber-400',
        bg: 'bg-amber-950/30 border-amber-500/20',
        text: 'Indicators of possible editing were detected. Consider verifying the original image from a trustworthy source and cross-referencing publication context before sharing.'
      };
    default:
      return {
        icon: HelpCircle,
        color: 'text-cyan-400',
        bg: 'bg-cyan-950/20 border-cyan-500/20',
        text: 'The assessment was inconclusive. Apply independent judgment, verify the source, and cross-reference with other information before sharing.'
      };
  }
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
  const theme = getTheme(verdict);
  const VerdictIcon = theme.icon;
  const guidance = getGuidance(verdict);
  const GuidanceIcon = guidance.icon;

  return (
    <div className="space-y-5 animate-fade-in">

      {/* ── VERDICT BANNER ── */}
      <div className={`rounded-3xl bg-gradient-to-br ${theme.bannerBg} border ${theme.border} ${theme.glow} overflow-hidden relative`}>

        {/* Top edge shimmer line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent pointer-events-none" />

        <div className="p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">

            {/* Icon + verdict text */}
            <div className="flex items-start gap-4 sm:gap-5 flex-1">
              <div className={`p-4 rounded-2xl ${theme.iconBg} border shrink-0`}>
                <VerdictIcon className={`w-9 h-9 sm:w-11 sm:h-11 ${theme.iconColor}`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`text-[11px] font-mono font-semibold uppercase tracking-wider px-3 py-1 rounded-full border ${theme.badge}`}>
                    Gemini Multimodal Analysis
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-mono text-slate-500">
                    <Sparkles className="w-3 h-3" /> Google Gemini Vision
                  </span>
                </div>

                {/* Section label */}
                <p className="text-[11px] font-mono uppercase tracking-widest text-slate-500 mb-1">Verdict</p>

                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-1">
                  {verdict}
                </h2>
                <p className={`text-sm font-mono ${theme.accent} mb-4`}>{theme.tagline}</p>

                {/* Confidence bar */}
                <ConfidenceBar confidence={confidence} bar={theme.bar} />
              </div>
            </div>

            {/* Reset button */}
            <div className="shrink-0">
              <button
                id="analyze-another-btn"
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Analyze Another</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── WHY? (Gemini summary) ── */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
        <p className="text-[11px] font-mono uppercase tracking-widest text-slate-500 mb-2">Why?</p>
        <p className="text-base text-slate-200 leading-relaxed">{summary}</p>
      </div>

      {/* ── VISUAL SIGNALS + FILE INFO row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* File thumbnail + meta */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col gap-4">
          {previewUrl && (
            <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center max-h-52">
              <img
                src={previewUrl}
                alt={file.name || 'Analyzed image'}
                className="max-h-52 w-auto max-w-full object-contain"
              />
            </div>
          )}
          <div>
            <p className="text-[11px] font-mono uppercase tracking-widest text-slate-500 mb-2">File</p>
            <p className="text-sm font-mono text-white break-all mb-3">{file.name || 'image'}</p>
            <div className="space-y-1 text-xs font-mono text-slate-500">
              <div className="flex justify-between"><span>Type</span><span className="text-slate-300">{file.type}</span></div>
              <div className="flex justify-between"><span>Size</span><span className="text-slate-300">{file.size ? `${(file.size / 1024).toFixed(1)} KB` : '—'}</span></div>
              {analyzedAt && <div className="flex justify-between"><span>Analyzed</span><span className="text-slate-300">{new Date(analyzedAt).toLocaleTimeString()}</span></div>}
              <div className="flex justify-between"><span>Engine</span><span className="text-cyan-400">Gemini Vision</span></div>
            </div>
          </div>
        </div>

        {/* Forensic signals */}
        <div className="lg:col-span-8 p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <p className="text-[11px] font-mono uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-2">
            <Eye className="w-3.5 h-3.5 text-cyan-400" /> Visual Signals
          </p>
          <p className="text-xs text-slate-500 mb-4">Observable characteristics reported by Gemini</p>

          {signals.length > 0 ? (
            <div className="space-y-3">
              {signals.map((signal, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <span className="text-sm font-semibold text-white">{signal.name}</span>
                    <ImpactPill impact={signal.impact} />
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{signal.observation}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic">No specific forensic signals returned.</p>
          )}
        </div>
      </div>

      {/* ── VISUAL OBSERVATIONS + MANIPULATION INDICATORS ── */}
      {(visualObservations.length > 0 || manipulationIndicators.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {visualObservations.length > 0 && (
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <p className="text-[11px] font-mono uppercase tracking-widest text-slate-500 mb-3">Visual Observations</p>
              <ul className="space-y-2">
                {visualObservations.map((obs, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                    {obs}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {manipulationIndicators.length > 0 && (
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <p className="text-[11px] font-mono uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
                <AlertOctagon className="w-3.5 h-3.5 text-rose-400" /> Possible Manipulation Indicators
              </p>
              <ul className="space-y-2">
                {manipulationIndicators.map((ind, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                    {ind}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* ── WHAT SHOULD YOU DO? ── */}
      <div className={`p-5 rounded-2xl border ${guidance.bg}`}>
        <p className="text-[11px] font-mono uppercase tracking-widest text-slate-500 mb-2">What should you do?</p>
        <div className="flex items-start gap-3">
          <GuidanceIcon className={`w-5 h-5 ${guidance.color} shrink-0 mt-0.5`} />
          <p className="text-sm text-slate-300 leading-relaxed">{guidance.text}</p>
        </div>
      </div>

      {/* ── DISCLAIMER ── */}
      <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20 flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-200/80 leading-relaxed">
          <strong className="text-amber-300">AI-assisted assessment — not definitive proof.</strong>{' '}
          Visual AI detection is probabilistic and can produce false positives and false negatives.
          This report is based solely on observable visual characteristics and should not be treated as conclusive evidence of authenticity or manipulation.
          {limitations.length > 0 && (
            <ul className="mt-2 space-y-1">
              {limitations.slice(0, 2).map((lim, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="mt-1 w-1 h-1 rounded-full bg-amber-400 shrink-0" />{lim}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ── SOURCE VERIFICATION PLACEHOLDER ── */}
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-dashed border-slate-700/60">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 shrink-0">
            <ExternalLink className="w-4 h-4 text-slate-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-300 mb-1">Source Verification — Coming Soon</p>
            <p className="text-xs text-slate-500 leading-relaxed">
              TruthShield will help you trace the origin, publication history, and spread of suspicious media — cross-referencing news archives and known databases of viral AI imagery.
            </p>
          </div>
        </div>
      </div>

      {/* ── RAW GEMINI JSON (collapsible) ── */}
      <div className="rounded-2xl bg-slate-900/30 border border-slate-800 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowRaw(!showRaw)}
          className="w-full p-4 flex items-center justify-between text-left text-xs font-mono text-slate-500 hover:text-white hover:bg-slate-900/50 transition-colors"
        >
          <span className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-emerald-400" />
            Raw Gemini Response
          </span>
          <span className="flex items-center gap-1">
            {showRaw ? 'Hide' : 'Inspect'}
            {showRaw ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </span>
        </button>

        {showRaw && (
          <div className="p-4 border-t border-slate-800 bg-slate-950 overflow-x-auto">
            <pre className="text-emerald-400 text-xs max-h-72 overflow-y-auto leading-relaxed">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>

    </div>
  );
}
