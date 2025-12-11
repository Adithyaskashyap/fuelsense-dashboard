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

// Default WebSocket URL - update this to your Pi's IP address
const DEFAULT_WS_URL = 'ws://localhost:8765';

export function useVehicleData(wsUrl: string = DEFAULT_WS_URL) {
  const [data, setData] = useState<VehicleData>({
    fuelIn: 0,
    fuelOut: 0,
    gear: 0,
    rpm: 0,
    speed: 0,
    mileage: 0,
    timestamp: Date.now(),
  });

  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const [gearWarning, setGearWarning] = useState<GearWarning>({
    active: false,
    message: '',
    currentGear: 0,
    suggestedGear: 0,
    duration: 0,
  });

  const wsRef = useRef<WebSocket | null>(null);
  const gearStartTime = useRef<number>(Date.now());
  const lastGear = useRef<number>(data.gear);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

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

  // Process incoming vehicle data
  const processData = useCallback((newData: VehicleData) => {
    // Track gear changes
    if (newData.gear !== lastGear.current) {
      gearStartTime.current = Date.now();
      lastGear.current = newData.gear;
    }

    const gearDuration = (Date.now() - gearStartTime.current) / 1000;

    // Update data with timestamp
    const dataWithTimestamp = {
      ...newData,
      timestamp: Date.now(),
    };

    setData(dataWithTimestamp);
    checkGearWarning(dataWithTimestamp, gearDuration);
  }, [checkGearWarning]);

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      console.log(`Connecting to WebSocket at ${wsUrl}...`);
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setConnectionError(null);
      };

      ws.onmessage = (event) => {
        try {
          const newData = JSON.parse(event.data) as VehicleData;
          processData(newData);
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionError('Connection error');
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        wsRef.current = null;

        // Auto-reconnect after 3 seconds
        reconnectTimeout.current = setTimeout(() => {
          console.log('Attempting to reconnect...');
          connect();
        }, 3000);
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('Failed to connect:', error);
      setConnectionError('Failed to connect');
    }
  }, [wsUrl, processData]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
      reconnectTimeout.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  // Connect on mount
  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    data,
    gearWarning,
    efficiencyStatus: getEfficiencyStatus(data.mileage),
    isConnected,
    connectionError,
    connect,
    disconnect,
    thresholds: MILEAGE_THRESHOLDS,
  };
}
