import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { DashboardCards } from "@/components/DashboardCards";
import { FeaturesSection } from "@/components/FeaturesSection";
import { NetworkSection } from "@/components/NetworkSection";
import { StatsShowcase } from "@/components/StatsShowcase";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { CTASection } from "@/components/CTASection";
import { AlumniDirectory } from "@/components/AlumniDirectory";
import { Footer } from "@/components/Footer";
import { TimelineSection } from "@/components/TimelineSection";
import { ParallaxBackground } from "@/components/effects/ParallaxBackground";
import { LoadingScreen } from "@/components/LoadingScreen";
import { OnboardingTutorial } from "@/components/OnboardingTutorial";
import { motion, useScroll, useSpring } from "framer-motion";

const Index = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <>
      <LoadingScreen />
      <OnboardingTutorial />
      
      <div className="min-h-screen overflow-x-hidden relative scroll-snap-container">
        {/* Parallax Background */}
        <ParallaxBackground />
        
        {/* Scroll Progress Bar */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent z-[100] origin-left"
          style={{ scaleX }}
        />
        
        <Navigation />
        <main className="relative z-10">
          <section id="hero" className="scroll-snap-section">
            <HeroSection />
          </section>
          <DashboardCards />
          <section id="features" className="scroll-snap-section">
            <FeaturesSection />
          </section>
          <section id="network" className="scroll-snap-section">
            <NetworkSection />
          </section>
          <section id="timeline" className="scroll-snap-section">
            <TimelineSection />
          </section>
          <section id="stats" className="scroll-snap-section">
            <StatsShowcase />
          </section>
          <section id="testimonials" className="scroll-snap-section">
            <TestimonialsSection />
          </section>
          <AlumniDirectory />
          <section id="cta" className="scroll-snap-section">
            <CTASection />
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
