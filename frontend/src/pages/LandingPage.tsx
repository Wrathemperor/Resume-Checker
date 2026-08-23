import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Target, Zap } from 'lucide-react';
import { Button, Card, IconBox, Badge } from '../components/ui';

export default function LandingPage() {
  const [typedLine1, setTypedLine1] = useState('');
  const [typedLine2, setTypedLine2] = useState('');
  const [typedLine3, setTypedLine3] = useState('');

  useEffect(() => {
    const l1 = "The New ";
    const l2 = "Standard ";
    const l3 = "In Hiring.";
    const full = l1 + l2 + l3;
    let i = 0;
    
    const interval = setInterval(() => {
      i++;
      if (i <= l1.length) {
        setTypedLine1(l1.slice(0, i));
      } else if (i <= l1.length + l2.length) {
        setTypedLine2(l2.slice(0, i - l1.length));
      } else if (i <= full.length) {
        setTypedLine3(l3.slice(0, i - l1.length - l2.length));
      } else {
        clearInterval(interval);
      }
    }, 50);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-paper selection:bg-ink selection:text-paper">
      {/* 
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        HERO SECTION (Editorial 8/4 Split)
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      */}
      <section className="border-b-[4px] border-ink newsprint-texture">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Column (8 cols) - Headlines */}
            <div className="lg:col-span-8 lg:border-r border-ink py-12 lg:py-24 lg:pr-12">
              <Badge className="mb-6">Front Page</Badge>
              
              <h1 className="text-6xl sm:text-7xl lg:text-9xl font-display font-black leading-[0.85] tracking-tighter mb-8 uppercase min-h-[3em]">
                {typedLine1} <br />
                {typedLine2} <br />
                <span className="text-news-red">{typedLine3}</span>
              </h1>
              
              <p className="font-body text-lg lg:text-xl text-neutral-700 leading-relaxed max-w-2xl text-justify mb-10">
                <span className="drop-cap">T</span>raditional Applicant Tracking Systems are structurally broken. By relying on rigid keyword matching, companies routinely discard highly qualified talent simply because a candidate used a synonym. Our semantic intelligence engine reads, understands, and ranks resumes instantly—delivering absolute clarity without the noise.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/upload">
                  <Button className="w-full sm:w-auto">
                    Process Resumes <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/jobs">
                  <Button variant="secondary" className="w-full sm:w-auto">
                    View Placements
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column (4 cols) - Visual & Stats */}
            <div className="lg:col-span-4 py-12 lg:py-24 lg:pl-12 flex flex-col justify-between border-t border-ink lg:border-t-0">
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-4">Fig 1.1 — System Architecture</div>
                {/* Grayscale vintage image effect */}
                <div className="border border-ink p-2 bg-white hard-shadow-hover relative aspect-square group">
                  <div className="absolute inset-2 bg-[radial-gradient(#000_1px,transparent_1px)] opacity-10 [background-size:8px_8px] z-10 pointer-events-none mix-blend-multiply" />
                  <img 
                    src="/assets/hero_2.jpg" 
                    alt="AI Processing Visualization" 
                    className="w-full h-full object-cover grayscale contrast-125 group-hover:sepia-[50%] transition-all duration-500"
                  />
                </div>
              </div>

              <div className="mt-12 space-y-6">
                <div className="border-l-4 border-news-red pl-4">
                  <h3 className="font-display font-bold text-3xl mb-1">92%</h3>
                  <p className="font-sans text-xs uppercase tracking-widest text-neutral-600">Match Accuracy</p>
                </div>
                <div className="border-l-4 border-ink pl-4">
                  <h3 className="font-display font-bold text-3xl mb-1">&lt; 7s</h3>
                  <p className="font-sans text-xs uppercase tracking-widest text-neutral-600">Processing Time</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        FEATURES SECTION (Collapsed Grid)
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      */}
      <section className="bg-white">
        <div className="max-w-screen-xl mx-auto">
          {/* Header */}
          <div className="border-b border-ink px-4 py-16 text-center">
            <h2 className="font-display text-4xl lg:text-5xl font-black uppercase tracking-tight">Core Infrastructure</h2>
            <div className="mt-6 font-serif text-2xl text-neutral-300 tracking-[1em] select-none">
              &#x2727; &#x2727; &#x2727;
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 border-x border-ink mx-4">
            {/* Feature 1 */}
            <div className="border-b md:border-b-0 md:border-r border-ink p-8 hover:bg-neutral-100 transition-colors">
              <IconBox icon={FileText} className="mb-6" />
              <h3 className="font-display font-bold text-2xl mb-3">Semantic Parsing</h3>
              <p className="font-body text-neutral-600 leading-relaxed text-justify">
                Extracts entities, skills, and timelines from unformatted PDFs with high precision. It understands context, not just strings.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="border-b md:border-b-0 md:border-r border-ink p-8 hover:bg-neutral-100 transition-colors">
              <IconBox icon={Zap} className="mb-6" />
              <h3 className="font-display font-bold text-2xl mb-3">Gemini AI</h3>
              <p className="font-body text-neutral-600 leading-relaxed text-justify">
                Powered by the latest LLMs to evaluate candidate experience against job requirements, generating nuanced scoring.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 hover:bg-neutral-100 transition-colors">
              <IconBox icon={Target} className="mb-6" />
              <h3 className="font-display font-bold text-2xl mb-3">Unbiased Ranking</h3>
              <p className="font-body text-neutral-600 leading-relaxed text-justify">
                Standardizes evaluation criteria to rank candidates purely on merit and skill alignment, removing initial screening bias.
              </p>
            </div>
          </div>
          
          {/* Bottom border to close the grid */}
          <div className="border-b-[4px] border-ink mx-4" />
        </div>
      </section>

      {/* 
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        INVERTED CTA SECTION
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      */}
      <section className="bg-ink text-paper py-24 px-4 newsprint-texture">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="bg-paper text-ink border-transparent mb-8">System Access</Badge>
          <h2 className="font-display text-5xl lg:text-7xl font-black mb-8 text-white">
            STOP SEARCHING.<br />
            START MATCHING.
          </h2>
          <Link to="/upload">
            <Button className="bg-news-red text-white border border-transparent hover:bg-white hover:text-news-red hover:border-news-red text-lg px-8 py-4">
              Initialize Analysis
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
