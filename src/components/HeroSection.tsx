import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/GlassCard";
import { HeroScene } from "@/components/3d/HeroScene";
import { Search, Users, ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const floatingAvatars = [
  { id: 1, delay: 0, position: "top-20 left-[10%]", size: "w-12 h-12" },
  { id: 2, delay: 0.5, position: "top-32 right-[15%]", size: "w-14 h-14" },
  { id: 3, delay: 0.2, position: "bottom-40 left-[20%]", size: "w-10 h-10" },
  { id: 4, delay: 0.7, position: "bottom-32 right-[10%]", size: "w-16 h-16" },
  { id: 5, delay: 0.3, position: "top-48 left-[30%]", size: "w-11 h-11" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const glowVariants = {
  initial: { scale: 1, opacity: 0.5 },
  animate: {
    scale: [1, 1.1, 1],
    opacity: [0.5, 0.8, 0.5],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export function HeroSection() {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-12 px-4">
      {/* 3D Background Scene */}
      <HeroScene />

      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/80 pointer-events-none" />

      {/* Animated glow orbs (2D fallback/enhancement) */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-aurora-cyan/20 blur-[120px]"
        variants={glowVariants}
        initial="initial"
        animate="animate"
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-aurora-purple/20 blur-[100px]"
        variants={glowVariants}
        initial="initial"
        animate="animate"
        style={{ animationDelay: "2s" }}
      />

      {/* Floating Alumni Avatars */}
      {floatingAvatars.map((avatar) => (
        <motion.div
          key={avatar.id}
          className={`absolute ${avatar.position} opacity-70`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 0.7, 
            scale: 1,
            y: [0, -20, 0],
          }}
          transition={{
            opacity: { delay: avatar.delay + 0.5, duration: 0.5 },
            scale: { delay: avatar.delay + 0.5, duration: 0.5 },
            y: { delay: avatar.delay + 1, duration: 6, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <div className={`${avatar.size} rounded-full glass border-2 border-white/20 flex items-center justify-center backdrop-blur-xl`}>
            <span className="text-xs font-medium text-foreground/70">👤</span>
          </div>
        </motion.div>
      ))}

      {/* Hero Content */}
      <motion.div
        className="relative z-10 max-w-4xl mx-auto text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 hover-lift"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-4 h-4 text-aurora-cyan" />
          </motion.div>
          <span className="text-sm font-medium text-muted-foreground">Your alumni network, reimagined</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          variants={itemVariants}
          className="font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight"
        >
          <span className="text-foreground">Welcome to</span>
          <br />
          <motion.span 
            className="text-aurora inline-block"
            animate={{ 
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            style={{
              backgroundSize: "200% 200%",
            }}
          >
            AlumniConnect
          </motion.span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          Reconnect with classmates, discover opportunities, and stay engaged with your alma mater through our futuristic alumni platform.
        </motion.p>

        {/* Search Bar */}
        <motion.div variants={itemVariants}>
          <GlassCard 
            className={`max-w-2xl mx-auto mb-10 p-2 transition-all duration-500 ${
              searchFocused ? 'glass-glow scale-[1.02] border-aurora-cyan/50' : ''
            }`}
            hover={false}
          >
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <motion.div
                  animate={searchFocused ? { scale: 1.1, color: "#00f2fe" } : { scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                </motion.div>
                <input
                  type="text"
                  placeholder="Search alumni by name, batch, or company..."
                  className="w-full bg-white/5 border-0 rounded-xl py-4 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
              </div>
              <Button variant="aurora" size="lg" className="hidden sm:flex group">
                Search
                <motion.div
                  className="ml-1"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </Button>
            </div>
          </GlassCard>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Button variant="aurora" size="xl" className="magnetic-hover">
              <Users className="w-5 h-5" />
              Find Classmates
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Button variant="glass" size="xl" className="magnetic-hover">
              Explore Events
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={itemVariants}
          className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto"
        >
          {[
            { value: "15K+", label: "Alumni" },
            { value: "500+", label: "Companies" },
            { value: "50+", label: "Countries" },
            { value: "200+", label: "Events/Year" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <GlassCard className="py-4 px-3 text-center hover:glass-glow transition-all duration-300" hover={false}>
                <motion.div
                  className="text-2xl sm:text-3xl font-display font-bold text-aurora mb-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <span className="text-xs text-muted-foreground">Scroll to explore</span>
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2"
          animate={{ borderColor: ["rgba(255,255,255,0.2)", "rgba(0,242,254,0.5)", "rgba(255,255,255,0.2)"] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-primary"
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
