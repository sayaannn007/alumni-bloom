import { motion, useScroll, useTransform } from "framer-motion";
import { ReactNode, useRef } from "react";

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  direction?: "up" | "down";
  fadeIn?: boolean;
  scale?: boolean;
  rotate?: boolean;
}

export function ParallaxSection({
  children,
  className = "",
  speed = 0.3,
  direction = "up",
  fadeIn = true,
  scale = false,
  rotate = false,
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const yValue = direction === "up" ? -100 * speed : 100 * speed;
  const y = useTransform(scrollYProgress, [0, 1], [yValue, -yValue]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scaleValue = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const rotateValue = useTransform(scrollYProgress, [0, 1], [-5, 5]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        y,
        opacity: fadeIn ? opacity : 1,
        scale: scale ? scaleValue : 1,
        rotate: rotate ? rotateValue : 0,
      }}
    >
      {children}
    </motion.div>
  );
}
