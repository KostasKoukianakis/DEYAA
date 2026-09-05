import {
  createContext,
  lazy,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createRoot, type Root } from "react-dom/client";
import { useLocation } from "react-router-dom";

const PHONE_MAX_WIDTH = 767;
const ShaderGradientScene = lazy(() => import("@/components/ShaderGradientScene"));

const PersistentHomeShaderSlotContext = createContext<(el: HTMLDivElement | null) => void>(
  () => undefined,
);

let persistRoot: Root | null = null;
let persistArmed = false;

function isPhoneViewport() {
  if (typeof window === "undefined") return true;
  return window.matchMedia(`(max-width: ${PHONE_MAX_WIDTH}px)`).matches;
}

function ensureLayer(id: string, className: string) {
  let el = document.getElementById(id) as HTMLDivElement | null;
  if (!el) {
    el = document.createElement("div");
    el.id = id;
    el.className = className;
    el.setAttribute("aria-hidden", "true");
    document.body.appendChild(el);
  }
  return el;
}

function getParking() {
  return ensureLayer("home-shader-parking", "home-shader-parking");
}

function getHost() {
  return ensureLayer("home-shader-persist-host", "home-shader-persist-host");
}

/** Pull the WebGL host out of the homepage before React deletes that subtree. */
export function parkHomeShaderHost() {
  const host = document.getElementById("home-shader-persist-host");
  if (!host) return;
  const parking = getParking();
  if (host.parentElement !== parking) parking.appendChild(host);
}

function mountPersistentScene(host: HTMLElement) {
  if (!persistRoot) {
    try {
      persistRoot = createRoot(host);
    } catch {
      host.replaceChildren();
      persistRoot = createRoot(host);
    }
  }
  persistRoot.render(
    <Suspense fallback={null}>
      <ShaderGradientScene />
    </Suspense>,
  );
}

function waitForFilledShader(root: HTMLElement, timeoutMs = 8000) {
  return new Promise<void>((resolve) => {
    const started = Date.now();
    let frames = 0;

    const tick = () => {
      const canvas = root.querySelector<HTMLCanvasElement>("canvas");
      const hostW = root.clientWidth;
      const hostH = root.clientHeight;
      const ready =
        Boolean(canvas) &&
        hostW > 200 &&
        hostH > 200 &&
        canvas!.clientWidth >= hostW * 0.85 &&
        canvas!.clientHeight >= hostH * 0.85 &&
        canvas!.width > 64 &&
        canvas!.height > 64;

      if (ready) {
        frames += 1;
        if (frames >= 2) {
          resolve();
          return;
        }
      } else {
        frames = 0;
      }

      if (Date.now() - started >= timeoutMs) {
        resolve();
        return;
      }

      window.requestAnimationFrame(tick);
    };

    window.requestAnimationFrame(tick);
  });
}

/** Desktop homepage water-plane stays mounted when leaving `/`, so return visits skip WebGL init. */
export function PersistentHomeShaderProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const [phone, setPhone] = useState(isPhoneViewport);
  const [slot, setSlot] = useState<HTMLDivElement | null>(null);
  const wantsScene = isHome || Boolean(slot);

  const registerSlot = useCallback((el: HTMLDivElement | null) => {
    if (!el) parkHomeShaderHost();
    setSlot(el);
  }, []);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${PHONE_MAX_WIDTH}px)`);
    const onChange = () => setPhone(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  useLayoutEffect(() => {
    if (phone) {
      parkHomeShaderHost();
      return;
    }
    if (!wantsScene && !persistArmed) return;
    if (!wantsScene) {
      parkHomeShaderHost();
      return;
    }

    const host = getHost();
    persistArmed = true;
    (slot ?? getParking()).appendChild(host);
    mountPersistentScene(host);
    if (slot) {
      window.dispatchEvent(new Event("resize"));
      window.requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
    }
  }, [slot, wantsScene, phone]);

  useEffect(() => {
    if (phone || !persistArmed) return;
    const host = getHost();
    if (!host.classList.contains("is-pending") && host.querySelector("canvas")) return;
    host.classList.add("is-pending");
    let cancelled = false;
    waitForFilledShader(host)
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) host.classList.remove("is-pending");
      });
    return () => {
      cancelled = true;
    };
  }, [slot, wantsScene, phone]);

  return (
    <PersistentHomeShaderSlotContext.Provider value={registerSlot}>
      {children}
    </PersistentHomeShaderSlotContext.Provider>
  );
}

export function usePersistentHomeShaderSlot(enabled: boolean) {
  const setSlot = useContext(PersistentHomeShaderSlotContext);
  const nodeRef = useRef<HTMLDivElement | null>(null);

  const ref = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node || !enabled) {
        parkHomeShaderHost();
        nodeRef.current = node;
        setSlot(null);
        return;
      }
      nodeRef.current = node;
      const host = getHost();
      if (host.parentElement !== node) node.appendChild(host);
      window.dispatchEvent(new Event("resize"));
      setSlot(node);
    },
    [enabled, setSlot],
  );

  useEffect(() => {
    setSlot(enabled ? nodeRef.current : null);
    return () => {
      parkHomeShaderHost();
      setSlot(null);
    };
  }, [enabled, setSlot]);

  return ref;
}
