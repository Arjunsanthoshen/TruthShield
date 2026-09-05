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

      {/* Persistent Navigation */}
      <Navbar currentView={currentView} onNavigate={handleNavigate} />

      {/* Main View Router */}
      <main className="flex-1">
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
