'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { GlassCard } from '@/components/ui/GlassCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { BadgeCard } from '@/components/ui/Badge';
import { useEcoStore } from '@/store/ecoStore';
import { getCarbonRating, NATIONAL_AVERAGE_KG } from '@/lib/carbonCalculator';
import { getCategoryColor, getCategoryIcon, formatCO2 } from '@/lib/utils';
import { getEcoRank, } from '@/lib/badges';
import { calculateLevelProgress } from '@/lib/utils';

const CATEGORY_COLORS = {
  transport: '#4F8A8B',
  energy: '#f59e0b',
  diet: '#22c55e',
  shopping: '#a855f7',
};

export default function DashboardPage() {
  const { profile, initializeStore } = useEcoStore();

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  const { carbonScore, history, badges, xp, streak, totalCO2Saved, completedActions } = profile;
  const { rank, nextRank, xpToNext } = getEcoRank(xp);
  const levelProgress = calculateLevelProgress(xp);

  const hasCarbonScore = carbonScore !== null;

  const breakdown = carbonScore?.breakdown;
  const totalTons = breakdown ? breakdown.total / 1000 : 0;
  const rating = breakdown ? getCarbonRating(breakdown.total) : null;
  const percentile = carbonScore?.percentileVsNational ?? 0;

  const pieData = breakdown
    ? [
        { name: 'Transport', value: breakdown.transport, color: CATEGORY_COLORS.transport },
        { name: 'Energy', value: breakdown.energy, color: CATEGORY_COLORS.energy },
        { name: 'Diet', value: breakdown.diet, color: CATEGORY_COLORS.diet },
        { name: 'Shopping', value: breakdown.shopping, color: CATEGORY_COLORS.shopping },
      ]
    : [];

  const chartData = history.slice(-30).map((h) => ({
    date: new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: h.footprintKg,
  }));

  const earnedBadges = badges.filter((b) => b.earned);
  const unearnedBadges = badges.filter((b) => !b.earned).slice(0, 4);

  const statsCards = [
    {
      icon: '💨',
      label: 'Total CO₂ Reduced',
      value: formatCO2(totalCO2Saved),
      sub: 'since joining',
      color: '#22c55e',
    },
    {
      icon: '🔥',
      label: 'Current Streak',
      value: `${streak} days`,
      sub: 'keep it up!',
      color: '#f97316',
    },
    {
      icon: '⚡',
      label: 'XP Earned',
      value: xp.toLocaleString(),
      sub: rank,
      color: '#eab308',
    },
    {
      icon: '🏆',
      label: 'Badges Earned',
      value: `${earnedBadges.length}/${badges.length}`,
      sub: 'achievements',
      color: '#a855f7',
    },
  ];

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
            Your <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-white/60">Track your sustainability journey and progress</p>
        </motion.div>

        {/* No carbon score banner */}
        {!hasCarbonScore && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 mb-8 border-[#4F8A8B]/40 text-center"
          >
            <p className="text-2xl mb-2">🧮</p>
            <h3 className="text-white font-bold text-lg mb-1">Calculate your carbon footprint first!</h3>
            <p className="text-white/60 text-sm mb-4">Complete the calculator to unlock your personalized dashboard.</p>
            <Link href="/calculator">
              <motion.button
                whileHover={{ scale: 1.03 }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#1A4D2E] to-[#4F8A8B] text-white font-bold"
              >
                Start Calculator →
              </motion.button>
            </Link>
          </motion.div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsCards.map((card, i) => (
            <GlassCard
              key={card.label}
              hover
              className="p-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{card.icon}</span>
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: card.color, boxShadow: `0 0 6px ${card.color}` }}
                />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-white">{card.value}</p>
              <p className="text-xs text-white/50 mt-0.5">{card.label}</p>
              <p className="text-xs mt-1" style={{ color: card.color }}>{card.sub}</p>
            </GlassCard>
          ))}
        </div>

        {/* Carbon Score + Donut */}
        {hasCarbonScore && breakdown && rating && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Score Card */}
            <GlassCard
              className="p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-white font-bold mb-5 text-lg">Your Carbon Score</h2>

              <div className="flex items-center gap-6 mb-6">
                <motion.div
                  className="text-5xl"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  {rating.emoji}
                </motion.div>
                <div>
                  <p className="text-4xl font-bold text-white">
                    <AnimatedCounter end={parseFloat(totalTons.toFixed(1))} decimals={1} suffix="t" />
                  </p>
                  <p className="text-white/50 text-sm">CO₂/year</p>
                  <span
                    className="text-xs px-3 py-1 rounded-full font-bold mt-2 inline-block"
                    style={{ background: `${rating.color}25`, color: rating.color }}
                  >
                    {rating.label}
                  </span>
                </div>
              </div>

              {/* vs National Average */}
              <div className="mb-5">
                <p className="text-sm text-white/60 mb-3">vs. US National Average (14.5t)</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70 flex items-center gap-1">
                      {getCategoryIcon('transport')} You
                    </span>
                    <span className="font-bold" style={{ color: rating.color }}>
                      {totalTons.toFixed(1)}t
                    </span>
                  </div>
                  <ProgressBar
                    value={breakdown.total}
                    max={NATIONAL_AVERAGE_KG * 1.5}
                    color="from-[#1A4D2E] to-[#4F8A8B]"
                    height="h-2"
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">🇺🇸 National Avg</span>
                    <span className="text-white/70 font-bold">14.5t</span>
                  </div>
                  <ProgressBar
                    value={NATIONAL_AVERAGE_KG}
                    max={NATIONAL_AVERAGE_KG * 1.5}
                    color="from-orange-500 to-red-500"
                    height="h-2"
                  />
                </div>
              </div>

              <div
                className={`p-3 rounded-xl text-sm font-medium ${
                  percentile >= 0
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                    : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                }`}
              >
                {percentile >= 0
                  ? `✓ You emit ${percentile}% less than the average American`
                  : `⚠️ You emit ${Math.abs(percentile)}% more than the average American`}
              </div>
            </GlassCard>

            {/* Donut Chart */}
            <GlassCard
              className="p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-white font-bold mb-4 text-lg">Emissions Breakdown</h2>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    animationBegin={200}
                    animationDuration={1200}
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${(Number(value) / 1000).toFixed(2)} tons`, '']}
                    contentStyle={{ background: 'rgba(15,25,35,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-2 gap-2 mt-2">
                {pieData.map((d) => (
                  <div key={d.name} className="flex items-center gap-2 text-sm">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                    <span className="text-white/70">{d.name}</span>
                    <span className="ml-auto font-semibold text-white text-xs">
                      {(d.value / 1000).toFixed(1)}t
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        )}

        {/* Historical Trend */}
        <GlassCard
          className="p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white font-bold text-lg">30-Day Carbon Trend</h2>
            <span className="text-xs text-[#4F8A8B] bg-[#4F8A8B]/10 px-3 py-1 rounded-full">
              Daily kg CO₂
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F8A8B" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4F8A8B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="date"
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                interval={6}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{ background: 'rgba(15,25,35,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}
                labelStyle={{ color: '#fff' }}
                formatter={(value) => [`${value} kg CO₂`, 'Daily footprint']}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#4F8A8B"
                strokeWidth={2}
                fill="url(#trendGradient)"
                dot={false}
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Bottom Row: XP + Badges */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* XP Progress */}
          <GlassCard
            className="p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-white font-bold text-lg mb-5">Eco Rank Progress</h2>

            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1A4D2E] to-[#4F8A8B] flex items-center justify-center">
                <span className="text-2xl">🌿</span>
              </div>
              <div>
                <p className="text-white font-bold text-xl">{rank}</p>
                <p className="text-white/50 text-sm">{xp.toLocaleString()} XP total</p>
                {xpToNext > 0 && (
                  <p className="text-[#4F8A8B] text-xs mt-0.5">{xpToNext} XP to {nextRank}</p>
                )}
              </div>
            </div>

            <ProgressBar
              value={levelProgress}
              label={`Progress to ${nextRank}`}
              showValue
              color="from-[#1A4D2E] to-[#4F8A8B]"
              height="h-3"
            />

            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-xl bg-white/5 text-center">
                <p className="text-2xl font-bold text-white">{completedActions.length}</p>
                <p className="text-white/50 text-xs mt-0.5">Actions Done</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 text-center">
                <p className="text-2xl font-bold text-[#22c55e]">{formatCO2(totalCO2Saved)}</p>
                <p className="text-white/50 text-xs mt-0.5">CO₂ Saved</p>
              </div>
            </div>
          </GlassCard>

          {/* Badges */}
          <GlassCard
            className="p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-white font-bold text-lg">Achievements</h2>
              <span className="text-xs text-white/50">{earnedBadges.length} earned</span>
            </div>

            {earnedBadges.length > 0 ? (
              <div className="grid grid-cols-4 gap-2 mb-4">
                {earnedBadges.map((badge, i) => (
                  <BadgeCard key={badge.id} badge={badge} size="sm" showDetails={false} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-white/40 text-sm mb-4">
                <p className="text-3xl mb-2">🎯</p>
                Complete actions to earn badges!
              </div>
            )}

            {unearnedBadges.length > 0 && (
              <div>
                <p className="text-xs text-white/40 mb-2 uppercase tracking-wider">Next to unlock</p>
                <div className="grid grid-cols-4 gap-2">
                  {unearnedBadges.map((badge, i) => (
                    <BadgeCard key={badge.id} badge={badge} size="sm" showDetails={false} index={i} />
                  ))}
                </div>
              </div>
            )}

            <Link href="/actions">
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="w-full mt-4 py-3 rounded-xl border border-white/10 text-white/70 text-sm hover:bg-white/5 transition-colors"
              >
                Complete Actions to Unlock More →
              </motion.button>
            </Link>
          </GlassCard>
        </div>

        {/* Category breakdown bars (if score exists) */}
        {hasCarbonScore && breakdown && (
          <GlassCard
            className="p-6 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="text-white font-bold text-lg mb-5">Category Analysis</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {Object.entries({
                transport: breakdown.transport,
                energy: breakdown.energy,
                diet: breakdown.diet,
                shopping: breakdown.shopping,
              }).map(([key, value]) => (
                <div key={key} className="p-4 rounded-xl bg-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-white flex items-center gap-2">
                      {getCategoryIcon(key)}
                      <span className="capitalize font-medium">{key}</span>
                    </span>
                    <span className="font-bold text-sm" style={{ color: getCategoryColor(key) }}>
                      {(value / 1000).toFixed(2)} tons
                    </span>
                  </div>
                  <ProgressBar
                    value={value}
                    max={breakdown.total}
                    animated
                    height="h-2"
                    color="from-[#1A4D2E] to-[#4F8A8B]"
                  />
                  <p className="text-xs text-white/40 mt-1.5">
                    {Math.round((value / breakdown.total) * 100)}% of your total footprint
                  </p>
                </div>
              ))}
            </div>
          </GlassCard>
        )}
      </main>
    </div>
  );
}
