'use client';

import { create } from 'zustand';
import type {
  UserProfile,
  CarbonInputs,
  CarbonScore,
  EcoAction,
  AIInsight,
} from '@/types/carbon';
import {
  loadUserProfile,
  saveUserProfile,
  updateStreak,
  completeAction as completeActionLocal,
  checkAndAwardBadges,
} from '@/lib/localStorage';
import {
  calculateCarbonFootprint,
  getPercentileVsNational,
  getDefaultInputs,
} from '@/lib/carbonCalculator';
import { generateWeeklyChallenges, generateHistoricalData } from '@/lib/actions';

interface EcoStore {
  profile: UserProfile;
  isLoaded: boolean;
  currentStep: number;
  calculatorInputs: CarbonInputs;

  // Actions
  initializeStore: () => void;
  setCalculatorInputs: (inputs: Partial<CarbonInputs>) => void;
  submitCalculator: () => void;
  completeAction: (action: EcoAction) => void;
  addAIInsight: (insight: AIInsight) => void;
  resetCalculator: () => void;
}

export const useEcoStore = create<EcoStore>((set, get) => ({
  profile: loadUserProfile(),
  isLoaded: false,
  currentStep: 0,
  calculatorInputs: getDefaultInputs(),

  initializeStore: () => {
    const profile = loadUserProfile();
    let updated = updateStreak(profile);

    // Seed historical data if empty
    if (updated.history.length === 0) {
      updated = { ...updated, history: generateHistoricalData() };
    }

    // Seed challenges if empty
    if (updated.challenges.length === 0) {
      updated = { ...updated, challenges: generateWeeklyChallenges() };
    }

    saveUserProfile(updated);
    set({ profile: updated, isLoaded: true });
  },

  setCalculatorInputs: (inputs) => {
    set((state) => ({
      calculatorInputs: {
        ...state.calculatorInputs,
        ...inputs,
        transport: { ...state.calculatorInputs.transport, ...(inputs.transport ?? {}) },
        energy: { ...state.calculatorInputs.energy, ...(inputs.energy ?? {}) },
        diet: { ...state.calculatorInputs.diet, ...(inputs.diet ?? {}) },
        shopping: { ...state.calculatorInputs.shopping, ...(inputs.shopping ?? {}) },
      },
    }));
  },

  submitCalculator: () => {
    const { calculatorInputs, profile } = get();
    const breakdown = calculateCarbonFootprint(calculatorInputs);
    const percentile = getPercentileVsNational(breakdown.total);

    const carbonScore: CarbonScore = {
      inputs: calculatorInputs,
      breakdown,
      calculatedAt: new Date().toISOString(),
      percentileVsNational: percentile,
    };

    let updated: UserProfile = {
      ...profile,
      carbonScore,
    };

    updated = checkAndAwardBadges(updated);
    saveUserProfile(updated);
    set({ profile: updated });
  },

  completeAction: (action: EcoAction) => {
    const { profile } = get();
    const updated = completeActionLocal(profile, action);
    saveUserProfile(updated);
    set({ profile: updated });
  },

  addAIInsight: (insight: AIInsight) => {
    const { profile } = get();
    const updated = {
      ...profile,
      aiInsights: [insight, ...profile.aiInsights].slice(0, 20),
    };
    saveUserProfile(updated);
    set({ profile: updated });
  },

  resetCalculator: () => {
    set({ calculatorInputs: getDefaultInputs(), currentStep: 0 });
  },
}));
