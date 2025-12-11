import { Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConnectionStatusProps {
  isConnected: boolean;
  error?: string | null;
  onReconnect?: () => void;
}

export function ConnectionStatus({ isConnected, error, onReconnect }: ConnectionStatusProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
          isConnected
            ? "bg-dashboard-success/20 text-dashboard-success"
            : "bg-dashboard-danger/20 text-dashboard-danger"
        )}
      >
        {isConnected ? (
          <>
            <Wifi className="w-4 h-4" />
            <span>Connected</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4" />
            <span>{error || 'Disconnected'}</span>
          </>
        )}
      </div>
      {!isConnected && onReconnect && (
        <button
          onClick={onReconnect}
          className="px-3 py-1.5 rounded-full text-sm font-medium bg-dashboard-accent/20 text-dashboard-accent hover:bg-dashboard-accent/30 transition-colors"
        >
          Reconnect
        </button>
      )}
    </div>
  );
}
