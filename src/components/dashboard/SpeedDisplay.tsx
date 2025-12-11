import { cn } from '@/lib/utils';

interface SpeedDisplayProps {
  speed: number;
}

export function SpeedDisplay({ speed }: SpeedDisplayProps) {
  return (
    <div className="p-6 rounded-xl bg-card border border-border">
      <span className="text-muted-foreground text-xs uppercase tracking-wider">
        Speed
      </span>
      
      <div className="mt-3 flex items-baseline gap-2">
        <span className="font-display text-5xl font-bold text-foreground">
          {Math.round(speed)}
        </span>
        <span className="text-muted-foreground text-lg">km/h</span>
      </div>
      
      {/* Speed bar */}
      <div className="mt-4 h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300 bg-primary'
          )}
          style={{ 
            width: `${Math.min((speed / 180) * 100, 100)}%`,
            boxShadow: '0 0 10px hsl(var(--primary))',
          }}
        />
      </div>
    </div>
  );
}
