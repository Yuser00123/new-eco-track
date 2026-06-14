'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import type { TransportData } from '@/types/carbon';

interface TransportStepProps {
  data: TransportData;
  onChange: (data: Partial<TransportData>) => void;
}

const fuelOptions: Array<{ value: TransportData['fuelType']; label: string; icon: string; desc: string; color: string }> = [
  { value: 'none', label: 'No Car', icon: '🚶', desc: 'I don\'t drive', color: '#22c55e' },
  { value: 'electric', label: 'Electric', icon: '⚡', desc: 'EV / Tesla', color: '#4F8A8B' },
  { value: 'hybrid', label: 'Hybrid', icon: '🔋', desc: 'Partial electric', color: '#84cc16' },
  { value: 'gasoline', label: 'Gasoline', icon: '⛽', desc: 'Regular petrol', color: '#f59e0b' },
  { value: 'diesel', label: 'Diesel', icon: '🛢️', desc: 'Diesel engine', color: '#ef4444' },
];

export function TransportStep({ data, onChange }: TransportStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="space-y-8"
    >
      {/* Vehicle Type */}
      <div>
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <span>🚗</span> What type of vehicle do you drive?
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {fuelOptions.map((opt) => (
            <motion.button
              key={opt.value}
              onClick={() => onChange({ fuelType: opt.value })}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`p-4 rounded-xl border text-center transition-all duration-200 ${
                data.fuelType === opt.value
                  ? 'border-[#4F8A8B] bg-[#4F8A8B]/20 shadow-[0_0_15px_rgba(79,138,139,0.3)]'
                  : 'border-white/10 bg-white/5 hover:border-white/30'
              }`}
            >
              <div className="text-3xl mb-2">{opt.icon}</div>
              <div className="text-sm font-semibold text-white">{opt.label}</div>
              <div className="text-xs text-white/50 mt-0.5">{opt.desc}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Miles per week */}
      {data.fuelType !== 'none' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <span>📍</span> Miles driven per week
            </h3>
            <span className="text-[#4F8A8B] font-bold text-lg">{data.carMilesPerWeek} mi</span>
          </div>
          <input
            type="range"
            min={0}
            max={500}
            step={10}
            value={data.carMilesPerWeek}
            onChange={(e) => onChange({ carMilesPerWeek: Number(e.target.value) })}
            className="w-full"
            aria-label="Miles driven per week"
          />
          <div className="flex justify-between text-xs text-white/40 mt-1">
            <span>0 mi</span>
            <span>250 mi</span>
            <span>500 mi</span>
          </div>
        </motion.div>
      )}

      {/* Public Transport */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <span>🚌</span> Public transport hours per week
          </h3>
          <span className="text-[#4F8A8B] font-bold text-lg">{data.publicTransportHoursPerWeek} hrs</span>
        </div>
        <input
          type="range"
          min={0}
          max={40}
          step={1}
          value={data.publicTransportHoursPerWeek}
          onChange={(e) => onChange({ publicTransportHoursPerWeek: Number(e.target.value) })}
          className="w-full"
          aria-label="Public transport hours per week"
        />
        <div className="flex justify-between text-xs text-white/40 mt-1">
          <span>None</span>
          <span>20 hrs</span>
          <span>40 hrs</span>
        </div>
      </div>

      {/* Flights */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <span>✈️</span> Total flights per year
            </h3>
            <span className="text-[#4F8A8B] font-bold">{data.flightsPerYear}</span>
          </div>
          <input
            type="range"
            min={0}
            max={30}
            step={1}
            value={data.flightsPerYear}
            onChange={(e) => {
              const v = Number(e.target.value);
              onChange({
                flightsPerYear: v,
                longHaulFlights: Math.min(data.longHaulFlights, v),
              });
            }}
            className="w-full"
            aria-label="Flights per year"
          />
          <div className="flex justify-between text-xs text-white/40 mt-1">
            <span>0</span>
            <span>15</span>
            <span>30+</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <span>🌏</span> Long-haul flights (of those)
            </h3>
            <span className="text-[#4F8A8B] font-bold">{data.longHaulFlights}</span>
          </div>
          <input
            type="range"
            min={0}
            max={Math.max(data.flightsPerYear, 1)}
            step={1}
            value={data.longHaulFlights}
            onChange={(e) => onChange({ longHaulFlights: Number(e.target.value) })}
            className="w-full"
            aria-label="Long-haul flights per year"
          />
          <div className="flex justify-between text-xs text-white/40 mt-1">
            <span>0</span>
            <span>{Math.floor(data.flightsPerYear / 2)}</span>
            <span>{data.flightsPerYear}</span>
          </div>
        </div>
      </div>

      {/* Eco Tips */}
      <GlassCard className="p-4" variant="teal">
        <p className="text-sm text-[#4F8A8B] font-semibold mb-1">💡 Did you know?</p>
        <p className="text-sm text-white/70">
          A single round-trip transatlantic flight produces ~1.6 tons of CO₂—equivalent to 3 months of driving!
          Even one fewer long-haul flight per year makes a massive difference.
        </p>
      </GlassCard>
    </motion.div>
  );
}
