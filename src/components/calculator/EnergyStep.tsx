'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import type { EnergyData } from '@/types/carbon';

interface EnergyStepProps {
  data: EnergyData;
  onChange: (data: Partial<EnergyData>) => void;
}

const gasLevels: Array<{ value: EnergyData['naturalGasUsage']; label: string; icon: string }> = [
  { value: 'none', label: 'No Gas', icon: '🚫' },
  { value: 'low', label: 'Low', icon: '🔵' },
  { value: 'medium', label: 'Medium', icon: '🟡' },
  { value: 'high', label: 'High', icon: '🔴' },
];

const heatingTypes: Array<{ value: EnergyData['heatingType']; label: string; icon: string; color: string }> = [
  { value: 'renewable', label: 'Renewable', icon: '☀️', color: '#22c55e' },
  { value: 'electric', label: 'Electric', icon: '⚡', color: '#4F8A8B' },
  { value: 'gas', label: 'Gas', icon: '🔥', color: '#f59e0b' },
  { value: 'oil', label: 'Oil', icon: '🛢️', color: '#ef4444' },
];

const applianceTypes: Array<{ value: EnergyData['applianceEfficiency']; label: string; icon: string; stars: number }> = [
  { value: 'very_efficient', label: 'A+++ Rated', icon: '⭐', stars: 4 },
  { value: 'efficient', label: 'A+ Rated', icon: '⭐', stars: 3 },
  { value: 'average', label: 'Average', icon: '⭐', stars: 2 },
  { value: 'old', label: 'Old/Inefficient', icon: '⭐', stars: 1 },
];

export function EnergyStep({ data, onChange }: EnergyStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="space-y-8"
    >
      {/* Electricity usage */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <span>⚡</span> Monthly electricity usage (kWh)
          </h3>
          <span className="text-[#4F8A8B] font-bold text-lg">{data.electricityKwhPerMonth} kWh</span>
        </div>
        <input
          type="range"
          min={50}
          max={3000}
          step={50}
          value={data.electricityKwhPerMonth}
          onChange={(e) => onChange({ electricityKwhPerMonth: Number(e.target.value) })}
          className="w-full"
          aria-label="Monthly electricity usage in kWh"
        />
        <div className="flex justify-between text-xs text-white/40 mt-1">
          <span>50 kWh</span>
          <span>US avg: 877 kWh</span>
          <span>3000 kWh</span>
        </div>
      </div>

      {/* Renewable Energy Toggle */}
      <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5">
        <div>
          <p className="text-white font-semibold flex items-center gap-2">
            <span>🌞</span> Renewable energy plan
          </p>
          <p className="text-sm text-white/50 mt-0.5">Solar, wind, or green energy tariff</p>
        </div>
        <motion.button
          onClick={() => onChange({ hasRenewableEnergy: !data.hasRenewableEnergy })}
          className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
            data.hasRenewableEnergy ? 'bg-[#1A4D2E]' : 'bg-white/20'
          }`}
          aria-label="Toggle renewable energy"
          role="switch"
          aria-checked={data.hasRenewableEnergy}
        >
          <motion.div
            className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md"
            animate={{ x: data.hasRenewableEnergy ? 28 : 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        </motion.button>
      </div>

      {/* Natural Gas Usage */}
      <div>
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <span>🔥</span> Natural gas / heating usage
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {gasLevels.map((level) => (
            <motion.button
              key={level.value}
              onClick={() => onChange({ naturalGasUsage: level.value })}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`p-4 rounded-xl border text-center transition-all ${
                data.naturalGasUsage === level.value
                  ? 'border-[#4F8A8B] bg-[#4F8A8B]/20'
                  : 'border-white/10 bg-white/5 hover:border-white/30'
              }`}
            >
              <div className="text-2xl mb-1">{level.icon}</div>
              <div className="text-sm text-white font-medium">{level.label}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Heating Type */}
      <div>
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <span>🏠</span> Primary heating source
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {heatingTypes.map((type) => (
            <motion.button
              key={type.value}
              onClick={() => onChange({ heatingType: type.value })}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`p-4 rounded-xl border text-center transition-all ${
                data.heatingType === type.value
                  ? 'border-[#4F8A8B] bg-[#4F8A8B]/20'
                  : 'border-white/10 bg-white/5 hover:border-white/30'
              }`}
            >
              <div className="text-2xl mb-1">{type.icon}</div>
              <div className="text-sm text-white font-medium">{type.label}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Appliance Efficiency */}
      <div>
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <span>🏷️</span> Home appliance efficiency
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {applianceTypes.map((type) => (
            <motion.button
              key={type.value}
              onClick={() => onChange({ applianceEfficiency: type.value })}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-xl border text-left transition-all flex items-center gap-3 ${
                data.applianceEfficiency === type.value
                  ? 'border-[#4F8A8B] bg-[#4F8A8B]/20'
                  : 'border-white/10 bg-white/5 hover:border-white/30'
              }`}
            >
              <div className="text-2xl">{type.icon}</div>
              <div>
                <div className="text-sm text-white font-medium">{type.label}</div>
                <div className="flex gap-0.5 mt-1">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${i < type.stars ? 'bg-[#4F8A8B]' : 'bg-white/20'}`}
                    />
                  ))}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <GlassCard className="p-4" variant="teal">
        <p className="text-sm text-[#4F8A8B] font-semibold mb-1">💡 Quick Win</p>
        <p className="text-sm text-white/70">
          Switching to a 100% renewable energy plan is one of the single biggest steps you can take—
          it can reduce your home energy emissions by up to 80%.
        </p>
      </GlassCard>
    </motion.div>
  );
}
