import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Trophy, UserPlus, Check, X, Sparkles, CheckCheck, Trash2 } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { useConnections } from "@/hooks/useConnections";
import { useAuth } from "@/contexts/AuthContext";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { useHaptics } from "@/hooks/useHaptics";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, formatDistanceToNow } from "date-fns";

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead,
    deleteNotification 
  } = useNotifications();
  const { pendingRequests, acceptConnection, rejectConnection } = useConnections();
  const { playSound } = useSoundEffects();
  const { vibrate } = useHaptics();

  // Combine persistent notifications with pending connection requests
  const combinedNotifications = [
    // Add pending connection requests that aren't already in notifications
    ...pendingRequests.map((request) => ({
      id: `connection-${request.id}`,
      type: "connection_request" as const,
      title: "New Connection Request",
      description: `${request.profile?.full_name || "Someone"} wants to connect with you`,
      created_at: request.created_at,
      is_read: false,
      data: request,
      isPersistent: false,
    })),
    // Add persistent notifications
    ...notifications.map((n) => ({
      ...n,
      isPersistent: true,
      data: null,
    })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const totalUnread = unreadCount + pendingRequests.length;

  const handleAcceptConnection = async (connectionId: string) => {
    const result = await acceptConnection(connectionId);
    if (result.success) {
      playSound("success");
      vibrate("success");
    }
  };

  const handleRejectConnection = async (connectionId: string) => {
    await rejectConnection(connectionId);
    vibrate("light");
  };

  const handleBellClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      playSound("click");
      vibrate("light");
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    vibrate("success");
  };

  const handleNotificationClick = (notification: typeof combinedNotifications[0]) => {
    if (notification.isPersistent && !notification.is_read) {
      markAsRead(notification.id);
    }
  };

  const handleDeleteNotification = (notificationId: string) => {
    deleteNotification(notificationId);
    vibrate("light");
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
          {totalUnread > 0 && (
            <motion.div
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <span className="text-[10px] font-bold text-primary-foreground">
                {totalUnread > 9 ? "9+" : totalUnread}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse Effect when notifications exist */}
        {totalUnread > 0 && (
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
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
                  <div className="flex items-center gap-2">
                    {totalUnread > 0 && (
                      <motion.span 
                        className="text-xs text-muted-foreground"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        {totalUnread} new
                      </motion.span>
                    )}
                    {notifications.some((n) => !n.is_read) && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 px-2 text-xs"
                        onClick={handleMarkAllAsRead}
                      >
                        <CheckCheck className="w-3 h-3 mr-1" />
                        Mark all read
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Notification List */}
              <ScrollArea className="max-h-80">
                {combinedNotifications.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <Bell className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">
                      No new notifications
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {combinedNotifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        className={`px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer relative group ${
                          !notification.is_read ? "bg-primary/5" : ""
                        }`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        {/* Unread indicator */}
                        {!notification.is_read && (
                          <motion.div
                            className="absolute left-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          />
                        )}

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
                            transition={{ delay: index * 0.03 + 0.1, type: "spring" }}
                          >
                            {notification.type === "achievement" ? (
                              <Trophy className="w-4 h-4 text-amber-400" />
                            ) : (
                              <UserPlus className="w-4 h-4 text-primary" />
                            )}
                          </motion.div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  {notification.title}
                                </p>
                                <p className="text-sm font-medium text-foreground truncate">
                                  {notification.description}
                                </p>
                              </div>
                              
                              {/* Delete button for persistent notifications */}
                              {notification.isPersistent && (
                                <button
                                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/20 rounded"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteNotification(notification.id);
                                  }}
                                >
                                  <Trash2 className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                                </button>
                              )}
                            </div>

                            {/* Timestamp */}
                            <p className="text-[10px] text-muted-foreground/70 mt-0.5">
                              {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                            </p>

                            {/* Connection Request Actions */}
                            {notification.type === "connection_request" && notification.data && (
                              <div className="flex gap-2 mt-2">
                                <Button
                                  size="sm"
                                  className="h-7 text-xs"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAcceptConnection(notification.data.id);
                                  }}
                                >
                                  <Check className="w-3 h-3 mr-1" />
                                  Accept
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-xs"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRejectConnection(notification.data.id);
                                  }}
                                >
                                  <X className="w-3 h-3 mr-1" />
                                  Decline
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {/* Footer */}
              {combinedNotifications.length > 0 && (
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
