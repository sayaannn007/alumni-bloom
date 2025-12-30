import { motion } from "framer-motion";
import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";

interface GradientButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "aurora";
}

export function GradientButton({ 
  children, 
  className = "", 
  onClick,
  variant = "primary"
}: GradientButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const gradients = {
    primary: "from-primary via-accent to-primary",
    secondary: "from-secondary via-primary/50 to-secondary",
    aurora: "from-emerald-500 via-cyan-400 to-purple-500",
  };

  return (
    <motion.button
      className={cn(
        "relative overflow-hidden rounded-xl px-6 py-3 font-medium text-foreground",
        "transition-shadow duration-300",
        className
      )}
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Animated gradient background */}
      <motion.div
        className={cn(
          "absolute inset-0 bg-gradient-to-r",
          gradients[variant]
        )}
        animate={{
          backgroundPosition: isPressed ? "200% 0" : "0% 0",
        }}
        transition={{ duration: 0.5 }}
        style={{ backgroundSize: "200% 100%" }}
      />
      
      {/* Glow effect on press */}
      <motion.div
        className="absolute inset-0 opacity-0 bg-white/20"
        animate={{ opacity: isPressed ? 0.3 : 0 }}
        transition={{ duration: 0.2 }}
      />
      
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 opacity-0"
        animate={{
          opacity: [0, 0.5, 0],
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatDelay: 2,
        }}
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
        }}
      />
      
      {/* Content */}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
