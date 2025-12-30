import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { ReactNode, MouseEvent } from "react";
import { cn } from "@/lib/utils";

interface GradientCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function GradientCard({ children, className, onClick }: GradientCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const background = useMotionTemplate`
    radial-gradient(
      350px circle at ${mouseX}px ${mouseY}px,
      hsl(var(--primary) / 0.15),
      hsl(var(--accent) / 0.1) 40%,
      transparent 80%
    )
  `;

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-2xl p-6",
        "glass border border-white/10",
        "transition-all duration-300",
        "hover:border-primary/30",
        className
      )}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Gradient follow mouse */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background }}
      />
      
      {/* Border glow on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0"
        whileHover={{ opacity: 1 }}
        style={{
          background: "linear-gradient(135deg, hsl(var(--primary) / 0.2), transparent 50%, hsl(var(--accent) / 0.2))",
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
