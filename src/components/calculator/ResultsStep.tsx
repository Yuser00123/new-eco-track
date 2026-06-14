'use client';

import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import {
  getCarbonRating,
  NATIONAL_AVERAGE_KG,
  getPercentileVsNational,
} from '@/lib/carbonCalculator';
import { getCategoryColor, getCategoryIcon } from '@/lib/utils';
import type { CarbonBreakdown } from '@/types/carbon';

interface ResultsStepProps {
  breakdown: CarbonBreakdown;
}

const RADIAN = Math.PI / 180;

interface CustomLabelProps {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
}

function CustomLabel({ cx = 0, cy = 0, midAngle = 0, innerRadius = 0, outerRadius = 0, percent = 0 }: CustomLabelProps) {
  if (percent < 0.05) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight="bold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

export function ResultsStep({ breakdown }: ResultsStepProps) {
  const rating = getCarbonRating(breakdown.total);
  const percentile = getPercentileVsNational(breakdown.total);
  const totalTons = breakdown.total / 1000;

  const pieData = [
    { name: 'Transport', value: breakdown.transport, color: getCategoryColor('transport') },
    { name: 'Energy', value: breakdown.energy, color: getCategoryColor('energy') },
    { name: 'Diet', value: breakdown.diet, color: getCategoryColor('diet') },
    { name: 'Shopping', value: breakdown.shopping, color: getCategoryColor('shopping') },
  ].filter((d) => d.value > 0);

  const categories = [
    { key: 'transport', label: 'Transport', value: breakdown.transport },
    { key: 'energy', label: 'Energy', value: breakdown.energy },
    { key: 'diet', label: 'Diet', value: breakdown.diet },
    { key: 'shopping', label: 'Shopping', value: breakdown.shopping },
  ];

  const maxCategory = categories.reduce((a, b) => (a.value > b.value ? a : b));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8"
    >
      {/* Score Hero */}
      <div className="text-center py-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="text-7xl mb-4"
        >
          {rating.emoji}
        </motion.div>
        <p className="text-white/60 text-sm uppercase tracking-widest mb-2">Your Carbon Footprint</p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-5xl sm:text-6xl font-bold text-white mb-1">
            <AnimatedCounter end={parseFloat(totalTons.toFixed(1))} decimals={1} suffix=" tons" />
          </p>
          <p className="text-white/50 text-sm">of CO₂ per year</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="inline-flex items-center gap-2 mt-4 px-5 py-2 rounded-full"
          style={{ background: `${rating.color}25`, border: `1px solid ${rating.color}50` }}
        >
          <span className="font-bold" style={{ color: rating.color }}>{rating.label}</span>
        </motion.div>

        {/* Comparison */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-4"
        >
          <span className={`text-sm font-medium ${percentile >= 0 ? 'text-green-400' : 'text-orange-400'}`}>
            {percentile >= 0
              ? `✓ ${percentile}% below the US national average`
              : `⚠️ ${Math.abs(percentile)}% above the US national average`}
          </span>
          <p className="text-xs text-white/40 mt-1">US National Average: {(NATIONAL_AVERAGE_KG / 1000).toFixed(1)} tons/year</p>
        </motion.div>
      </div>

      {/* Charts + Breakdown */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <GlassCard className="p-6">
          <h3 className="text-white font-semibold mb-4 text-center">Emissions by Category</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                labelLine={false}
                label={CustomLabel}
              >
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${(Number(value) / 1000).toFixed(2)} tons`, '']}
                contentStyle={{ background: 'rgba(15,25,35,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}
                labelStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-white/70">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                {d.name}
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Bar Breakdown */}
        <GlassCard className="p-6">
          <h3 className="text-white font-semibold mb-5">Category Breakdown</h3>
          <div className="space-y-5">
            {categories.map((cat) => (
              <div key={cat.key}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm text-white/80 flex items-center gap-1.5">
                    <span>{getCategoryIcon(cat.key)}</span>
                    {cat.label}
                  </span>
                  <span className="text-sm font-bold" style={{ color: getCategoryColor(cat.key) }}>
                    {(cat.value / 1000).toFixed(2)} tons
                  </span>
                </div>
                <ProgressBar
                  value={cat.value}
                  max={breakdown.total}
                  color="from-[#1A4D2E] to-[#4F8A8B]"
                  height="h-2.5"
                />
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Biggest Opportunity */}
      <GlassCard className="p-6 border-[#4F8A8B]/30" variant="teal">
        <div className="flex items-start gap-4">
          <div className="text-3xl">{getCategoryIcon(maxCategory.key)}</div>
          <div>
            <p className="text-sm text-[#4F8A8B] font-semibold mb-1">Your biggest opportunity</p>
            <h3 className="text-white font-bold text-lg capitalize mb-1">{maxCategory.label}</h3>
            <p className="text-white/70 text-sm">
              This is your highest-emission category at <strong>{(maxCategory.value / 1000).toFixed(2)} tons/year</strong>.
              Head to the Action Center for personalized tips to reduce your {maxCategory.label.toLowerCase()} footprint.
            </p>
          </div>
        </div>
      </GlassCard>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-2">
        <Link href="/dashboard" className="flex-1">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-[#1A4D2E] to-[#4F8A8B] text-white font-bold"
          >
            📊 View Full Dashboard
          </motion.button>
        </Link>
        <Link href="/actions" className="flex-1">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-6 py-4 rounded-2xl border border-white/20 text-white font-semibold hover:bg-white/5 transition-colors"
          >
            ⚡ See Actions to Reduce →
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}
