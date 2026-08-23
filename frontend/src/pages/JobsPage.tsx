import React, { useState, useEffect } from 'react';
import { Briefcase, Target, ChevronRight, PlusCircle, UserCheck } from 'lucide-react';
import { Button, Card, Badge, IconBox } from '../components/ui';
import { jobApi, resumeApi, JobDescription, MatchResult, Resume } from '../lib/api';
import { ProfileCard } from '../components/original';

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobDescription[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobDescription | null>(null);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  
  // Job Creation form state
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newText, setNewText] = useState('');
  const [creating, setCreating] = useState(false);

  // Match trigger state
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [matching, setMatching] = useState(false);

  useEffect(() => {
    fetchJobs();
    resumeApi.list().then(res => setResumes(res.data)).catch(console.error);
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await jobApi.list();
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectJob = async (job: JobDescription) => {
    setSelectedJob(job);
    setShowCreate(false);
    try {
      const res = await jobApi.getMatches(job.id);
      setMatches(res.data.sort((a, b) => b.score - a.score));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await jobApi.create(newTitle, newText);
      await fetchJobs();
      handleSelectJob(res.data);
      setNewTitle('');
      setNewText('');
      setShowCreate(false);
    } catch (err) {
      alert("Failed to create job.");
    } finally {
      setCreating(false);
    }
  };

  const handleRunMatch = async () => {
    if (!selectedJob || !selectedResumeId) return;
    setMatching(true);
    try {
      await jobApi.match(selectedJob.id, selectedResumeId);
      // refresh matches
      handleSelectJob(selectedJob);
      setSelectedResumeId('');
    } catch (err) {
      alert("Match failed. Ensure backend and Gemini API are running.");
    } finally {
      setMatching(false);
    }
  };

  return (
    <main className="min-h-screen bg-paper text-ink pt-8 pb-24">
      <div className="max-w-screen-xl mx-auto px-4">
        
        {/* Page Header */}
        <div className="border-b-[4px] border-ink pb-8 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <Badge className="mb-4">Evaluation Matrix</Badge>
            <h1 className="font-display text-5xl md:text-7xl font-black uppercase tracking-tight">
              Classifieds & Matching
            </h1>
          </div>
          <Button onClick={() => setShowCreate(true)} variant={showCreate ? 'secondary' : 'primary'}>
            <PlusCircle className="w-4 h-4 mr-2" /> Post Requisition
          </Button>
        </div>

        {/* 2-Column Ledger Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 border border-ink bg-white">
          
          {/* Left Column: Job Ledger */}
          <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-ink bg-neutral-100">
            <div className="border-b border-ink p-4 bg-ink text-paper">
              <h2 className="font-mono text-xs uppercase tracking-widest font-bold">Active Requisitions</h2>
            </div>
            <div className="divide-y divide-ink max-h-[700px] overflow-y-auto">
              {jobs.length === 0 ? (
                <div className="p-8 text-center font-mono text-xs text-neutral-500 uppercase">No active jobs.</div>
              ) : (
                jobs.map(job => (
                  <button
                    key={job.id}
                    onClick={() => handleSelectJob(job)}
                    className={`w-full text-left p-6 transition-colors hover:bg-neutral-200 ${selectedJob?.id === job.id ? 'bg-white border-l-4 border-l-news-red' : 'border-l-4 border-l-transparent'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-display font-bold text-xl leading-tight pr-4">{job.title}</h3>
                      <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0 mt-1" />
                    </div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
                      Posted: {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Active View (Create Job OR Match Results) */}
          <div className="lg:col-span-8 p-6 lg:p-10 newsprint-texture">
            {showCreate ? (
              <div className="max-w-2xl">
                <div className="flex items-end justify-between mb-8 pb-4 border-b-[2px] border-ink">
                  <h2 className="font-display text-3xl font-bold">New Requisition</h2>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setNewTitle('Senior Frontend Engineer');
                        setNewText('We are looking for a Senior Frontend Engineer with 5+ years of experience in React, TypeScript, and modern CSS frameworks like Tailwind. Must have experience with state management, performance optimization, and architectural design of large-scale SPAs.');
                      }}
                      className="font-mono text-[10px] uppercase tracking-widest bg-neutral-200 hover:bg-ink hover:text-white px-2 py-1 transition-colors"
                    >
                      Sample 1: Frontend
                    </button>
                    <button 
                      onClick={() => {
                        setNewTitle('Backend Java Developer');
                        setNewText('Seeking a Backend Developer proficient in Java 21, Spring Boot, and PostgreSQL. The ideal candidate will have 3+ years experience building scalable REST APIs, working with Docker, and writing robust unit tests. Experience with AWS is a plus.');
                      }}
                      className="font-mono text-[10px] uppercase tracking-widest bg-neutral-200 hover:bg-ink hover:text-white px-2 py-1 transition-colors"
                    >
                      Sample 2: Backend
                    </button>
                  </div>
                </div>
                <form onSubmit={handleCreateJob} className="space-y-6">
                  <div>
                    <label className="block font-sans text-xs font-bold uppercase tracking-widest mb-2">Role Title</label>
                    <input
                      required
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      className="w-full border-b-2 border-ink bg-transparent px-3 py-3 font-serif text-xl focus-visible:bg-neutral-100 focus-visible:outline-none transition-colors"
                      placeholder="e.g. Senior Frontend Engineer"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-xs font-bold uppercase tracking-widest mb-2">Job Description</label>
                    <textarea
                      required
                      value={newText}
                      onChange={e => setNewText(e.target.value)}
                      rows={12}
                      className="w-full border-2 border-ink bg-transparent p-4 font-body text-base leading-relaxed focus-visible:bg-neutral-100 focus-visible:outline-none transition-colors resize-y"
                      placeholder="Paste the full job description here..."
                    />
                  </div>
                  <div className="pt-4">
                    <Button type="submit" disabled={creating} className="w-full">
                      {creating ? 'Publishing...' : 'Publish Requisition'}
                    </Button>
                  </div>
                </form>
              </div>
            ) : selectedJob ? (
              <div>
                {/* Selected Job Header */}
                <div className="mb-8 pb-8 border-b-2 border-ink">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="font-display text-4xl font-black mb-2">{selectedJob.title}</h2>
                      <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">ID: {selectedJob.id}</p>
                    </div>
                  </div>
                  
                  {/* Manual Match Trigger */}
                  <div className="mt-8 p-6 border border-ink bg-neutral-50 flex flex-col sm:flex-row items-end gap-4">
                    <div className="flex-1 w-full">
                      <label className="block font-sans text-[10px] font-bold uppercase tracking-widest mb-2 text-news-red">Run AI Evaluation</label>
                      <select 
                        className="w-full border-b-2 border-ink bg-transparent px-2 py-2 font-mono text-sm focus-visible:bg-white focus-visible:outline-none"
                        value={selectedResumeId}
                        onChange={e => setSelectedResumeId(e.target.value)}
                      >
                        <option value="">-- Select a candidate dossier --</option>
                        {resumes.filter(r => r.parseStatus === 'completed').map(r => (
                          <option key={r.id} value={r.id}>{r.parsedJson?.name || r.filename}</option>
                        ))}
                      </select>
                    </div>
                    <Button onClick={handleRunMatch} disabled={!selectedResumeId || matching}>
                      {matching ? 'Analyzing...' : 'Execute Match'}
                    </Button>
                  </div>
                </div>

                {/* Match Results */}
                <div>
                  <h3 className="font-display text-2xl font-bold mb-6 flex items-center gap-3">
                    <Target className="w-6 h-6 stroke-[1.5]" /> Match Ledger
                  </h3>
                  
                  <div className="space-y-6">
                    {matches.length === 0 ? (
                      <p className="font-body text-neutral-500 italic">No candidates have been evaluated for this role yet.</p>
                    ) : (
                      matches.map(match => (
                        <ProfileCard 
                          key={match.id}
                          name={match.candidate?.name || 'Unknown Candidate'}
                          website="linkedin.com/in/candidate"
                          visits="N/A"
                          heatScore={Math.round(match.score * 10)}
                          location="Global"
                          categories={match.strengths?.slice(0, 3) || ["Relevant Skills"]}
                          employees="1"
                          arr="N/A"
                          founders={[{
                            name: match.candidate?.name || 'Candidate',
                            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${match.candidate?.name || 'C'}`
                          }]}
                          extraFounders={0}
                        />
                      ))
                    )}
                  </div>
                </div>

              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-neutral-400 py-32 border-2 border-dashed border-neutral-300 bg-white">
                <Briefcase className="w-12 h-12 stroke-1 mb-4" />
                <p className="font-sans text-sm uppercase tracking-widest">Select or create a requisition</p>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </main>
  );
}
