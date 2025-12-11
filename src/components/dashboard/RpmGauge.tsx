import { cn } from '@/lib/utils';

interface RpmGaugeProps {
  rpm: number;
  maxRpm?: number;
}

export function RpmGauge({ rpm, maxRpm = 7000 }: RpmGaugeProps) {
  const percentage = Math.min((rpm / maxRpm) * 100, 100);
  const isHighRpm = rpm > 5000;
  const isRedline = rpm > 6000;

  return (
    <div className="p-6 rounded-xl bg-card border border-border">
      <div className="flex items-center justify-between mb-4">
        <span className="text-muted-foreground text-xs uppercase tracking-wider">
          Engine RPM
        </span>
        <span className={cn(
          'font-display text-2xl font-bold',
          isRedline ? 'text-status-danger text-glow-danger animate-warning-pulse' :
          isHighRpm ? 'text-status-warning text-glow-warning' :
          'text-primary text-glow'
        )}>
          {Math.round(rpm)}
        </span>
      </div>
      
      {/* RPM Bar */}
      <div className="relative h-4 bg-secondary rounded-full overflow-hidden">
        {/* Background segments */}
        <div className="absolute inset-0 flex">
          <div className="flex-1 border-r border-background/20" />
          <div className="flex-1 border-r border-background/20" />
          <div className="flex-1 border-r border-background/20" />
          <div className="flex-1 border-r border-background/20" />
          <div className="flex-1 border-r border-background/20" />
          <div className="flex-1 border-r border-background/20" />
          <div className="flex-1" />
        </div>
        
        {/* Progress bar */}
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300 relative',
            isRedline ? 'bg-status-danger' :
            isHighRpm ? 'bg-status-warning' :
            'bg-primary'
          )}
          style={{ 
            width: `${percentage}%`,
            boxShadow: `0 0 15px currentColor`,
          }}
        />
      </div>
      
      {/* Labels */}
      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
        <span>0</span>
        <span>1k</span>
        <span>2k</span>
        <span>3k</span>
        <span>4k</span>
        <span>5k</span>
        <span>6k</span>
        <span>7k</span>
      </div>
    </div>
  );
}
