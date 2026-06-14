import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number, decimals = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function formatCO2(kg: number): string {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(1)} tons`;
  }
  return `${Math.round(kg)} kg`;
}

export function getDifficultyColor(difficulty: 'easy' | 'medium' | 'hard'): string {
  const colors = {
    easy: 'text-green-400 bg-green-400/10',
    medium: 'text-yellow-400 bg-yellow-400/10',
    hard: 'text-red-400 bg-red-400/10',
  };
  return colors[difficulty];
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    transport: '#4F8A8B',
    energy: '#f59e0b',
    diet: '#22c55e',
    shopping: '#a855f7',
  };
  return colors[category] ?? '#4F8A8B';
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    transport: '🚗',
    energy: '⚡',
    diet: '🥗',
    shopping: '🛍️',
  };
  return icons[category] ?? '🌱';
}

export function getRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}

export function calculateLevelProgress(xp: number): number {
  const thresholds = [0, 100, 300, 700, 1500, 3000, 6000];
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (xp >= thresholds[i]) {
      const current = thresholds[i];
      const next = thresholds[i + 1] ?? thresholds[i];
      if (current === next) return 100;
      return Math.round(((xp - current) / (next - current)) * 100);
    }
  }
  return 0;
}
