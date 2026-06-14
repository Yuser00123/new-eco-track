'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

// Floating particle component
function Particle({ delay, x, y, size }: { delay: number; x: string; y: string; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-[#4F8A8B]/20 blur-sm"
      style={{ left: x, top: y, width: size, height: size }}
      animate={{
        y: [0, -20, 0],
        opacity: [0.3, 0.7, 0.3],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 4 + delay,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
    />
  );
}

// Animated Globe SVG
function AnimatedGlobe() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Outer glow rings */}
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-[#4F8A8B]/20"
          style={{
            width: `${100 + i * 60}px`,
            height: `${100 + i * 60}px`,
          }}
          animate={{ rotate: 360 * (i % 2 === 0 ? 1 : -1) }}
          transition={{ duration: 10 + i * 5, repeat: Infinity, ease: 'linear' }}
        />
      ))}

      {/* Globe */}
      <motion.div
        className="relative w-48 h-48 md:w-64 md:h-64"
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
          <defs>
            <radialGradient id="globeGrad" cx="35%" cy="35%">
              <stop offset="0%" stopColor="#4F8A8B" stopOpacity="0.9" />
              <stop offset="40%" stopColor="#1A4D2E" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#0F1923" stopOpacity="1" />
            </radialGradient>
            <radialGradient id="shineGrad" cx="30%" cy="30%">
              <stop offset="0%" stopColor="white" stopOpacity="0.2" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
            <clipPath id="globeClip">
              <circle cx="100" cy="100" r="90" />
            </clipPath>
          </defs>

          {/* Globe base */}
          <circle cx="100" cy="100" r="90" fill="url(#globeGrad)" />

          {/* Grid lines */}
          <g clipPath="url(#globeClip)" stroke="#4F8A8B" strokeWidth="0.5" strokeOpacity="0.3" fill="none">
            {/* Latitude lines */}
            {[-60, -30, 0, 30, 60].map((lat) => {
              const y = 100 + (lat / 90) * 90;
              const r = Math.sqrt(90 * 90 - (y - 100) * (y - 100));
              return r > 0 ? <ellipse key={lat} cx="100" cy={y} rx={r} ry={r * 0.3} /> : null;
            })}
            {/* Longitude lines */}
            {[0, 30, 60, 90, 120, 150].map((lon) => (
              <ellipse key={lon} cx="100" cy="100" rx={Math.abs(Math.cos((lon * Math.PI) / 180)) * 90 + 1} ry="90" />
            ))}
          </g>

          {/* Continents (simplified) */}
          <g clipPath="url(#globeClip)" fill="#22c55e" fillOpacity="0.4">
            <ellipse cx="75" cy="80" rx="25" ry="30" />
            <ellipse cx="120" cy="70" rx="35" ry="25" />
            <ellipse cx="115" cy="120" rx="20" ry="15" />
            <ellipse cx="60" cy="125" rx="10" ry="20" />
          </g>

          {/* Shine */}
          <circle cx="100" cy="100" r="90" fill="url(#shineGrad)" />

          {/* Glowing dots */}
          {[[70, 75], [120, 65], [115, 120], [85, 110]].map(([cx, cy], i) => (
            <motion.circle
              key={i}
              cx={cx}
              cy={cy}
              r="3"
              fill="#4F8A8B"
              animate={{ opacity: [0.5, 1, 0.5], r: [2, 4, 2] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
            />
          ))}
        </svg>
      </motion.div>

      {/* Orbit dots */}
      {[
        { angle: 0, label: '🌱', delay: 0 },
        { angle: 90, label: '♻️', delay: 0.5 },
        { angle: 180, label: '💧', delay: 1 },
        { angle: 270, label: '☀️', delay: 1.5 },
      ].map(({ angle, label, delay }) => (
        <motion.div
          key={angle}
          className="absolute"
          style={{
            left: '50%',
            top: '50%',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear', delay }}
        >
          <div
            className="absolute flex items-center justify-center w-8 h-8 rounded-full bg-white/10 backdrop-blur text-base border border-white/20"
            style={{
              left: `${Math.cos((angle * Math.PI) / 180) * 140 - 16}px`,
              top: `${Math.sin((angle * Math.PI) / 180) * 140 - 16}px`,
            }}
          >
            {label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient pt-16">
      {/* Background particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[
          { delay: 0, x: '10%', y: '20%', size: 6 },
          { delay: 1, x: '80%', y: '10%', size: 8 },
          { delay: 2, x: '20%', y: '70%', size: 5 },
          { delay: 0.5, x: '70%', y: '60%', size: 10 },
          { delay: 1.5, x: '50%', y: '15%', size: 7 },
          { delay: 3, x: '90%', y: '40%', size: 6 },
          { delay: 2.5, x: '30%', y: '85%', size: 9 },
        ].map((p, i) => (
          <Particle key={i} {...p} />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left: Text Content */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1A4D2E]/40 border border-[#4F8A8B]/30 text-sm text-[#4F8A8B] font-medium mb-6">
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🌍
                </motion.span>
                Climate Action Platform
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6"
            >
              Track Your{' '}
              <span className="gradient-text">Carbon Footprint</span>
              {' '}& Build a{' '}
              <span className="text-[#E8F3D6]">Greener Future</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg text-white/70 mb-8 max-w-xl mx-auto lg:mx-0"
            >
              Understand your environmental impact, take personalized eco actions, and join
              millions working toward a sustainable planet—powered by AI insights.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link href="/calculator">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(79, 138, 139, 0.5)' }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#1A4D2E] to-[#4F8A8B] text-white font-bold text-lg shadow-lg"
                >
                  🧮 Calculate Your Impact in 60 Seconds
                </motion.button>
              </Link>
              <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 rounded-2xl border border-white/20 text-white font-semibold text-lg backdrop-blur hover:bg-white/5 transition-colors"
                >
                  View Dashboard →
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-6 mt-10 justify-center lg:justify-start"
            >
              {[
                { value: 2847392, label: 'Users', suffix: '+', prefix: '' },
                { value: 14.2, label: 'Tons Saved', suffix: 'M', prefix: '', decimals: 1 },
                { value: 97, label: 'Satisfaction', suffix: '%', prefix: '' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-bold text-white">
                    <AnimatedCounter
                      end={stat.value}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                      decimals={stat.decimals ?? 0}
                    />
                  </p>
                  <p className="text-sm text-white/50">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Globe */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative h-[400px] md:h-[500px]"
          >
            <AnimatedGlobe />
          </motion.div>
        </div>

        {/* Live Counter */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 glass-card p-6 text-center max-w-2xl mx-auto"
        >
          <p className="text-white/60 text-sm mb-2">🌍 Live Counter — Carbon Saved by EcoTrack Users</p>
          <p className="text-3xl sm:text-4xl font-bold text-white">
            <AnimatedCounter
              end={14247832}
              suffix=" kg CO₂"
              duration={3000}
            />
          </p>
          <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#1A4D2E] to-[#4F8A8B]"
              initial={{ width: '60%' }}
              animate={{ width: '73%' }}
              transition={{ duration: 3, ease: 'easeOut' }}
            />
          </div>
          <p className="text-xs text-white/40 mt-2">Updated in real-time · 2,847,392 users contributing</p>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
          <div className="w-1 h-3 rounded-full bg-white/50" />
        </div>
      </motion.div>
    </section>
  );
}
