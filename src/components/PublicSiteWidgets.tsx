import { useEffect } from "react";
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

  if (hideOnDashboard) {
    return null;
  }

  return (
    <>
      <UserWayWidget />
      <CookieConsent />
    </>
  );
}
