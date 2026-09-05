import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { UserWayWidget } from "@/components/UserWayWidget";
import { CookieConsent } from "@/components/CookieConsent";

function isDashboardPath(pathname: string) {
  return pathname === "/dashboard" || pathname.startsWith("/dashboard/");
}

/** Public-site FABs (accessibility + cookies). Hidden on admin dashboard routes. */
export function PublicSiteWidgets() {
  const { pathname } = useLocation();
  const hideOnDashboard = isDashboardPath(pathname);
  const [widgetsReady, setWidgetsReady] = useState(false);

  useEffect(() => {
    if (hideOnDashboard) return;

    const phone = window.matchMedia("(max-width: 767px)").matches;
    const idleTimeout = phone ? 8000 : 2500;
    const fallbackMs = phone ? 6000 : 1200;

    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(() => setWidgetsReady(true), { timeout: idleTimeout });
      return () => window.cancelIdleCallback(id);
    }

    const timeoutId = window.setTimeout(() => setWidgetsReady(true), fallbackMs);
    return () => window.clearTimeout(timeoutId);
  }, [hideOnDashboard]);

  useEffect(() => {
    if (hideOnDashboard) {
      document.body.dataset.appSurface = "dashboard";
    } else {
      delete document.body.dataset.appSurface;
    }

    return () => {
      delete document.body.dataset.appSurface;
    };
  }, [hideOnDashboard]);

  if (hideOnDashboard || !widgetsReady) {
    return null;
  }

  return (
    <>
      <UserWayWidget />
      <CookieConsent />
    </>
  );
}
