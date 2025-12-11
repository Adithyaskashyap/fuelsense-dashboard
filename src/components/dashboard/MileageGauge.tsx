import { EfficiencyStatus } from '@/types/vehicle';
import { cn } from '@/lib/utils';

interface MileageGaugeProps {
  mileage: number;
  status: EfficiencyStatus;
  maxMileage?: number;
}

export function MileageGauge({ mileage, status, maxMileage = 30 }: MileageGaugeProps) {
  const percentage = Math.min((mileage / maxMileage) * 100, 100);
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (percentage / 100) * circumference * 0.75;

  const statusColors = {
    optimal: {
      stroke: 'stroke-status-optimal',
      text: 'text-status-optimal text-glow-optimal',
      bg: 'bg-status-optimal/10',
    },
    warning: {
      stroke: 'stroke-status-warning',
      text: 'text-status-warning text-glow-warning',
      bg: 'bg-status-warning/10',
    },
    danger: {
      stroke: 'stroke-status-danger',
      text: 'text-status-danger text-glow-danger',
      bg: 'bg-status-danger/10',
    },
  };

  const colors = statusColors[status];

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg
        className="transform -rotate-[135deg]"
        width="280"
        height="280"
        viewBox="0 0 280 280"
      >
        {/* Background arc */}
        <circle
          cx="140"
          cy="140"
          r="120"
          fill="none"
          stroke="hsl(var(--secondary))"
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.25}
          className="gauge-ring"
        />
        {/* Progress arc */}
        <circle
          cx="140"
          cy="140"
          r="120"
          fill="none"
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={cn('gauge-ring transition-all duration-500', colors.stroke)}
          style={{
            filter: `drop-shadow(0 0 10px currentColor)`,
          }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-muted-foreground text-sm uppercase tracking-wider mb-1">
          Mileage
        </span>
        <span className={cn(
          'font-display text-6xl font-bold transition-colors duration-300',
          colors.text
        )}>
          {mileage.toFixed(1)}
        </span>
        <span className="text-muted-foreground text-lg mt-1">km/L</span>
        
        {/* Status indicator */}
        <div className={cn(
          'mt-4 px-4 py-1.5 rounded-full text-sm font-medium uppercase tracking-wider',
          colors.bg,
          colors.text
        )}>
          {status === 'optimal' && 'Efficient'}
          {status === 'warning' && 'Moderate'}
          {status === 'danger' && 'Poor'}
        </div>
      </div>
    </div>
  );
}
