import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from './ui';

export function Navbar() {
  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <header className="w-full border-b-[4px] border-ink bg-paper z-40 relative">
      {/* Top Edition Metadata Bar */}
      <div className="border-b border-ink bg-neutral-100 flex items-center justify-between px-4 py-1.5 overflow-hidden">
        <div className="flex gap-4 font-mono text-[10px] uppercase tracking-widest whitespace-nowrap">
          <span>Vol. I — No. 1</span>
          <span className="hidden md:inline">|</span>
          <span className="hidden md:inline">{dateStr}</span>
        </div>
        
        {/* Ticker / Breaking News */}
        <div className="flex-1 overflow-hidden ml-4 border-l border-ink pl-4 hidden sm:block">
          <div className="animate-marquee whitespace-nowrap font-mono text-[10px] uppercase tracking-widest text-news-red">
            <span className="mx-4">BREAKING: AI Match Accuracy Hits 92%</span>
            <span className="mx-4">•</span>
            <span className="mx-4">New Semantic Extraction Model Live</span>
            <span className="mx-4">•</span>
            <span className="mx-4">Process 100+ Resumes Instantly</span>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-6 md:py-8">
        <div className="flex-1 md:flex-none">
          <Link to="/" className="font-display font-black text-4xl md:text-5xl tracking-tighter hover:opacity-80 transition-opacity">
            ResumeAI.
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8 font-sans text-xs uppercase tracking-widest font-semibold">
          <Link to="/" className="hover:text-news-red transition-colors underline-offset-4 decoration-2 decoration-news-red hover:underline">Platform</Link>
          <Link to="/upload" className="hover:text-news-red transition-colors underline-offset-4 decoration-2 decoration-news-red hover:underline">Process</Link>
          <Link to="/jobs" className="hover:text-news-red transition-colors underline-offset-4 decoration-2 decoration-news-red hover:underline">Matches</Link>
        </nav>

        <div className="hidden md:block">
          <Link to="/upload">
            <Button variant="primary">Scan Resume</Button>
          </Link>
        </div>

        <button className="md:hidden flex items-center justify-center min-h-[44px] min-w-[44px] border border-ink hover:bg-ink hover:text-paper transition-colors">
          <Menu className="w-5 h-5 stroke-[1.5]" />
          <span className="sr-only">Menu</span>
        </button>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </header>
  );
}
