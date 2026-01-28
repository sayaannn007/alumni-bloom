import { useCallback } from "react";
import { useSoundEffects } from "./useSoundEffects";
import { useHaptics } from "./useHaptics";

interface Use3DInteractionOptions {
  enableSound?: boolean;
  enableHaptics?: boolean;
}

export function use3DInteraction(options: Use3DInteractionOptions = {}) {
  const { enableSound = true, enableHaptics = true } = options;
  const { playSound } = useSoundEffects();
  const { vibrate } = useHaptics();

  const handleClick = useCallback(() => {
    if (enableSound) {
      playSound("click");
    }
    if (enableHaptics) {
      vibrate("medium");
    }
  }, [enableSound, enableHaptics, playSound, vibrate]);

  const handleHover = useCallback(() => {
    if (enableSound) {
      playSound("hover");
    }
    if (enableHaptics) {
      vibrate("light");
    }
  }, [enableSound, enableHaptics, playSound, vibrate]);

  const handleExplosion = useCallback(() => {
    if (enableSound) {
      playSound("pop");
    }
    if (enableHaptics) {
      vibrate("heavy");
    }
  }, [enableSound, enableHaptics, playSound, vibrate]);

  const handleTransition = useCallback(() => {
    if (enableSound) {
      playSound("whoosh");
    }
    if (enableHaptics) {
      vibrate("medium");
    }
  }, [enableSound, enableHaptics, playSound, vibrate]);

  return {
    handleClick,
    handleHover,
    handleExplosion,
    handleTransition,
  };
}
