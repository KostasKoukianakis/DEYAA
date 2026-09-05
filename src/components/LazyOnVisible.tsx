import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

interface LazyOnVisibleProps {
  children: ReactNode;
  minHeight?: CSSProperties["minHeight"];
  rootMargin?: string;
  className?: string;
}

/** Mounts children once the placeholder is near the viewport. */
export function LazyOnVisible({
  children,
  minHeight = "80vh",
  rootMargin = "480px 0px",
  className,
}: LazyOnVisibleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || show) return;

    const reveal = () => setShow(true);

    if (typeof IntersectionObserver === "undefined") {
      reveal();
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, show]);

  return (
    <div ref={ref} className={className} style={show ? undefined : { minHeight }}>
      {show ? children : null}
    </div>
  );
}
