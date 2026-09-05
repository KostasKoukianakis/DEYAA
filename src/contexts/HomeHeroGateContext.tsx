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
import { useLocation } from "react-router-dom";
import { markHomeHeroIntroSeen, hasSeenHomeHeroIntro } from "@/lib/homeHeroSession";
import {
  HOME_LOADER_FADE_MS,
  HOME_LOADER_HOLD_MS,
  HOME_LOADER_MIN_MS,
} from "@/lib/homeLoaderTiming";
import { preloadHomeHeroAssets } from "@/lib/preloadHomeHeroAssets";

type ReadyPart = "assets" | "tank" | "ripple" | "shader";

const REQUIRED_PARTS: ReadyPart[] = ["assets", "tank", "ripple", "shader"];
const ENTRANCE_PARTS: ReadyPart[] = ["assets"];
const MIN_LOADER_MS = HOME_LOADER_MIN_MS;
const HOLD_MS = HOME_LOADER_HOLD_MS;
const FADE_OUT_MS = HOME_LOADER_FADE_MS;
const MAX_LOADER_MS = 10000;

type HomeHeroGateContextValue = {
  showLoader: boolean;
  loaderDismissing: boolean;
  loaderStartedAt: number;
  /** Photos, tank, ripple, and shader have reported in */
  sceneReady: boolean;
  /** True once the drop may fade — hero entrance starts underneath */
  entranceReady: boolean;
  isFirstVisit: boolean;
  reportReady: (part: ReadyPart) => void;
  completeEntrance: () => void;
};

const HomeHeroGateContext = createContext<HomeHeroGateContextValue | null>(null);

function removeBootLoader() {
  document.getElementById("deyaa-boot-loader")?.remove();
}

export function HomeHeroGateProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const [isFirstVisit] = useState(() => !hasSeenHomeHeroIntro());
  const [readyParts, setReadyParts] = useState<Set<ReadyPart>>(() => new Set());
  const [showLoader, setShowLoader] = useState(() => isFirstVisit && isHome);
  const [loaderDismissing, setLoaderDismissing] = useState(false);
  const [entranceReady, setEntranceReady] = useState(() => !isFirstVisit);
  const [loaderStartedAt, setLoaderStartedAt] = useState(() =>
    isFirstVisit && isHome ? Date.now() : 0,
  );
  const loaderStartedAtRef = useRef(loaderStartedAt);
  const dismissedRef = useRef(false);

  useEffect(() => {
    if (!isHome || !isFirstVisit || dismissedRef.current || entranceReady) return;
    setShowLoader(true);
    if (loaderStartedAtRef.current === 0) {
      const now = Date.now();
      loaderStartedAtRef.current = now;
      setLoaderStartedAt(now);
    }
  }, [isHome, isFirstVisit, entranceReady]);

  const sceneReady = REQUIRED_PARTS.every((part) => readyParts.has(part));
  const entranceAssetsReady = ENTRANCE_PARTS.every((part) => readyParts.has(part));

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
    if (showLoader) return;
    removeBootLoader();
  }, [showLoader]);

  useEffect(() => {
    if (!isHome || !isFirstVisit) return;

    let cancelled = false;
    preloadHomeHeroAssets()
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) reportReady("assets");
      });

    return () => {
      cancelled = true;
    };
  }, [isHome, isFirstVisit, reportReady]);

  useEffect(() => {
    if (!isHome || !isFirstVisit) return;
    if (!entranceAssetsReady || dismissedRef.current) return;

    const elapsed = Date.now() - loaderStartedAtRef.current;
    const wait = Math.max(0, MIN_LOADER_MS - elapsed);
    let holdTimer = 0;
    let fadeTimer = 0;
    let cancelled = false;

    const waitTimer = window.setTimeout(() => {
      if (cancelled || dismissedRef.current) return;
      dismissedRef.current = true;

      holdTimer = window.setTimeout(() => {
        setLoaderDismissing(true);
        setEntranceReady(true);
        fadeTimer = window.setTimeout(() => {
          setShowLoader(false);
        }, FADE_OUT_MS);
      }, HOLD_MS);
    }, wait);

    return () => {
      cancelled = true;
      window.clearTimeout(waitTimer);
      if (!dismissedRef.current) {
        window.clearTimeout(holdTimer);
        window.clearTimeout(fadeTimer);
      }
    };
  }, [isHome, isFirstVisit, entranceAssetsReady]);

  useEffect(() => {
    if (!isHome || !isFirstVisit || entranceReady) return;

    const forceTimer = window.setTimeout(() => {
      setReadyParts(new Set(REQUIRED_PARTS));
    }, MAX_LOADER_MS);

    return () => window.clearTimeout(forceTimer);
  }, [isHome, isFirstVisit, entranceReady]);

  useEffect(() => {
    if (!isHome || !isFirstVisit || !showLoader) {
      document.documentElement.classList.remove("home-hero-loader-active");
      return;
    }
    document.documentElement.classList.add("home-hero-loader-active");
    return () => {
      document.documentElement.classList.remove("home-hero-loader-active");
    };
  }, [isHome, isFirstVisit, showLoader]);

  const value = useMemo(
    () => ({
      showLoader,
      loaderDismissing,
      loaderStartedAt,
      sceneReady,
      entranceReady,
      isFirstVisit,
      reportReady,
      completeEntrance,
    }),
    [
      showLoader,
      loaderDismissing,
      loaderStartedAt,
      sceneReady,
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
