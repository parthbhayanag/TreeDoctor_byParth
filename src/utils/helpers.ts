import { HealthStatus, HealthTrend, UrgencyLevel } from '../types';

export function getStatusColor(status: HealthStatus): {
  bg: string;
  text: string;
  border: string;
  badgeBg: string;
  dot: string;
  hex: string;
} {
  switch (status) {
    case 'healthy':
      return {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-400',
        border: 'border-emerald-500/30',
        badgeBg: 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30',
        dot: 'bg-emerald-400',
        hex: '#10b981',
      };
    case 'needs_attention':
      return {
        bg: 'bg-amber-500/10',
        text: 'text-amber-400',
        border: 'border-amber-500/30',
        badgeBg: 'bg-amber-950/80 text-amber-300 border border-amber-500/30',
        dot: 'bg-amber-400',
        hex: '#f59e0b',
      };
    case 'at_risk':
      return {
        bg: 'bg-orange-500/10',
        text: 'text-orange-400',
        border: 'border-orange-500/30',
        badgeBg: 'bg-orange-950/80 text-orange-300 border border-orange-500/30',
        dot: 'bg-orange-400',
        hex: '#f97316',
      };
    case 'critical':
      return {
        bg: 'bg-rose-500/10',
        text: 'text-rose-400',
        border: 'border-rose-500/30',
        badgeBg: 'bg-rose-950/80 text-rose-300 border border-rose-500/30',
        dot: 'bg-rose-500',
        hex: '#f43f5e',
      };
  }
}

export function getStatusLabel(status: HealthStatus): string {
  switch (status) {
    case 'healthy':
      return 'Healthy';
    case 'needs_attention':
      return 'Needs Attention';
    case 'at_risk':
      return 'At Risk';
    case 'critical':
      return 'Critical';
  }
}

export function getTrendInfo(trend: HealthTrend): { label: string; iconText: string; color: string } {
  switch (trend) {
    case 'improving':
      return { label: 'Improving', iconText: '↑', color: 'text-emerald-400' };
    case 'stable':
      return { label: 'Stable', iconText: '→', color: 'text-amber-300' };
    case 'declining':
      return { label: 'Declining', iconText: '↓', color: 'text-orange-400' };
    case 'rapidly_deteriorating':
      return { label: 'Rapidly Deteriorating', iconText: '↓↓', color: 'text-rose-400' };
  }
}

export function getUrgencyBadge(urgency: UrgencyLevel): { text: string; bg: string } {
  switch (urgency) {
    case 'low':
      return { text: 'Low Urgency', bg: 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/40' };
    case 'medium':
      return { text: 'Moderate Urgency', bg: 'bg-amber-900/40 text-amber-300 border border-amber-700/40' };
    case 'high':
      return { text: 'High Urgency', bg: 'bg-orange-900/40 text-orange-300 border border-orange-700/40' };
    case 'urgent':
      return { text: '🚨 Immediate Action Required', bg: 'bg-rose-900/60 text-rose-200 border border-rose-600/60' };
  }
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}
