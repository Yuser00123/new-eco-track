import type { UserProfile, Badge, EcoAction, HistoricalEntry } from '@/types/carbon';
import { generateDefaultBadges } from './badges';
import { generateDefaultActions } from './actions';

const STORAGE_KEY = 'ecotrack_user_profile';

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

function createDefaultProfile(): UserProfile {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    createdAt: now,
    carbonScore: null,
    completedActions: [],
    badges: generateDefaultBadges(),
    xp: 0,
    streak: 0,
    lastActiveDate: now,
    history: [],
    challenges: [],
    aiInsights: [],
    totalCO2Saved: 0,
  };
}

export function loadUserProfile(): UserProfile {
  if (typeof window === 'undefined') return createDefaultProfile();

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const profile = createDefaultProfile();
      saveUserProfile(profile);
      return profile;
    }
    return JSON.parse(stored) as UserProfile;
  } catch {
    const profile = createDefaultProfile();
    saveUserProfile(profile);
    return profile;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // Storage full or unavailable
  }
}

export function updateStreak(profile: UserProfile): UserProfile {
  const today = new Date().toDateString();
  const lastActive = new Date(profile.lastActiveDate).toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  let newStreak = profile.streak;

  if (lastActive === today) {
    // Already active today, no change
  } else if (lastActive === yesterday) {
    // Continue streak
    newStreak = profile.streak + 1;
  } else {
    // Streak broken
    newStreak = 1;
  }

  return {
    ...profile,
    streak: newStreak,
    lastActiveDate: new Date().toISOString(),
  };
}

export function addHistoricalEntry(
  profile: UserProfile,
  entry: HistoricalEntry
): UserProfile {
  const newHistory = [...profile.history, entry].slice(-90); // Keep 90 days
  return { ...profile, history: newHistory };
}

export function completeAction(
  profile: UserProfile,
  action: EcoAction
): UserProfile {
  if (profile.completedActions.includes(action.id)) return profile;

  const newCompleted = [...profile.completedActions, action.id];
  const newXp = profile.xp + Math.round(action.co2SavedKg * 10);
  const newCO2Saved = profile.totalCO2Saved + action.co2SavedKg;

  const updatedProfile = {
    ...profile,
    completedActions: newCompleted,
    xp: newXp,
    totalCO2Saved: newCO2Saved,
  };

  return checkAndAwardBadges(updatedProfile);
}

export function checkAndAwardBadges(profile: UserProfile): UserProfile {
  const updatedBadges = profile.badges.map((badge) => {
    if (badge.earned) return badge;

    let shouldEarn = false;

    switch (badge.id) {
      case 'green_starter':
        shouldEarn = profile.completedActions.length >= 1;
        break;
      case 'eco_explorer':
        shouldEarn = profile.completedActions.length >= 5;
        break;
      case 'energy_saver':
        shouldEarn = profile.totalCO2Saved >= 50;
        break;
      case 'eco_warrior':
        shouldEarn = profile.completedActions.length >= 20;
        break;
      case 'carbon_crusher':
        shouldEarn = profile.totalCO2Saved >= 500;
        break;
      case 'sustainability_champion':
        shouldEarn = profile.streak >= 30;
        break;
      case 'calculator_complete':
        shouldEarn = profile.carbonScore !== null;
        break;
      case 'streak_week':
        shouldEarn = profile.streak >= 7;
        break;
    }

    if (shouldEarn) {
      return {
        ...badge,
        earned: true,
        earnedAt: new Date().toISOString(),
      };
    }
    return badge;
  });

  return { ...profile, badges: updatedBadges };
}

export function getStoredActions(profile: UserProfile): EcoAction[] {
  const allActions = generateDefaultActions();
  return allActions.map((action) => ({
    ...action,
    completed: profile.completedActions.includes(action.id),
  }));
}
