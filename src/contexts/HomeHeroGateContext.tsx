import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { markHomeHeroIntroSeen, hasSeenHomeHeroIntro } from "@/lib/homeHeroSession";
import {
  HOME_LOADER_FADE_MS,
  HOME_LOADER_HOLD_MS,
  HOME_LOADER_MIN_MS,
} from "@/lib/homeLoaderTiming";
import { preloadHomeHeroAssets } from "@/lib/preloadHomeHeroAssets";

type ReadyPart = "assets" | "tank" | "ripple";

const REQUIRED_PARTS: ReadyPart[] = ["assets", "tank", "ripple"];
const MIN_LOADER_MS = HOME_LOADER_MIN_MS;
const HOLD_MS = HOME_LOADER_HOLD_MS;
const FADE_OUT_MS = HOME_LOADER_FADE_MS;
const MAX_LOADER_MS = 12000;

type HomeHeroGateContextValue = {
  showLoader: boolean;
  loaderDismissing: boolean;
  loaderStartedAt: number;
  /** True only after drop + loader fade are fully finished — hero entrance may start */
  entranceReady: boolean;
  isFirstVisit: boolean;
  reportReady: (part: ReadyPart) => void;
  completeEntrance: () => void;
};

const HomeHeroGateContext = createContext<HomeHeroGateContextValue | null>(null);

export function HomeHeroGateProvider({ children }: { children: ReactNode }) {
  const isFirstVisit = !hasSeenHomeHeroIntro();
  const [readyParts, setReadyParts] = useState<Set<ReadyPart>>(() => new Set());
  const [showLoader, setShowLoader] = useState(isFirstVisit);
  const [loaderDismissing, setLoaderDismissing] = useState(false);
  const [entranceReady, setEntranceReady] = useState(!isFirstVisit);
  const [loaderStartedAt] = useState(() => (isFirstVisit ? Date.now() : 0));
  const loaderStartedAtRef = useRef(loaderStartedAt);
  const dismissedRef = useRef(false);

  const reportReady = useCallback((part: ReadyPart) => {
    setReadyParts((prev) => {
      if (prev.has(part)) return prev;
      const next = new Set(prev);
      next.add(part);
      return next;
    });
  }, []);

  const completeEntrance = useCallback(() => {
    markHomeHeroIntroSeen();
  }, []);

  useEffect(() => {
    if (!isFirstVisit) return;

    let cancelled = false;
    preloadHomeHeroAssets()
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) reportReady("assets");
      });

    return () => {
      cancelled = true;
    };
  }, [isFirstVisit, reportReady]);

  useEffect(() => {
    if (!isFirstVisit || entranceReady) return;

    const allReady = REQUIRED_PARTS.every((part) => readyParts.has(part));
    if (!allReady || dismissedRef.current) return;

    const beginDismiss = () => {
      if (dismissedRef.current) return;
      const elapsed = Date.now() - loaderStartedAtRef.current;
      if (elapsed < MIN_LOADER_MS) return;

      dismissedRef.current = true;

      window.setTimeout(() => {
        setLoaderDismissing(true);

        window.setTimeout(() => {
          setShowLoader(false);
          setEntranceReady(true);
        }, FADE_OUT_MS);
      }, HOLD_MS);
    };

    beginDismiss();
    const interval = window.setInterval(beginDismiss, 40);
    return () => window.clearInterval(interval);
  }, [isFirstVisit, entranceReady, readyParts]);

  useEffect(() => {
    if (!isFirstVisit || entranceReady) return;

    const forceTimer = window.setTimeout(() => {
      setReadyParts(new Set(REQUIRED_PARTS));
    }, MAX_LOADER_MS);

    return () => window.clearTimeout(forceTimer);
  }, [isFirstVisit, entranceReady]);

  useEffect(() => {
    if (!isFirstVisit || entranceReady) return;
    document.documentElement.classList.add("home-hero-loader-active");
    return () => {
      document.documentElement.classList.remove("home-hero-loader-active");
    };
  }, [isFirstVisit, entranceReady]);

  const value = useMemo(
    () => ({
      showLoader,
      loaderDismissing,
      loaderStartedAt,
      entranceReady,
      isFirstVisit,
      reportReady,
      completeEntrance,
    }),
    [
      showLoader,
      loaderDismissing,
      loaderStartedAt,
      entranceReady,
      isFirstVisit,
      reportReady,
      completeEntrance,
    ],
  );

  return <HomeHeroGateContext.Provider value={value}>{children}</HomeHeroGateContext.Provider>;
}

export function useHomeHeroGate() {
  const ctx = useContext(HomeHeroGateContext);
  if (!ctx) {
    throw new Error("useHomeHeroGate must be used within HomeHeroGateProvider");
  }
  return ctx;
}

/** Safe no-op when provider is absent (e.g. tests). */
export function useOptionalHomeHeroGate() {
  return useContext(HomeHeroGateContext);
}
