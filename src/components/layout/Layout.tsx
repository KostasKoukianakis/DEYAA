import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import { useLenisScroll } from "@/hooks/useLenisScroll";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { pathname } = useLocation();
  const isHomePage = pathname === "/";
  const isServicesPage = pathname === "/services";
  const isContactPage = pathname === "/contact";
  const headerOverlaysHero = isHomePage || isContactPage;

  useLenisScroll(headerOverlaysHero);

  return (
    <div
      className={cn(
        "relative flex min-h-screen flex-col",
        isServicesPage && "z-[10] bg-transparent",
        isHomePage && "bg-transparent"
      )}
    >
      <Header />
      <main
        className={cn(
          "flex-1",
          !headerOverlaysHero && "pt-[5.25rem] lg:pt-24",
          isServicesPage && "bg-transparent"
        )}
      >
        {children}
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
