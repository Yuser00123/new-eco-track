'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export function CTASection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center glass-card p-12 relative overflow-hidden"
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-[#1A4D2E]/30 blur-3xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full bg-[#4F8A8B]/20 blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          />
        </div>

        <div className="relative z-10">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-6xl mb-6 inline-block"
          >
            🌍
          </motion.div>

          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Make Your{' '}
            <span className="gradient-text">Carbon Footprint Count</span>
            ?
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
            Join 2.8 million people already taking action. Calculate your footprint in 60 seconds
            and get AI-powered insights to reduce your impact starting today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/calculator">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(79, 138, 139, 0.6)' }}
                whileTap={{ scale: 0.97 }}
                className="px-10 py-4 rounded-2xl bg-gradient-to-r from-[#1A4D2E] to-[#4F8A8B] text-white font-bold text-lg shadow-xl"
              >
                🚀 Start Free — No Sign-Up Required
              </motion.button>
            </Link>
            <Link href="/actions">
              <motion.button
                whileHover={{ scale: 1.03 }}
                className="px-10 py-4 rounded-2xl border border-white/20 text-white font-semibold text-lg hover:bg-white/5 transition-colors"
              >
                Browse Eco Actions →
              </motion.button>
            </Link>
          </div>

          <div className="flex justify-center gap-8 mt-10 flex-wrap">
            {['No account needed', 'Privacy focused', '100% free', 'Works offline'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-white/60">
                <span className="text-[#4F8A8B]">✓</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
