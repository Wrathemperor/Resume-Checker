import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

export function getScoreColor(score: number): string {
  if (score >= 80) return '#22c55e';
  if (score >= 60) return '#0039FF';
  if (score >= 40) return '#f59e0b';
  return '#ef4444';
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return 'Strong Match';
  if (score >= 60) return 'Good Fit';
  if (score >= 40) return 'Partial Fit';
  return 'Low Match';
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'completed': return '#22c55e';
    case 'processing': return '#0039FF';
    case 'pending': return '#f59e0b';
    case 'failed': return '#ef4444';
    default: return '#6B7280';
  }
}
