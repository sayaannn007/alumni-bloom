import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Sparkles } from "lucide-react";
import { Achievement } from "@/hooks/useAchievements";
import { useEffect, useState } from "react";

interface AchievementToastProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export function AchievementToast({ achievement, onClose }: AchievementToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  return (
    <AnimatePresence>
      {isVisible && achievement && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100]"
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/90 to-secondary/90 backdrop-blur-xl border border-white/20 shadow-2xl">
            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-white/30"
                  initial={{ 
                    x: Math.random() * 300, 
                    y: Math.random() * 100,
                    scale: 0 
                  }}
                  animate={{ 
                    y: [null, -100],
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    delay: i * 0.2,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                />
              ))}
            </div>

            <div className="relative flex items-center gap-4 p-4 pr-6">
              {/* Trophy icon with glow */}
              <motion.div
                className={`w-16 h-16 rounded-xl bg-gradient-to-br ${achievement.badge_color} flex items-center justify-center shadow-lg`}
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(255,255,255,0.3)",
                    "0 0 40px rgba(255,255,255,0.5)",
                    "0 0 20px rgba(255,255,255,0.3)",
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Trophy className="w-8 h-8 text-white" />
              </motion.div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">
                    Achievement Unlocked!
                  </span>
                </div>
                <h4 className="text-lg font-display font-bold text-white">
                  {achievement.name}
                </h4>
                <p className="text-sm text-white/70">
                  {achievement.description}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm font-bold text-yellow-300">
                    +{achievement.points} points
                  </span>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(onClose, 300);
                }}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <span className="text-white text-sm">×</span>
              </button>
            </div>

            {/* Progress bar animation */}
            <motion.div
              className="h-1 bg-white/30"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 5, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
