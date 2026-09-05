import { useState, useEffect } from 'react';
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

  const handleFileSelected = (file) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(objectUrl);
    setUiState('selected');
    setStateData(null);
  };

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => onNavigate('home')}
          aria-label="Back to Overview page"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to Overview</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
          <span>Gemini Vision Analysis Active</span>
        </div>
      </div>

      {/* Page Title & Context Header */}
      <div className="mb-8 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400 mb-3">
          <Shield className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Gemini Multimodal Analysis</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-2">
          Media Verification Lab
        </h1>
        {uiState !== 'result' && (
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl">
            Upload an image and receive a Gemini-powered assessment of whether it shows indicators of AI generation or manipulation.
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
          <AnalysisResult
            result={stateData}
            previewUrl={previewUrl}
            onReset={handleReset}
          />
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
  );
}
