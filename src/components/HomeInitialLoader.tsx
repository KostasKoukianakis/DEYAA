import { useEffect } from "react";
import { WaterLoader } from "@/components/WaterLoader";
import { HOME_LOADER_MIN_MS } from "@/lib/homeLoaderTiming";
import { cn } from "@/lib/utils";
import { t } from "@/i18n/runtime";

interface HomeInitialLoaderProps {
  visible: boolean;
  dismissing: boolean;
  startedAt: number;
  sceneReady?: boolean;
}

export function HomeInitialLoader({
  visible,
  dismissing,
  startedAt,
  sceneReady = false,
}: HomeInitialLoaderProps) {
  useEffect(() => {
    if (!visible) return;
    document.getElementById("deyaa-boot-loader")?.remove();
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={cn("home-initial-loader", dismissing && "home-initial-loader--fade-out")}
      aria-hidden={dismissing}
      aria-busy={!dismissing}
      role="status"
      aria-label={t("common.loadingHome")}
    >
      <div className="home-initial-loader__backdrop" aria-hidden />
      <div className="home-initial-loader__drop">
        <WaterLoader
          startedAt={startedAt}
          durationMs={HOME_LOADER_MIN_MS}
          overlay
          sceneReady={sceneReady}
        />
      </div>
    </div>
  );
}
