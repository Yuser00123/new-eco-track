'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  variant?: 'default' | 'light' | 'dark' | 'teal';
}

export function GlassCard({
  children,
  className,
  hover = false,
  glow = false,
  variant = 'default',
  ...props
}: GlassCardProps) {
  const variants = {
    default: 'bg-white/5 border-white/10',
    light: 'bg-sage/10 border-sage/20',
    dark: 'bg-black/30 border-white/5',
    teal: 'bg-teal/10 border-teal/20',
  };

  return (
    <motion.div
      className={cn(
        'rounded-2xl border backdrop-blur-xl',
        'shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)]',
        variants[variant],
        hover && 'cursor-pointer transition-all duration-300',
        glow && 'shadow-[0_0_30px_rgba(79,138,139,0.2)]',
        className
      )}
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
