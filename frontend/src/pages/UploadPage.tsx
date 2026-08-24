import React, { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Button, Card, Badge } from '../components/ui';
import { ListStack } from '../components/original';
import { resumeApi, Resume } from '../lib/api';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [resumes, setResumes] = useState<Resume[]>([]);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const res = await resumeApi.list();
      setResumes(res.data);
    } catch (err) {
      console.error("Failed to fetch resumes", err);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.length) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    setUploading(true);
    try {
      await resumeApi.upload(file);
      setFile(null);
      await fetchResumes();
    } catch (error: any) {
      const status = error?.response?.status;
      const msg = error?.response?.data?.message || error?.message || 'Unknown error';
      const url = error?.config?.url || error?.request?.responseURL || 'unknown URL';
      console.error("Upload error:", error);
      alert(`Upload failed!\n\nStatus: ${status || 'No response (CORS or network error)'}\nMessage: ${msg}\nURL called: ${url}\n\nCheck browser console (F12) for full details.`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-paper text-ink pt-8 pb-24">
      <div className="max-w-screen-xl mx-auto px-4">
        
        {/* Page Header */}
        <div className="border-b-[4px] border-ink pb-8 mb-12">
          <Badge className="mb-4">Intake Module</Badge>
          <h1 className="font-display text-5xl md:text-7xl font-black uppercase tracking-tight">
            Document Ingestion
          </h1>
          <p className="font-body text-neutral-600 mt-4 max-w-2xl text-lg">
            Submit candidate CVs/Resume (PDF) for immediate semantic extraction and indexing by the Gemini AI subsystem.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 border border-ink">
          
          {/* Left Col: Upload Zone */}
          <div className="lg:col-span-7 border-b lg:border-b-0 lg:border-r border-ink p-8 bg-white">
            <h2 className="font-display text-2xl font-bold mb-6">File Submission</h2>
            
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="border-2 border-dashed border-neutral-300 hover:border-ink transition-colors bg-neutral-50 p-12 flex flex-col items-center justify-center text-center cursor-pointer min-h-[300px]"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <input 
                id="file-upload" 
                type="file" 
                accept="application/pdf" 
                className="hidden" 
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              
              <div className="h-16 w-16 border border-ink bg-white flex items-center justify-center mb-6 hard-shadow-hover">
                <Upload className="w-6 h-6 stroke-[1.5]" />
              </div>
              
              {file ? (
                <div>
                  <p className="font-mono text-sm font-bold">{file.name}</p>
                  <p className="font-sans text-xs text-neutral-500 mt-2 uppercase tracking-widest">{(file.size / 1024 / 1024).toFixed(2)} MB • Ready</p>
                </div>
              ) : (
                <div>
                  <p className="font-display text-xl font-bold mb-2">Select or drop PDF file</p>
                  <p className="font-sans text-xs text-neutral-500 uppercase tracking-widest">Max file size: 10MB</p>
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-end">
              <Button 
                onClick={handleSubmit} 
                disabled={!file || uploading}
                className="w-full sm:w-auto"
              >
                {uploading ? 'Processing...' : 'Execute Intake'}
              </Button>
            </div>
          </div>

          {/* Right Col: Ledger */}
          <div className="lg:col-span-5 p-8 bg-neutral-100 newsprint-texture">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold">Intake Ledger</h2>
              <Badge>{resumes.length} Records</Badge>
            </div>

            <div className="max-h-[500px] overflow-y-auto pr-2">
              <ListStack 
                items={resumes.map(resume => ({
                  id: resume.id,
                  title: resume.filename,
                  location: resume.parseStatus === 'completed' ? 'Extraction Successful' : 'Processing...',
                  date: new Date(resume.uploadDate).toLocaleDateString(),
                  icon: resume.parseStatus === 'completed' ? CheckCircle2 : (resume.parseStatus === 'failed' ? AlertCircle : Clock),
                  skills: resume.parsedJson?.skills || []
                }))}
                onDelete={async (id) => {
                  if (window.confirm('Delete this record?')) {
                    try {
                      await resumeApi.delete(id);
                      fetchResumes();
                    } catch(e) {
                      alert('Could not delete. It may be tied to a match record.');
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
