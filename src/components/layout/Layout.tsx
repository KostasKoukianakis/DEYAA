import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import { ScrollToTopOnNavigate } from "@/components/ScrollToTopOnNavigate";
import { useLenisScroll } from "@/hooks/useLenisScroll";
import { useScrollLockLayoutFix } from "@/hooks/useScrollLockLayoutFix";
import { cn } from "@/lib/utils";
import { isEServicesSubpage as checkEServicesSubpage } from "@/lib/eServicesRoutes";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { pathname } = useLocation();
  const isHomePage = pathname === "/";
  const isServicesHub = pathname === "/services";
  const isContactPage = pathname === "/contact";
  const isAboutPage = pathname === "/about";
  const isAnnouncementsPage = pathname.startsWith("/announcements");
  const isAnnouncementsArchive = pathname === "/announcements";
  const isEServicesHub = pathname === "/e-services";
  const eServicesSubpage = checkEServicesSubpage(pathname);
  const headerOverlaysHero =
    isHomePage ||
    isContactPage ||
    isAboutPage ||
    isAnnouncementsArchive ||
    isEServicesHub ||
    isServicesHub ||
    eServicesSubpage;

  useLenisScroll(headerOverlaysHero || isAnnouncementsPage);
  useScrollLockLayoutFix();

  return (
    <>
      <ScrollToTopOnNavigate />
      <div
        className={cn(
          "relative flex min-h-screen flex-col",
          (isHomePage || isAboutPage || isServicesHub) && "bg-transparent"
        )}
      >
        <Header />
        <main
          className={cn(
            "flex-1",
            !headerOverlaysHero && "pt-[5.25rem] lg:pt-24",
            isAboutPage && "bg-transparent",
            isEServicesHub && "bg-transparent",
            isServicesHub && "bg-transparent",
            eServicesSubpage && "bg-transparent"
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
