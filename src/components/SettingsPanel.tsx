import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Settings,
  X,
  Volume2,
  VolumeX,
  Sparkles,
  Vibrate,
  MousePointer2,
  Layers,
  RotateCcw,
  SlidersHorizontal,
  Bell,
  Mail,
  MessageSquare,
  Users,
} from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useInteractionFeedback } from "@/hooks/useInteractionFeedback";

export const SettingsPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { settings, updateSetting, resetSettings } = useSettings();
  const { trigger } = useInteractionFeedback();

  const togglePanel = () => {
    trigger("toggle");
    setIsOpen(!isOpen);
  };

  const handleReset = () => {
    trigger("success");
    resetSettings();
  };

  return (
    <>
      {/* Settings toggle button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.5 }}
        onClick={togglePanel}
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full glass-card hover:bg-primary/20 transition-colors group"
        title="Settings"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Settings className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
        </motion.div>
      </motion.button>

      {/* Settings panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed right-4 top-1/2 -translate-y-1/2 z-50 w-80 max-h-[80vh] overflow-y-auto glass-card rounded-2xl p-6 border border-border/50"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-bold text-foreground">Settings</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Sound Settings */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    {settings.soundEnabled ? (
                      <Volume2 className="w-4 h-4 text-primary" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-muted-foreground" />
                    )}
                    Sound
                  </h3>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Enable sounds</span>
                    <Switch
                      checked={settings.soundEnabled}
                      onCheckedChange={(checked) => updateSetting("soundEnabled", checked)}
                    />
                  </div>

                  {settings.soundEnabled && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Volume</span>
                        <span className="text-xs text-primary font-mono">
                          {Math.round(settings.soundVolume * 100)}%
                        </span>
                      </div>
                      <Slider
                        value={[settings.soundVolume * 100]}
                        onValueChange={([v]) => updateSetting("soundVolume", v / 100)}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                    </motion.div>
                  )}
                </div>

                <div className="h-px bg-border/50" />

                {/* Animation Settings */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Animations
                  </h3>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Intensity</span>
                      <span className="text-xs text-primary font-mono">
                        {settings.animationIntensity === 0
                          ? "Off"
                          : settings.animationIntensity < 0.5
                          ? "Low"
                          : settings.animationIntensity < 1
                          ? "Medium"
                          : "Full"}
                      </span>
                    </div>
                    <Slider
                      value={[settings.animationIntensity * 100]}
                      onValueChange={([v]) => updateSetting("animationIntensity", v / 100)}
                      max={100}
                      step={25}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Particle density</span>
                      <span className="text-xs text-primary font-mono">
                        {settings.particleCount === 0
                          ? "None"
                          : settings.particleCount < 0.5
                          ? "Low"
                          : settings.particleCount < 1
                          ? "Normal"
                          : "High"}
                      </span>
                    </div>
                    <Slider
                      value={[settings.particleCount * 100]}
                      onValueChange={([v]) => updateSetting("particleCount", v / 100)}
                      max={150}
                      step={25}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="h-px bg-border/50" />

                {/* Effects Toggles */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <MousePointer2 className="w-4 h-4 text-primary" />
                    Effects
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Vibrate className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Haptic feedback</span>
                      </div>
                      <Switch
                        checked={settings.hapticEnabled}
                        onCheckedChange={(checked) => updateSetting("hapticEnabled", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MousePointer2 className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Cursor trail</span>
                      </div>
                      <Switch
                        checked={settings.cursorTrailEnabled}
                        onCheckedChange={(checked) => updateSetting("cursorTrailEnabled", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Parallax effects</span>
                      </div>
                      <Switch
                        checked={settings.parallaxEnabled}
                        onCheckedChange={(checked) => updateSetting("parallaxEnabled", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Scroll snap</span>
                      </div>
                      <Switch
                        checked={settings.scrollSnapEnabled}
                        onCheckedChange={(checked) => updateSetting("scrollSnapEnabled", checked)}
                      />
                    </div>
                  </div>
                </div>

                <div className="h-px bg-border/50" />

                {/* Notification Settings */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Bell className="w-4 h-4 text-primary" />
                    Notifications
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Email notifications</span>
                      </div>
                      <Switch
                        checked={settings.emailNotifications}
                        onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Push notifications</span>
                      </div>
                      <Switch
                        checked={settings.pushNotifications}
                        onCheckedChange={(checked) => updateSetting("pushNotifications", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Message alerts</span>
                      </div>
                      <Switch
                        checked={settings.messageNotifications}
                        onCheckedChange={(checked) => updateSetting("messageNotifications", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Event reminders</span>
                      </div>
                      <Switch
                        checked={settings.eventReminders}
                        onCheckedChange={(checked) => updateSetting("eventReminders", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Connection requests</span>
                      </div>
                      <Switch
                        checked={settings.connectionRequests}
                        onCheckedChange={(checked) => updateSetting("connectionRequests", checked)}
                      />
                    </div>
                  </div>
                </div>

                <div className="h-px bg-border/50" />

                {/* Reset Button */}
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="w-full gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset to defaults
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
