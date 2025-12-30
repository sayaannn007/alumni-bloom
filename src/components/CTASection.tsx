import { motion } from "framer-motion";
import { Scene3D } from "@/components/3d/Scene3D";
import { LookingEyes } from "@/components/3d/LookingEyes";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/transitions/ScrollReveal";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, MessageSquare, Calendar, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { icon: Users, value: "15,000+", label: "Active Alumni", delay: 0 },
  { icon: MessageSquare, value: "50,000+", label: "Messages Sent", delay: 0.1 },
  { icon: Calendar, value: "200+", label: "Events Yearly", delay: 0.2 },
  { icon: Trophy, value: "98%", label: "Satisfaction", delay: 0.3 },
];

export function CTASection() {
  return (
    <section className="py-32 px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div>
            <ScrollReveal variant="slide-up">
              <div className="mb-8">
                <LookingEyes size={50} eyeColor="hsl(var(--accent))" />
              </div>
            </ScrollReveal>
            
            <ScrollReveal variant="slide-up" delay={0.1}>
              <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-6">
                <span className="text-foreground">Ready to </span>
                <span className="text-aurora">Connect?</span>
              </h2>
            </ScrollReveal>
            
            <ScrollReveal variant="slide-up" delay={0.2}>
              <p className="text-muted-foreground text-lg mb-8 max-w-md">
                Join thousands of alumni who are already networking, mentoring, 
                and growing their careers through our platform.
              </p>
            </ScrollReveal>
            
            <ScrollReveal variant="slide-up" delay={0.3}>
              <div className="flex flex-wrap gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="aurora" size="xl" asChild>
                    <Link to="/auth">
                      Get Started
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="glass" size="xl">
                    Learn More
                  </Button>
                </motion.div>
              </div>
            </ScrollReveal>

            {/* Stats */}
            <StaggerContainer className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">
              {stats.map((stat) => (
                <StaggerItem key={stat.label}>
                  <motion.div 
                    className="text-center"
                    whileHover={{ y: -5 }}
                  >
                    <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                    <div className="font-display font-bold text-2xl text-aurora">
                      {stat.value}
                    </div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>

          {/* Right: 3D Scene */}
          <ScrollReveal variant="scale" className="h-[400px] lg:h-[500px]">
            <div className="w-full h-full relative">
              <Scene3D variant="dna" />
              
              {/* Decorative elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-32 h-32 rounded-full border-2 border-primary/20"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full border-2 border-accent/20"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
