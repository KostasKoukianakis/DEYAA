import { WaterLoader } from "@/components/WaterLoader";
import { HOME_LOADER_MIN_MS } from "@/lib/homeLoaderTiming";
import { cn } from "@/lib/utils";

interface HomeInitialLoaderProps {
  visible: boolean;
  dismissing: boolean;
  startedAt: number;
}

export function HomeInitialLoader({ visible, dismissing, startedAt }: HomeInitialLoaderProps) {
  if (!visible) return null;

  return (
    <div
      className={cn("home-initial-loader", dismissing && "home-initial-loader--fade-out")}
      aria-hidden={dismissing}
      aria-busy={!dismissing}
      role="status"
      aria-label="Φόρτωση αρχικής σελίδας"
    >
      <div className="home-initial-loader__backdrop" aria-hidden />
      <div className="home-initial-loader__drop">
        <WaterLoader startedAt={startedAt} durationMs={HOME_LOADER_MIN_MS} overlay />
      </div>
    </div>
  );
}
