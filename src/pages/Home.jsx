import Hero from '../components/Hero';
import SupportedMedia from '../components/SupportedMedia';
import HowItWorks from '../components/HowItWorks';
import { Shield } from 'lucide-react';

export default function Home({ onNavigate }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <Hero onNavigate={onNavigate} />

      {/* Supported Media Modalities Section */}
      <SupportedMedia 
        onSelectMediaType={() => {
          onNavigate('analyze');
        }} 
      />

      {/* How It Works Forensic Section */}
      <HowItWorks onNavigate={onNavigate} />

      {/* TruthShield Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white tracking-tight">TruthShield</span>
              <p className="text-xs text-slate-400">
                Verify before you trust. Share. Or amplify.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <span>Phase 1 Foundation</span>
            <span>•</span>
            <span>Journalistic & Research Integrity</span>
            <span>•</span>
            <button 
              onClick={() => onNavigate('analyze')}
              className="text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Analyze Media
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
