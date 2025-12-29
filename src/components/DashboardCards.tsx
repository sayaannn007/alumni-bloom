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
import { motion } from "framer-motion";

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export function DashboardCards() {
  return (
    <section id="dashboard" className="py-20 px-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] rounded-full bg-aurora-cyan/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-aurora-purple/5 blur-[120px] pointer-events-none" />

      <motion.div 
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Section Header */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl mb-4">
            Your <span className="text-aurora animate-text-shimmer">Dashboard</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Stay connected with your alumni community at a glance
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Recent Activity Card */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <GlassCard premium iridescent className="h-full">
              <div className="flex items-center gap-3 mb-6">
                <motion.div 
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-aurora-cyan/20 to-aurora-purple/20 flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Activity className="w-5 h-5 text-aurora-cyan" />
                </motion.div>
                <h3 className="font-display font-semibold text-lg">Recent Activity</h3>
              </div>
              <div className="space-y-4">
                {recentActivity.map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 8 }}
                    className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group cursor-pointer"
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
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* My Network Card */}
          <motion.div variants={itemVariants}>
            <GlassCard premium className="h-full">
              <div className="flex items-center gap-3 mb-6">
                <motion.div 
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-aurora-green/20 to-aurora-cyan/20 flex items-center justify-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Users className="w-5 h-5 text-aurora-green" />
                </motion.div>
                <h3 className="font-display font-semibold text-lg">My Network</h3>
              </div>
              <div className="text-center py-4">
                <motion.div 
                  className="text-4xl font-display font-bold text-aurora-green mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                >
                  248
                </motion.div>
                <p className="text-sm text-muted-foreground mb-4">Connections</p>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-aurora-cyan" />
                  <span className="text-muted-foreground">23 nearby</span>
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Button variant="glass" className="w-full mt-4 magnetic-hover">
                  Expand Network
                </Button>
              </motion.div>
            </GlassCard>
          </motion.div>

          {/* Profile Stats Card */}
          <motion.div variants={itemVariants}>
            <GlassCard premium className="h-full">
              <div className="flex items-center gap-3 mb-6">
                <motion.div 
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-aurora-gold/20 to-aurora-purple/20 flex items-center justify-center"
                  whileHover={{ rotate: 15 }}
                >
                  <TrendingUp className="w-5 h-5 text-aurora-gold" />
                </motion.div>
                <h3 className="font-display font-semibold text-lg">Profile Stats</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Profile Views</span>
                  <span className="font-semibold">142</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-aurora-cyan to-aurora-purple rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: "75%" }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Search Appearances</span>
                  <span className="font-semibold">89</span>
                </div>
                <div className="flex items-center gap-1 text-aurora-gold">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.div
                      key={star}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: star * 0.1 }}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </motion.div>
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">Top 5%</span>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Upcoming Events Card */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <GlassCard premium iridescent className="h-full">
              <div className="flex items-center gap-3 mb-6">
                <motion.div 
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-aurora-purple/20 to-aurora-green/20 flex items-center justify-center"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Calendar className="w-5 h-5 text-aurora-purple" />
                </motion.div>
                <h3 className="font-display font-semibold text-lg">Upcoming Events</h3>
              </div>
              <div className="space-y-3">
                {upcomingEvents.map((event, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-aurora-purple/30 to-aurora-cyan/30 flex flex-col items-center justify-center group-hover:from-aurora-purple/50 group-hover:to-aurora-cyan/50 transition-all">
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
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="aurora" size="sm">RSVP</Button>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Career Opportunities Card */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <GlassCard premium className="h-full">
              <div className="flex items-center gap-3 mb-6">
                <motion.div 
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-aurora-cyan/20 to-aurora-gold/20 flex items-center justify-center"
                  whileHover={{ scale: 1.2 }}
                >
                  <Briefcase className="w-5 h-5 text-aurora-cyan" />
                </motion.div>
                <h3 className="font-display font-semibold text-lg">Career Opportunities</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { count: "45", label: "Open Positions", color: "from-aurora-cyan to-aurora-purple" },
                  { count: "12", label: "Referral Requests", color: "from-aurora-green to-aurora-cyan" },
                  { count: "8", label: "Mentorship Slots", color: "from-aurora-purple to-aurora-gold" },
                ].map((item, index) => (
                  <motion.div 
                    key={index} 
                    className="text-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <motion.div 
                      className={`text-3xl font-display font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent mb-1`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.15 }}
                    >
                      {item.count}
                    </motion.div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                  </motion.div>
                ))}
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button variant="auroraGreen" className="w-full mt-6 magnetic-hover">
                  Explore Opportunities
                </Button>
              </motion.div>
            </GlassCard>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
