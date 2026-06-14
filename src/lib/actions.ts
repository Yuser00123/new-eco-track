import type { EcoAction, WeeklyChallenge } from '@/types/carbon';

export function generateDefaultActions(): EcoAction[] {
  return [
    // Transport
    {
      id: 'carpool_week',
      title: 'Carpool This Week',
      description: 'Share rides with colleagues or neighbors to reduce emissions',
      category: 'transport',
      co2SavedKg: 12.5,
      difficulty: 'easy',
      timeRequired: '1 week',
      completed: false,
    },
    {
      id: 'bike_commute',
      title: 'Bike to Work',
      description: 'Replace one car trip with cycling for a week',
      category: 'transport',
      co2SavedKg: 8.3,
      difficulty: 'medium',
      timeRequired: '1 week',
      completed: false,
    },
    {
      id: 'public_transport',
      title: 'Use Public Transport',
      description: 'Take the bus or train instead of driving for 5 trips',
      category: 'transport',
      co2SavedKg: 15.2,
      difficulty: 'easy',
      timeRequired: '5 trips',
      completed: false,
    },
    {
      id: 'avoid_flights',
      title: 'Skip One Short-Haul Flight',
      description: 'Take the train or video call instead of flying',
      category: 'transport',
      co2SavedKg: 255,
      difficulty: 'hard',
      timeRequired: 'One trip',
      completed: false,
    },
    {
      id: 'electric_vehicle',
      title: 'Test Drive an EV',
      description: 'Visit a dealership and consider switching to electric',
      category: 'transport',
      co2SavedKg: 5,
      difficulty: 'easy',
      timeRequired: '2 hours',
      completed: false,
    },
    // Energy
    {
      id: 'led_bulbs',
      title: 'Switch to LED Bulbs',
      description: 'Replace 5 incandescent bulbs with LED equivalents',
      category: 'energy',
      co2SavedKg: 40,
      difficulty: 'easy',
      timeRequired: '30 minutes',
      completed: false,
    },
    {
      id: 'unplug_standby',
      title: 'Unplug Standby Devices',
      description: 'Turn off TVs, chargers, and appliances at the wall for 1 week',
      category: 'energy',
      co2SavedKg: 6.8,
      difficulty: 'easy',
      timeRequired: '1 week',
      completed: false,
    },
    {
      id: 'smart_thermostat',
      title: 'Lower Thermostat by 2°C',
      description: 'Reduce heating temperature by 2 degrees for a week',
      category: 'energy',
      co2SavedKg: 18.5,
      difficulty: 'easy',
      timeRequired: '1 week',
      completed: false,
    },
    {
      id: 'renewable_energy',
      title: 'Switch to Green Energy',
      description: 'Contact your energy provider about renewable options',
      category: 'energy',
      co2SavedKg: 1200,
      difficulty: 'medium',
      timeRequired: '1 hour',
      completed: false,
    },
    {
      id: 'cold_wash',
      title: 'Wash Clothes in Cold Water',
      description: 'Use cold water for laundry for 1 month',
      category: 'energy',
      co2SavedKg: 22,
      difficulty: 'easy',
      timeRequired: '1 month',
      completed: false,
    },
    // Diet
    {
      id: 'meatless_monday',
      title: 'Meatless Monday',
      description: 'Go meat-free every Monday for a month',
      category: 'diet',
      co2SavedKg: 30,
      difficulty: 'easy',
      timeRequired: '1 month',
      completed: false,
    },
    {
      id: 'plant_based_week',
      title: 'Plant-Based Week',
      description: 'Eat plant-based meals for an entire week',
      category: 'diet',
      co2SavedKg: 45,
      difficulty: 'medium',
      timeRequired: '1 week',
      completed: false,
    },
    {
      id: 'local_food',
      title: 'Shop Local Produce',
      description: 'Buy from a farmers market or local store for a week',
      category: 'diet',
      co2SavedKg: 8,
      difficulty: 'easy',
      timeRequired: '1 week',
      completed: false,
    },
    {
      id: 'reduce_food_waste',
      title: 'Zero Waste Meal Planning',
      description: 'Plan meals to eliminate food waste for 2 weeks',
      category: 'diet',
      co2SavedKg: 20,
      difficulty: 'medium',
      timeRequired: '2 weeks',
      completed: false,
    },
    // Shopping
    {
      id: 'reusable_bottle',
      title: 'Use a Reusable Water Bottle',
      description: 'Switch from single-use plastics to reusable bottles',
      category: 'shopping',
      co2SavedKg: 7.2,
      difficulty: 'easy',
      timeRequired: 'Ongoing',
      completed: false,
    },
    {
      id: 'secondhand_shopping',
      title: 'Buy Secondhand',
      description: 'Purchase one clothing item from a thrift store',
      category: 'shopping',
      co2SavedKg: 22,
      difficulty: 'easy',
      timeRequired: '2 hours',
      completed: false,
    },
    {
      id: 'reduce_packaging',
      title: 'Choose Minimal Packaging',
      description: 'Pick products with recyclable or minimal packaging for 2 weeks',
      category: 'shopping',
      co2SavedKg: 5,
      difficulty: 'easy',
      timeRequired: '2 weeks',
      completed: false,
    },
    {
      id: 'repair_dont_replace',
      title: 'Repair Instead of Replace',
      description: 'Fix one broken item instead of buying new',
      category: 'shopping',
      co2SavedKg: 35,
      difficulty: 'medium',
      timeRequired: '1-2 days',
      completed: false,
    },
  ];
}

export function generateWeeklyChallenges(): WeeklyChallenge[] {
  const deadline = new Date();
  deadline.setDate(deadline.getDate() + 7);

  return [
    {
      id: 'challenge_meatless',
      title: 'Meatless Monday',
      description: 'Complete 4 meat-free days this week and save significant CO₂',
      category: 'diet',
      targetActions: 4,
      completedActions: 0,
      co2SavedKg: 30,
      xpReward: 200,
      deadline: deadline.toISOString(),
      active: true,
    },
    {
      id: 'challenge_transport',
      title: 'Bike To Work Week',
      description: 'Replace car trips with cycling or walking 3 times this week',
      category: 'transport',
      targetActions: 3,
      completedActions: 0,
      co2SavedKg: 25,
      xpReward: 250,
      deadline: deadline.toISOString(),
      active: true,
    },
    {
      id: 'challenge_energy',
      title: 'Energy Saver Week',
      description: 'Reduce home energy use with 5 daily energy-saving actions',
      category: 'energy',
      targetActions: 5,
      completedActions: 0,
      co2SavedKg: 40,
      xpReward: 300,
      deadline: deadline.toISOString(),
      active: true,
    },
  ];
}

export function generateHistoricalData(): import('@/types/carbon').HistoricalEntry[] {
  const entries: import('@/types/carbon').HistoricalEntry[] = [];
  const now = Date.now();
  const BASE_KG = 40; // kg per day baseline

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now - i * 86400000).toISOString().split('T')[0];
    const trend = 1 - (29 - i) * 0.008; // Gradually improving
    const noise = 0.85 + Math.random() * 0.3;
    const footprintKg = Math.round(BASE_KG * trend * noise * 10) / 10;

    entries.push({
      date,
      footprintKg,
      actionsCompleted: Math.floor(Math.random() * 3),
      category: 'overall',
    });
  }

  return entries;
}
