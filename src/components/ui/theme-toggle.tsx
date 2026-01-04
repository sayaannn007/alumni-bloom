import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useInteractionFeedback } from "@/hooks/useInteractionFeedback";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { trigger } = useInteractionFeedback();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-12 h-12 rounded-2xl bg-muted animate-pulse" />
    );
  }

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    trigger("toggle");
    setIsAnimating(true);
    setTimeout(() => {
      setTheme(isDark ? "light" : "dark");
      setTimeout(() => setIsAnimating(false), 500);
    }, 150);
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 border border-border/50 flex items-center justify-center overflow-hidden group"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.85 }}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {/* Morphing background blob */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: isDark
            ? [
                "radial-gradient(circle at 30% 30%, hsl(250 100% 60% / 0.4), transparent 60%)",
                "radial-gradient(circle at 70% 70%, hsl(280 100% 60% / 0.4), transparent 60%)",
                "radial-gradient(circle at 30% 30%, hsl(250 100% 60% / 0.4), transparent 60%)",
              ]
            : [
                "radial-gradient(circle at 30% 30%, hsl(45 100% 60% / 0.4), transparent 60%)",
                "radial-gradient(circle at 70% 70%, hsl(35 100% 60% / 0.4), transparent 60%)",
                "radial-gradient(circle at 30% 30%, hsl(45 100% 60% / 0.4), transparent 60%)",
              ],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Particle explosion on toggle */}
      <AnimatePresence>
        {isAnimating && (
          <>
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  background: isDark
                    ? "hsl(45 100% 60%)"
                    : "hsl(250 100% 60%)",
                }}
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  x: Math.cos((i * 30 * Math.PI) / 180) * 30,
                  y: Math.sin((i * 30 * Math.PI) / 180) * 30,
                  opacity: [1, 1, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Rotating rays for sun */}
      <AnimatePresence mode="wait">
        {!isDark && (
          <motion.div
            key="rays"
            className="absolute inset-0"
            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
            transition={{ duration: 0.4, type: "spring" }}
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2 w-0.5 h-3 rounded-full bg-gradient-to-t from-amber-400/0 via-amber-400 to-orange-400"
                style={{
                  transformOrigin: "center 14px",
                  transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
                }}
                animate={{
                  opacity: [0.6, 1, 0.6],
                  scaleY: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.08,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stars for dark mode */}
      <AnimatePresence>
        {isDark && (
          <>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={`star-${i}`}
                className="absolute"
                style={{
                  top: `${20 + Math.random() * 60}%`,
                  left: `${20 + Math.random() * 60}%`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1, 0.8, 1],
                  opacity: [0, 1, 0.5, 1],
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              >
                <Sparkles className="w-2 h-2 text-primary" />
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Icon container with 3D flip */}
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ rotateY: -90, scale: 0, opacity: 0 }}
            animate={{ rotateY: 0, scale: 1, opacity: 1 }}
            exit={{ rotateY: 90, scale: 0, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
            className="relative z-10"
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Moon className="w-6 h-6 text-primary drop-shadow-[0_0_8px_hsl(var(--primary)/0.8)]" />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotateY: 90, scale: 0, opacity: 0 }}
            animate={{ rotateY: 0, scale: 1, opacity: 1 }}
            exit={{ rotateY: -90, scale: 0, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
            className="relative z-10"
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            >
              <Sun className="w-6 h-6 text-amber-500 drop-shadow-[0_0_10px_hsl(45_100%_50%/0.8)]" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glowing ring effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        animate={{
          boxShadow: isDark
            ? [
                "inset 0 0 15px hsl(250 100% 60% / 0.2), 0 0 20px hsl(250 100% 60% / 0.3)",
                "inset 0 0 20px hsl(280 100% 60% / 0.3), 0 0 30px hsl(280 100% 60% / 0.4)",
                "inset 0 0 15px hsl(250 100% 60% / 0.2), 0 0 20px hsl(250 100% 60% / 0.3)",
              ]
            : [
                "inset 0 0 15px hsl(45 100% 60% / 0.2), 0 0 20px hsl(45 100% 60% / 0.3)",
                "inset 0 0 20px hsl(35 100% 60% / 0.3), 0 0 30px hsl(35 100% 60% / 0.4)",
                "inset 0 0 15px hsl(45 100% 60% / 0.2), 0 0 20px hsl(45 100% 60% / 0.3)",
              ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.button>
  );
}
