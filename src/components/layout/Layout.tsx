import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { PageShaderBackdrop } from "@/components/PageShaderBackdrop";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import { ScrollToTopOnNavigate } from "@/components/ScrollToTopOnNavigate";
import { useLenisScroll } from "@/hooks/useLenisScroll";
import { useScrollLockLayoutFix } from "@/hooks/useScrollLockLayoutFix";
import { cn } from "@/lib/utils";
import { isEServicesSubpage as checkEServicesSubpage } from "@/lib/eServicesRoutes";
import { isShaderBackdropPath } from "@/lib/shaderBackdropRoutes";

interface LayoutProps {
  children: ReactNode;
  /** Force the homepage water-plane behind sparse pages (e.g. 404). */
  shaderBackdrop?: boolean;
}

export function Layout({ children, shaderBackdrop }: LayoutProps) {
  const { pathname } = useLocation();
  const isHomePage = pathname === "/";
  const isServicesHub = pathname === "/services";
  const isContactPage = pathname === "/contact";
  const isAboutPage = pathname === "/about";
  const isAnnouncementsPage = pathname.startsWith("/announcements");
  const isAnnouncementsArchive = pathname === "/announcements";
  const isEServicesHub = pathname === "/e-services";
  const eServicesSubpage = checkEServicesSubpage(pathname);
  const useShaderBackdrop = shaderBackdrop ?? isShaderBackdropPath(pathname);
  const headerOverlaysHero =
    isHomePage ||
    isContactPage ||
    isAboutPage ||
    isAnnouncementsArchive ||
    isEServicesHub ||
    isServicesHub ||
    eServicesSubpage ||
    isShaderBackdropPath(pathname);

  useLenisScroll(headerOverlaysHero || isAnnouncementsPage);
  useScrollLockLayoutFix();

  return (
    <>
      <ScrollToTopOnNavigate />
      <div
        className={cn(
          "relative flex min-h-screen flex-col",
          (isHomePage || isAboutPage || isServicesHub || useShaderBackdrop) && "bg-transparent"
        )}
      >
        {useShaderBackdrop ? <PageShaderBackdrop /> : null}
        <Header />
        <main
          className={cn(
            "flex-1",
            useShaderBackdrop && "relative z-[1]",
            (!headerOverlaysHero || isShaderBackdropPath(pathname)) && "pt-[5.25rem] lg:pt-24",
            isAboutPage && "bg-transparent",
            isEServicesHub && "bg-transparent",
            isServicesHub && "bg-transparent",
            eServicesSubpage && "bg-transparent",
            useShaderBackdrop && "bg-transparent"
          )}
        >
          {children}
        </main>
        <Footer />
        <ScrollToTopButton />
      </div>
    </>
  );
}
