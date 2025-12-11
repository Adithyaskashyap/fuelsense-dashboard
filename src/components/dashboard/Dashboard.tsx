import { useVehicleData } from '@/hooks/useVehicleData';
import { MileageGauge } from './MileageGauge';
import { DataCard } from './DataCard';
import { GearIndicator } from './GearIndicator';
import { RpmGauge } from './RpmGauge';
import { GearWarningAlert } from './GearWarningAlert';
import { FuelGauge } from './FuelGauge';
import { SpeedDisplay } from './SpeedDisplay';
import { ConnectionStatus } from './ConnectionStatus';
import { Fuel, Droplets, Activity } from 'lucide-react';

// Update this to your Raspberry Pi's IP address and port
const WS_URL = 'ws://localhost:8765';

export function Dashboard() {
  const { data, gearWarning, efficiencyStatus, thresholds, isConnected, connectionError, connect } = useVehicleData(WS_URL);

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      {/* Gear shift warning overlay */}
      <GearWarningAlert warning={gearWarning} />

      {/* Header */}
      <header className="mb-6 md:mb-8">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
          Fuel Efficiency Monitor
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Real-time AI-powered mileage prediction
        </p>
      </header>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        {/* Left column - Mileage gauge */}
        <div className="lg:col-span-5 flex items-center justify-center">
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 w-full max-w-md">
            <MileageGauge
              mileage={data.mileage}
              status={efficiencyStatus}
            />
            
            {/* Threshold legend */}
            <div className="mt-6 flex justify-center gap-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-status-optimal" />
                <span className="text-muted-foreground">≥{thresholds.optimal} km/L</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-status-warning" />
                <span className="text-muted-foreground">{thresholds.warning}-{thresholds.optimal}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-status-danger" />
                <span className="text-muted-foreground">&lt;{thresholds.warning}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column - Stats */}
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Gear and Speed row */}
          <GearIndicator currentGear={data.gear} />
          <SpeedDisplay speed={data.speed} />

          {/* RPM gauge - full width */}
          <div className="md:col-span-2">
            <RpmGauge rpm={data.rpm} />
          </div>

          {/* Fuel gauge */}
          <FuelGauge fuelIn={data.fuelIn} fuelOut={data.fuelOut} />

          {/* Quick stats */}
          <div className="space-y-4">
            <DataCard
              label="Fuel Input"
              value={data.fuelIn}
              unit="L"
              icon={Fuel}
              variant="accent"
            />
            <DataCard
              label="Fuel Consumed"
              value={data.fuelOut}
              unit="L"
              icon={Droplets}
            />
          </div>
        </div>
      </div>

      {/* Footer status */}
      <footer className="mt-6 md:mt-8 flex items-center justify-between text-xs text-muted-foreground">
        <ConnectionStatus 
          isConnected={isConnected} 
          error={connectionError} 
          onReconnect={connect} 
        />
        <span>Last update: {new Date(data.timestamp).toLocaleTimeString()}</span>
      </footer>
    </div>
  );
}
