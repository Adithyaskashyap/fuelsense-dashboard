export interface VehicleData {
  fuelIn: number;       // Liters
  fuelOut: number;      // Liters
  gear: number;         // 1-6, 0 for neutral
  rpm: number;          // Rotations per minute
  speed: number;        // km/h
  mileage: number;      // km/L predicted by AI
  timestamp: number;
}

export type EfficiencyStatus = 'optimal' | 'warning' | 'danger';

export interface GearWarning {
  active: boolean;
  message: string;
  currentGear: number;
  suggestedGear: number;
  duration: number; // seconds in current gear
}
