import { GlassCard } from "@/components/GlassCard";
import { 
  Activity, 
  Users, 
  Calendar, 
  TrendingUp, 
  MapPin, 
  Briefcase,
  MessageCircle,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";

const recentActivity = [
  { name: "Sarah Chen", action: "updated her profile", time: "2m ago", avatar: "SC" },
  { name: "James Wilson", action: "joined the network", time: "15m ago", avatar: "JW" },
  { name: "Priya Sharma", action: "posted a job opening", time: "1h ago", avatar: "PS" },
];

const upcomingEvents = [
  { title: "Annual Alumni Gala", date: "Dec 28", location: "Grand Ballroom" },
  { title: "Tech Networking Night", date: "Jan 5", location: "Innovation Hub" },
  { title: "Career Workshop", date: "Jan 12", location: "Virtual" },
];

export function DashboardCards() {
  return (
    <section id="dashboard" className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl mb-4">
            Your <span className="text-aurora">Dashboard</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Stay connected with your alumni community at a glance
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Recent Activity Card */}
          <GlassCard className="lg:col-span-2 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-aurora-cyan/20 to-aurora-purple/20 flex items-center justify-center">
                <Activity className="w-5 h-5 text-aurora-cyan" />
              </div>
              <h3 className="font-display font-semibold text-lg">Recent Activity</h3>
            </div>
            <div className="space-y-4">
              {recentActivity.map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-aurora-purple to-aurora-cyan flex items-center justify-center text-xs font-bold text-primary-foreground">
                    {item.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium text-foreground">{item.name}</span>{" "}
                      <span className="text-muted-foreground">{item.action}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* My Network Card */}
          <GlassCard className="opacity-0 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-aurora-green/20 to-aurora-cyan/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-aurora-green" />
              </div>
              <h3 className="font-display font-semibold text-lg">My Network</h3>
            </div>
            <div className="text-center py-4">
              <div className="text-4xl font-display font-bold text-aurora-green mb-2">248</div>
              <p className="text-sm text-muted-foreground mb-4">Connections</p>
              <div className="flex items-center justify-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-aurora-cyan" />
                <span className="text-muted-foreground">23 nearby</span>
              </div>
            </div>
            <Button variant="glass" className="w-full mt-4">
              Expand Network
            </Button>
          </GlassCard>

          {/* Profile Stats Card */}
          <GlassCard className="opacity-0 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-aurora-gold/20 to-aurora-purple/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-aurora-gold" />
              </div>
              <h3 className="font-display font-semibold text-lg">Profile Stats</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Profile Views</span>
                <span className="font-semibold">142</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-gradient-to-r from-aurora-cyan to-aurora-purple rounded-full" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Search Appearances</span>
                <span className="font-semibold">89</span>
              </div>
              <div className="flex items-center gap-1 text-aurora-gold">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-current" />
                ))}
                <span className="text-sm text-muted-foreground ml-2">Top 5%</span>
              </div>
            </div>
          </GlassCard>

          {/* Upcoming Events Card */}
          <GlassCard className="lg:col-span-2 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-aurora-purple/20 to-aurora-green/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-aurora-purple" />
              </div>
              <h3 className="font-display font-semibold text-lg">Upcoming Events</h3>
            </div>
            <div className="space-y-3">
              {upcomingEvents.map((event, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-aurora-purple/30 to-aurora-cyan/30 flex flex-col items-center justify-center">
                    <span className="text-xs font-bold text-aurora-purple">{event.date.split(" ")[0]}</span>
                    <span className="text-[10px] text-muted-foreground">{event.date.split(" ")[1]}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{event.title}</h4>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {event.location}
                    </div>
                  </div>
                  <Button variant="aurora" size="sm">RSVP</Button>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Career Opportunities Card */}
          <GlassCard className="lg:col-span-2 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-aurora-cyan/20 to-aurora-gold/20 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-aurora-cyan" />
              </div>
              <h3 className="font-display font-semibold text-lg">Career Opportunities</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { count: "45", label: "Open Positions", color: "from-aurora-cyan to-aurora-purple" },
                { count: "12", label: "Referral Requests", color: "from-aurora-green to-aurora-cyan" },
                { count: "8", label: "Mentorship Slots", color: "from-aurora-purple to-aurora-gold" },
              ].map((item, index) => (
                <div key={index} className="text-center p-4 rounded-xl bg-white/5">
                  <div className={`text-3xl font-display font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent mb-1`}>
                    {item.count}
                  </div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
            <Button variant="auroraGreen" className="w-full mt-6">
              Explore Opportunities
            </Button>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
