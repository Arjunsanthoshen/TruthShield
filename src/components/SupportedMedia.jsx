import { Image, Video, Music, CheckCircle2, Clock, ArrowRight } from 'lucide-react';

const mediaTypes = [
  {
    id: 'image',
    icon: Image,
    label: 'IMAGE',
    title: 'Image Verification',
    status: 'ACTIVE',
    statusColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    dotColor: 'bg-emerald-400',
    statusIcon: CheckCircle2,
    formats: 'JPG / PNG / WEBP',
    availability: 'Available now',
    availabilityColor: 'text-emerald-400',
    description: 'Upload an image and receive a Gemini-powered assessment of whether it shows indicators of AI generation or manipulation.',
    features: [
      'AI generation indicators',
      'Visual manipulation signals',
      'Explained confidence assessment',
      'Human-readable forensic summary'
    ],
    cardClass: 'border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 to-slate-900/60',
    active: true
  },
  {
    id: 'video',
    icon: Video,
    label: 'VIDEO',
    title: 'Video Forensics',
    status: 'COMING SOON',
    statusColor: 'bg-slate-700/60 text-slate-400 border-slate-700',
    dotColor: 'bg-slate-500',
    statusIcon: Clock,
    formats: 'MP4 / WEBM',
    availability: 'Deepfake and frame analysis planned',
    availabilityColor: 'text-slate-500',
    description: 'Frame-by-frame deepfake detection, lip-sync analysis, and temporal consistency evaluation. Not yet implemented.',
    features: [
      'Deepfake face-swap detection',
      'Temporal frame consistency',
      'Lip-sync verification'
    ],
    cardClass: 'border-slate-800 bg-slate-900/40 opacity-70',
    active: false
  },
  {
    id: 'audio',
    icon: Music,
    label: 'AUDIO',
    title: 'Audio Authenticity',
    status: 'COMING SOON',
    statusColor: 'bg-slate-700/60 text-slate-400 border-slate-700',
    dotColor: 'bg-slate-500',
    statusIcon: Clock,
    formats: 'MP3 / WAV',
    availability: 'Synthetic voice analysis planned',
    availabilityColor: 'text-slate-500',
    description: 'Voice cloning detection and spectrogram analysis for synthetic speech identification. Not yet implemented.',
    features: [
      'Voice cloning signature detection',
      'Spectrogram frequency analysis',
      'Acoustic pattern evaluation'
    ],
    cardClass: 'border-slate-800 bg-slate-900/40 opacity-70',
    active: false
  }
];

export default function SupportedMedia({ onSelectMediaType }) {
  return (
    <section className="py-20 border-t border-slate-800/80 bg-slate-950/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Supported Media
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Image analysis is active now. Video and audio analysis are planned for future phases.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {mediaTypes.map((card) => {
            const Icon = card.icon;
            const StatusIcon = card.statusIcon;

            return (
              <div
                key={card.id}
                className={`relative flex flex-col justify-between p-6 rounded-2xl border backdrop-blur-sm transition-all duration-300 ${card.cardClass} ${card.active ? 'hover:shadow-[0_8px_30px_rgba(16,185,129,0.12)]' : ''}`}
              >
                <div>
                  {/* Header */}
                  <div className="flex items-start justify-between mb-5">
                    <div className={`p-3 rounded-xl border ${card.active ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-800 border-slate-700'}`}>
                      <Icon className={`w-6 h-6 ${card.active ? 'text-emerald-400' : 'text-slate-500'}`} />
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold border ${card.statusColor}`}>
                      <StatusIcon className="w-3 h-3" />
                      {card.status}
                    </span>
                  </div>

                  <p className="text-xs font-mono font-semibold uppercase tracking-widest text-slate-500 mb-1">{card.label}</p>
                  <h3 className={`text-xl font-bold mb-1 ${card.active ? 'text-white' : 'text-slate-400'}`}>{card.title}</h3>

                  {/* Formats + availability */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-mono text-slate-500">{card.formats}</span>
                    <span className="text-slate-700">·</span>
                    <span className={`text-xs font-mono font-medium ${card.availabilityColor}`}>{card.availability}</span>
                  </div>

                  <p className={`text-sm leading-relaxed mb-5 ${card.active ? 'text-slate-300' : 'text-slate-500'}`}>
                    {card.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {card.features.map((feat, i) => (
                      <li key={i} className={`flex items-center gap-2 text-xs ${card.active ? 'text-slate-300' : 'text-slate-600'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${card.dotColor}`} />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                {card.active ? (
                  <button
                    onClick={() => onSelectMediaType('image')}
                    aria-label="Analyze an Image in Media Verification Lab"
                    className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                  >
                    <span>Analyze an Image</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="w-full py-3 px-4 rounded-xl text-sm font-medium text-slate-600 bg-slate-800/50 border border-slate-800 text-center flex items-center justify-center gap-2 cursor-not-allowed select-none">
                    <Clock className="w-4 h-4" />
                    <span>Not yet available</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
