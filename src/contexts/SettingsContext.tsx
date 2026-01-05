import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Settings {
  soundEnabled: boolean;
  soundVolume: number; // 0-1
  animationIntensity: number; // 0-1, 0 = reduced, 1 = full
  hapticEnabled: boolean;
  particleCount: number; // multiplier
  cursorTrailEnabled: boolean;
  parallaxEnabled: boolean;
  scrollSnapEnabled: boolean;
  // Notification settings
  emailNotifications: boolean;
  pushNotifications: boolean;
  messageNotifications: boolean;
  eventReminders: boolean;
  connectionRequests: boolean;
}

interface SettingsContextType {
  settings: Settings;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  resetSettings: () => void;
}

const defaultSettings: Settings = {
  soundEnabled: true,
  soundVolume: 0.5,
  animationIntensity: 1,
  hapticEnabled: true,
  particleCount: 1,
  cursorTrailEnabled: true,
  parallaxEnabled: true,
  scrollSnapEnabled: true,
  // Notification defaults
  emailNotifications: true,
  pushNotifications: true,
  messageNotifications: true,
  eventReminders: true,
  connectionRequests: true,
};

const STORAGE_KEY = "alumniconnect-settings";

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          return { ...defaultSettings, ...JSON.parse(stored) };
        } catch {
          return defaultSettings;
        }
      }
    }
    return defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
