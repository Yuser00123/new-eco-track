'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useEcoStore } from '@/store/ecoStore';
import { getEcoRank } from '@/lib/badges';

const navLinks = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/calculator', label: 'Calculate', icon: '🧮' },
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/actions', label: 'Actions', icon: '⚡' },
  { href: '/coach', label: 'AI Coach', icon: '🤖' },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const profile = useEcoStore((s) => s.profile);
  const { rank } = getEcoRank(profile.xp);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur-xl"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <motion.div
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1A4D2E] to-[#4F8A8B] flex items-center justify-center text-lg shadow-lg"
              whileHover={{ rotate: 5, scale: 1.05 }}
            >
              🌿
            </motion.div>
            <span className="font-bold text-white text-lg tracking-tight">
              Eco<span className="text-[#4F8A8B]">Track</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                    active
                      ? 'bg-[#1A4D2E]/60 text-white border border-[#4F8A8B]/40'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  <span role="img" aria-hidden="true">{link.icon}</span>
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* User Stats */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <span className="text-yellow-400 text-sm">⚡</span>
              <span className="text-white text-sm font-semibold">{profile.xp.toLocaleString()} XP</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <span className="text-orange-400 text-sm">🔥</span>
              <span className="text-white text-sm font-semibold">{profile.streak}d</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-[#1A4D2E]/40 border border-[#4F8A8B]/30">
              <span className="text-[#4F8A8B] text-sm font-bold">{rank}</span>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span className={cn('h-0.5 bg-current rounded transition-all', mobileOpen && 'rotate-45 translate-y-1.5')} />
              <span className={cn('h-0.5 bg-current rounded transition-all', mobileOpen && 'opacity-0')} />
              <span className={cn('h-0.5 bg-current rounded transition-all', mobileOpen && '-rotate-45 -translate-y-1.5')} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10 bg-black/40 backdrop-blur-xl"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium',
                      active
                        ? 'bg-[#1A4D2E]/60 text-white'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    )}
                  >
                    <span>{link.icon}</span>
                    {link.label}
                  </Link>
                );
              })}
              <div className="flex items-center gap-3 px-4 py-3">
                <span className="text-yellow-400">⚡ {profile.xp} XP</span>
                <span className="text-orange-400">🔥 {profile.streak}d</span>
                <span className="text-[#4F8A8B]">{rank}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
