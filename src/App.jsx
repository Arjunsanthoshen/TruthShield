import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Analyze from './pages/Analyze';

export default function App() {
  const [currentView, setCurrentView] = useState('home');

  const handleNavigate = (view) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500/20 selection:text-emerald-400">
      {/* Background Cyber Grid & Vignette */}
      <div className="fixed inset-0 bg-cyber-grid pointer-events-none opacity-40 -z-20" />
      <div className="fixed inset-0 bg-radial-vignette pointer-events-none -z-10" />

      {/* Accessible skip link for keyboard & screen reader navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-emerald-400 focus:text-slate-950 focus:font-bold focus:rounded-xl focus:shadow-xl focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Persistent Navigation */}
      <Navbar currentView={currentView} onNavigate={handleNavigate} />

      {/* Main View Router */}
      <main id="main-content" className="flex-1">
        {currentView === 'home' && (
          <Home onNavigate={handleNavigate} />
        )}

        {currentView === 'analyze' && (
          <Analyze onNavigate={handleNavigate} />
        )}
      </main>
    </div>
  );
}
