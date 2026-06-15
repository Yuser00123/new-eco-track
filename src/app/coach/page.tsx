'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { GlassCard } from '@/components/ui/GlassCard';
import { useEcoStore } from '@/store/ecoStore';
import { getCategoryIcon } from '@/lib/utils';
import type { AIInsight } from '@/types/carbon';

type InsightType = 'recommendations' | 'challenge' | 'progress' | 'motivation';

interface AIResponse {
  success: boolean;
  source: string;
  data: {
    insights?: Array<{
      title: string;
      content: string;
      category?: string;
      co2Impact?: string;
    }>;
    challenge?: {
      title: string;
      content: string;
      category?: string;
      co2Impact?: string;
      tips?: string[];
    };
    report?: {
      title: string;
      content: string;
      highlight: string;
      nextGoal: string;
    };
    motivation?: {
      message: string;
      impact: string;
      quote: string;
    };
  };
}

const coachModes = [
  {
    id: 'recommendations' as InsightType,
    icon: '💡',
    title: 'Personalized Tips',
    description: 'AI recommendations based on your footprint',
    color: '#4F8A8B',
  },
  {
    id: 'challenge' as InsightType,
    icon: '🎯',
    title: 'Weekly Challenge',
    description: 'Get a custom eco-challenge for this week',
    color: '#22c55e',
  },
  {
    id: 'progress' as InsightType,
    icon: '📈',
    title: 'Progress Report',
    description: 'AI analysis of your sustainability journey',
    color: '#f59e0b',
  },
  {
    id: 'motivation' as InsightType,
    icon: '🌟',
    title: 'Motivation Boost',
    description: 'Encouragement and real-world impact stats',
    color: '#a855f7',
  },
];

export default function CoachPage() {
  const { profile, addAIInsight, initializeStore } = useEcoStore();
  const [activeMode, setActiveMode] = useState<InsightType>('recommendations');
  const [isLoading, setIsLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<AIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  const getTopCategory = useCallback(() => {
    if (!profile.carbonScore) return 'transport';
    const { breakdown } = profile.carbonScore;
    const cats = [
      { key: 'transport', val: breakdown.transport },
      { key: 'energy', val: breakdown.energy },
      { key: 'diet', val: breakdown.diet },
      { key: 'shopping', val: breakdown.shopping },
    ];
    return cats.reduce((a, b) => (a.val > b.val ? a : b)).key;
  }, [profile.carbonScore]);

  const fetchInsight = useCallback(async (type: InsightType) => {
    setIsLoading(true);
    setError(null);
    setCurrentResponse(null);

    try {
      const response = await fetch('/api/ai-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          carbonScore: profile.carbonScore
            ? {
                breakdown: profile.carbonScore.breakdown,
                percentileVsNational: profile.carbonScore.percentileVsNational,
              }
            : null,
          xp: profile.xp,
          streak: profile.streak,
          completedActions: profile.completedActions.length,
          totalCO2Saved: profile.totalCO2Saved,
          topCategory: getTopCategory(),
        }),
      });

      if (!response.ok) throw new Error('Failed to get AI response');

      const data = await response.json() as AIResponse;
      setCurrentResponse(data);

      // Save insight to profile
      const insightType: AIInsight['type'] =
        type === 'recommendations' ? 'recommendation' :
        type === 'challenge' ? 'challenge' :
        type === 'progress' ? 'progress' : 'motivation';

      const insight: AIInsight = {
        id: Math.random().toString(36).substring(2),
        type: insightType,
        title: coachModes.find((m) => m.id === type)?.title ?? 'AI Insight',
        content: JSON.stringify(data.data),
        generatedAt: new Date().toISOString(),
        actionable: type === 'recommendations' || type === 'challenge',
      };
      addAIInsight(insight);
    } catch (err) {
      setError('Failed to get AI insights. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [profile, getTopCategory, addAIInsight]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchInsight(activeMode);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [activeMode, fetchInsight]);

  const handleModeChange = (mode: InsightType) => {
    setActiveMode(mode);
  };

  return (
    <div className="min-h-screen hero-gradient">
      <Navbar />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1A4D2E]/40 border border-[#4F8A8B]/30 text-sm text-[#4F8A8B] font-medium mb-4">
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🤖
            </motion.span>
            Powered by Gemini AI
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Your AI <span className="gradient-text">Sustainability Coach</span>
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto">
            Get personalized eco-insights, weekly challenges, and progress reports tailored
            to your specific carbon footprint and lifestyle.
          </p>
        </motion.div>

        {/* Mode Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {coachModes.map((mode, i) => (
            <motion.button
              key={mode.id}
              onClick={() => handleModeChange(mode.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className={`p-5 rounded-2xl border text-left transition-all duration-200 ${
                activeMode === mode.id
                  ? 'border-[#4F8A8B]/60 bg-[#4F8A8B]/15 shadow-[0_0_20px_rgba(79,138,139,0.3)]'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
            >
              <div className="text-3xl mb-3">{mode.icon}</div>
              <div className="font-bold text-white text-sm mb-1">{mode.title}</div>
              <div className="text-xs text-white/50">{mode.description}</div>
              {activeMode === mode.id && (
                <motion.div
                  layoutId="activeIndicator"
                  className="w-1.5 h-1.5 rounded-full mt-2"
                  style={{ background: mode.color }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* AI Response Area */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass-card p-12 text-center"
              >
                <motion.div
                  className="inline-block text-5xl mb-4"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  🌿
                </motion.div>
                <p className="text-white font-semibold">EcoCoach is analyzing your data...</p>
                <p className="text-white/50 text-sm mt-1">Generating personalized insights with Gemini AI</p>
                <div className="flex justify-center gap-1 mt-4">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-[#4F8A8B]"
                      animate={{ y: [0, -8, 0], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {error && !isLoading && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card p-8 text-center"
              >
                <p className="text-3xl mb-3">⚠️</p>
                <p className="text-white font-semibold">{error}</p>
                <motion.button
                  onClick={() => fetchInsight(activeMode)}
                  whileHover={{ scale: 1.03 }}
                  className="mt-4 px-6 py-3 rounded-xl bg-[#4F8A8B]/30 border border-[#4F8A8B]/50 text-white"
                >
                  Try Again
                </motion.button>
              </motion.div>
            )}

            {currentResponse && !isLoading && (
              <motion.div
                key={`response-${activeMode}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Recommendations */}
                {activeMode === 'recommendations' && currentResponse.data.insights && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-5">
                      <span className="text-2xl">💡</span>
                      <h2 className="text-white font-bold text-xl">Personalized Recommendations</h2>
                      {currentResponse.source === 'gemini' && (
                        <span className="ml-auto text-xs px-2 py-1 rounded-full bg-[#4F8A8B]/20 text-[#4F8A8B]">
                          AI Generated
                        </span>
                      )}
                    </div>
                    {currentResponse.data.insights.map((insight, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.15 }}
                        className="glass-card p-6"
                      >
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-xl bg-[#4F8A8B]/10 text-2xl flex-shrink-0">
                            {insight.category ? getCategoryIcon(insight.category) : '💡'}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h3 className="font-bold text-white">{insight.title}</h3>
                              {insight.co2Impact && (
                                <span className="text-xs px-2 py-1 rounded-full bg-green-500/15 text-green-400 font-semibold whitespace-nowrap">
                                  Saves {insight.co2Impact}
                                </span>
                              )}
                            </div>
                            <p className="text-white/70 text-sm leading-relaxed">{insight.content}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Challenge */}
                {activeMode === 'challenge' && currentResponse.data.challenge && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-8 border-[#22c55e]/20"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-4xl">🎯</span>
                      <div>
                        <p className="text-sm text-[#22c55e] font-semibold uppercase tracking-wider">This Week&apos;s Challenge</p>
                        <h2 className="text-2xl font-bold text-white mt-0.5">
                          {currentResponse.data.challenge.title}
                        </h2>
                      </div>
                    </div>

                    <p className="text-white/80 text-base leading-relaxed mb-6">
                      {currentResponse.data.challenge.content}
                    </p>

                    <div className="flex flex-wrap gap-3 mb-6">
                      {currentResponse.data.challenge.co2Impact && (
                        <div className="px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20">
                          <span className="text-green-400 font-bold text-sm">
                            💨 {currentResponse.data.challenge.co2Impact}
                          </span>
                        </div>
                      )}
                      {currentResponse.data.challenge.category && (
                        <div className="px-4 py-2 rounded-xl bg-[#4F8A8B]/10 border border-[#4F8A8B]/20">
                          <span className="text-[#4F8A8B] font-bold text-sm capitalize">
                            {getCategoryIcon(currentResponse.data.challenge.category)} {currentResponse.data.challenge.category}
                          </span>
                        </div>
                      )}
                    </div>

                    {currentResponse.data.challenge.tips && currentResponse.data.challenge.tips.length > 0 && (
                      <div>
                        <p className="text-white/60 text-sm font-semibold mb-3">💡 Tips for success:</p>
                        <ul className="space-y-2">
                          {currentResponse.data.challenge.tips.map((tip, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                              <span className="text-[#22c55e] mt-0.5">→</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Progress Report */}
                {activeMode === 'progress' && currentResponse.data.report && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <GlassCard className="p-8">
                      <div className="flex items-center gap-3 mb-5">
                        <span className="text-4xl">📈</span>
                        <h2 className="text-2xl font-bold text-white">
                          {currentResponse.data.report.title}
                        </h2>
                      </div>
                      <p className="text-white/80 leading-relaxed text-base mb-6">
                        {currentResponse.data.report.content}
                      </p>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                          <p className="text-yellow-400 font-bold text-sm mb-1">🌟 Highlight</p>
                          <p className="text-white/80 text-sm">{currentResponse.data.report.highlight}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-[#4F8A8B]/10 border border-[#4F8A8B]/20">
                          <p className="text-[#4F8A8B] font-bold text-sm mb-1">🎯 Next Goal</p>
                          <p className="text-white/80 text-sm">{currentResponse.data.report.nextGoal}</p>
                        </div>
                      </div>
                    </GlassCard>

                    {/* Stats summary */}
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: 'Actions Done', value: profile.completedActions.length, icon: '✅' },
                        { label: 'Day Streak', value: profile.streak, icon: '🔥' },
                        { label: 'CO₂ Saved (kg)', value: Math.round(profile.totalCO2Saved), icon: '💨' },
                      ].map((stat) => (
                        <GlassCard key={stat.label} className="p-4 text-center">
                          <div className="text-2xl mb-1">{stat.icon}</div>
                          <p className="text-xl font-bold text-white">{stat.value}</p>
                          <p className="text-xs text-white/50 mt-0.5">{stat.label}</p>
                        </GlassCard>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Motivation */}
                {activeMode === 'motivation' && currentResponse.data.motivation && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-8 text-center relative overflow-hidden"
                  >
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-[#1A4D2E]/20 blur-3xl" />
                      <div className="absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full bg-[#4F8A8B]/10 blur-3xl" />
                    </div>

                    <div className="relative z-10">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="text-6xl mb-6"
                      >
                        🌍
                      </motion.div>

                      <p className="text-white text-xl leading-relaxed mb-8 max-w-2xl mx-auto">
                        &ldquo;{currentResponse.data.motivation.message}&rdquo;
                      </p>

                      <div className="inline-block px-6 py-4 rounded-2xl bg-[#4F8A8B]/15 border border-[#4F8A8B]/30 mb-8">
                        <p className="text-sm text-white/60 mb-1">Your Real-World Impact</p>
                        <p className="text-[#4F8A8B] font-bold text-lg">{currentResponse.data.motivation.impact}</p>
                      </div>

                      <blockquote className="text-white/50 text-sm italic border-l-2 border-[#4F8A8B]/40 pl-4 text-left max-w-lg mx-auto">
                        {currentResponse.data.motivation.quote}
                      </blockquote>
                    </div>
                  </motion.div>
                )}

                {/* Refresh button */}
                <div className="flex justify-center mt-6">
                  <motion.button
                    onClick={() => fetchInsight(activeMode)}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 text-white/70 hover:text-white hover:bg-white/5 transition-all text-sm"
                  >
                    <motion.span
                      animate={{ rotate: 0 }}
                      whileHover={{ rotate: 180 }}
                      transition={{ duration: 0.5 }}
                    >
                      🔄
                    </motion.span>
                    Regenerate with AI
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Past Insights */}
        {profile.aiInsights.length > 1 && (
          <div className="mt-12">
            <h2 className="text-white font-bold text-lg mb-4">Recent AI Insights</h2>
            <div className="space-y-3">
              {profile.aiInsights.slice(1, 6).map((insight, i) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card p-4 flex items-center gap-4"
                >
                  <span className="text-xl">
                    {coachModes.find((m) => m.id === insight.type)?.icon ?? '💡'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm">{insight.title}</p>
                    <p className="text-white/40 text-xs mt-0.5">
                      {new Date(insight.generatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
