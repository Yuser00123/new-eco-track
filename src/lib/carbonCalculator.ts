import type {
  CarbonInputs,
  CarbonBreakdown,
  TransportData,
  EnergyData,
  DietData,
  ShoppingData,
} from '@/types/carbon';

// US national average: ~14.5 tons CO2/year = 14500 kg
export const NATIONAL_AVERAGE_KG = 14500;

// ─── Transport Calculation ────────────────────────────────────────────────────
const FUEL_EMISSION_FACTORS: Record<TransportData['fuelType'], number> = {
  gasoline: 0.404,   // kg CO2 per mile
  diesel: 0.426,
  hybrid: 0.202,
  electric: 0.085,
  none: 0,
};

const FLIGHT_EMISSION_SHORT = 255;  // kg CO2 per short-haul round trip
const FLIGHT_EMISSION_LONG  = 1620; // kg CO2 per long-haul round trip
const PUBLIC_TRANSPORT_FACTOR = 0.089; // kg CO2 per hour

export function calculateTransportEmissions(data: TransportData): number {
  const carAnnualMiles = data.carMilesPerWeek * 52;
  const carEmissions = carAnnualMiles * FUEL_EMISSION_FACTORS[data.fuelType];

  const publicTransportAnnualHours = data.publicTransportHoursPerWeek * 52;
  const publicTransportEmissions = publicTransportAnnualHours * PUBLIC_TRANSPORT_FACTOR;

  const shortFlights = Math.max(0, data.flightsPerYear - data.longHaulFlights);
  const flightEmissions =
    shortFlights * FLIGHT_EMISSION_SHORT +
    data.longHaulFlights * FLIGHT_EMISSION_LONG;

  return Math.round(carEmissions + publicTransportEmissions + flightEmissions);
}

// ─── Energy Calculation ───────────────────────────────────────────────────────
const ELECTRICITY_EMISSION_FACTOR = 0.386; // kg CO2 per kWh (US grid average)
const RENEWABLE_DISCOUNT = 0.2; // 80% reduction for renewables

const GAS_EMISSIONS: Record<EnergyData['naturalGasUsage'], number> = {
  none: 0,
  low: 600,
  medium: 1200,
  high: 2400,
};

const HEATING_MULTIPLIERS: Record<EnergyData['heatingType'], number> = {
  renewable: 0.1,
  electric: 0.7,
  gas: 1.0,
  oil: 1.4,
};

const APPLIANCE_MULTIPLIERS: Record<EnergyData['applianceEfficiency'], number> = {
  very_efficient: 0.7,
  efficient: 0.85,
  average: 1.0,
  old: 1.3,
};

export function calculateEnergyEmissions(data: EnergyData): number {
  const annualKwh = data.electricityKwhPerMonth * 12;
  let electricityEmissions = annualKwh * ELECTRICITY_EMISSION_FACTOR;

  if (data.hasRenewableEnergy) {
    electricityEmissions *= RENEWABLE_DISCOUNT;
  }

  const gasEmissions = GAS_EMISSIONS[data.naturalGasUsage];
  const heatingMultiplier = HEATING_MULTIPLIERS[data.heatingType];
  const applianceMultiplier = APPLIANCE_MULTIPLIERS[data.applianceEfficiency];

  return Math.round(
    (electricityEmissions + gasEmissions * heatingMultiplier) * applianceMultiplier
  );
}

// ─── Diet Calculation ─────────────────────────────────────────────────────────
const MEAT_EMISSIONS: Record<DietData['meatConsumption'], number> = {
  vegan: 700,
  vegetarian: 1200,
  low_meat: 1800,
  medium_meat: 2500,
  high_meat: 3300,
};

const DAIRY_EMISSIONS: Record<DietData['dairyConsumption'], number> = {
  none: 0,
  low: 200,
  medium: 500,
  high: 900,
};

const FOOD_WASTE_MULTIPLIERS: Record<DietData['foodWasteLevel'], number> = {
  none: 0.9,
  low: 1.0,
  medium: 1.15,
  high: 1.3,
};

export function calculateDietEmissions(data: DietData): number {
  const baseEmissions = MEAT_EMISSIONS[data.meatConsumption] + DAIRY_EMISSIONS[data.dairyConsumption];
  const localFoodDiscount = 1 - (data.localFoodPercentage / 100) * 0.1;
  const wasteMultiplier = FOOD_WASTE_MULTIPLIERS[data.foodWasteLevel];

  return Math.round(baseEmissions * localFoodDiscount * wasteMultiplier);
}

// ─── Shopping Calculation ─────────────────────────────────────────────────────
const ONLINE_SHOPPING_EMISSION = 3.5; // kg CO2 per order
const CLOTHING_EMISSION = 25;          // kg CO2 per item
const ELECTRONICS_EMISSION = 200;      // kg CO2 per device

const RECYCLING_DISCOUNTS: Record<ShoppingData['recyclingHabits'], number> = {
  none: 1.0,
  some: 0.9,
  most: 0.75,
  all: 0.6,
};

export function calculateShoppingEmissions(data: ShoppingData): number {
  const onlineShopping = data.onlineShoppingPerMonth * 12 * ONLINE_SHOPPING_EMISSION;
  const clothing = data.clothingPurchasesPerYear * CLOTHING_EMISSION;
  const electronics = data.electronicsPerYear * ELECTRONICS_EMISSION;

  const sustainableDiscount = data.sustainableBrands ? 0.8 : 1.0;
  const recyclingDiscount = RECYCLING_DISCOUNTS[data.recyclingHabits];

  return Math.round(
    (onlineShopping + clothing + electronics) * sustainableDiscount * recyclingDiscount
  );
}

// ─── Main Calculator ──────────────────────────────────────────────────────────
export function calculateCarbonFootprint(inputs: CarbonInputs): CarbonBreakdown {
  const transport = calculateTransportEmissions(inputs.transport);
  const energy = calculateEnergyEmissions(inputs.energy);
  const diet = calculateDietEmissions(inputs.diet);
  const shopping = calculateShoppingEmissions(inputs.shopping);
  const total = transport + energy + diet + shopping;

  return { transport, energy, diet, shopping, total };
}

export function getPercentileVsNational(totalKg: number): number {
  // Returns how much better/worse user is vs national average
  // Positive = better than average, Negative = worse
  return Math.round(((NATIONAL_AVERAGE_KG - totalKg) / NATIONAL_AVERAGE_KG) * 100);
}

export function getCarbonRating(totalKg: number): {
  label: string;
  color: string;
  emoji: string;
} {
  const totalTons = totalKg / 1000;

  if (totalTons < 4)  return { label: 'Eco Champion',     color: '#22c55e', emoji: '🌱' };
  if (totalTons < 7)  return { label: 'Green Living',      color: '#4F8A8B', emoji: '🌿' };
  if (totalTons < 10) return { label: 'Average Impact',    color: '#eab308', emoji: '⚠️' };
  if (totalTons < 14) return { label: 'High Impact',       color: '#f97316', emoji: '🔥' };
  return                     { label: 'Critical Impact',   color: '#ef4444', emoji: '💨' };
}

export function getDefaultInputs(): CarbonInputs {
  return {
    transport: {
      carMilesPerWeek: 100,
      fuelType: 'gasoline',
      publicTransportHoursPerWeek: 2,
      flightsPerYear: 2,
      longHaulFlights: 1,
    },
    energy: {
      electricityKwhPerMonth: 877,
      hasRenewableEnergy: false,
      naturalGasUsage: 'medium',
      heatingType: 'gas',
      applianceEfficiency: 'average',
    },
    diet: {
      meatConsumption: 'medium_meat',
      dairyConsumption: 'medium',
      localFoodPercentage: 20,
      foodWasteLevel: 'medium',
    },
    shopping: {
      onlineShoppingPerMonth: 4,
      clothingPurchasesPerYear: 10,
      electronicsPerYear: 2,
      sustainableBrands: false,
      recyclingHabits: 'some',
    },
  };
}
