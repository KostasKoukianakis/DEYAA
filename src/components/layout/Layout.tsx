import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="relative z-[10] flex min-h-screen flex-col bg-transparent">
      <Header />
      <main className="flex-1 bg-transparent">{children}</main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
