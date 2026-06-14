'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { TransportStep } from '@/components/calculator/TransportStep';
import { EnergyStep } from '@/components/calculator/EnergyStep';
import { DietStep } from '@/components/calculator/DietStep';
import { ShoppingStep } from '@/components/calculator/ShoppingStep';
import { ResultsStep } from '@/components/calculator/ResultsStep';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useEcoStore } from '@/store/ecoStore';
import { calculateCarbonFootprint } from '@/lib/carbonCalculator';
import type { CarbonBreakdown } from '@/types/carbon';

const steps = [
  { id: 'transport', title: 'Transport', icon: '🚗', description: 'How you get around' },
  { id: 'energy', title: 'Home Energy', icon: '⚡', description: 'Your home\'s footprint' },
  { id: 'diet', title: 'Diet', icon: '🥗', description: 'What you eat' },
  { id: 'shopping', title: 'Lifestyle', icon: '🛍️', description: 'Shopping habits' },
  { id: 'results', title: 'Results', icon: '📊', description: 'Your carbon score' },
];

export default function CalculatorPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [liveBreakdown, setLiveBreakdown] = useState<CarbonBreakdown | null>(null);
  const { calculatorInputs, setCalculatorInputs, submitCalculator, initializeStore } = useEcoStore();

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  useEffect(() => {
    const breakdown = calculateCarbonFootprint(calculatorInputs);
    setLiveBreakdown(breakdown);
  }, [calculatorInputs]);

  const handleNext = () => {
    if (currentStep === steps.length - 2) {
      // Submit before showing results
      submitCalculator();
    }
    setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setCurrentStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const stepProgress = ((currentStep + 1) / steps.length) * 100;
  const isResultsStep = currentStep === steps.length - 1;

  return (
    <div className="min-h-screen hero-gradient">
      <Navbar />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Carbon Footprint <span className="gradient-text">Calculator</span>
          </h1>
          <p className="text-white/60">
            Answer a few questions to discover your environmental impact
          </p>
        </motion.div>

        {/* Step Progress Bar */}
        <div className="mb-8">
          <ProgressBar
            value={stepProgress}
            height="h-1.5"
            animated
            color="from-[#1A4D2E] to-[#4F8A8B]"
          />
          <div className="flex justify-between mt-4">
            {steps.map((step, i) => (
              <div
                key={step.id}
                className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${
                  i <= currentStep ? 'opacity-100' : 'opacity-40'
                }`}
              >
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 text-lg transition-all ${
                    i < currentStep
                      ? 'bg-[#1A4D2E] border-[#4F8A8B]'
                      : i === currentStep
                      ? 'bg-[#4F8A8B]/30 border-[#4F8A8B] shadow-[0_0_15px_rgba(79,138,139,0.4)]'
                      : 'bg-white/5 border-white/20'
                  }`}
                  animate={i === currentStep ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {i < currentStep ? '✓' : step.icon}
                </motion.div>
                <span className="text-xs text-white/60 hidden sm:block">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Carbon Meter */}
        {!isResultsStep && liveBreakdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4 mb-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌍</span>
              <div>
                <p className="text-xs text-white/50 uppercase tracking-wider">Live Carbon Score</p>
                <p className="text-lg font-bold text-white">
                  {(liveBreakdown.total / 1000).toFixed(1)} tons CO₂/year
                </p>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <div className="flex gap-2 text-xs">
                {[
                  { k: 'T', v: liveBreakdown.transport, c: '#4F8A8B' },
                  { k: 'E', v: liveBreakdown.energy, c: '#f59e0b' },
                  { k: 'D', v: liveBreakdown.diet, c: '#22c55e' },
                  { k: 'S', v: liveBreakdown.shopping, c: '#a855f7' },
                ].map((item) => (
                  <div key={item.k} className="flex flex-col items-center">
                    <span className="font-bold" style={{ color: item.c }}>{item.k}</span>
                    <span className="text-white/50">{(item.v / 1000).toFixed(1)}t</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Step Content */}
        <div className="glass-card p-6 sm:p-8">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{steps[currentStep].icon}</span>
              <div>
                <h2 className="text-xl font-bold text-white">{steps[currentStep].title}</h2>
                <p className="text-sm text-white/50">{steps[currentStep].description}</p>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={currentStep}>
              {currentStep === 0 && (
                <TransportStep
                  data={calculatorInputs.transport}
                  onChange={(d) => setCalculatorInputs({ transport: { ...calculatorInputs.transport, ...d } })}
                />
              )}
              {currentStep === 1 && (
                <EnergyStep
                  data={calculatorInputs.energy}
                  onChange={(d) => setCalculatorInputs({ energy: { ...calculatorInputs.energy, ...d } })}
                />
              )}
              {currentStep === 2 && (
                <DietStep
                  data={calculatorInputs.diet}
                  onChange={(d) => setCalculatorInputs({ diet: { ...calculatorInputs.diet, ...d } })}
                />
              )}
              {currentStep === 3 && (
                <ShoppingStep
                  data={calculatorInputs.shopping}
                  onChange={(d) => setCalculatorInputs({ shopping: { ...calculatorInputs.shopping, ...d } })}
                />
              )}
              {currentStep === 4 && liveBreakdown && (
                <ResultsStep breakdown={liveBreakdown} />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {!isResultsStep && (
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/10">
              <motion.button
                onClick={handleBack}
                disabled={currentStep === 0}
                whileHover={currentStep > 0 ? { scale: 1.02 } : {}}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  currentStep === 0
                    ? 'opacity-30 cursor-not-allowed text-white/50'
                    : 'text-white border border-white/20 hover:bg-white/5'
                }`}
              >
                ← Back
              </motion.button>

              <span className="text-sm text-white/40">
                Step {currentStep + 1} of {steps.length - 1}
              </span>

              <motion.button
                onClick={handleNext}
                whileHover={{ scale: 1.03, boxShadow: '0 0 25px rgba(79,138,139,0.4)' }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 rounded-xl font-bold bg-gradient-to-r from-[#1A4D2E] to-[#4F8A8B] text-white shadow-lg"
              >
                {currentStep === steps.length - 2 ? '🧮 Calculate My Score' : 'Next →'}
              </motion.button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
