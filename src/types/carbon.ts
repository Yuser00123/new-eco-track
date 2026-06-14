// Core carbon footprint types

export interface TransportData {
  carMilesPerWeek: number;
  fuelType: 'gasoline' | 'diesel' | 'hybrid' | 'electric' | 'none';
  publicTransportHoursPerWeek: number;
  flightsPerYear: number;
  longHaulFlights: number;
}

export interface EnergyData {
  electricityKwhPerMonth: number;
  hasRenewableEnergy: boolean;
  naturalGasUsage: 'none' | 'low' | 'medium' | 'high';
  heatingType: 'electric' | 'gas' | 'oil' | 'renewable';
  applianceEfficiency: 'old' | 'average' | 'efficient' | 'very_efficient';
}

export interface DietData {
  meatConsumption: 'vegan' | 'vegetarian' | 'low_meat' | 'medium_meat' | 'high_meat';
  dairyConsumption: 'none' | 'low' | 'medium' | 'high';
  localFoodPercentage: number;
  foodWasteLevel: 'none' | 'low' | 'medium' | 'high';
}

export interface ShoppingData {
  onlineShoppingPerMonth: number;
  clothingPurchasesPerYear: number;
  electronicsPerYear: number;
  sustainableBrands: boolean;
  recyclingHabits: 'none' | 'some' | 'most' | 'all';
}

export interface CarbonInputs {
  transport: TransportData;
  energy: EnergyData;
  diet: DietData;
  shopping: ShoppingData;
}

export interface CarbonBreakdown {
  transport: number;
  energy: number;
  diet: number;
  shopping: number;
  total: number;
}

export interface CarbonScore {
  inputs: CarbonInputs;
  breakdown: CarbonBreakdown;
  calculatedAt: string;
  percentileVsNational: number;
}

export interface EcoAction {
  id: string;
  title: string;
  description: string;
  category: 'transport' | 'energy' | 'diet' | 'shopping';
  co2SavedKg: number;
  difficulty: 'easy' | 'medium' | 'hard';
  timeRequired: string;
  completed: boolean;
  completedAt?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
  earned: boolean;
  requirement: string;
  xpReward: number;
}

export interface WeeklyChallenge {
  id: string;
  title: string;
  description: string;
  category: 'transport' | 'energy' | 'diet' | 'shopping';
  targetActions: number;
  completedActions: number;
  co2SavedKg: number;
  xpReward: number;
  deadline: string;
  active: boolean;
}

export interface HistoricalEntry {
  date: string;
  footprintKg: number;
  actionsCompleted: number;
  category: 'transport' | 'energy' | 'diet' | 'shopping' | 'overall';
}

export interface UserProfile {
  id: string;
  createdAt: string;
  carbonScore: CarbonScore | null;
  completedActions: string[];
  badges: Badge[];
  xp: number;
  streak: number;
  lastActiveDate: string;
  history: HistoricalEntry[];
  challenges: WeeklyChallenge[];
  aiInsights: AIInsight[];
  totalCO2Saved: number;
}

export interface AIInsight {
  id: string;
  type: 'recommendation' | 'challenge' | 'progress' | 'motivation';
  title: string;
  content: string;
  category?: 'transport' | 'energy' | 'diet' | 'shopping';
  generatedAt: string;
  actionable: boolean;
}

export type CalculatorStep = 
  | 'welcome'
  | 'transport'
  | 'energy'
  | 'diet'
  | 'shopping'
  | 'results';

export interface StepConfig {
  id: CalculatorStep;
  title: string;
  description: string;
  icon: string;
}
