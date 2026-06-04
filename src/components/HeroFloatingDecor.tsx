import { motion, useReducedMotion } from "framer-motion";
import paymentsImg from "@/pages/images/payments.png";
import meterImg from "@/pages/images/Metrhths.png";
import documentsImg from "@/pages/images/lhpsharxeioy.png";
import outageImg from "@/pages/images/nowater.png";
import deyaLogo from "@/pages/images/deya_logo.png";
import { cn } from "@/lib/utils";

interface FloaterProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  delay?: number;
}

function Floater({ src, alt, className, imgClassName, delay = 0 }: FloaterProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
        transition={{ duration: 5 + delay, repeat: Infinity, ease: "easeInOut" }}
        className="rounded-2xl bg-white p-3 shadow-[0_16px_40px_rgba(11,61,107,0.14),0_4px_12px_rgba(0,0,0,0.06)] ring-1 ring-white/80"
      >
        <img
          src={src}
          alt={alt}
          className={cn("h-auto w-full object-contain select-none", imgClassName)}
          draggable={false}
        />
      </motion.div>
    </motion.div>
  );
}

/** Palladio-style product scatter — top of hero, above mesh gradient */
export function HeroFloatingDecor() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-[42vh] overflow-hidden"
      aria-hidden
    >
      <Floater
        src={paymentsImg}
        alt=""
        className="left-[2%] top-[18%] w-[clamp(100px,14vw,160px)] -rotate-12"
        delay={0.1}
      />
      <Floater
        src={meterImg}
        alt=""
        className="left-[22%] top-[4%] w-[clamp(90px,12vw,140px)] rotate-6"
        delay={0.25}
      />
      <Floater
        src={deyaLogo}
        alt=""
        imgClassName="max-h-14 md:max-h-16"
        className="left-1/2 top-[2%] w-[clamp(120px,16vw,180px)] -translate-x-1/2 rotate-2"
        delay={0.15}
      />
      <Floater
        src={documentsImg}
        alt=""
        className="right-[18%] top-[10%] w-[clamp(95px,13vw,150px)] -rotate-6"
        delay={0.35}
      />
      <Floater
        src={outageImg}
        alt=""
        className="right-[2%] top-[22%] w-[clamp(100px,14vw,155px)] rotate-12"
        delay={0.45}
      />
      {/* Soft edge fade so floaters blend into gradient */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-transparent to-transparent" />
    </div>
  );
}
