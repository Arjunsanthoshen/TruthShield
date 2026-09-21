import { useState, useEffect, useCallback } from 'react';
import UploadZone from '../components/UploadZone';
import MediaPreview from '../components/MediaPreview';
import AnalysisResult from '../components/AnalysisResult';
import UIStateCard from '../components/UIStateCard';
import { analyzeMedia } from '../services/api';
import { ArrowLeft, Shield, Info } from 'lucide-react';

export default function Analyze({ onNavigate }) {
  // UI states: 'empty' | 'selected' | 'invalid_file' | 'loading' | 'error' | 'result'
  const [uiState, setUiState] = useState('empty');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [stateData, setStateData] = useState(null);

  // Clean up object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelected = useCallback((file) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(objectUrl);
    setUiState('selected');
    setStateData(null);
  }, [previewUrl]);

  // Support pasting image directly from clipboard (Ctrl+V / Cmd+V)
  useEffect(() => {
    const handlePaste = (e) => {
      if (uiState === 'loading') return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            handleFileSelected(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [uiState, handleFileSelected]);

  const handleFileError = (errorObj) => {
    setUiState('invalid_file');
    setStateData(errorObj);
  };

  const handleRemoveFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setUiState('empty');
    setStateData(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setUiState('loading');
    setStateData(null);

    try {
      // Call backend API /api/analyze which communicates with Gemini
      const result = await analyzeMedia(selectedFile);
      setUiState('result');
      setStateData(result);
    } catch (err) {
      console.error('Analyze execution error:', err);
      setUiState('error');
      setStateData({
        error: err.message || 'Failed to communicate with TruthShield verification backend.',
        upstreamStatus: err.upstreamStatus,
        upstreamBody: err.upstreamBody
      });
    }
  };

  const handleReset = () => {
    handleRemoveFile();
  };

  return (
    <div className="relative min-h-screen bg-radial-vignette">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => onNavigate('home')}
            aria-label="Back to Overview page"
            className="glass-pill inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono text-slate-300 hover:text-white hover:border-slate-600 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>&larr; Overview Dossier</span>
          </button>

          <div className="glass-pill flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono text-emerald-300 border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
            <span>Gemini Vision Forensics Online</span>
          </div>
        </div>

        {/* Page Title & Context Header */}
        <div className="mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/80 border border-emerald-500/30 text-xs font-mono text-emerald-400 mb-3 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <Shield className="w-3.5 h-3.5" aria-hidden="true" />
            <span>AI Authenticity &amp; Integrity Suite</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-2">
            Media Verification Lab
          </h1>
          {uiState !== 'result' && (
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
              Upload an image to execute Google Gemini multimodal forensic inspection — detecting diffusion noise patterns, synthetic artifacts, and image compositing indicators.
            </p>
          )}
        </div>

      {/* Alert / State Feedback Card for invalid_file, loading, and error states */}
      <UIStateCard
        state={uiState}
        data={stateData}
        onReset={handleReset}
        onRetry={handleAnalyze}
      />

      {/* Main Content Area */}
      <div className="space-y-8">
        
        {/* Upload Zone (shown when empty or invalid_file) */}
        {(uiState === 'empty' || uiState === 'invalid_file') && (
          <UploadZone
            onFileSelected={handleFileSelected}
            onError={handleFileError}
            disabled={uiState === 'loading'}
          />
        )}

        {/* Media Preview (shown when file is selected and ready to analyze) */}
        {uiState === 'selected' && selectedFile && (
          <MediaPreview
            file={selectedFile}
            previewUrl={previewUrl}
            onRemove={handleRemoveFile}
            onAnalyze={handleAnalyze}
            isAnalyzing={false}
          />
        )}

        {/* Gemini Results Dashboard (shown when state is 'result') */}
        {uiState === 'result' && stateData && (
          <div role="region" aria-label="Media Analysis Results" aria-live="polite">
            <AnalysisResult
              result={stateData}
              previewUrl={previewUrl}
              onReset={handleReset}
            />
          </div>
        )}

        {/* Architecture & Privacy Pipeline Notes Box */}
        {uiState !== 'result' && (
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 text-left">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                <span className="font-semibold text-slate-200">Private & Ephemeral:</span>{' '}
                Your image is processed in-memory by TruthShield's Express backend and sent directly to Google Gemini for analysis. It is never stored on disk. Your API credentials remain strictly server-side and are never exposed to the browser.
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  </div>
  );
}
