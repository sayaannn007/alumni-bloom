import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, ReactNode, MouseEvent } from "react";

interface RippleEffect {
  id: number;
  x: number;
  y: number;
}

interface GradientRippleProps {
  children: ReactNode;
  className?: string;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  disabled?: boolean;
}

export function GradientRipple({ 
  children, 
  className = "", 
  onClick,
  disabled = false 
}: GradientRippleProps) {
  const [ripples, setRipples] = useState<RippleEffect[]>([]);

  const handleClick = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { id, x, y }]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
    }, 1000);

    onClick?.(e);
  }, [onClick, disabled]);

  return (
    <div
      className={`relative overflow-hidden cursor-pointer ${className}`}
      onClick={handleClick}
    >
      {children}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute pointer-events-none rounded-full"
            style={{
              left: ripple.x - 50,
              top: ripple.y - 50,
              width: 100,
              height: 100,
              background: "radial-gradient(circle, hsl(var(--primary) / 0.5), hsl(var(--accent) / 0.3), transparent)",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
