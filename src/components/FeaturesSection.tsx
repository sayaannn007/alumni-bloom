import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Scene3D } from "@/components/3d/Scene3D";
import { LookingEyes } from "@/components/3d/LookingEyes";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/transitions/ScrollReveal";
import { GlassCard } from "@/components/GlassCard";
import { Sparkles, Zap, Globe, Shield } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Smart Matching",
    description: "AI-powered suggestions connect you with the right alumni based on your interests and goals.",
    color: "from-primary to-secondary",
  },
  {
    icon: Zap,
    title: "Instant Connect",
    description: "One-click messaging and scheduling to make networking effortless.",
    color: "from-accent to-primary",
  },
  {
    icon: Globe,
    title: "Global Network",
    description: "Connect with alumni across 50+ countries and expand your professional reach.",
    color: "from-secondary to-accent",
  },
  {
    icon: Shield,
    title: "Verified Members",
    description: "All profiles are verified to ensure authentic connections within the community.",
    color: "from-primary to-accent",
  },
];

export function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgY1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const bgY2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 0.9]);

  return (
    <section ref={sectionRef} className="py-32 px-4 relative overflow-hidden">
      {/* Background Elements with parallax */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute top-0 left-1/4 w-[800px] h-[800px] rounded-full bg-primary/5 blur-[200px]" 
          style={{ y: bgY1, scale: bgScale }}
        />
        <motion.div 
          className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full bg-secondary/5 blur-[150px]" 
          style={{ y: bgY2 }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Section Header with Eyes */}
        <ScrollReveal variant="slide-up" className="text-center mb-20">
          <div className="flex justify-center mb-8">
            <LookingEyes size={60} />
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-6">
            <span className="text-foreground">Features that </span>
            <span className="gradient-text-animated">Watch Over You</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our platform learns and adapts to help you make meaningful connections
          </p>
        </ScrollReveal>

        {/* Features Grid with 3D Elements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: 3D Scene */}
          <ScrollReveal variant="slide-left" className="h-[400px] lg:h-[500px]">
            <div className="w-full h-full relative">
              <Scene3D variant="crystals" />
              
              {/* Floating gradient orbs */}
              <motion.div
                className="absolute top-10 left-10 w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 blur-xl"
                animate={{
                  y: [0, -20, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute bottom-10 right-10 w-16 h-16 rounded-full bg-gradient-to-br from-accent/30 to-primary/30 blur-xl"
                animate={{
                  y: [0, 20, 0],
                  scale: [1, 0.9, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              />
            </div>
          </ScrollReveal>

          {/* Right: Feature Cards */}
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <StaggerItem key={feature.title}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <GlassCard premium className="h-full">
                    <motion.div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <feature.icon className="w-6 h-6 text-primary-foreground" />
                    </motion.div>
                    <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </GlassCard>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
