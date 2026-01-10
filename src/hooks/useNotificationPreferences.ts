import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import type { Json } from "@/integrations/supabase/types";

export interface NotificationPreferences {
  achievements: boolean;
  messages: boolean;
  connections: boolean;
  events: boolean;
  jobs: boolean;
}

const defaultPreferences: NotificationPreferences = {
  achievements: true,
  messages: true,
  connections: true,
  events: true,
  jobs: true,
};

export function useNotificationPreferences() {
  const { profile } = useProfile();
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);
  const [loading, setLoading] = useState(true);

  const fetchPreferences = useCallback(async () => {
    if (!profile?.id) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("notification_preferences")
      .eq("id", profile.id)
      .single();

    if (!error && data?.notification_preferences) {
      const prefs = data.notification_preferences as unknown as NotificationPreferences;
      setPreferences({ ...defaultPreferences, ...prefs });
    }
  }, [profile?.id]);

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  const updatePreference = async (key: keyof NotificationPreferences, value: boolean) => {
    if (!profile?.id) return;

    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);

    const { error } = await supabase
      .from("profiles")
      .update({ notification_preferences: newPreferences as unknown as Json })
      .eq("id", profile.id);

    if (error) {
      console.error("Error updating preferences:", error);
      toast.error("Failed to save preference");
      // Revert on error
      setPreferences(preferences);
    }
  };

  const updateAllPreferences = async (newPreferences: NotificationPreferences) => {
    if (!profile?.id) return;

    setPreferences(newPreferences);

    const { error } = await supabase
      .from("profiles")
      .update({ notification_preferences: newPreferences as unknown as Json })
      .eq("id", profile.id);

    if (error) {
      console.error("Error updating preferences:", error);
      toast.error("Failed to save preferences");
      fetchPreferences();
    } else {
      toast.success("Preferences saved");
    }
  };

  const isEnabled = (type: string): boolean => {
    const typeMap: Record<string, keyof NotificationPreferences> = {
      achievement: "achievements",
      message: "messages",
      connection_request: "connections",
      event: "events",
      job: "jobs",
      system: "achievements", // System notifications follow achievements setting
    };
    const key = typeMap[type] || "achievements";
    return preferences[key];
  };

  return {
    preferences,
    loading,
    updatePreference,
    updateAllPreferences,
    isEnabled,
    refetch: fetchPreferences,
  };
}
