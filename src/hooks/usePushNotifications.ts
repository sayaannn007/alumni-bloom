import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";

// VAPID public key - in production, generate your own pair
const VAPID_PUBLIC_KEY = "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushNotifications() {
  const { profile } = useProfile();
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [permission, setPermission] = useState<NotificationPermission>("default");

  // Check if push notifications are supported
  useEffect(() => {
    const supported = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
    setIsSupported(supported);
    if (supported) {
      setPermission(Notification.permission);
    }
  }, []);

  // Check existing subscription
  const checkSubscription = useCallback(async () => {
    if (!isSupported || !profile?.id) {
      setIsLoading(false);
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        // Verify it exists in database
        const { data } = await supabase
          .from("push_subscriptions")
          .select("id")
          .eq("profile_id", profile.id)
          .eq("endpoint", subscription.endpoint)
          .single();
        
        setIsSubscribed(!!data);
      } else {
        setIsSubscribed(false);
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isSupported, profile?.id]);

  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  // Register service worker
  const registerServiceWorker = async () => {
    if (!isSupported) return null;
    
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;
      return registration;
    } catch (error) {
      console.error("Service worker registration failed:", error);
      return null;
    }
  };

  // Subscribe to push notifications
  const subscribe = async () => {
    if (!profile?.id) {
      toast.error("Please sign in to enable notifications");
      return false;
    }

    setIsLoading(true);
    
    try {
      // Request permission
      const permissionResult = await Notification.requestPermission();
      setPermission(permissionResult);
      
      if (permissionResult !== "granted") {
        toast.error("Notification permission denied");
        setIsLoading(false);
        return false;
      }

      // Register service worker
      const registration = await registerServiceWorker();
      if (!registration) {
        toast.error("Failed to register service worker");
        setIsLoading(false);
        return false;
      }

      // Subscribe to push
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      const subscriptionJson = subscription.toJSON();
      
      // Save to database
      const { error } = await supabase
        .from("push_subscriptions")
        .upsert({
          profile_id: profile.id,
          endpoint: subscriptionJson.endpoint!,
          p256dh: subscriptionJson.keys!.p256dh,
          auth: subscriptionJson.keys!.auth,
        }, {
          onConflict: "profile_id,endpoint"
        });

      if (error) {
        console.error("Error saving subscription:", error);
        toast.error("Failed to save notification settings");
        setIsLoading(false);
        return false;
      }

      setIsSubscribed(true);
      toast.success("Push notifications enabled!");
      return true;
    } catch (error) {
      console.error("Error subscribing:", error);
      toast.error("Failed to enable notifications");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Unsubscribe from push notifications
  const unsubscribe = async () => {
    if (!profile?.id) return false;
    
    setIsLoading(true);
    
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
        
        // Remove from database
        await supabase
          .from("push_subscriptions")
          .delete()
          .eq("profile_id", profile.id)
          .eq("endpoint", subscription.endpoint);
      }

      setIsSubscribed(false);
      toast.success("Push notifications disabled");
      return true;
    } catch (error) {
      console.error("Error unsubscribing:", error);
      toast.error("Failed to disable notifications");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const toggle = async () => {
    if (isSubscribed) {
      return unsubscribe();
    } else {
      return subscribe();
    }
  };

  return {
    isSupported,
    isSubscribed,
    isLoading,
    permission,
    subscribe,
    unsubscribe,
    toggle,
  };
}
