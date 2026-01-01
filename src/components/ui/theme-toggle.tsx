import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-xl bg-muted animate-pulse" />
    );
  }

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-border/50 flex items-center justify-center overflow-hidden group"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {/* Background glow effect */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: isDark
            ? "radial-gradient(circle at center, hsl(45 100% 60% / 0.3), transparent 70%)"
            : "radial-gradient(circle at center, hsl(250 100% 60% / 0.3), transparent 70%)",
        }}
      />

      {/* Rotating rays for sun */}
      <AnimatePresence mode="wait">
        {!isDark && (
          <motion.div
            key="rays"
            className="absolute inset-0"
            initial={{ opacity: 0, rotate: -45 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 45 }}
            transition={{ duration: 0.3 }}
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2 w-0.5 h-2 bg-gradient-to-t from-amber-400/0 to-amber-400"
                style={{
                  transformOrigin: "center 10px",
                  transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
                }}
                animate={{
                  opacity: [0.5, 1, 0.5],
                  scale: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Icon container */}
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 180, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
            }}
            className="relative z-10"
          >
            <Moon className="w-5 h-5 text-primary" />
            {/* Stars around moon */}
            <motion.div
              className="absolute -top-1 -right-1 w-1 h-1 rounded-full bg-primary"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-0.5 -left-1 w-0.5 h-0.5 rounded-full bg-secondary"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ scale: 0, rotate: 180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: -180, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
            }}
            className="relative z-10"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sun className="w-5 h-5 text-amber-500" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ripple effect on click */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        whileTap={{
          boxShadow: isDark
            ? "0 0 0 4px hsl(45 100% 60% / 0.3)"
            : "0 0 0 4px hsl(250 100% 60% / 0.3)",
        }}
        transition={{ duration: 0.2 }}
      />
    </motion.button>
  );
}
