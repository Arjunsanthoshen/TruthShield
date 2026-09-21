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
  CheckCircle2,
  Copy,
  Check,
  Download,
  Crosshair,
  Layers
} from 'lucide-react';

/**
 * Map a Gemini verdict string to visual theme tokens.
 */
function getTheme(verdict) {
  switch (verdict) {
    case 'Likely Authentic':
      return {
        icon: ShieldCheck,
        iconColor: 'text-emerald-400',
        iconBg: 'bg-emerald-500/15 border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.3)]',
        bannerBg: 'from-emerald-950/60 via-slate-900/80 to-slate-950/90',
        border: 'border-emerald-500/40',
        glow: 'shadow-[0_0_50px_-10px_rgba(16,185,129,0.3)]',
        badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
        bar: 'from-emerald-500 via-teal-400 to-cyan-400',
        accent: 'text-emerald-400',
        strokeColor: '#34d399',
        tagline: 'No significant AI generation indicators detected',
        confidenceTier: 'HIGH FIDELITY AUTHENTIC'
      };
    case 'Potentially Manipulated':
      return {
        icon: AlertTriangle,
        iconColor: 'text-amber-400',
        iconBg: 'bg-amber-500/15 border-amber-500/40 shadow-[0_0_25px_rgba(245,158,11,0.25)]',
        bannerBg: 'from-amber-950/60 via-slate-900/80 to-slate-950/90',
        border: 'border-amber-500/40',
        glow: 'shadow-[0_0_50px_-10px_rgba(245,158,11,0.25)]',
        badge: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
        bar: 'from-amber-500 via-yellow-400 to-orange-400',
        accent: 'text-amber-400',
        strokeColor: '#fbbf24',
        tagline: 'Indicators of digital compositing or post-processing detected',
        confidenceTier: 'POTENTIAL MANIPULATION DETECTED'
      };
    case 'Likely AI-Generated':
      return {
        icon: ShieldAlert,
        iconColor: 'text-rose-400',
        iconBg: 'bg-rose-500/15 border-rose-500/40 shadow-[0_0_25px_rgba(244,63,94,0.3)]',
        bannerBg: 'from-rose-950/60 via-slate-900/80 to-slate-950/90',
        border: 'border-rose-500/40',
        glow: 'shadow-[0_0_50px_-10px_rgba(244,63,94,0.3)]',
        badge: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
        bar: 'from-rose-500 via-pink-500 to-red-400',
        accent: 'text-rose-400',
        strokeColor: '#fb7185',
        tagline: 'Strong structural & diffusion artifacts consistent with generative AI',
        confidenceTier: 'SYNTHETIC ORIGIN LIKELY'
      };
    default: // Inconclusive
      return {
        icon: HelpCircle,
        iconColor: 'text-cyan-400',
        iconBg: 'bg-cyan-500/15 border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.2)]',
        bannerBg: 'from-slate-900/90 via-slate-900/80 to-cyan-950/40',
        border: 'border-cyan-500/30',
        glow: 'shadow-[0_0_40px_-10px_rgba(6,182,212,0.2)]',
        badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40',
        bar: 'from-cyan-500 via-sky-400 to-blue-400',
        accent: 'text-cyan-400',
        strokeColor: '#38bdf8',
        tagline: 'Insufficient visual indicators to confirm or deny synthetic origin',
        confidenceTier: 'EVALUATION INCONCLUSIVE'
      };
  }
}

/**
 * Circular HUD Confidence Gauge Meter
 */
function CircularGaugeMeter({ confidence, strokeColor }) {
  const pct = Math.round((confidence || 0) * 100);
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg className="w-32 h-32 -rotate-90 transform" viewBox="0 0 110 110">
        {/* Track background */}
        <circle
          cx="55"
          cy="55"
          r={radius}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="8"
          fill="transparent"
        />
        {/* Progress Arc */}
        <circle
          cx="55"
          cy="55"
          r={radius}
          stroke={strokeColor}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-1000 ease-out"
          style={{ filter: `drop-shadow(0 0 6px ${strokeColor})` }}
        />
      </svg>
      {/* Centered Value */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tighter">
          {pct}%
        </span>
        <span className="text-[9px] font-mono uppercase text-slate-400 tracking-wider">
          CONFIDENCE
        </span>
      </div>
    </div>
  );
}

/** Impact pill for an individual forensic signal */
function ImpactPill({ impact }) {
  if (impact === 'supports_ai') {
    return (
      <span className="shrink-0 text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/35 shadow-[0_0_10px_rgba(244,63,94,0.15)] flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
        AI Indicator
      </span>
    );
  }
  if (impact === 'supports_authentic') {
    return (
      <span className="shrink-0 text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/35 shadow-[0_0_10px_rgba(16,185,129,0.15)] flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        Authentic Signal
      </span>
    );
  }
  return (
    <span className="shrink-0 text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
      Neutral Observation
    </span>
  );
}

export default function AnalysisResult({ result, previewUrl, onReset }) {
  const [showRaw, setShowRaw] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [showForensicGrid, setShowForensicGrid] = useState(false);
  const [signalFilter, setSignalFilter] = useState('all'); // 'all' | 'ai' | 'authentic'

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

  const handleCopySummary = () => {
    const textToCopy = `[TruthShield Forensic Report]\nVerdict: ${verdict} (${Math.round((confidence || 0) * 100)}% Confidence)\nFile: ${file.name || 'image'}\nAssessment: ${summary}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleDownloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `truthshield-analysis-${file.name || 'image'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Filter signals according to user tab selection
  const filteredSignals = signals.filter((s) => {
    if (signalFilter === 'ai') return s.impact === 'supports_ai';
    if (signalFilter === 'authentic') return s.impact === 'supports_authentic';
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── 1. EXECUTIVE VERDICT HERO CARD ── */}
      <div className={`glass-card hud-corner-tl hud-corner-br rounded-3xl bg-gradient-to-br ${theme.bannerBg} border ${theme.border} ${theme.glow} overflow-hidden relative`}>
        
        {/* Shimmer top glow line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent pointer-events-none" />

        <div className="p-6 sm:p-10 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">

            {/* Left: Icon, Badge, Verdict Title */}
            <div className="flex items-start sm:items-center gap-5 sm:gap-6 flex-1 min-w-0">
              <div className={`p-4 sm:p-5 rounded-2xl ${theme.iconBg} border shrink-0 backdrop-blur-md`}>
                <VerdictIcon className={`w-10 h-10 sm:w-12 sm:h-12 ${theme.iconColor}`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${theme.badge}`}>
                    {theme.confidenceTier}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-mono text-slate-400 bg-slate-950/60 px-2.5 py-0.5 rounded-full border border-slate-800">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>Gemini Vision Forensics</span>
                  </span>
                </div>

                <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-2">
                  {verdict}
                </h2>
                <p className={`text-sm sm:text-base font-medium ${theme.accent} leading-snug`}>
                  {theme.tagline}
                </p>
              </div>
            </div>

            {/* Center / Right: Circular Gauge & Actions */}
            <div className="flex flex-col sm:flex-row lg:flex-row items-center gap-6 shrink-0 border-t lg:border-t-0 pt-6 lg:pt-0 border-slate-800/80">
              {/* Radial Gauge */}
              <CircularGaugeMeter
                confidence={confidence}
                strokeColor={theme.strokeColor}
              />

              {/* Action Buttons Column */}
              <div className="flex flex-col gap-2.5 w-full sm:w-auto">
                <button
                  id="analyze-another-btn"
                  type="button"
                  onClick={onReset}
                  aria-label="Analyze another image"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.35)] transition-all active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  <span>Analyze Another</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopySummary}
                    aria-label="Copy summary to clipboard"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-medium text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 transition-colors"
                  >
                    {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSummary ? 'Copied!' : 'Copy Summary'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadJson}
                    aria-label="Download JSON report"
                    className="inline-flex items-center justify-center p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 transition-colors"
                    title="Export JSON Report"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ── 2. EXECUTIVE REASONING SUMMARY ── */}
      <div className="glass-card rounded-2xl p-6 sm:p-7 border border-slate-800/90 shadow-lg">
        <div className="flex items-center justify-between gap-4 mb-3 pb-2 border-b border-slate-800/80">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Executive Forensic Assessment
          </span>
          <span className="text-[11px] font-mono text-slate-500">
            ENGINE_INFERENCE_SYNTHESIS
          </span>
        </div>
        <p className="text-base sm:text-lg text-slate-100 leading-relaxed font-normal">
          &ldquo;{summary}&rdquo;
        </p>
      </div>

      {/* ── 3. VISUAL INSPECTION HUD & FORENSIC SIGNALS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Col: Interactive Image Preview HUD */}
        <div className="lg:col-span-5 glass-card rounded-2xl p-5 border border-slate-800/90 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
                Target Specimen
              </span>

              {/* Forensic Grid Toggle */}
              <button
                type="button"
                onClick={() => setShowForensicGrid(!showForensicGrid)}
                className={`text-[10px] font-mono px-2 py-0.5 rounded-md border transition-all ${
                  showForensicGrid
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {showForensicGrid ? 'Forensic Grid: ON' : 'Forensic Grid: OFF'}
              </button>
            </div>

            {/* Specimen Frame */}
            {previewUrl && (
              <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center max-h-72 shadow-inner group">
                <img
                  src={previewUrl}
                  alt={file.name ? `Analyzed preview: ${file.name}` : 'Analyzed specimen preview'}
                  className="max-h-72 w-auto max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                />

                {/* Optional Forensic HUD Grid Overlay */}
                {showForensicGrid && (
                  <div className="absolute inset-0 bg-cyber-grid bg-[size:16px_16px] pointer-events-none opacity-60 border border-cyan-500/40">
                    <div className="absolute inset-x-0 top-1/2 h-px bg-cyan-400/40" />
                    <div className="absolute inset-y-0 left-1/2 w-px bg-cyan-400/40" />
                    <span className="absolute top-2 left-2 text-[9px] font-mono text-cyan-400 bg-slate-950/80 px-1.5 py-0.5 rounded">
                      SPECTRAL_MAP_ACTIVE
                    </span>
                  </div>
                )}

                {/* Corner reticles */}
                <div className="absolute top-2 right-2 p-1 rounded bg-slate-950/80 text-[10px] font-mono text-slate-400 border border-slate-800">
                  SPEC_01
                </div>
              </div>
            )}
          </div>

          {/* Specimen File Metadata */}
          <div className="pt-4 mt-4 border-t border-slate-800/80 space-y-2 text-xs font-mono text-slate-400">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">File Identifier:</span>
              <span className="text-white font-medium truncate max-w-[180px]">{file.name || 'image'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">MIME Payload:</span>
              <span className="text-slate-300">{file.type}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Memory Footprint:</span>
              <span className="text-slate-300">{file.size ? `${(file.size / 1024).toFixed(1)} KB` : '—'}</span>
            </div>
            {analyzedAt && (
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Verified Timestamp:</span>
                <span className="text-cyan-400">{new Date(analyzedAt).toLocaleTimeString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Forensic Signal Breakdown */}
        <div className="lg:col-span-7 glass-card rounded-2xl p-5 sm:p-6 border border-slate-800/90 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                  Forensic Signals ({signals.length})
                </h3>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setSignalFilter('all')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    signalFilter === 'all' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setSignalFilter('ai')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    signalFilter === 'ai' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  AI
                </button>
                <button
                  type="button"
                  onClick={() => setSignalFilter('authentic')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    signalFilter === 'authentic' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Authentic
                </button>
              </div>
            </div>

            {/* Signals Stream */}
            {filteredSignals.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {filteredSignals.map((signal, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700/90 transition-all hover:bg-slate-900/50"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <span className="text-sm font-semibold text-white tracking-tight">
                        {signal.name}
                      </span>
                      <ImpactPill impact={signal.impact} />
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {signal.observation}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-500 font-mono text-xs">
                No signals match the current filter selection.
              </div>
            )}
          </div>

          <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>MULTIMODAL_INSPECTION_MATRIX</span>
            <span>STATUS: COMPLETE</span>
          </div>
        </div>
      </div>

      {/* ── 4. OBSERVATIONS & MANIPULATION INDICATORS ── */}
      {(visualObservations.length > 0 || manipulationIndicators.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Observable Characteristics */}
          {visualObservations.length > 0 && (
            <div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-800/90">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2 mb-4">
                <Layers className="w-4 h-4" />
                Observable Visual Characteristics
              </span>
              <ul className="space-y-2.5">
                {visualObservations.map((obs, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-200">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 shadow-[0_0_6px_#22d3ee]" />
                    <span className="leading-relaxed font-sans">{obs}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Manipulation Indicators */}
          {manipulationIndicators.length > 0 && (
            <div className="glass-card rounded-2xl p-5 sm:p-6 border border-rose-500/30 shadow-[0_0_30px_rgba(244,63,94,0.1)]">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2 mb-4">
                <AlertOctagon className="w-4 h-4" />
                Detected Manipulation Indicators
              </span>
              <ul className="space-y-2.5">
                {manipulationIndicators.map((ind, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-200">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 shadow-[0_0_6px_#fb7185]" />
                    <span className="leading-relaxed font-sans">{ind}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      )}

      {/* ── 5. PROTOCOL & VERIFICATION NEXT STEPS ── */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800/90">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2 mb-3">
          <CheckCircle2 className="w-4 h-4" />
          Verification Protocol &amp; Recommended Next Steps
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <p className="text-xs font-bold text-white mb-1.5">1. Trace Provenance</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Verify where the image originated. Cross-reference the primary photographer, news agency, or publication date before broadcasting.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <p className="text-xs font-bold text-white mb-1.5">2. Reverse Image Search</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Inspect older versions across search indexers (Google Images, TinEye) to see if older, unedited variants of the same composition exist.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <p className="text-xs font-bold text-white mb-1.5">3. Multi-Signal Corroboration</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Never rely on a single forensic tool. Corroborate metadata, situational reporting, and independent eyewitness documentation.
            </p>
          </div>

        </div>
      </div>

      {/* ── 6. FORENSIC DISCLAIMER ── */}
      <div className="glass-card p-4 rounded-2xl border border-amber-500/25 bg-amber-950/20 flex items-start gap-3.5">
        <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-200/90 leading-relaxed">
          <strong className="text-amber-300 font-semibold">Probabilistic Forensics Advisory:</strong>{' '}
          Computer vision assessment identifies visual and statistical artifacts, but cannot guarantee 100% ground-truth provenance.
          {limitations.length > 0 && (
            <ul className="mt-2 space-y-1">
              {limitations.slice(0, 2).map((lim, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-amber-400 shrink-0" />
                  <span>{lim}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ── 7. COLLAPSIBLE RAW JSON INSPECTOR ── */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowRaw(!showRaw)}
          aria-expanded={showRaw}
          aria-controls="raw-gemini-json-panel"
          className="w-full p-4 flex items-center justify-between text-left text-xs font-mono text-slate-400 hover:text-white hover:bg-slate-900/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        >
          <span className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-cyan-400" aria-hidden="true" />
            <span>Structured Verification Telemetry &amp; Raw JSON</span>
          </span>
          <span className="flex items-center gap-1.5 text-[11px] bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
            {showRaw ? 'Collapse Terminal' : 'Inspect Raw JSON'}
            {showRaw ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </span>
        </button>

        {showRaw && (
          <div id="raw-gemini-json-panel" className="p-4 border-t border-slate-800 bg-slate-950/90 overflow-x-auto">
            <pre className="text-cyan-300 text-xs font-mono max-h-80 overflow-y-auto leading-relaxed p-2">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>

    </div>
  );
}

