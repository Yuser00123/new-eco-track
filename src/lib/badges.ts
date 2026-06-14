import type { Badge } from '@/types/carbon';

export function generateDefaultBadges(): Badge[] {
  return [
    {
      id: 'green_starter',
      name: 'Green Starter',
      description: 'Complete your first eco action',
      icon: '🌱',
      earned: false,
      requirement: 'Complete 1 eco action',
      xpReward: 50,
    },
    {
      id: 'calculator_complete',
      name: 'Carbon Aware',
      description: 'Complete the carbon footprint calculator',
      icon: '🧮',
      earned: false,
      requirement: 'Calculate your carbon footprint',
      xpReward: 100,
    },
    {
      id: 'eco_explorer',
      name: 'Eco Explorer',
      description: 'Complete 5 eco actions',
      icon: '🔭',
      earned: false,
      requirement: 'Complete 5 eco actions',
      xpReward: 150,
    },
    {
      id: 'streak_week',
      name: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: '🔥',
      earned: false,
      requirement: '7-day streak',
      xpReward: 200,
    },
    {
      id: 'energy_saver',
      name: 'Energy Saver',
      description: 'Save 50kg of CO₂',
      icon: '⚡',
      earned: false,
      requirement: 'Save 50kg CO₂ total',
      xpReward: 300,
    },
    {
      id: 'eco_warrior',
      name: 'Eco Warrior',
      description: 'Complete 20 eco actions',
      icon: '⚔️',
      earned: false,
      requirement: 'Complete 20 eco actions',
      xpReward: 400,
    },
    {
      id: 'carbon_crusher',
      name: 'Carbon Crusher',
      description: 'Save 500kg of CO₂',
      icon: '💪',
      earned: false,
      requirement: 'Save 500kg CO₂ total',
      xpReward: 750,
    },
    {
      id: 'sustainability_champion',
      name: 'Sustainability Champion',
      description: 'Maintain a 30-day streak',
      icon: '🏆',
      earned: false,
      requirement: '30-day streak',
      xpReward: 1000,
    },
  ];
}

export function getEcoRank(xp: number): { rank: string; color: string; nextRank: string; xpToNext: number } {
  if (xp < 100)   return { rank: 'Seedling',    color: '#86efac', nextRank: 'Sprout',     xpToNext: 100 - xp };
  if (xp < 300)   return { rank: 'Sprout',      color: '#4ade80', nextRank: 'Sapling',    xpToNext: 300 - xp };
  if (xp < 700)   return { rank: 'Sapling',     color: '#22c55e', nextRank: 'Tree',       xpToNext: 700 - xp };
  if (xp < 1500)  return { rank: 'Tree',        color: '#16a34a', nextRank: 'Forest',     xpToNext: 1500 - xp };
  if (xp < 3000)  return { rank: 'Forest',      color: '#4F8A8B', nextRank: 'Guardian',   xpToNext: 3000 - xp };
  if (xp < 6000)  return { rank: 'Guardian',    color: '#1A4D2E', nextRank: 'Champion',   xpToNext: 6000 - xp };
  return                  { rank: 'Champion',   color: '#ffd700', nextRank: 'Champion',   xpToNext: 0 };
}
