'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import type { ShoppingData } from '@/types/carbon';

interface ShoppingStepProps {
  data: ShoppingData;
  onChange: (data: Partial<ShoppingData>) => void;
}

const recyclingOptions: Array<{ value: ShoppingData['recyclingHabits']; label: string; icon: string; desc: string }> = [
  { value: 'all', label: 'Everything', icon: '♻️', desc: 'Zero waste mindset' },
  { value: 'most', label: 'Most items', icon: '✅', desc: 'Paper, glass, plastic' },
  { value: 'some', label: 'Some items', icon: '⚠️', desc: 'Occasional recycler' },
  { value: 'none', label: 'Rarely', icon: '❌', desc: 'No recycling habit' },
];

export function ShoppingStep({ data, onChange }: ShoppingStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="space-y-8"
    >
      {/* Online Shopping */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <span>📦</span> Online orders per month
          </h3>
          <span className="text-[#4F8A8B] font-bold text-lg">{data.onlineShoppingPerMonth}</span>
        </div>
        <input
          type="range"
          min={0}
          max={30}
          step={1}
          value={data.onlineShoppingPerMonth}
          onChange={(e) => onChange({ onlineShoppingPerMonth: Number(e.target.value) })}
          className="w-full"
          aria-label="Online orders per month"
        />
        <div className="flex justify-between text-xs text-white/40 mt-1">
          <span>0 orders</span>
          <span>US avg: 4/mo</span>
          <span>30+</span>
        </div>
      </div>

      {/* Clothing Purchases */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <span>👕</span> New clothing items per year
          </h3>
          <span className="text-[#4F8A8B] font-bold text-lg">{data.clothingPurchasesPerYear}</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={data.clothingPurchasesPerYear}
          onChange={(e) => onChange({ clothingPurchasesPerYear: Number(e.target.value) })}
          className="w-full"
          aria-label="New clothing items per year"
        />
        <div className="flex justify-between text-xs text-white/40 mt-1">
          <span>0 items</span>
          <span>US avg: ~68 items</span>
          <span>100+</span>
        </div>
      </div>

      {/* Electronics */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <span>💻</span> New electronic devices per year
          </h3>
          <span className="text-[#4F8A8B] font-bold text-lg">{data.electronicsPerYear}</span>
        </div>
        <input
          type="range"
          min={0}
          max={10}
          step={1}
          value={data.electronicsPerYear}
          onChange={(e) => onChange({ electronicsPerYear: Number(e.target.value) })}
          className="w-full"
          aria-label="Electronic devices purchased per year"
        />
        <div className="flex justify-between text-xs text-white/40 mt-1">
          <span>0 devices</span>
          <span>5 devices</span>
          <span>10+</span>
        </div>
      </div>

      {/* Sustainable Brands */}
      <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5">
        <div>
          <p className="text-white font-semibold flex items-center gap-2">
            <span>🌿</span> Do you prioritize sustainable brands?
          </p>
          <p className="text-sm text-white/50 mt-0.5">B-Corp, fair trade, eco-certified products</p>
        </div>
        <motion.button
          onClick={() => onChange({ sustainableBrands: !data.sustainableBrands })}
          className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
            data.sustainableBrands ? 'bg-[#1A4D2E]' : 'bg-white/20'
          }`}
          aria-label="Toggle sustainable brands preference"
          role="switch"
          aria-checked={data.sustainableBrands}
        >
          <motion.div
            className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md"
            animate={{ x: data.sustainableBrands ? 28 : 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        </motion.button>
      </div>

      {/* Recycling */}
      <div>
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <span>♻️</span> How much do you recycle?
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {recyclingOptions.map((opt) => (
            <motion.button
              key={opt.value}
              onClick={() => onChange({ recyclingHabits: opt.value })}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`p-4 rounded-xl border text-center transition-all ${
                data.recyclingHabits === opt.value
                  ? 'border-[#4F8A8B] bg-[#4F8A8B]/20'
                  : 'border-white/10 bg-white/5 hover:border-white/30'
              }`}
            >
              <div className="text-2xl mb-2">{opt.icon}</div>
              <div className="text-sm font-semibold text-white">{opt.label}</div>
              <div className="text-xs text-white/40 mt-0.5">{opt.desc}</div>
            </motion.button>
          ))}
        </div>
      </div>

      <GlassCard className="p-4" variant="teal">
        <p className="text-sm text-[#4F8A8B] font-semibold mb-1">🛍️ Fast Fashion Impact</p>
        <p className="text-sm text-white/70">
          The fashion industry produces 10% of global CO₂ emissions. Buying 10 fewer clothing items
          per year saves ~250 kg of CO₂—equivalent to driving 700 miles less.
        </p>
      </GlassCard>
    </motion.div>
  );
}
