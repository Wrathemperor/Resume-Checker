import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import LandingPage from './pages/LandingPage';
import UploadPage from './pages/UploadPage';
import JobsPage from './pages/JobsPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/jobs" element={<JobsPage />} />
          </Routes>
        </div>
        
        {/* Simple Footer */}
        <footer className="border-t-[4px] border-ink bg-paper px-4 py-8">
          <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="font-display font-black text-2xl">ResumeAI.</div>
            <div className="font-mono text-[10px] uppercase tracking-widest">
              Edition: Vol 1.0 | Printed in Localhost
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
