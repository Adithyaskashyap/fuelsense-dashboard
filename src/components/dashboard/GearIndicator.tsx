import { cn } from '@/lib/utils';

interface GearIndicatorProps {
  currentGear: number;
}

export function GearIndicator({ currentGear }: GearIndicatorProps) {
  const gears = [0, 1, 2, 3, 4, 5, 6];
  
  return (
    <div className="flex flex-col items-center gap-4 p-6 rounded-xl bg-card border border-border">
      <span className="text-muted-foreground text-xs uppercase tracking-wider">
        Current Gear
      </span>
      
      <div className="font-display text-7xl font-bold text-primary text-glow">
        {currentGear === 0 ? 'N' : currentGear}
      </div>
      
      <div className="flex gap-2 mt-2">
        {gears.map((gear) => (
          <div
            key={gear}
            className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-300',
              gear === currentGear
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                : 'bg-secondary text-muted-foreground'
            )}
          >
            {gear === 0 ? 'N' : gear}
          </div>
        ))}
      </div>
    </div>
  );
}
