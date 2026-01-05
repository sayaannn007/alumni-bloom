import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  badge_color: string;
  category: string;
  points: number;
  requirement_type: string;
  requirement_count: number;
}

export interface UserAchievement {
  id: string;
  profile_id: string;
  achievement_id: string;
  earned_at: string;
  progress: number;
  achievement?: Achievement;
}

export function useAchievements() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
  }, []);

  useEffect(() => {
    if (profile?.id) {
      fetchUserAchievements();
    }
  }, [profile?.id]);

  async function fetchAchievements() {
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .order("points", { ascending: true });

    if (!error && data) {
      setAchievements(data);
    }
    setLoading(false);
  }

  async function fetchUserAchievements() {
    if (!profile?.id) return;

    const { data, error } = await supabase
      .from("user_achievements")
      .select(`
        *,
        achievement:achievements(*)
      `)
      .eq("profile_id", profile.id);

    if (!error && data) {
      setUserAchievements(data as unknown as UserAchievement[]);
    }
  }

  async function checkAndAwardAchievement(requirementType: string, currentCount: number) {
    if (!profile?.id) return;

    const eligibleAchievements = achievements.filter(
      (a) => a.requirement_type === requirementType && currentCount >= a.requirement_count
    );

    for (const achievement of eligibleAchievements) {
      const alreadyEarned = userAchievements.some(
        (ua) => ua.achievement_id === achievement.id
      );

      if (!alreadyEarned) {
        const { error } = await supabase.from("user_achievements").insert({
          profile_id: profile.id,
          achievement_id: achievement.id,
          progress: currentCount,
        });

        if (!error) {
          fetchUserAchievements();
          return achievement;
        }
      }
    }

    return null;
  }

  async function updateProgress(requirementType: string, currentCount: number) {
    if (!profile?.id) return;

    const relevantAchievements = achievements.filter(
      (a) => a.requirement_type === requirementType
    );

    for (const achievement of relevantAchievements) {
      const existingUserAchievement = userAchievements.find(
        (ua) => ua.achievement_id === achievement.id
      );

      if (existingUserAchievement && !existingUserAchievement.earned_at) {
        await supabase
          .from("user_achievements")
          .update({ progress: currentCount })
          .eq("id", existingUserAchievement.id);
      }
    }

    return checkAndAwardAchievement(requirementType, currentCount);
  }

  const earnedAchievements = userAchievements.filter((ua) => ua.earned_at);
  const totalPoints = earnedAchievements.reduce((sum, ua) => {
    const achievement = achievements.find((a) => a.id === ua.achievement_id);
    return sum + (achievement?.points || 0);
  }, 0);

  return {
    achievements,
    userAchievements,
    earnedAchievements,
    totalPoints,
    loading,
    checkAndAwardAchievement,
    updateProgress,
    refetch: fetchUserAchievements,
  };
}
