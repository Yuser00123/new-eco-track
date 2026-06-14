'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { GlassCard } from '@/components/ui/GlassCard';
import { BadgeCard } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useEcoStore } from '@/store/ecoStore';
import { getEcoRank } from '@/lib/badges';
import { calculateLevelProgress } from '@/lib/utils';

export default function BadgesPage() {
  const { profile, initializeStore } = useEcoStore();

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  const { badges, xp, streak, completedActions } = profile;
  const { rank, nextRank, xpToNext } = getEcoRank(xp);
  const levelProgress = calculateLevelProgress(xp);
  const earnedBadges = badges.filter((b) => b.earned);
  const unearnedBadges = badges.filter((b) => !b.earned);

  const ecoRanks = [
    { name: 'Seedling', xp: 0, icon: '🌱', color: '#86efac' },
    { name: 'Sprout', xp: 100, icon: '🌿', color: '#4ade80' },
    { name: 'Sapling', xp: 300, icon: '🌳', color: '#22c55e' },
    { name: 'Tree', xp: 700, icon: '🌲', color: '#16a34a' },
    { name: 'Forest', xp: 1500, icon: '🏔️', color: '#4F8A8B' },
    { name: 'Guardian', xp: 3000, icon: '⚡', color: '#1A4D2E' },
    { name: 'Champion', xp: 6000, icon: '🏆', color: '#ffd700' },
  ];

  return (
    <div className="min-h-screen hero-gradient">
      <Navbar />
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Link href="/dashboard" className="text-white/60 hover:text-white transition-colors text-sm">
            ← Dashboard
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            Achievements & <span className="gradient-text">Ranks</span>
          </h1>
        </motion.div>

        {/* Current Rank */}
        <GlassCard className="p-8 mb-8 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <motion.div
            animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-7xl mb-4"
          >
            🌿
          </motion.div>
          <h2 className="text-3xl font-bold text-white mb-1">{rank}</h2>
          <p className="text-white/60 mb-2">{xp.toLocaleString()} XP total</p>
          {xpToNext > 0 && (
            <p className="text-[#4F8A8B] text-sm mb-5">{xpToNext} XP until {nextRank}</p>
          )}
          <div className="max-w-sm mx-auto">
            <ProgressBar
              value={levelProgress}
              showValue
              label={`Progress to ${nextRank}`}
              height="h-3"
              color="from-[#1A4D2E] to-[#4F8A8B]"
            />
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6 max-w-sm mx-auto">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#22c55e]">{earnedBadges.length}</p>
              <p className="text-xs text-white/50">Badges</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-400">{streak}</p>
              <p className="text-xs text-white/50">Day Streak</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#4F8A8B]">{completedActions.length}</p>
              <p className="text-xs text-white/50">Actions</p>
            </div>
          </div>
        </GlassCard>

        {/* Eco Ranks Ladder */}
        <GlassCard className="p-6 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-white font-bold text-lg mb-5">Eco Rank Ladder</h2>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-white/10" />
            <div className="space-y-3">
              {ecoRanks.map((r, i) => {
                const isActive = rank === r.name;
                const isUnlocked = xp >= r.xp;
                return (
                  <motion.div
                    key={r.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`relative flex items-center gap-4 p-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-[#4F8A8B]/15 border border-[#4F8A8B]/40'
                        : isUnlocked
                        ? 'bg-white/5'
                        : 'opacity-40'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl z-10 border-2 ${
                        isActive ? 'border-[#4F8A8B]' : isUnlocked ? 'border-white/20' : 'border-white/10'
                      }`}
                      style={{ background: isUnlocked ? `${r.color}20` : 'rgba(255,255,255,0.05)' }}
                    >
                      {r.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{r.name}</span>
                        {isActive && (
                          <span className="text-xs px-2 py-0.5 rounded-full text-[#4F8A8B] bg-[#4F8A8B]/15 font-medium">
                            Current
                          </span>
                        )}
                        {isUnlocked && !isActive && (
                          <span className="text-xs text-green-400">✓ Unlocked</span>
                        )}
                      </div>
                      <p className="text-xs text-white/50">{r.xp.toLocaleString()} XP required</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </GlassCard>

        {/* Earned Badges */}
        {earnedBadges.length > 0 && (
          <div className="mb-8">
            <h2 className="text-white font-bold text-lg mb-4">
              🏆 Earned Badges ({earnedBadges.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {earnedBadges.map((badge, i) => (
                <BadgeCard key={badge.id} badge={badge} size="md" index={i} />
              ))}
            </div>
          </div>
        )}

        {/* Unearned Badges */}
        {unearnedBadges.length > 0 && (
          <div>
            <h2 className="text-white font-bold text-lg mb-4">
              🎯 Badges to Unlock ({unearnedBadges.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {unearnedBadges.map((badge, i) => (
                <BadgeCard key={badge.id} badge={badge} size="md" index={i} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
