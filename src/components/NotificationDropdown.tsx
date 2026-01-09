import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Trophy, UserPlus, Check, X, Sparkles } from "lucide-react";
import { useAchievements } from "@/hooks/useAchievements";
import { useConnections } from "@/hooks/useConnections";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Notification {
  id: string;
  type: "achievement" | "connection_request";
  title: string;
  description: string;
  timestamp: Date;
  data?: any;
  isNew?: boolean;
}

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();
  const { profile } = useProfile();
  const { earnedAchievements, userAchievements, refetch: refetchAchievements } = useAchievements();
  const { pendingRequests, acceptConnection, rejectConnection, refetch: refetchConnections } = useConnections();
  const { playSound } = useSoundEffects();
  const previousNotificationIds = useRef<Set<string>>(new Set());

  // Build notifications from current data
  const buildNotifications = useCallback(() => {
    const newNotifications: Notification[] = [];

    // Add pending connection requests as notifications
    pendingRequests?.forEach((request) => {
      const notifId = `connection-${request.id}`;
      newNotifications.push({
        id: notifId,
        type: "connection_request",
        title: "New Connection Request",
        description: `${request.profile?.full_name || "Someone"} wants to connect with you`,
        timestamp: new Date(request.created_at),
        data: request,
        isNew: !previousNotificationIds.current.has(notifId),
      });
    });

    // Add recent achievements as notifications (last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    earnedAchievements?.forEach((userAchievement) => {
      const earnedAt = userAchievement.earned_at;
      if (earnedAt && new Date(earnedAt) > oneDayAgo && userAchievement.achievement) {
        const notifId = `achievement-${userAchievement.achievement_id}`;
        newNotifications.push({
          id: notifId,
          type: "achievement",
          title: "Achievement Unlocked!",
          description: userAchievement.achievement.name,
          timestamp: new Date(earnedAt),
          data: userAchievement.achievement,
          isNew: !previousNotificationIds.current.has(notifId),
        });
      }
    });

    // Sort by timestamp (newest first)
    newNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    return newNotifications;
  }, [pendingRequests, earnedAchievements]);

  // Update notifications and play sound for new ones
  useEffect(() => {
    const newNotifications = buildNotifications();
    
    // Check for truly new notifications (not in previous set)
    const hasNewNotification = newNotifications.some(n => n.isNew);
    
    if (hasNewNotification && previousNotificationIds.current.size > 0) {
      // Check if it's an achievement or connection
      const newAchievement = newNotifications.find(n => n.isNew && n.type === "achievement");
      const newConnection = newNotifications.find(n => n.isNew && n.type === "connection_request");
      
      if (newAchievement) {
        playSound("achievement");
      } else if (newConnection) {
        playSound("notification");
      }
    }

    // Update the previous IDs set
    previousNotificationIds.current = new Set(newNotifications.map(n => n.id));
    
    // Clear isNew flag after setting
    setNotifications(newNotifications.map(n => ({ ...n, isNew: false })));
  }, [buildNotifications, playSound]);

  // Real-time subscription for connections
  useEffect(() => {
    if (!profile?.id) return;

    const channel = supabase
      .channel('notifications-connections')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'connections',
          filter: `recipient_id=eq.${profile.id}`,
        },
        (payload) => {
          console.log('Connection change:', payload);
          // Refetch connections to update notifications
          refetchConnections();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.id, refetchConnections]);

  // Real-time subscription for achievements
  useEffect(() => {
    if (!profile?.id) return;

    const channel = supabase
      .channel('notifications-achievements')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_achievements',
          filter: `profile_id=eq.${profile.id}`,
        },
        (payload) => {
          console.log('New achievement:', payload);
          // Refetch achievements to update notifications
          refetchAchievements();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.id, refetchAchievements]);

  const unreadCount = notifications.length;

  const handleAcceptConnection = async (connectionId: string) => {
    await acceptConnection(connectionId);
    playSound("success");
    setNotifications((prev) =>
      prev.filter((n) => n.id !== `connection-${connectionId}`)
    );
  };

  const handleRejectConnection = async (connectionId: string) => {
    await rejectConnection(connectionId);
    setNotifications((prev) =>
      prev.filter((n) => n.id !== `connection-${connectionId}`)
    );
  };

  const handleBellClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      playSound("click");
    }
  };

  if (!user) return null;

  return (
    <div className="relative">
      {/* Bell Button */}
      <motion.button
        className="relative w-10 h-10 rounded-full glass flex items-center justify-center hover:glass-glow transition-all duration-300"
        onClick={handleBellClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Bell className="w-5 h-5 text-primary" />
        
        {/* Notification Badge */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.div
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <span className="text-[10px] font-bold text-primary-foreground">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse Effect when notifications exist */}
        {unreadCount > 0 && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(0, 242, 254, 0.3) 0%, transparent 70%)",
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
        )}
      </motion.button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              className="absolute right-0 mt-2 w-80 rounded-xl glass border border-white/10 shadow-2xl z-50 overflow-hidden"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              {/* Header */}
              <div className="px-4 py-3 border-b border-white/10 bg-gradient-to-r from-primary/10 to-secondary/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <motion.span 
                      className="text-xs text-muted-foreground"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      {unreadCount} new
                    </motion.span>
                  )}
                </div>
              </div>

              {/* Notification List */}
              <ScrollArea className="max-h-80">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <Bell className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">
                      No new notifications
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {notifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        className="px-4 py-3 hover:bg-white/5 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="flex items-start gap-3">
                          {/* Icon */}
                          <motion.div
                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              notification.type === "achievement"
                                ? "bg-gradient-to-br from-amber-400/20 to-orange-500/20"
                                : "bg-gradient-to-br from-primary/20 to-secondary/20"
                            }`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.05 + 0.1, type: "spring" }}
                          >
                            {notification.type === "achievement" ? (
                              <Trophy className="w-4 h-4 text-amber-400" />
                            ) : (
                              <UserPlus className="w-4 h-4 text-primary" />
                            )}
                          </motion.div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground">
                              {notification.title}
                            </p>
                            <p className="text-sm font-medium text-foreground truncate">
                              {notification.description}
                            </p>

                            {/* Connection Request Actions */}
                            {notification.type === "connection_request" && (
                              <div className="flex gap-2 mt-2">
                                <Button
                                  size="sm"
                                  className="h-7 text-xs"
                                  onClick={() =>
                                    handleAcceptConnection(notification.data.id)
                                  }
                                >
                                  <Check className="w-3 h-3 mr-1" />
                                  Accept
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-xs"
                                  onClick={() =>
                                    handleRejectConnection(notification.data.id)
                                  }
                                >
                                  <X className="w-3 h-3 mr-1" />
                                  Decline
                                </Button>
                              </div>
                            )}

                            {/* Achievement Badge */}
                            {notification.type === "achievement" && (
                              <motion.div 
                                className="flex items-center gap-1 mt-1"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.05 + 0.2 }}
                              >
                                <span className="text-xs text-amber-400">
                                  +{notification.data.points} points
                                </span>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="px-4 py-2 border-t border-white/10 bg-muted/30">
                  <button
                    className="text-xs text-primary hover:text-primary/80 transition-colors w-full text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Close
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
