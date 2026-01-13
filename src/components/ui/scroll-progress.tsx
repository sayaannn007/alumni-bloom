import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScrollProgressProps {
  className?: string;
  variant?: "gradient" | "glow" | "minimal" | "aurora";
  position?: "top" | "bottom";
  height?: number;
  showPercentage?: boolean;
}

export function ScrollProgress({ 
  className,
  variant = "aurora",
  position = "top",
  height = 3,
  showPercentage = false,
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const percentage = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const roundedPercentage = useTransform(percentage, (p) => Math.round(p));

  const variantStyles = {
    gradient: "bg-gradient-to-r from-primary via-secondary to-accent",
    glow: "bg-primary shadow-[0_0_20px_hsl(var(--primary)/0.8),0_0_40px_hsl(var(--primary)/0.4)]",
    minimal: "bg-foreground/30",
    aurora: "bg-gradient-to-r from-[hsl(185_100%_50%)] via-[hsl(280_100%_60%)] to-[hsl(155_100%_50%)]",
  };

  const positionStyles = {
    top: "top-0",
    bottom: "bottom-0",
  };

  return (
    <>
      <motion.div
        className={cn(
          "fixed left-0 right-0 z-[100] origin-left",
          positionStyles[position],
          variantStyles[variant],
          className
        )}
        style={{ 
          scaleX,
          height: `${height}px`,
        }}
      />
      
      {/* Glow effect for aurora variant */}
      {variant === "aurora" && (
        <motion.div
          className={cn(
            "fixed left-0 right-0 z-[99] origin-left pointer-events-none",
            positionStyles[position],
            "bg-gradient-to-r from-[hsl(185_100%_50%/0.5)] via-[hsl(280_100%_60%/0.5)] to-[hsl(155_100%_50%/0.5)]",
            "blur-sm"
          )}
          style={{ 
            scaleX,
            height: `${height * 2}px`,
          }}
        />
      )}

      {/* Percentage indicator */}
      {showPercentage && (
        <motion.div
          className={cn(
            "fixed right-4 z-[100] px-3 py-1.5 rounded-full",
            "bg-card/80 backdrop-blur-md border border-border/50",
            "text-xs font-mono font-medium",
            position === "top" ? "top-4" : "bottom-4"
          )}
          initial={{ opacity: 0, y: position === "top" ? -20 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.span className="text-aurora">{roundedPercentage}</motion.span>
          <span className="text-muted-foreground">%</span>
        </motion.div>
      )}
    </>
  );
}
