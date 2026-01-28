import { motion, useScroll, useTransform } from "framer-motion";
import { ReactNode, useRef } from "react";

interface LiquidSceneTransitionProps {
  children: ReactNode;
  className?: string;
  variant?: "morph" | "wave" | "ripple" | "dissolve";
}

export function LiquidSceneTransition({
  children,
  className = "",
  variant = "morph",
}: LiquidSceneTransitionProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Different transform values based on variant
  const morphTransforms = {
    morph: {
      clipPath: useTransform(
        scrollYProgress,
        [0, 0.2, 0.8, 1],
        [
          "circle(0% at 50% 100%)",
          "circle(100% at 50% 50%)",
          "circle(100% at 50% 50%)",
          "circle(0% at 50% 0%)",
        ]
      ),
      scale: useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]),
      rotateX: useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [15, 0, 0, -15]),
    },
    wave: {
      clipPath: useTransform(
        scrollYProgress,
        [0, 0.3, 0.7, 1],
        [
          "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
          "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        ]
      ),
      scale: useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.95, 1, 1, 0.95]),
      rotateX: useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [10, 0, 0, -10]),
    },
    ripple: {
      clipPath: useTransform(
        scrollYProgress,
        [0, 0.25, 0.75, 1],
        [
          "ellipse(0% 0% at 50% 50%)",
          "ellipse(100% 100% at 50% 50%)",
          "ellipse(100% 100% at 50% 50%)",
          "ellipse(0% 0% at 50% 50%)",
        ]
      ),
      scale: useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.9, 1, 1, 0.9]),
      rotateX: useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [20, 0, 0, -20]),
    },
    dissolve: {
      clipPath: useTransform(
        scrollYProgress,
        [0, 0.2, 0.8, 1],
        [
          "inset(100% 0% 0% 0%)",
          "inset(0% 0% 0% 0%)",
          "inset(0% 0% 0% 0%)",
          "inset(0% 0% 100% 0%)",
        ]
      ),
      scale: useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1.1, 1, 1, 1.1]),
      rotateX: useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [5, 0, 0, -5]),
    },
  };

  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100, 0, 0, -100]);
  const blur = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [20, 0, 0, 20]);

  const transforms = morphTransforms[variant];

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        clipPath: transforms.clipPath,
        scale: transforms.scale,
        rotateX: transforms.rotateX,
        opacity,
        y,
        filter: useTransform(blur, (v) => `blur(${v}px)`),
        transformPerspective: 1200,
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </motion.div>
  );
}

// Wrapper for sections with liquid blob background effect
interface LiquidBlobWrapperProps {
  children: ReactNode;
  className?: string;
  color?: string;
}

export function LiquidBlobWrapper({
  children,
  className = "",
  color = "hsl(var(--primary))",
}: LiquidBlobWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const blobScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 1, 0.5]);
  const blobX = useTransform(scrollYProgress, [0, 0.5, 1], [-200, 0, 200]);
  const blobRotate = useTransform(scrollYProgress, [0, 1], [0, 180]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Liquid blob background */}
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 0 }}
      >
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
            left: "50%",
            top: "50%",
            x: blobX,
            scale: blobScale,
            rotate: blobRotate,
            translateX: "-50%",
            translateY: "-50%",
            filter: "blur(60px)",
          }}
        />
      </motion.div>
      
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
