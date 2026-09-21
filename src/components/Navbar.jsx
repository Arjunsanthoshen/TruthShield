import { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import { checkHealth } from '../services/api';

export default function Navbar({ currentView, onNavigate }) {
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    let isMounted = true;
    async function verifyBackend() {
      try {
        const res = await checkHealth();
        if (isMounted) {
          setApiStatus(res && res.status === 'ok' ? 'online' : 'offline');
        }
      } catch {
        if (isMounted) setApiStatus('offline');
      }
    }

    verifyBackend();

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        verifyBackend();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        verifyBackend();
      }
    }, 60000);

    return () => {
      isMounted = false;
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-slate-950/75 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

        {/* Logo & Brand Identity */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl p-1"
          aria-label="TruthShield Home"
        >
          <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-cyan-500/20 to-indigo-500/20 border border-emerald-500/40 group-hover:border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.25)] transition-all duration-300">
            <ShieldCheck className="w-6 h-6 text-emerald-400 group-hover:scale-105 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 ring-2 ring-slate-950 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                TruthShield
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hidden sm:inline">
                v3.0
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block font-mono">
              AI Authenticity &amp; Verification Lab
            </p>
          </div>
        </button>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md" aria-label="Main Navigation">
          <button
            onClick={() => onNavigate('analyze')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              currentView === 'analyze'
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Analyze Lab
          </button>

          <button
            onClick={() => {
              if (currentView !== 'home') {
                onNavigate('home');
                setTimeout(() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              } else {
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
              currentView === 'home'
                ? 'text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            How It Works
          </button>
        </nav>

        {/* Backend Status Indicator */}
        <div
          role="status"
          aria-label={`API backend status: ${apiStatus}`}
          title={`Backend Status: ${apiStatus}`}
          className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-mono shadow-sm"
        >
          <span className={`w-2 h-2 rounded-full ${
            apiStatus === 'online'
              ? 'bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.9)]'
              : apiStatus === 'checking'
              ? 'bg-amber-400 animate-pulse'
              : 'bg-red-400'
          }`} aria-hidden="true" />
          <span className="text-slate-300 text-[11px] font-semibold">
            {apiStatus === 'online' ? 'Gemini Active' : apiStatus === 'checking' ? 'Connecting...' : 'API Offline'}
          </span>
        </div>

      </div>
    </header>
  );
}
