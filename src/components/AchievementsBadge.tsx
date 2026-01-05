import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Users, Network, Calendar, CalendarCheck, 
  MessageCircle, MessageSquare, Briefcase, Building, 
  Sparkles, Trophy, Lock
} from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { useAchievements, Achievement, UserAchievement } from "@/hooks/useAchievements";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  User,
  Users,
  Network,
  Calendar,
  CalendarCheck,
  MessageCircle,
  MessageSquare,
  Briefcase,
  Building,
  Sparkles,
};

interface BadgeProps {
  achievement: Achievement;
  earned?: boolean;
  progress?: number;
  earnedAt?: string;
}

function Badge({ achievement, earned = false, progress = 0, earnedAt }: BadgeProps) {
  const IconComponent = iconMap[achievement.icon] || Trophy;
  const progressPercent = Math.min((progress / achievement.requirement_count) * 100, 100);

  return (
    <motion.div
      className={`relative group ${earned ? "cursor-pointer" : "opacity-60"}`}
      whileHover={{ scale: earned ? 1.05 : 1 }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      <GlassCard className={`p-4 h-full transition-all duration-300 ${earned ? "glass-glow" : ""}`}>
        <div className="flex flex-col items-center text-center">
          <motion.div
            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${achievement.badge_color} flex items-center justify-center mb-3 shadow-lg relative`}
            animate={earned ? {
              boxShadow: [
                "0 0 20px rgba(255,255,255,0.2)",
                "0 0 40px rgba(255,255,255,0.3)",
                "0 0 20px rgba(255,255,255,0.2)",
              ],
            } : {}}
            transition={{ duration: 2, repeat: earned ? Infinity : 0 }}
          >
            <IconComponent className="w-8 h-8 text-white" />
            {!earned && (
              <div className="absolute inset-0 bg-background/60 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Lock className="w-5 h-5 text-muted-foreground" />
              </div>
            )}
          </motion.div>

          <h4 className="font-semibold text-sm mb-1">{achievement.name}</h4>
          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{achievement.description}</p>

          {earned ? (
            <div className="flex items-center gap-1 text-xs text-primary">
              <Trophy className="w-3 h-3" />
              <span>+{achievement.points} pts</span>
            </div>
          ) : (
            <div className="w-full">
              <Progress value={progressPercent} className="h-1.5 mb-1" />
              <p className="text-xs text-muted-foreground">
                {progress}/{achievement.requirement_count}
              </p>
            </div>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
}

export function AchievementsBadge() {
  const { achievements, userAchievements, earnedAchievements, totalPoints, loading } = useAchievements();
  const [isOpen, setIsOpen] = useState(false);

  const earnedIds = new Set(earnedAchievements.map((ua) => ua.achievement_id));

  const getProgressForAchievement = (achievementId: string) => {
    const ua = userAchievements.find((u) => u.achievement_id === achievementId);
    return ua?.progress || 0;
  };

  const categorizedAchievements = achievements.reduce((acc, achievement) => {
    if (!acc[achievement.category]) {
      acc[achievement.category] = [];
    }
    acc[achievement.category].push(achievement);
    return acc;
  }, {} as Record<string, Achievement[]>);

  const categoryLabels: Record<string, string> = {
    profile: "Profile",
    networking: "Networking",
    events: "Events",
    messaging: "Messaging",
    jobs: "Career",
    special: "Special",
  };

  if (loading) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <motion.button
          className="fixed bottom-24 right-6 z-50 p-4 rounded-full bg-gradient-to-r from-primary to-secondary shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            boxShadow: [
              "0 0 20px rgba(0, 242, 254, 0.3)",
              "0 0 40px rgba(191, 0, 255, 0.4)",
              "0 0 20px rgba(0, 242, 254, 0.3)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Trophy className="w-6 h-6 text-primary-foreground" />
          {earnedAchievements.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center font-bold">
              {earnedAchievements.length}
            </span>
          )}
        </motion.button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[85vh] glass border-white/10">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                <Trophy className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold">Achievements</h2>
                <p className="text-sm text-muted-foreground">
                  {earnedAchievements.length}/{achievements.length} unlocked
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-aurora">{totalPoints}</div>
              <div className="text-xs text-muted-foreground">Total Points</div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-8">
            {Object.entries(categorizedAchievements).map(([category, categoryAchievements]) => (
              <div key={category}>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-secondary" />
                  {categoryLabels[category] || category}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <AnimatePresence>
                    {categoryAchievements.map((achievement, index) => (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Badge
                          achievement={achievement}
                          earned={earnedIds.has(achievement.id)}
                          progress={getProgressForAchievement(achievement.id)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
