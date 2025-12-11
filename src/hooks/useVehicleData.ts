import { useState, useEffect, useCallback, useRef } from 'react';
import { VehicleData, EfficiencyStatus, GearWarning } from '@/types/vehicle';

// Mileage thresholds (adjust based on your vehicle)
const MILEAGE_THRESHOLDS = {
  optimal: 15,    // Above 15 km/L = green
  warning: 10,    // 10-15 km/L = yellow
  // Below 10 km/L = red
};

// Gear shift warning threshold (seconds)
const GEAR_DURATION_THRESHOLD = 15;

// RPM thresholds for gear shift suggestions
const RPM_THRESHOLDS = {
  shiftUp: 3000,
  shiftDown: 1200,
};

export function useVehicleData() {
  const [data, setData] = useState<VehicleData>({
    fuelIn: 45.5,
    fuelOut: 2.3,
    gear: 3,
    rpm: 2500,
    speed: 65,
    mileage: 14.2,
    timestamp: Date.now(),
  });

  const [gearWarning, setGearWarning] = useState<GearWarning>({
    active: false,
    message: '',
    currentGear: 0,
    suggestedGear: 0,
    duration: 0,
  });

  const gearStartTime = useRef<number>(Date.now());
  const lastGear = useRef<number>(data.gear);

  // Calculate efficiency status based on mileage
  const getEfficiencyStatus = useCallback((mileage: number): EfficiencyStatus => {
    if (mileage >= MILEAGE_THRESHOLDS.optimal) return 'optimal';
    if (mileage >= MILEAGE_THRESHOLDS.warning) return 'warning';
    return 'danger';
  }, []);

  // Check for gear shift warnings
  const checkGearWarning = useCallback((currentData: VehicleData, gearDuration: number) => {
    const { gear, rpm, speed } = currentData;
    
    // Only warn if moving and in a valid gear
    if (speed < 5 || gear === 0) {
      setGearWarning({ active: false, message: '', currentGear: gear, suggestedGear: gear, duration: 0 });
      return;
    }

    // Check if should shift up
    if (rpm > RPM_THRESHOLDS.shiftUp && gear < 6 && gearDuration > GEAR_DURATION_THRESHOLD) {
      setGearWarning({
        active: true,
        message: `High RPM detected. Consider shifting to gear ${gear + 1}`,
        currentGear: gear,
        suggestedGear: gear + 1,
        duration: gearDuration,
      });
      return;
    }

    // Check if should shift down
    if (rpm < RPM_THRESHOLDS.shiftDown && gear > 1 && gearDuration > GEAR_DURATION_THRESHOLD) {
      setGearWarning({
        active: true,
        message: `Low RPM detected. Consider shifting to gear ${gear - 1}`,
        currentGear: gear,
        suggestedGear: gear - 1,
        duration: gearDuration,
      });
      return;
    }

    // Check prolonged gear usage at suboptimal RPM
    if (gearDuration > GEAR_DURATION_THRESHOLD * 2 && (rpm > 2800 || rpm < 1500) && gear > 0 && gear < 6) {
      const suggestedGear = rpm > 2800 ? gear + 1 : gear - 1;
      if (suggestedGear > 0 && suggestedGear <= 6) {
        setGearWarning({
          active: true,
          message: `Driving in gear ${gear} for ${Math.round(gearDuration)}s. Shift to gear ${suggestedGear} for better efficiency`,
          currentGear: gear,
          suggestedGear,
          duration: gearDuration,
        });
        return;
      }
    }

    setGearWarning({ active: false, message: '', currentGear: gear, suggestedGear: gear, duration: gearDuration });
  }, []);

  // Simulate real-time data updates (replace with actual WebSocket/API connection)
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        // Track gear changes
        if (prev.gear !== lastGear.current) {
          gearStartTime.current = Date.now();
          lastGear.current = prev.gear;
        }

        const gearDuration = (Date.now() - gearStartTime.current) / 1000;

        // Simulate realistic fluctuations
        const newData: VehicleData = {
          fuelIn: Math.max(0, prev.fuelIn - Math.random() * 0.01),
          fuelOut: prev.fuelOut + Math.random() * 0.005,
          gear: prev.gear,
          rpm: Math.max(800, Math.min(6500, prev.rpm + (Math.random() - 0.5) * 200)),
          speed: Math.max(0, Math.min(180, prev.speed + (Math.random() - 0.5) * 5)),
          mileage: Math.max(5, Math.min(25, prev.mileage + (Math.random() - 0.5) * 0.5)),
          timestamp: Date.now(),
        };

        // Check gear warnings
        checkGearWarning(newData, gearDuration);

        return newData;
      });
    }, 500); // Update every 500ms

    return () => clearInterval(interval);
  }, [checkGearWarning]);

  // Function to connect to actual backend (for future use)
  const connectToBackend = useCallback((wsUrl: string) => {
    // TODO: Implement WebSocket connection to Python backend
    // const ws = new WebSocket(wsUrl);
    // ws.onmessage = (event) => {
    //   const newData = JSON.parse(event.data);
    //   setData(newData);
    // };
    console.log('Connect to backend:', wsUrl);
  }, []);

  return {
    data,
    gearWarning,
    efficiencyStatus: getEfficiencyStatus(data.mileage),
    connectToBackend,
    thresholds: MILEAGE_THRESHOLDS,
  };
}
