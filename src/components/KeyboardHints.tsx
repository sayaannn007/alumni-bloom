import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Keyboard, X } from "lucide-react";

export const KeyboardHints = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Show hint after 3 seconds on first load
    const timer = setTimeout(() => {
      if (!hasShown) {
        setIsVisible(true);
        setHasShown(true);
        // Auto hide after 5 seconds
        setTimeout(() => setIsVisible(false), 5000);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [hasShown]);

  const shortcuts = [
    { keys: ["1-7"], description: "Jump to section" },
    { keys: ["↓", "J"], description: "Next section" },
    { keys: ["↑", "K"], description: "Previous section" },
    { keys: ["Home"], description: "Go to top" },
    { keys: ["End"], description: "Go to bottom" },
  ];

  return (
    <>
      {/* Toggle button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2 }}
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-6 left-6 z-50 p-3 rounded-full glass-card hover:bg-primary/20 transition-colors"
        title="Keyboard shortcuts"
      >
        <Keyboard className="w-5 h-5 text-foreground" />
      </motion.button>

      {/* Hints panel */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, x: -100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.8 }}
            transition={{ type: "spring", bounce: 0.3 }}
            className="fixed bottom-20 left-6 z-50 glass-card p-4 rounded-xl min-w-[200px]"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">
                Keyboard Shortcuts
              </h3>
              <button
                onClick={() => setIsVisible(false)}
                className="p-1 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-2">
              {shortcuts.map((shortcut, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex gap-1">
                    {shortcut.keys.map((key, j) => (
                      <kbd
                        key={j}
                        className="px-2 py-1 text-xs rounded bg-muted text-muted-foreground font-mono"
                      >
                        {key}
                      </kbd>
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {shortcut.description}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
