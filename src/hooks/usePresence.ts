import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";

interface PresenceState {
  onlineUsers: Set<string>;
  typingUsers: Map<string, string>; // recipientId -> senderId
}

export function usePresence(currentProfileId: string | null) {
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [typingUsers, setTypingUsers] = useState<Map<string, string>>(new Map());
  const channelRef = useRef<RealtimeChannel | null>(null);
  const typingTimeoutRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    if (!currentProfileId) return;

    const channel = supabase.channel("presence-room", {
      config: {
        presence: { key: currentProfileId },
      },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const online = new Set<string>();
        
        Object.keys(state).forEach((key) => {
          online.add(key);
        });
        
        setOnlineUsers(online);
      })
      .on("presence", { event: "join" }, ({ key }) => {
        setOnlineUsers((prev) => new Set([...prev, key]));
      })
      .on("presence", { event: "leave" }, ({ key }) => {
        setOnlineUsers((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
      })
      .on("broadcast", { event: "typing" }, ({ payload }) => {
        const { senderId, recipientId, isTyping } = payload;
        
        // Only process if we're the recipient
        if (recipientId !== currentProfileId) return;

        setTypingUsers((prev) => {
          const next = new Map(prev);
          
          if (isTyping) {
            next.set(senderId, senderId);
            
            // Clear existing timeout for this sender
            const existingTimeout = typingTimeoutRef.current.get(senderId);
            if (existingTimeout) {
              clearTimeout(existingTimeout);
            }
            
            // Auto-clear typing after 3 seconds
            const timeout = setTimeout(() => {
              setTypingUsers((p) => {
                const n = new Map(p);
                n.delete(senderId);
                return n;
              });
            }, 3000);
            
            typingTimeoutRef.current.set(senderId, timeout);
          } else {
            next.delete(senderId);
          }
          
          return next;
        });
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            online_at: new Date().toISOString(),
            profile_id: currentProfileId,
          });
        }
      });

    channelRef.current = channel;

    return () => {
      // Clear all typing timeouts
      typingTimeoutRef.current.forEach((timeout) => clearTimeout(timeout));
      typingTimeoutRef.current.clear();
      
      supabase.removeChannel(channel);
    };
  }, [currentProfileId]);

  const sendTypingIndicator = useCallback(
    (recipientId: string, isTyping: boolean) => {
      if (!channelRef.current || !currentProfileId) return;

      channelRef.current.send({
        type: "broadcast",
        event: "typing",
        payload: {
          senderId: currentProfileId,
          recipientId,
          isTyping,
        },
      });
    },
    [currentProfileId]
  );

  const isUserOnline = useCallback(
    (profileId: string) => onlineUsers.has(profileId),
    [onlineUsers]
  );

  const isUserTyping = useCallback(
    (profileId: string) => typingUsers.has(profileId),
    [typingUsers]
  );

  return {
    onlineUsers,
    typingUsers,
    sendTypingIndicator,
    isUserOnline,
    isUserTyping,
  };
}
