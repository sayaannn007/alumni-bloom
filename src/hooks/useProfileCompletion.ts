import { useEffect, useRef, useCallback } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useAchievements } from "@/hooks/useAchievements";

const REQUIRED_FIELDS = [
  "full_name",
  "bio",
  "job_title",
  "company",
  "location",
] as const;

export function useProfileCompletion() {
  const { profile } = useProfile();
  const { checkAndAwardAchievement } = useAchievements();
  const hasChecked = useRef(false);

  // Calculate completion percentage
  const getCompletionPercentage = useCallback(() => {
    if (!profile) return 0;

    const filledFields = REQUIRED_FIELDS.filter((field) => {
      const value = profile[field];
      return value && String(value).trim().length > 0;
    });

    return Math.round((filledFields.length / REQUIRED_FIELDS.length) * 100);
  }, [profile]);

  const isComplete = useCallback(() => {
    if (!profile) return false;
    return REQUIRED_FIELDS.every((field) => {
      const value = profile[field];
      return value && String(value).trim().length > 0;
    });
  }, [profile]);

  const getMissingFields = useCallback(() => {
    if (!profile) return REQUIRED_FIELDS.map(String);
    
    return REQUIRED_FIELDS.filter((field) => {
      const value = profile[field];
      return !value || String(value).trim().length === 0;
    }).map((field) => {
      // Convert field names to readable format
      return field
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    });
  }, [profile]);

  // Check for profile completion achievement
  useEffect(() => {
    if (!profile || hasChecked.current) return;

    const checkProfileCompletion = async () => {
      if (isComplete()) {
        hasChecked.current = true;
        await checkAndAwardAchievement("profile_complete", 1);
      }
    };

    checkProfileCompletion();
  }, [profile, checkAndAwardAchievement, isComplete]);

  return {
    completionPercentage: getCompletionPercentage(),
    isComplete: isComplete(),
    missingFields: getMissingFields(),
  };
}
