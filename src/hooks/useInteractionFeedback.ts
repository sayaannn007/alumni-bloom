import { useCallback } from "react";
import { useSoundEffects } from "./useSoundEffects";
import { useHaptics } from "./useHaptics";

type FeedbackType = "click" | "hover" | "success" | "error" | "toggle";

export const useInteractionFeedback = () => {
  const { playSound } = useSoundEffects();
  const { vibrate } = useHaptics();

  const trigger = useCallback(
    (type: FeedbackType) => {
      switch (type) {
        case "click":
          playSound("click");
          vibrate("light");
          break;
        case "hover":
          playSound("hover");
          break;
        case "success":
          playSound("success");
          vibrate("success");
          break;
        case "error":
          playSound("error");
          vibrate("error");
          break;
        case "toggle":
          playSound("pop");
          vibrate("medium");
          break;
      }
    },
    [playSound, vibrate]
  );

  return { trigger };
};
