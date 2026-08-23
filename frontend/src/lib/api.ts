import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
});

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Resume {
  id: string;
  filename: string;
  parseStatus: 'pending' | 'processing' | 'completed' | 'failed';
  uploadDate: string;
  updatedAt: string;
  rawText: string | null;
  parsedJson: ParsedJson | null;
}

export interface ParsedJson {
  name: string | null;
  email: string | null;
  phone: string | null;
  summary: string | null;
  skills: Array<{ skillName: string; proficiency: string | null; yearsExp: number | null }>;
  experiences: Array<{ title: string; company: string; startDate: string; endDate: string; description: string }>;
  educations: Array<{ institution: string; degree: string; field: string; graduationYear: number | null }>;
}

export interface JobDescription {
  id: string;
  title: string;
  rawText: string;
  createdAt: string;
}

export interface MatchResult {
  id: string;
  score: number;
  justification: string;
  matchingSkills: string[];
  missingSkills: string[];
  strengths: string[];
  concerns: string[];
  shortlisted: boolean;
  createdAt: string;
  candidate?: { id: string; name: string };
  jobDescription?: { id: string; title: string };
}

// ─── Resume API ───────────────────────────────────────────────────────────────

export const resumeApi = {
  upload: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post<{ resumeId: string; status: string }>('/resumes/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  list: () => api.get<Resume[]>('/resumes'),
  getById: (id: string) => api.get<Resume>(`/resumes/${id}`),
  delete: (id: string) => api.delete(`/resumes/${id}`),
};

// ─── Job API ──────────────────────────────────────────────────────────────────

export const jobApi = {
  create: (title: string, rawText: string) =>
    api.post<JobDescription>('/jobs', { title, rawText }),
  list: () => api.get<JobDescription[]>('/jobs'),
  match: (jobId: string, resumeId: string) =>
    api.post<MatchResult>(`/jobs/${jobId}/match/${resumeId}`),
  getMatches: (jobId: string) =>
    api.get<MatchResult[]>(`/jobs/${jobId}/matches`),
};
