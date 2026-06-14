'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  label?: string;
  color?: string;
  showValue?: boolean;
  className?: string;
  height?: string;
  animated?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  color = 'from-[#1A4D2E] to-[#4F8A8B]',
  showValue = false,
  className,
  height = 'h-2',
  animated = true,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn('w-full', className)}>
      {(label ?? showValue) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-sm text-white/70">{label}</span>}
          {showValue && (
            <span className="text-sm font-semibold text-white">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div
        className={cn('w-full rounded-full bg-white/10 overflow-hidden', height)}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        {animated ? (
          <motion.div
            className={cn('h-full rounded-full bg-gradient-to-r', color)}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          />
        ) : (
          <div
            className={cn('h-full rounded-full bg-gradient-to-r', color)}
            style={{ width: `${percentage}%` }}
          />
        )}
      </div>
    </div>
  );
}
