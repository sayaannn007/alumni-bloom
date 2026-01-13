import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState, createContext, useContext, ReactNode } from "react";

interface ThemeTransitionContextType {
  triggerTransition: (x: number, y: number) => void;
}

const ThemeTransitionContext = createContext<ThemeTransitionContextType | undefined>(undefined);

export const useThemeTransition = () => {
  const context = useContext(ThemeTransitionContext);
  if (!context) {
    throw new Error("useThemeTransition must be used within ThemeTransitionProvider");
  }
  return context;
};

interface ThemeTransitionProviderProps {
  children: ReactNode;
}

export function ThemeTransitionProvider({ children }: ThemeTransitionProviderProps) {
  const { resolvedTheme } = useTheme();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const [prevTheme, setPrevTheme] = useState(resolvedTheme);

  useEffect(() => {
    if (resolvedTheme !== prevTheme && isTransitioning) {
      // Theme changed, keep animation running
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 800);
      return () => clearTimeout(timer);
    }
    setPrevTheme(resolvedTheme);
  }, [resolvedTheme, prevTheme, isTransitioning]);

  const triggerTransition = (x: number, y: number) => {
    setClickPosition({ x, y });
    setIsTransitioning(true);
  };

  // Calculate the maximum distance from click point to any corner
  const getMaxRadius = () => {
    if (typeof window === "undefined") return 2000;
    const { x, y } = clickPosition;
    const corners = [
      { x: 0, y: 0 },
      { x: window.innerWidth, y: 0 },
      { x: 0, y: window.innerHeight },
      { x: window.innerWidth, y: window.innerHeight },
    ];
    return Math.max(...corners.map((c) => Math.hypot(c.x - x, c.y - y))) * 1.1;
  };

  const isDark = resolvedTheme === "dark";

  return (
    <ThemeTransitionContext.Provider value={{ triggerTransition }}>
      {children}
      
      {/* Fullscreen ripple overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-[9999]"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Main expanding circle */}
            <motion.div
              className="absolute rounded-full"
              style={{
                left: clickPosition.x,
                top: clickPosition.y,
                x: "-50%",
                y: "-50%",
                background: isDark
                  ? "radial-gradient(circle, hsl(250 100% 20% / 0.8) 0%, hsl(280 100% 10% / 0.6) 50%, transparent 70%)"
                  : "radial-gradient(circle, hsl(45 100% 90% / 0.9) 0%, hsl(35 100% 95% / 0.7) 50%, transparent 70%)",
              }}
              initial={{ width: 0, height: 0 }}
              animate={{ 
                width: getMaxRadius() * 2, 
                height: getMaxRadius() * 2,
              }}
              transition={{ 
                duration: 0.7, 
                ease: [0.22, 1, 0.36, 1] 
              }}
            />

            {/* Secondary glow ring */}
            <motion.div
              className="absolute rounded-full"
              style={{
                left: clickPosition.x,
                top: clickPosition.y,
                x: "-50%",
                y: "-50%",
                border: isDark 
                  ? "3px solid hsl(250 100% 60% / 0.6)" 
                  : "3px solid hsl(45 100% 60% / 0.8)",
                boxShadow: isDark
                  ? "0 0 60px 20px hsl(250 100% 60% / 0.4), inset 0 0 60px 20px hsl(280 100% 60% / 0.2)"
                  : "0 0 60px 20px hsl(45 100% 60% / 0.5), inset 0 0 60px 20px hsl(35 100% 70% / 0.3)",
              }}
              initial={{ width: 0, height: 0, opacity: 1 }}
              animate={{ 
                width: getMaxRadius() * 2.2, 
                height: getMaxRadius() * 2.2,
                opacity: 0,
              }}
              transition={{ 
                duration: 0.8, 
                ease: "easeOut" 
              }}
            />

            {/* Particle burst */}
            {[...Array(16)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  left: clickPosition.x,
                  top: clickPosition.y,
                  background: isDark
                    ? `hsl(${250 + i * 10} 100% 60%)`
                    : `hsl(${35 + i * 5} 100% 60%)`,
                  boxShadow: isDark
                    ? `0 0 10px hsl(${250 + i * 10} 100% 60%)`
                    : `0 0 10px hsl(${35 + i * 5} 100% 70%)`,
                }}
                initial={{ 
                  scale: 0, 
                  x: 0, 
                  y: 0,
                  opacity: 1 
                }}
                animate={{
                  scale: [0, 1.5, 0],
                  x: Math.cos((i * 22.5 * Math.PI) / 180) * 150,
                  y: Math.sin((i * 22.5 * Math.PI) / 180) * 150,
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 0.6,
                  delay: 0.05,
                  ease: "easeOut",
                }}
              />
            ))}

            {/* Central flash */}
            <motion.div
              className="absolute rounded-full"
              style={{
                left: clickPosition.x,
                top: clickPosition.y,
                x: "-50%",
                y: "-50%",
                background: isDark
                  ? "radial-gradient(circle, hsl(280 100% 80%) 0%, transparent 70%)"
                  : "radial-gradient(circle, hsl(45 100% 100%) 0%, transparent 70%)",
              }}
              initial={{ width: 0, height: 0, opacity: 1 }}
              animate={{ 
                width: 200, 
                height: 200, 
                opacity: 0 
              }}
              transition={{ 
                duration: 0.4, 
                ease: "easeOut" 
              }}
            />

            {/* Morphing blob effect */}
            <motion.div
              className="absolute"
              style={{
                left: clickPosition.x,
                top: clickPosition.y,
                x: "-50%",
                y: "-50%",
                filter: "blur(40px)",
              }}
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <svg width="200" height="200" viewBox="0 0 200 200">
                <motion.path
                  fill={isDark ? "hsl(250, 100%, 50%)" : "hsl(45, 100%, 70%)"}
                  d="M 100,100 m -75,0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
                  animate={{
                    d: [
                      "M 100,100 m -75,0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0",
                      "M 100,100 m -60,-30 q 60,-50 120,0 q 50,60 0,120 q -60,50 -120,0 q -50,-60 0,-90",
                      "M 100,100 m -75,0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0",
                    ],
                  }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
              </svg>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ThemeTransitionContext.Provider>
  );
}
