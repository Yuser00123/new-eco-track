'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';

const features = [
  {
    icon: '🔍',
    pillar: 'UNDERSTAND',
    title: 'Know Your Impact',
    description: 'Complete our intelligent carbon calculator to discover exactly where your emissions come from—across transport, energy, diet, and lifestyle.',
    color: '#4F8A8B',
    items: ['AI-powered calculation', 'Category breakdown', 'National comparison'],
  },
  {
    icon: '📊',
    pillar: 'TRACK',
    title: 'Monitor Progress',
    description: 'Your personal analytics dashboard shows weekly trends, historical data, and projected improvements as you adopt greener habits.',
    color: '#22c55e',
    items: ['Real-time dashboard', 'Historical trends', 'Progress visualization'],
  },
  {
    icon: '⚡',
    pillar: 'REDUCE',
    title: 'Take Action',
    description: 'Get personalized recommendations from our AI coach and complete gamified eco-challenges that make sustainability fun and rewarding.',
    color: '#E8F3D6',
    items: ['AI recommendations', 'Eco challenges', 'Gamified rewards'],
  },
];

const benefitCards = [
  { icon: '🤖', title: 'AI-Powered Coaching', desc: 'Gemini AI analyzes your data and delivers hyper-personalized sustainability recommendations' },
  { icon: '🏆', title: 'Gamification System', desc: 'Earn badges, XP, and climb eco rankings as you complete actions and maintain streaks' },
  { icon: '📱', title: 'Works Offline', desc: 'Your data is stored locally—access your dashboard and insights anywhere, anytime' },
  { icon: '🔒', title: 'Privacy First', desc: 'No account required, no data sold. Your environmental journey stays completely private' },
  { icon: '🌍', title: 'Real Impact Data', desc: 'Every CO₂ saving is measured in real-world equivalents—trees planted, miles offset' },
  { icon: '♻️', title: 'Actionable Steps', desc: 'Not just awareness—concrete, practical actions with estimated CO₂ savings for each' },
];

export function FeaturesSection() {
  return (
    <>
      {/* Feature Pillars */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="features">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#4F8A8B] font-semibold text-sm uppercase tracking-widest mb-3">The EcoTrack System</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Your Sustainability Journey in{' '}
            <span className="gradient-text">3 Simple Steps</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            A complete ecosystem designed to turn environmental awareness into lasting positive habits.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <GlassCard
              key={feature.pillar}
              hover
              className="p-8 group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <div className="mb-6">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4"
                  style={{ background: `${feature.color}20`, color: feature.color }}
                >
                  {feature.pillar}
                </div>
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{feature.description}</p>
              </div>
              <ul className="space-y-2">
                {feature.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-white/70">
                    <span style={{ color: feature.color }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              {/* Hover glow effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: `radial-gradient(circle at 50% 50%, ${feature.color}15, transparent 70%)` }}
              />
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-[#4F8A8B] font-semibold text-sm uppercase tracking-widest mb-3">Why EcoTrack</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Built for{' '}
            <span className="gradient-text">Real Impact</span>
          </h2>
          <p className="text-white/60 max-w-xl mx-auto">
            Every feature is designed with one goal: helping you live more sustainably without sacrificing convenience.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefitCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="glass-card p-6 group cursor-default"
            >
              <div className="text-3xl mb-3">{card.icon}</div>
              <h3 className="font-bold text-white mb-2">{card.title}</h3>
              <p className="text-sm text-white/60 leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-10 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A4D2E]/20 to-[#4F8A8B]/20 pointer-events-none" />
          <p className="text-[#4F8A8B] font-semibold text-sm uppercase tracking-widest mb-4">Real-World Impact</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-10">
            Why Carbon Awareness Matters
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { num: '4.7', unit: 'Tons', label: 'Global average CO₂ per person per year to stay under 1.5°C', icon: '🎯' },
              { num: '14.5', unit: 'Tons', label: 'Average US carbon footprint — 3x the sustainable level', icon: '🇺🇸' },
              { num: '1B+', unit: 'People', label: 'Could be displaced by climate change by 2050 without action', icon: '⚠️' },
            ].map((s) => (
              <div key={s.label} className="relative z-10">
                <div className="text-4xl mb-2">{s.icon}</div>
                <p className="text-3xl font-bold text-white">{s.num} <span className="text-[#4F8A8B]">{s.unit}</span></p>
                <p className="text-sm text-white/60 mt-2">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </>
  );
}
