import { GearWarning } from '@/types/vehicle';
import { AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GearWarningAlertProps {
  warning: GearWarning;
}

export function GearWarningAlert({ warning }: GearWarningAlertProps) {
  if (!warning.active) return null;

  const shouldShiftUp = warning.suggestedGear > warning.currentGear;

  return (
    <div className={cn(
      'fixed top-6 left-1/2 -translate-x-1/2 z-50',
      'bg-status-warning/95 text-primary-foreground',
      'px-6 py-4 rounded-xl shadow-2xl',
      'animate-warning-pulse',
      'border-2 border-status-warning',
      'backdrop-blur-sm'
    )}>
      <div className="flex items-center gap-4">
        <div className="p-2 bg-primary-foreground/20 rounded-full">
          <AlertTriangle className="w-6 h-6" />
        </div>
        
        <div className="flex-1">
          <p className="font-semibold text-sm uppercase tracking-wider mb-1">
            Gear Shift Recommended
          </p>
          <p className="text-sm opacity-90">{warning.message}</p>
        </div>
        
        <div className="flex items-center gap-2 bg-primary-foreground/20 px-4 py-2 rounded-lg">
          <span className="font-display text-2xl font-bold">{warning.currentGear}</span>
          {shouldShiftUp ? (
            <ArrowUp className="w-5 h-5" />
          ) : (
            <ArrowDown className="w-5 h-5" />
          )}
          <span className="font-display text-2xl font-bold">{warning.suggestedGear}</span>
        </div>
      </div>
    </div>
  );
}
