import { useState, useRef } from 'react';
import { UploadCloud } from 'lucide-react';

const MAX_IMAGE_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB

const SUPPORTED_IMAGE_EXTS = ['jpg', 'jpeg', 'png', 'webp'];
const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const PHASE_2_VIDEO_EXTS = ['mp4', 'webm', 'mov'];
const PHASE_2_AUDIO_EXTS = ['mp3', 'wav', 'aac'];

export default function UploadZone({ onFileSelected, onError, disabled }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const validateAndProcessFile = (file) => {
    if (!file) return;

    const fileName = file.name || '';
    const fileExt = fileName.split('.').pop()?.toLowerCase();
    const mimeType = file.type?.toLowerCase();

    // Check if user dropped video or audio (Visual support with Phase 2 notification)
    if (PHASE_2_VIDEO_EXTS.includes(fileExt) || (mimeType && mimeType.startsWith('video/'))) {
      onError({
        type: 'PHASE_2_FORMAT',
        title: 'Video Analysis Coming in Phase 2',
        message: `You selected "${fileName}". Deepfake and temporal frame analysis for video files will be enabled in Phase 2. Please upload an image (JPG, PNG, WEBP) for current verification.`,
        fileName
      });
      return;
    }

    if (PHASE_2_AUDIO_EXTS.includes(fileExt) || (mimeType && mimeType.startsWith('audio/'))) {
      onError({
        type: 'PHASE_2_FORMAT',
        title: 'Audio Analysis Coming in Phase 2',
        message: `You selected "${fileName}". Synthetic voice and audio clone detection will be enabled in Phase 2. Please upload an image (JPG, PNG, WEBP) for current verification.`,
        fileName
      });
      return;
    }

    // Check if image
    const isSupportedImage = 
      SUPPORTED_IMAGE_EXTS.includes(fileExt) || 
      SUPPORTED_IMAGE_TYPES.includes(mimeType);

    if (!isSupportedImage) {
      onError({
        type: 'INVALID_TYPE',
        title: 'Unsupported File Format',
        message: `The file format "${fileExt || 'unknown'}" is not supported. TruthShield accepts JPG, PNG, and WEBP image files for forensic analysis.`,
        fileName
      });
      return;
    }

    // Validate size limit
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      onError({
        type: 'SIZE_EXCEEDED',
        title: 'File Exceeds Size Limit',
        message: `The selected image is ${sizeMB} MB, which exceeds the 20 MB limit. Please select a smaller image.`,
        fileName
      });
      return;
    }

    // Valid image file
    onFileSelected(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndProcessFile(droppedFile);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      validateAndProcessFile(selectedFile);
      // Reset input value so same file can be re-selected if removed
      e.target.value = '';
    }
  };

  return (
    <div className="w-full">
      <div
        id="dropzone-area"
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Upload media to verify. Drop an image here or press Enter or Space to browse."
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        className={`relative flex flex-col items-center justify-center p-8 sm:p-14 rounded-3xl border-2 border-dashed transition-all duration-300 cursor-pointer text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
          isDragOver
            ? 'border-emerald-400 bg-emerald-500/10 scale-[1.01] shadow-[0_0_40px_rgba(16,185,129,0.25)]'
            : 'border-slate-700/80 hover:border-slate-500 bg-slate-900/50 hover:bg-slate-900/80 shadow-xl'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          id="media-file-input"
          aria-label="Choose image file to analyze"
          accept=".jpg,.jpeg,.png,.webp,.mp4,.mp3,.wav"
          className="hidden"
          disabled={disabled}
          onChange={handleFileInputChange}
        />

        {/* Dynamic scanner laser effect when dragging over */}
        {isDragOver && (
          <div className="absolute inset-x-8 top-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent scan-line pointer-events-none" />
        )}

        {/* Upload Icon Container */}
        <div className={`relative mb-6 p-5 rounded-2xl transition-transform duration-300 ${
          isDragOver 
            ? 'scale-110 bg-emerald-500/20 text-emerald-300 border border-emerald-400/50' 
            : 'bg-slate-800/80 text-emerald-400 border border-slate-700 shadow-inner'
        }`}>
          <UploadCloud className="w-10 h-10 stroke-[1.75]" />
        </div>

        {/* Primary Prompt Text */}
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight">
          Upload media to verify
        </h3>

        <p className="text-slate-400 text-sm sm:text-base max-w-md mb-6">
          Drag and drop your file here or <span className="text-emerald-400 font-semibold underline underline-offset-4 hover:text-emerald-300">browse</span>
        </p>

        {/* Supported Format Badges */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-lg">
            <span className="text-xs font-mono text-slate-400 mr-1">Supported formats:</span>
            {['JPG', 'JPEG', 'PNG', 'WEBP'].map((fmt) => (
              <span
                key={fmt}
                className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-medium"
              >
                {fmt}
              </span>
            ))}
            {['MP4', 'MP3', 'WAV'].map((fmt) => (
              <span
                key={fmt}
                title="Phase 2 Modality"
                className="px-2 py-0.5 rounded-md bg-slate-800/60 border border-slate-700/60 text-slate-400 text-xs font-mono"
              >
                {fmt}
              </span>
            ))}
          </div>

          <p className="text-xs text-slate-400 font-mono">
            Max image file size: 20 MB • Zero retention ephemeral scanning
          </p>
        </div>

      </div>
    </div>
  );
}
