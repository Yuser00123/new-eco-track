'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { GlassCard } from '@/components/ui/GlassCard';
import { useEcoStore } from '@/store/ecoStore';
import { getStoredActions } from '@/lib/localStorage';
import { getDifficultyColor, getCategoryColor, getCategoryIcon } from '@/lib/utils';
import type { EcoAction } from '@/types/carbon';

type CategoryFilter = 'all' | 'transport' | 'energy' | 'diet' | 'shopping';
type DifficultyFilter = 'all' | 'easy' | 'medium' | 'hard';

export default function ActionsPage() {
  const { profile, completeAction, initializeStore } = useEcoStore();
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('all');
  const [actions, setActions] = useState<EcoAction[]>([]);
  const [justCompleted, setJustCompleted] = useState<string | null>(null);

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  useEffect(() => {
    setActions(getStoredActions(profile));
  }, [profile]);

  const filteredActions = actions.filter((action) => {
    if (categoryFilter !== 'all' && action.category !== categoryFilter) return false;
    if (difficultyFilter !== 'all' && action.difficulty !== difficultyFilter) return false;
    return true;
  });

  const pendingActions = filteredActions.filter((a) => !a.completed);
  const completedActions = filteredActions.filter((a) => a.completed);
  const totalCO2Potential = pendingActions.reduce((sum, a) => sum + a.co2SavedKg, 0);

  const handleComplete = async (action: EcoAction) => {
    if (action.completed) return;
    completeAction(action);
    setJustCompleted(action.id);
    setTimeout(() => setJustCompleted(null), 3000);
  };

  const categoryFilters: CategoryFilter[] = ['all', 'transport', 'energy', 'diet', 'shopping'];
  const difficultyFilters: DifficultyFilter[] = ['all', 'easy', 'medium', 'hard'];

  const categoryCounts = actions.reduce((acc, a) => {
    acc[a.category] = (acc[a.category] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen hero-gradient">
      <Navbar />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">
            Action <span className="gradient-text">Center</span>
          </h1>
          <p className="text-white/60">Complete eco-actions to reduce your footprint and earn XP</p>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { icon: '⚡', label: 'Available Actions', value: pendingActions.length, color: '#4F8A8B' },
            { icon: '✅', label: 'Completed', value: completedActions.length, color: '#22c55e' },
            { icon: '💨', label: 'CO₂ Potential', value: `${totalCO2Potential.toFixed(0)}kg`, color: '#f59e0b' },
            { icon: '🏆', label: 'XP Earned', value: profile.xp.toLocaleString(), color: '#a855f7' },
          ].map((card, i) => (
            <GlassCard
              key={card.label}
              className="p-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="text-2xl mb-2">{card.icon}</div>
              <p className="text-xl font-bold text-white">{card.value}</p>
              <p className="text-xs text-white/50 mt-0.5">{card.label}</p>
            </GlassCard>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex flex-wrap gap-2">
            {categoryFilters.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
                  categoryFilter === cat
                    ? 'bg-[#4F8A8B]/30 border border-[#4F8A8B]/60 text-white'
                    : 'bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/30'
                }`}
              >
                {cat !== 'all' && <span>{getCategoryIcon(cat)}</span>}
                <span className="capitalize">{cat}</span>
                {cat !== 'all' && (
                  <span className="text-xs opacity-60">({categoryCounts[cat] ?? 0})</span>
                )}
              </motion.button>
            ))}
          </div>
          <div className="flex gap-2 ml-auto">
            {difficultyFilters.map((diff) => (
              <motion.button
                key={diff}
                onClick={() => setDifficultyFilter(diff)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all capitalize ${
                  difficultyFilter === diff
                    ? 'bg-white/20 text-white'
                    : 'bg-white/5 text-white/50 hover:text-white'
                }`}
              >
                {diff}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Success Toast */}
        <AnimatePresence>
          {justCompleted && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="fixed top-20 right-4 z-50 bg-green-500/90 backdrop-blur text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3"
            >
              <span className="text-2xl">🎉</span>
              <div>
                <p className="font-bold">Action Completed!</p>
                <p className="text-xs opacity-80">XP earned & CO₂ saved tracked</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pending Actions */}
        {pendingActions.length > 0 && (
          <div className="mb-10">
            <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              ⚡ Available Actions
              <span className="text-sm font-normal text-white/50">({pendingActions.length})</span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {pendingActions.map((action, i) => (
                  <ActionCard
                    key={action.id}
                    action={action}
                    index={i}
                    onComplete={handleComplete}
                    justCompleted={justCompleted === action.id}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Completed Actions */}
        {completedActions.length > 0 && (
          <div>
            <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              ✅ Completed Actions
              <span className="text-sm font-normal text-white/50">({completedActions.length})</span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedActions.map((action, i) => (
                <ActionCard
                  key={action.id}
                  action={action}
                  index={i}
                  onComplete={handleComplete}
                  justCompleted={false}
                />
              ))}
            </div>
          </div>
        )}

        {filteredActions.length === 0 && (
          <div className="text-center py-16 text-white/40">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-lg">No actions match your filters</p>
            <p className="text-sm mt-1">Try changing the category or difficulty filter</p>
          </div>
        )}
      </main>
    </div>
  );
}

interface ActionCardProps {
  action: EcoAction;
  index: number;
  onComplete: (action: EcoAction) => void;
  justCompleted: boolean;
}

function ActionCard({ action, index, onComplete, justCompleted }: ActionCardProps) {
  const categoryColor = getCategoryColor(action.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: justCompleted ? 0 : 1, y: justCompleted ? -20 : 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className={`glass-card p-5 flex flex-col transition-all duration-300 ${
        action.completed
          ? 'opacity-60'
          : 'hover:border-[#4F8A8B]/30'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div
          className="p-2 rounded-xl text-xl"
          style={{ background: `${categoryColor}15` }}
        >
          {getCategoryIcon(action.category)}
        </div>
        {action.completed && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold">
            <span>✓</span> Done
          </div>
        )}
      </div>

      <h3 className="font-bold text-white mb-1.5 line-clamp-2">{action.title}</h3>
      <p className="text-sm text-white/60 mb-4 flex-1 line-clamp-2">{action.description}</p>

      {/* Meta info */}
      <div className="grid grid-cols-3 gap-2 mb-4 text-center">
        <div className="p-2 rounded-lg bg-white/5">
          <p className="text-xs font-bold text-[#22c55e]">{action.co2SavedKg}kg</p>
          <p className="text-xs text-white/40 mt-0.5">CO₂ saved</p>
        </div>
        <div className="p-2 rounded-lg bg-white/5">
          <p className={`text-xs font-bold capitalize ${getDifficultyColor(action.difficulty).split(' ')[0]}`}>
            {action.difficulty}
          </p>
          <p className="text-xs text-white/40 mt-0.5">difficulty</p>
        </div>
        <div className="p-2 rounded-lg bg-white/5">
          <p className="text-xs font-bold text-white/80">{action.timeRequired}</p>
          <p className="text-xs text-white/40 mt-0.5">time</p>
        </div>
      </div>

      {/* Category tag */}
      <div className="flex items-center justify-between">
        <span
          className="text-xs px-2 py-1 rounded-full font-medium capitalize"
          style={{ background: `${categoryColor}15`, color: categoryColor }}
        >
          {action.category}
        </span>

        {!action.completed ? (
          <motion.button
            onClick={() => onComplete(action)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-[#1A4D2E] to-[#4F8A8B] text-white shadow-md"
          >
            Complete ✓
          </motion.button>
        ) : (
          <div className="px-4 py-2 rounded-xl text-sm text-green-400 font-semibold">
            +{Math.round(action.co2SavedKg * 10)} XP
          </div>
        )}
      </div>
    </motion.div>
  );
}
