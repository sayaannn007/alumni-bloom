import { useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef, RefObject } from "react";

interface UseParallaxOptions {
  speed?: number;
  direction?: "up" | "down" | "left" | "right";
  offset?: [string, string];
}

interface UseParallaxReturn {
  ref: RefObject<HTMLDivElement>;
  y: MotionValue<number>;
  x: MotionValue<number>;
  opacity: MotionValue<number>;
  scale: MotionValue<number>;
  rotate: MotionValue<number>;
}

export function useParallax({
  speed = 0.3,
  direction = "up",
  offset = ["start end", "end start"],
}: UseParallaxOptions = {}): UseParallaxReturn {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as ["start end", "end start"],
  });

  const yRange = direction === "up" ? [-100 * speed, 100 * speed] : [100 * speed, -100 * speed];
  const xRange = direction === "left" ? [-100 * speed, 100 * speed] : [100 * speed, -100 * speed];
  
  const y = useTransform(
    scrollYProgress, 
    [0, 1], 
    direction === "up" || direction === "down" ? yRange : [0, 0]
  );
  
  const x = useTransform(
    scrollYProgress, 
    [0, 1], 
    direction === "left" || direction === "right" ? xRange : [0, 0]
  );
  
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1, 0.85]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-3, 3]);

  return { ref, y, x, opacity, scale, rotate };
}
