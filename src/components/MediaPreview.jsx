import { useState, useEffect } from 'react';
import { Trash2, ShieldCheck, FileImage, CheckCircle, RefreshCw } from 'lucide-react';

export default function MediaPreview({ file, previewUrl, onRemove, onAnalyze, isAnalyzing }) {
  const [dimensions, setDimensions] = useState(null);

  useEffect(() => {
    if (!previewUrl) return;
    let cancelled = false;
    const img = new Image();
    img.src = previewUrl;
    img.onload = () => {
      if (!cancelled) {
        setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      }
    };
    return () => {
      cancelled = true;
    };
  }, [previewUrl]);

  const formatFileSize = (bytes) => {
    if (!bytes && bytes !== 0) return '0 B';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white tracking-tight">
                Media Ready for Verification
              </h3>
              <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                Ready to Analyze
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Integrity checks passed. Ephemeral processing active.
            </p>
          </div>
        </div>

        {/* Remove Button */}
        <button
          id="remove-media-btn"
          type="button"
          onClick={onRemove}
          disabled={isAnalyzing}
          aria-label={`Remove selected file ${file.name}`}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-rose-300 hover:text-rose-200 bg-rose-950/30 hover:bg-rose-950/60 border border-rose-800/40 hover:border-rose-700/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
        >
          <Trash2 className="w-4 h-4" aria-hidden="true" />
          <span>Remove file</span>
        </button>
      </div>

      {/* Main Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-6 items-center">
        
        {/* Visual Preview Box */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <div className="relative w-full max-h-[420px] rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-950/90 shadow-2xl group flex items-center justify-center">
            <img
              src={previewUrl}
              alt={`Preview of selected file: ${file.name}`}
              className="max-h-[380px] w-auto max-w-full object-contain rounded-xl transition-transform duration-300 group-hover:scale-[1.01]"
            />
            {/* Subtle overlay watermark badge */}
            <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-slate-950/80 border border-slate-800 backdrop-blur-md text-[10px] font-mono text-slate-300 flex items-center gap-1.5">
              <FileImage className="w-3 h-3 text-emerald-400" />
              <span>Preview Mode</span>
            </div>
          </div>
        </div>

        {/* File Metadata Details */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4 bg-slate-950/50 rounded-2xl p-5 border border-slate-800/80">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-800">
              Media File Details
            </h4>

            {/* Name */}
            <div>
              <span className="text-xs text-slate-400 block mb-1">File Name</span>
              <p className="text-sm font-mono text-white font-medium break-all bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                {file.name}
              </p>
            </div>

            {/* Grid of metadata items */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">File Size</span>
                <span className="text-sm font-mono font-bold text-slate-200">
                  {formatFileSize(file.size)}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">MIME Type</span>
                <span className="text-sm font-mono font-bold text-emerald-400">
                  {file.type || 'image/jpeg'}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Resolution</span>
                <span className="text-sm font-mono font-bold text-slate-200">
                  {dimensions ? `${dimensions.width} × ${dimensions.height}` : 'Reading...'}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Inspection Status</span>
                <span className="text-sm font-mono font-bold text-teal-400 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Ready
                </span>
              </div>
            </div>
          </div>

          {/* Action Trigger Card */}
          <div className="space-y-3">
            <button
              id="analyze-media-action-btn"
              type="button"
              onClick={onAnalyze}
              disabled={isAnalyzing}
              aria-label={isAnalyzing ? 'Analyzing image with Gemini Vision...' : 'Analyze media with Gemini Vision AI'}
              className="w-full inline-flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-bold text-base text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-[0_0_30px_-5px_rgba(16,185,129,0.5)] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed transform active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin text-slate-950" />
                  <span>Preparing Verification Pipeline...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5 text-slate-950" />
                  <span>Analyze Media</span>
                </>
              )}
            </button>

            <p className="text-center text-xs text-slate-400">
              Transmits to TruthShield forensic receiver (<code className="text-slate-300 font-mono">POST /api/analyze</code>)
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
