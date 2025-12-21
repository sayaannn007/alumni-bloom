import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/GlassCard";
import { LiquidBlob } from "@/components/LiquidBlob";
import { Search, Users, ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";

const floatingAvatars = [
  { id: 1, delay: "0s", position: "top-20 left-[10%]", size: "w-12 h-12" },
  { id: 2, delay: "-5s", position: "top-32 right-[15%]", size: "w-14 h-14" },
  { id: 3, delay: "-2s", position: "bottom-40 left-[20%]", size: "w-10 h-10" },
  { id: 4, delay: "-7s", position: "bottom-32 right-[10%]", size: "w-16 h-16" },
  { id: 5, delay: "-3s", position: "top-48 left-[30%]", size: "w-11 h-11" },
];

export function HeroSection() {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-12 px-4">
      {/* Animated Background Blobs */}
      <LiquidBlob color="cyan" size="xl" className="top-0 left-0 -translate-x-1/2 -translate-y-1/2" />
      <LiquidBlob color="purple" size="lg" delay className="top-1/4 right-0 translate-x-1/3" />
      <LiquidBlob color="green" size="md" className="bottom-0 left-1/4" delay />
      <LiquidBlob color="mixed" size="lg" className="bottom-1/4 right-1/4" />

      {/* Floating Alumni Avatars */}
      {floatingAvatars.map((avatar) => (
        <div
          key={avatar.id}
          className={`absolute ${avatar.position} float opacity-70`}
          style={{ animationDelay: avatar.delay }}
        >
          <div className={`${avatar.size} rounded-full glass border-2 border-white/20 flex items-center justify-center`}>
            <span className="text-xs font-medium text-foreground/70">👤</span>
          </div>
        </div>
      ))}

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <Sparkles className="w-4 h-4 text-aurora-cyan" />
          <span className="text-sm font-medium text-muted-foreground">Your alumni network, reimagined</span>
        </div>

        {/* Main Heading */}
        <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight opacity-0 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <span className="text-foreground">Welcome to</span>
          <br />
          <span className="text-aurora">AlumniConnect</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 opacity-0 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          Reconnect with classmates, discover opportunities, and stay engaged with your alma mater through our futuristic alumni platform.
        </p>

        {/* Search Bar */}
        <GlassCard 
          className={`max-w-2xl mx-auto mb-10 p-2 opacity-0 animate-fade-in transition-all duration-300 ${searchFocused ? 'glass-glow scale-[1.02]' : ''}`}
          hover={false}
          style={{ animationDelay: "0.4s" }}
        >
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search alumni by name, batch, or company..."
                className="w-full bg-white/5 border-0 rounded-xl py-4 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>
            <Button variant="aurora" size="lg" className="hidden sm:flex">
              Search
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </GlassCard>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <Button variant="aurora" size="xl">
            <Users className="w-5 h-5" />
            Find Classmates
          </Button>
          <Button variant="glass" size="xl">
            Explore Events
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto opacity-0 animate-fade-in" style={{ animationDelay: "0.6s" }}>
          {[
            { value: "15K+", label: "Alumni" },
            { value: "500+", label: "Companies" },
            { value: "50+", label: "Countries" },
            { value: "200+", label: "Events/Year" },
          ].map((stat) => (
            <GlassCard key={stat.label} className="py-4 px-3 text-center" hover={false}>
              <div className="text-2xl sm:text-3xl font-display font-bold text-aurora mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 animate-fade-in" style={{ animationDelay: "0.8s" }}>
        <span className="text-xs text-muted-foreground">Scroll to explore</span>
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
        </div>
      </div>
    </section>
  );
}
