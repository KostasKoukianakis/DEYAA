import { ReactNode } from "react";
import { Header } from "./Header";

interface LayoutWithoutFooterProps {
  children: ReactNode;
}

export function LayoutWithoutFooter({ children }: LayoutWithoutFooterProps) {
  return (
    <div className="flex min-h-screen flex-col bg-transparent">
      <Header />
      <main className="flex-1 bg-transparent">{children}</main>
    </div>
  );
}

