import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, formatDistanceToNow } from "date-fns";
import {
  Bell,
  Trophy,
  UserPlus,
  MessageSquare,
  Settings2,
  Search,
  Filter,
  Check,
  CheckCheck,
  Trash2,
  X,
  Calendar,
  Briefcase,
  Loader2,
} from "lucide-react";
import { useNotifications, Notification } from "@/hooks/useNotifications";
import { useNotificationPreferences } from "@/hooks/useNotificationPreferences";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const typeIcons: Record<string, React.ElementType> = {
  achievement: Trophy,
  connection_request: UserPlus,
  message: MessageSquare,
  system: Bell,
  event: Calendar,
  job: Briefcase,
};

const typeColors: Record<string, string> = {
  achievement: "text-amber-500 bg-amber-500/10",
  connection_request: "text-blue-500 bg-blue-500/10",
  message: "text-green-500 bg-green-500/10",
  system: "text-purple-500 bg-purple-500/10",
  event: "text-pink-500 bg-pink-500/10",
  job: "text-cyan-500 bg-cyan-500/10",
};

function NotificationItem({
  notification,
  onMarkRead,
  onDelete,
}: {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const Icon = typeIcons[notification.type] || Bell;
  const colorClass = typeColors[notification.type] || "text-muted-foreground bg-muted";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={`p-4 rounded-xl border transition-all ${
        notification.is_read
          ? "bg-background/50 border-border/30"
          : "bg-primary/5 border-primary/20 shadow-sm"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className={`font-medium ${notification.is_read ? "text-muted-foreground" : "text-foreground"}`}>
                {notification.title}
              </h4>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                {notification.description}
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {!notification.is_read && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => onMarkRead(notification.id)}
                  title="Mark as read"
                >
                  <Check className="w-4 h-4" />
                </Button>
              )}
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => onDelete(notification.id)}
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs capitalize">
              {notification.type.replace("_", " ")}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Notifications() {
  const { user } = useAuth();
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  } = useNotifications();
  const { preferences, updatePreference } = useNotificationPreferences();
  const { isSupported, isSubscribed, toggle: togglePush, isLoading: pushLoading } = usePushNotifications();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !n.title.toLowerCase().includes(query) &&
          !n.description.toLowerCase().includes(query)
        ) {
          return false;
        }
      }
      // Type filter
      if (filterType !== "all" && n.type !== filterType) {
        return false;
      }
      // Unread filter
      if (showUnreadOnly && n.is_read) {
        return false;
      }
      return true;
    });
  }, [notifications, searchQuery, filterType, showUnreadOnly]);

  const notificationTypes = useMemo(() => {
    const types = new Set(notifications.map((n) => n.type));
    return ["all", ...Array.from(types)];
  }, [notifications]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Bell className="w-8 h-8 text-primary" />
              Notifications
            </h1>
            {unreadCount > 0 && (
              <Badge className="bg-primary text-primary-foreground">
                {unreadCount} unread
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            Stay updated on achievements, connections, and messages
          </p>
        </motion.div>

        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="w-4 h-4" />
              All Notifications
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings2 className="w-4 h-4" />
              Preferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="pt-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search notifications..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-muted-foreground" />
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="bg-background border border-input rounded-md px-3 py-2 text-sm"
                      >
                        {notificationTypes.map((type) => (
                          <option key={type} value={type}>
                            {type === "all" ? "All types" : type.replace("_", " ")}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={showUnreadOnly}
                        onCheckedChange={setShowUnreadOnly}
                        id="unread-only"
                      />
                      <label htmlFor="unread-only" className="text-sm text-muted-foreground">
                        Unread only
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? "s" : ""}
              </span>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <Button variant="outline" size="sm" onClick={markAllAsRead} className="gap-2">
                    <CheckCheck className="w-4 h-4" />
                    Mark all read
                  </Button>
                )}
                {notifications.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllNotifications}
                    className="gap-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear all
                  </Button>
                )}
              </div>
            </div>

            {/* Notification List */}
            <ScrollArea className="h-[600px] pr-4">
              {loading ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : filteredNotifications.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-40 text-muted-foreground"
                >
                  <Bell className="w-12 h-12 mb-4 opacity-30" />
                  <p>No notifications found</p>
                  {(searchQuery || filterType !== "all" || showUnreadOnly) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2"
                      onClick={() => {
                        setSearchQuery("");
                        setFilterType("all");
                        setShowUnreadOnly(false);
                      }}
                    >
                      Clear filters
                    </Button>
                  )}
                </motion.div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {filteredNotifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onMarkRead={markAsRead}
                        onDelete={deleteNotification}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            {/* Push Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  Push Notifications
                </CardTitle>
                <CardDescription>
                  Receive notifications even when you're not on the site
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Browser Push Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      {!isSupported
                        ? "Not supported in this browser"
                        : isSubscribed
                        ? "You'll receive push notifications"
                        : "Enable to receive push alerts"}
                    </p>
                  </div>
                  <Switch
                    checked={isSubscribed}
                    onCheckedChange={togglePush}
                    disabled={!isSupported || pushLoading}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Notification Types */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings2 className="w-5 h-5 text-primary" />
                  Notification Types
                </CardTitle>
                <CardDescription>
                  Choose which notifications you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${typeColors.achievement}`}>
                      <Trophy className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium">Achievements</p>
                      <p className="text-sm text-muted-foreground">When you unlock new achievements</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.achievements}
                    onCheckedChange={(v) => updatePreference("achievements", v)}
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${typeColors.message}`}>
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium">Messages</p>
                      <p className="text-sm text-muted-foreground">When you receive new messages</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.messages}
                    onCheckedChange={(v) => updatePreference("messages", v)}
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${typeColors.connection_request}`}>
                      <UserPlus className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium">Connections</p>
                      <p className="text-sm text-muted-foreground">Connection requests and updates</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.connections}
                    onCheckedChange={(v) => updatePreference("connections", v)}
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${typeColors.event}`}>
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium">Events</p>
                      <p className="text-sm text-muted-foreground">Event reminders and updates</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.events}
                    onCheckedChange={(v) => updatePreference("events", v)}
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${typeColors.job}`}>
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium">Jobs</p>
                      <p className="text-sm text-muted-foreground">New job postings and applications</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.jobs}
                    onCheckedChange={(v) => updatePreference("jobs", v)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
