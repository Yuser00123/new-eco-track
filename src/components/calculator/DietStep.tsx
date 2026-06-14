'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import type { DietData } from '@/types/carbon';

interface DietStepProps {
  data: DietData;
  onChange: (data: Partial<DietData>) => void;
}

const meatOptions: Array<{
  value: DietData['meatConsumption'];
  label: string;
  icon: string;
  desc: string;
  co2: string;
  color: string;
}> = [
  { value: 'vegan', label: 'Vegan', icon: '🥦', desc: 'No animal products', co2: '700 kg/yr', color: '#22c55e' },
  { value: 'vegetarian', label: 'Vegetarian', icon: '🥗', desc: 'No meat', co2: '1,200 kg/yr', color: '#84cc16' },
  { value: 'low_meat', label: 'Low Meat', icon: '🐟', desc: '1-2 times/week', co2: '1,800 kg/yr', color: '#4F8A8B' },
  { value: 'medium_meat', label: 'Medium', icon: '🍗', desc: '3-5 times/week', co2: '2,500 kg/yr', color: '#f59e0b' },
  { value: 'high_meat', label: 'High Meat', icon: '🥩', desc: 'Daily meat eater', co2: '3,300 kg/yr', color: '#ef4444' },
];

const dairyOptions: Array<{ value: DietData['dairyConsumption']; label: string; icon: string }> = [
  { value: 'none', label: 'No dairy', icon: '🚫' },
  { value: 'low', label: 'Occasional', icon: '🥛' },
  { value: 'medium', label: 'Regular', icon: '🧀' },
  { value: 'high', label: 'Heavy dairy', icon: '🍦' },
];

const wasteOptions: Array<{ value: DietData['foodWasteLevel']; label: string; icon: string }> = [
  { value: 'none', label: 'Zero waste', icon: '♻️' },
  { value: 'low', label: 'Minimal', icon: '✅' },
  { value: 'medium', label: 'Average', icon: '⚠️' },
  { value: 'high', label: 'High waste', icon: '🗑️' },
];

export function DietStep({ data, onChange }: DietStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="space-y-8"
    >
      {/* Meat Consumption */}
      <div>
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <span>🍽️</span> How often do you eat meat?
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {meatOptions.map((opt) => (
            <motion.button
              key={opt.value}
              onClick={() => onChange({ meatConsumption: opt.value })}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`p-4 rounded-xl border text-center transition-all ${
                data.meatConsumption === opt.value
                  ? 'border-[#4F8A8B] bg-[#4F8A8B]/20 shadow-[0_0_15px_rgba(79,138,139,0.2)]'
                  : 'border-white/10 bg-white/5 hover:border-white/30'
              }`}
            >
              <div className="text-3xl mb-2">{opt.icon}</div>
              <div className="text-sm font-semibold text-white">{opt.label}</div>
              <div className="text-xs text-white/40 mt-0.5">{opt.desc}</div>
              <div
                className="text-xs font-medium mt-2 px-2 py-0.5 rounded-full inline-block"
                style={{ background: `${opt.color}25`, color: opt.color }}
              >
                {opt.co2}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Dairy */}
      <div>
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <span>🥛</span> Dairy consumption
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {dairyOptions.map((opt) => (
            <motion.button
              key={opt.value}
              onClick={() => onChange({ dairyConsumption: opt.value })}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`p-4 rounded-xl border text-center transition-all ${
                data.dairyConsumption === opt.value
                  ? 'border-[#4F8A8B] bg-[#4F8A8B]/20'
                  : 'border-white/10 bg-white/5 hover:border-white/30'
              }`}
            >
              <div className="text-2xl mb-1">{opt.icon}</div>
              <div className="text-xs text-white font-medium">{opt.label}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Local Food */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <span>🌾</span> How much food is locally sourced?
          </h3>
          <span className="text-[#4F8A8B] font-bold">{data.localFoodPercentage}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={data.localFoodPercentage}
          onChange={(e) => onChange({ localFoodPercentage: Number(e.target.value) })}
          className="w-full"
          aria-label="Percentage of locally sourced food"
        />
        <div className="flex justify-between text-xs text-white/40 mt-1">
          <span>All imported</span>
          <span>Mixed</span>
          <span>All local</span>
        </div>
      </div>

      {/* Food Waste */}
      <div>
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <span>🗑️</span> How much food do you waste?
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {wasteOptions.map((opt) => (
            <motion.button
              key={opt.value}
              onClick={() => onChange({ foodWasteLevel: opt.value })}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`p-4 rounded-xl border text-center transition-all ${
                data.foodWasteLevel === opt.value
                  ? 'border-[#4F8A8B] bg-[#4F8A8B]/20'
                  : 'border-white/10 bg-white/5 hover:border-white/30'
              }`}
            >
              <div className="text-2xl mb-1">{opt.icon}</div>
              <div className="text-xs text-white font-medium">{opt.label}</div>
            </motion.button>
          ))}
        </div>
      </div>

      <GlassCard className="p-4" variant="teal">
        <p className="text-sm text-[#4F8A8B] font-semibold mb-1">🌱 Food Impact</p>
        <p className="text-sm text-white/70">
          Switching from a high-meat diet to vegetarian saves ~2,100 kg CO₂ per year—
          the equivalent of not driving for 5 months!
        </p>
      </GlassCard>
    </motion.div>
  );
}
