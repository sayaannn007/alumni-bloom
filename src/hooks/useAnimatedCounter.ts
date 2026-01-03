import { useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

interface UseAnimatedCounterOptions {
  from?: number;
  to: number;
  duration?: number;
  delay?: number;
  decimals?: number;
}

export function useAnimatedCounter({
  from = 0,
  to,
  duration = 2,
  delay = 0,
  decimals = 0,
}: UseAnimatedCounterOptions) {
  const ref = useRef<HTMLElement>(null);
  const motionValue = useMotionValue(from);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const rounded = useTransform(motionValue, (latest) => {
    if (decimals > 0) {
      return latest.toFixed(decimals);
    }
    return Math.round(latest).toLocaleString();
  });

  useEffect(() => {
    if (isInView) {
      const controls = animate(motionValue, to, {
        duration,
        delay,
        ease: "easeOut",
      });
      return controls.stop;
    }
  }, [isInView, motionValue, to, duration, delay]);

  return { ref, value: rounded, isInView };
}
