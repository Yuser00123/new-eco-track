'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Badge as BadgeType } from '@/types/carbon';

interface BadgeCardProps {
  badge: BadgeType;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  index?: number;
}

export function BadgeCard({ badge, size = 'md', showDetails = true, index = 0 }: BadgeCardProps) {
  const sizes = {
    sm: { card: 'p-3', icon: 'text-2xl', name: 'text-xs', desc: 'text-xs' },
    md: { card: 'p-4', icon: 'text-3xl', name: 'text-sm', desc: 'text-xs' },
    lg: { card: 'p-6', icon: 'text-5xl', name: 'text-base', desc: 'text-sm' },
  };

  const s = sizes[size];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 300 }}
      className={cn(
        'rounded-2xl border text-center transition-all duration-300',
        s.card,
        badge.earned
          ? 'bg-gradient-to-br from-[#1A4D2E]/40 to-[#4F8A8B]/20 border-[#4F8A8B]/40 shadow-[0_0_20px_rgba(79,138,139,0.2)]'
          : 'bg-white/5 border-white/10 opacity-50 grayscale'
      )}
    >
      <div className={cn('mb-2', s.icon, !badge.earned && 'opacity-40')} role="img" aria-label={badge.name}>
        {badge.icon}
      </div>
      {showDetails && (
        <>
          <p className={cn('font-semibold text-white', s.name)}>{badge.name}</p>
          <p className={cn('text-white/50 mt-1', s.desc)}>{badge.description}</p>
          {badge.earned && badge.earnedAt && (
            <p className={cn('text-[#4F8A8B] mt-2', s.desc)}>
              ✓ Earned
            </p>
          )}
          {!badge.earned && (
            <p className={cn('text-white/30 mt-2', s.desc)}>{badge.requirement}</p>
          )}
        </>
      )}
    </motion.div>
  );
}
