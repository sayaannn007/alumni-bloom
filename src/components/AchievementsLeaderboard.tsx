import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Medal, Crown, ChevronUp, Users } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

interface LeaderboardEntry {
  profile_id: string;
  full_name: string | null;
  avatar_url: string | null;
  total_points: number;
  achievement_count: number;
  rank: number;
}

export function AchievementsLeaderboard() {
  const { profile } = useProfile();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, [profile?.id]);

  async function fetchLeaderboard() {
    setLoading(true);

    // Get all user achievements with their points
    const { data: achievementsData, error: achievementsError } = await supabase
      .from("user_achievements")
      .select(`
        profile_id,
        achievement:achievements(points)
      `);

    if (achievementsError) {
      console.error("Error fetching achievements:", achievementsError);
      setLoading(false);
      return;
    }

    // Calculate total points per user
    const pointsMap = new Map<string, { total: number; count: number }>();
    
    achievementsData?.forEach((ua) => {
      const profileId = ua.profile_id;
      const points = (ua.achievement as unknown as { points: number })?.points || 0;
      
      if (!pointsMap.has(profileId)) {
        pointsMap.set(profileId, { total: 0, count: 0 });
      }
      
      const current = pointsMap.get(profileId)!;
      current.total += points;
      current.count += 1;
    });

    // Get profile info for users with achievements
    const profileIds = Array.from(pointsMap.keys());
    
    if (profileIds.length === 0) {
      setLeaderboard([]);
      setLoading(false);
      return;
    }

    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .in("id", profileIds);

    // Build leaderboard
    const leaderboardData: LeaderboardEntry[] = profileIds.map((profileId) => {
      const stats = pointsMap.get(profileId)!;
      const profileInfo = profiles?.find((p) => p.id === profileId);
      
      return {
        profile_id: profileId,
        full_name: profileInfo?.full_name || "Anonymous",
        avatar_url: profileInfo?.avatar_url,
        total_points: stats.total,
        achievement_count: stats.count,
        rank: 0,
      };
    });

    // Sort by points and assign ranks
    leaderboardData.sort((a, b) => b.total_points - a.total_points);
    leaderboardData.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    // Find current user's rank
    if (profile?.id) {
      const currentUserEntry = leaderboardData.find((e) => e.profile_id === profile.id);
      setUserRank(currentUserEntry || null);
    }

    setLeaderboard(leaderboardData.slice(0, 10));
    setLoading(false);
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-300" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankGradient = (rank: number) => {
    switch (rank) {
      case 1:
        return "from-yellow-500/20 to-amber-500/20 border-yellow-500/30";
      case 2:
        return "from-gray-300/20 to-gray-400/20 border-gray-400/30";
      case 3:
        return "from-amber-600/20 to-orange-600/20 border-amber-600/30";
      default:
        return "from-transparent to-transparent border-white/10";
    }
  };

  if (loading) {
    return (
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-display font-bold">Leaderboard</h3>
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            <Trophy className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-xl font-display font-bold">Leaderboard</h3>
            <p className="text-xs text-muted-foreground">Top achievers this month</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>{leaderboard.length}</span>
        </div>
      </div>

      {leaderboard.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No achievements yet. Be the first!</p>
        </div>
      ) : (
        <ScrollArea className="h-[400px] pr-2">
          <div className="space-y-2">
            <AnimatePresence>
              {leaderboard.map((entry, index) => (
                <motion.div
                  key={entry.profile_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r border transition-all hover:scale-[1.02] ${getRankGradient(entry.rank)} ${
                    entry.profile_id === profile?.id ? "ring-2 ring-primary/50" : ""
                  }`}
                >
                  {/* Rank */}
                  <div className="w-8 flex items-center justify-center">
                    {getRankIcon(entry.rank)}
                  </div>

                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-bold text-primary-foreground">
                    {entry.full_name?.charAt(0) || "?"}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {entry.full_name}
                      {entry.profile_id === profile?.id && (
                        <span className="ml-2 text-xs text-primary">(You)</span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {entry.achievement_count} achievements
                    </p>
                  </div>

                  {/* Points */}
                  <div className="text-right">
                    <p className="font-bold text-aurora">{entry.total_points}</p>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      )}

      {/* Current user rank if not in top 10 */}
      {userRank && userRank.rank > 10 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/10 border border-primary/20">
            <div className="w-8 flex items-center justify-center">
              <ChevronUp className="w-4 h-4 text-primary" />
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-bold text-primary-foreground">
              {userRank.full_name?.charAt(0) || "?"}
            </div>
            <div className="flex-1">
              <p className="font-medium">Your Rank: #{userRank.rank}</p>
              <p className="text-xs text-muted-foreground">
                {userRank.achievement_count} achievements
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-aurora">{userRank.total_points}</p>
              <p className="text-xs text-muted-foreground">points</p>
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
