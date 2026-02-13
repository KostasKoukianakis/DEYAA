import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 200);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <Button
      type="button"
      aria-label="Μετάβαση στην κορυφή της σελίδας"
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-40 rounded-full shadow-lg h-12 w-12 p-0 flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
}

