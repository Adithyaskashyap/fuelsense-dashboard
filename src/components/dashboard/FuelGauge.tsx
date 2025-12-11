import { cn } from '@/lib/utils';
import { Fuel } from 'lucide-react';

interface FuelGaugeProps {
  fuelIn: number;
  fuelOut: number;
  maxCapacity?: number;
}

export function FuelGauge({ fuelIn, fuelOut, maxCapacity = 60 }: FuelGaugeProps) {
  const currentFuel = fuelIn - fuelOut;
  const percentage = Math.max(0, Math.min((currentFuel / maxCapacity) * 100, 100));
  const isLow = percentage < 20;
  const isCritical = percentage < 10;

  return (
    <div className="p-6 rounded-xl bg-card border border-border">
      <div className="flex items-center justify-between mb-4">
        <span className="text-muted-foreground text-xs uppercase tracking-wider">
          Fuel Level
        </span>
        <Fuel className={cn(
          'w-5 h-5',
          isCritical ? 'text-status-danger animate-warning-pulse' :
          isLow ? 'text-status-warning' :
          'text-primary'
        )} />
      </div>

      {/* Fuel tank visualization */}
      <div className="relative h-32 w-full bg-secondary rounded-lg overflow-hidden border border-border">
        {/* Fuel level */}
        <div
          className={cn(
            'absolute bottom-0 left-0 right-0 transition-all duration-500',
            isCritical ? 'bg-status-danger/80' :
            isLow ? 'bg-status-warning/80' :
            'bg-primary/80'
          )}
          style={{ 
            height: `${percentage}%`,
            boxShadow: `0 -5px 20px currentColor`,
          }}
        >
          {/* Wave effect */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-foreground/10 to-transparent" />
        </div>

        {/* Level markers */}
        <div className="absolute inset-y-0 right-2 flex flex-col justify-between py-2 text-xs text-muted-foreground">
          <span>F</span>
          <span>¾</span>
          <span>½</span>
          <span>¼</span>
          <span>E</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="text-center">
          <p className="text-muted-foreground text-xs uppercase">Current</p>
          <p className={cn(
            'font-display text-xl font-bold',
            isCritical ? 'text-status-danger' :
            isLow ? 'text-status-warning' :
            'text-foreground'
          )}>
            {currentFuel.toFixed(1)}L
          </p>
        </div>
        <div className="text-center">
          <p className="text-muted-foreground text-xs uppercase">Consumed</p>
          <p className="font-display text-xl font-bold text-foreground">
            {fuelOut.toFixed(1)}L
          </p>
        </div>
      </div>
    </div>
  );
}
