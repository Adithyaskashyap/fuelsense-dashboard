import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface DataCardProps {
  label: string;
  value: string | number;
  unit: string;
  icon: LucideIcon;
  variant?: 'default' | 'accent';
  animate?: boolean;
}

export function DataCard({ label, value, unit, icon: Icon, variant = 'default', animate = false }: DataCardProps) {
  return (
    <div className={cn(
      'relative overflow-hidden rounded-xl p-5 border transition-all duration-300',
      'bg-card border-border hover:border-primary/30',
      animate && 'animate-pulse-glow'
    )}>
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
      
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-muted-foreground text-xs uppercase tracking-wider mb-2">
            {label}
          </p>
          <div className="flex items-baseline gap-2">
            <span className={cn(
              'font-display text-3xl font-bold',
              variant === 'accent' ? 'text-primary text-glow' : 'text-foreground'
            )}>
              {typeof value === 'number' ? value.toFixed(1) : value}
            </span>
            <span className="text-muted-foreground text-sm">{unit}</span>
          </div>
        </div>
        
        <div className={cn(
          'p-2.5 rounded-lg',
          variant === 'accent' ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'
        )}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
