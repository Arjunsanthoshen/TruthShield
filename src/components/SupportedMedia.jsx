import { Image, Video, Music, Check, Clock, Layers } from 'lucide-react';

export default function SupportedMedia({ onSelectMediaType }) {
  const mediaTypes = [
    {
      id: 'image',
      title: 'Image Verification',
      category: 'Visual Forensics',
      icon: Image,
      status: 'Active in Phase 1',
      statusType: 'active',
      formats: ['JPG', 'JPEG', 'PNG', 'WEBP'],
      maxSize: '25 MB',
      description: 'Scans for GAN artifacts, diffusion model signatures, spliced boundaries, and EXIF timestamp anomalies.',
      features: [
        'AI Generation Probability',
        'Synthetic Texture Artifacts',
        'Compression & Metadata Audit',
        'Direct Preview & Analysis'
      ],
      accentColor: 'from-emerald-500/20 to-teal-500/5',
      borderColor: 'border-emerald-500/30',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      ctaText: 'Verify Image Now'
    },
    {
      id: 'video',
      title: 'Video Forensics',
      category: 'Temporal Deepfakes',
      icon: Video,
      status: 'Planned for Phase 2',
      statusType: 'upcoming',
      formats: ['MP4', 'WEBM', 'MOV'],
      maxSize: '100 MB',
      description: 'Evaluates face-swap temporal consistency, lip-sync alignment, blink rate anomalies, and frame-by-frame generative blending.',
      features: [
        'Deepfake Face-Swap Detection',
        'Frame-to-Frame Temporal Jitter',
        'Facial Landmark Consistency',
        'Audio-Visual Lip Synchronization'
      ],
      accentColor: 'from-cyan-500/20 to-blue-500/5',
      borderColor: 'border-slate-800 hover:border-cyan-500/30',
      badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      ctaText: 'Coming in Phase 2'
    },
    {
      id: 'audio',
      title: 'Audio Authenticity',
      category: 'Voice Cloning',
      icon: Music,
      status: 'Planned for Phase 2',
      statusType: 'upcoming',
      formats: ['MP3', 'WAV', 'AAC'],
      maxSize: '50 MB',
      description: 'Identifies synthetic speech clones, neural vocoder spectrogram signatures, and unnatural acoustic frequency gaps.',
      features: [
        'Voice Cloning Signature Match',
        'Spectrogram Frequency Gaps',
        'Acoustic Breath Pattern Analysis',
        'Robotic Vocoder Artifacts'
      ],
      accentColor: 'from-indigo-500/20 to-purple-500/5',
      borderColor: 'border-slate-800 hover:border-indigo-500/30',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
      ctaText: 'Coming in Phase 2'
    }
  ];

  return (
    <section className="py-20 border-t border-slate-800/80 bg-slate-950/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400 mb-4">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Multi-Modal Coverage</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Supported Media Modalities
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            TruthShield provides forensic inspection across multiple formats. Phase 1 activates our core image ingestion and inspection engine.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {mediaTypes.map((card) => {
            const Icon = card.icon;
            const isActive = card.statusType === 'active';

            return (
              <div
                key={card.id}
                className={`relative flex flex-col justify-between p-7 rounded-2xl bg-slate-900/60 border ${card.borderColor} backdrop-blur-sm transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)]`}
              >
                {/* Accent Top Gradient Glow */}
                <div className={`absolute inset-x-0 top-0 h-32 rounded-t-2xl bg-gradient-to-b ${card.accentColor} pointer-events-none`} />

                <div className="relative">
                  {/* Top Bar with Icon and Status Badge */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700/60 shadow-inner">
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-medium border ${card.badgeColor}`}>
                      {card.status}
                    </span>
                  </div>

                  <p className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    {card.category}
                  </p>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {card.title}
                  </h3>
                  <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                    {card.description}
                  </p>

                  {/* Formats Pills */}
                  <div className="mb-6">
                    <p className="text-xs font-medium text-slate-400 mb-2">Supported Formats:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {card.formats.map((fmt) => (
                        <span
                          key={fmt}
                          className="px-2.5 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/80 text-xs font-mono font-medium text-slate-300"
                        >
                          {fmt}
                        </span>
                      ))}
                      <span className="px-2 py-0.5 rounded-md text-xs font-mono text-slate-400">
                        Max {card.maxSize}
                      </span>
                    </div>
                  </div>

                  {/* Capabilities List */}
                  <div className="space-y-2.5 pt-4 border-t border-slate-800/80 mb-8">
                    {card.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action */}
                <div className="relative pt-2">
                  {isActive ? (
                    <button
                      onClick={() => onSelectMediaType('image')}
                      className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2"
                    >
                      <span>Upload & Verify Image</span>
                    </button>
                  ) : (
                    <div className="w-full py-3 px-4 rounded-xl text-sm font-medium text-slate-400 bg-slate-800/50 border border-slate-800 text-center flex items-center justify-center gap-2 cursor-not-allowed">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>{card.ctaText}</span>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
