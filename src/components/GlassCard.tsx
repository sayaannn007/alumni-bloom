import { cn } from "@/lib/utils";
import { ReactNode, CSSProperties } from "react";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  intense?: boolean;
  premium?: boolean;
  iridescent?: boolean;
  style?: CSSProperties;
}

export function GlassCard({ 
  children, 
  className, 
  hover = true,
  glow = false,
  intense = false,
  premium = false,
  iridescent = false,
  style
}: GlassCardProps) {
  if (premium) {
    return (
      <motion.div
        className={cn(
          "rounded-2xl p-6 premium-card",
          intense ? "glass-intense" : "glass",
          glow && "glass-glow",
          iridescent && "iridescent-border",
          className
        )}
        style={style}
        whileHover={{ scale: 1.02, y: -8 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-2xl p-6 transition-all duration-300",
        intense ? "glass-intense" : "glass",
        glow && "glass-glow",
        hover && "hover:scale-[1.02] hover:glass-intense",
        iridescent && "iridescent-border",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}
