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
      className="fixed bottom-[4.85rem] right-4 z-40 rounded-full shadow-lg h-10 w-10 p-0 flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 lg:bottom-[5.35rem]"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
}

