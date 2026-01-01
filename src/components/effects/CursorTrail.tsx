import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TrailPoint {
  id: number;
  x: number;
  y: number;
  color: string;
}

const trailColors = [
  "hsl(185 100% 50%)", // cyan
  "hsl(280 100% 60%)", // purple
  "hsl(155 100% 50%)", // green
  "hsl(35 100% 50%)",  // orange
];

export function CursorTrail() {
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [isActive, setIsActive] = useState(false);
  const idCounter = useRef(0);
  const lastPosition = useRef({ x: 0, y: 0 });
  const throttleTimer = useRef<number | null>(null);

  const addPoint = useCallback((x: number, y: number) => {
    const distance = Math.sqrt(
      Math.pow(x - lastPosition.current.x, 2) + 
      Math.pow(y - lastPosition.current.y, 2)
    );

    if (distance < 10) return;

    lastPosition.current = { x, y };
    const id = idCounter.current++;
    const color = trailColors[Math.floor(Math.random() * trailColors.length)];

    setTrail((prev) => [...prev.slice(-20), { id, x, y, color }]);

    setTimeout(() => {
      setTrail((prev) => prev.filter((p) => p.id !== id));
    }, 600);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (throttleTimer.current) return;

      throttleTimer.current = window.setTimeout(() => {
        throttleTimer.current = null;
        addPoint(e.clientX, e.clientY);
      }, 16);
    };

    const handleMouseEnter = () => setIsActive(true);
    const handleMouseLeave = () => setIsActive(false);

    window.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseenter", handleMouseEnter);
    document.body.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseenter", handleMouseEnter);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      if (throttleTimer.current) {
        clearTimeout(throttleTimer.current);
      }
    };
  }, [addPoint]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <AnimatePresence>
        {trail.map((point, index) => (
          <motion.div
            key={point.id}
            className="absolute rounded-full"
            style={{
              left: point.x,
              top: point.y,
              background: `radial-gradient(circle, ${point.color} 0%, transparent 70%)`,
            }}
            initial={{ 
              width: 24, 
              height: 24, 
              opacity: 0.8,
              x: -12,
              y: -12,
              scale: 1,
            }}
            animate={{ 
              width: 8, 
              height: 8, 
              opacity: 0,
              x: -4,
              y: -4,
              scale: 0.5,
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ 
              duration: 0.6, 
              ease: "easeOut",
            }}
          />
        ))}
      </AnimatePresence>
      
      {/* Cursor glow effect */}
      <motion.div
        className="absolute w-40 h-40 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsl(185 100% 50% / 0.15) 0%, transparent 70%)",
          left: lastPosition.current.x - 80,
          top: lastPosition.current.y - 80,
        }}
        animate={{
          left: lastPosition.current.x - 80,
          top: lastPosition.current.y - 80,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
      />
    </div>
  );
}
