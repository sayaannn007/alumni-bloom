import { useCallback } from "react";

type HapticType = "light" | "medium" | "heavy" | "success" | "warning" | "error";

// Get settings from localStorage directly to avoid circular dependency
const getSettings = () => {
  try {
    const stored = localStorage.getItem("alumniconnect-settings");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore
  }
  return { hapticEnabled: true };
};

export const useHaptics = () => {
  const vibrate = useCallback((type: HapticType) => {
    const { hapticEnabled } = getSettings();
    if (!hapticEnabled) return;
    if (!("vibrate" in navigator)) return;

    try {
      switch (type) {
        case "light":
          navigator.vibrate(10);
          break;
        case "medium":
          navigator.vibrate(25);
          break;
        case "heavy":
          navigator.vibrate(50);
          break;
        case "success":
          navigator.vibrate([10, 50, 10]);
          break;
        case "warning":
          navigator.vibrate([30, 50, 30]);
          break;
        case "error":
          navigator.vibrate([50, 100, 50, 100, 50]);
          break;
      }
    } catch (e) {
      // Haptics not supported
    }
  }, []);

  return { vibrate };
};
