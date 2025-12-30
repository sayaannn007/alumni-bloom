import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { DashboardCards } from "@/components/DashboardCards";
import { FeaturesSection } from "@/components/FeaturesSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { CTASection } from "@/components/CTASection";
import { AlumniDirectory } from "@/components/AlumniDirectory";
import { Footer } from "@/components/Footer";
import { motion, useScroll, useSpring } from "framer-motion";

const Index = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="min-h-screen overflow-x-hidden smooth-scroll">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent z-[100] origin-left"
        style={{ scaleX }}
      />
      
      <Navigation />
      <main>
        <HeroSection />
        <DashboardCards />
        <FeaturesSection />
        <TestimonialsSection />
        <AlumniDirectory />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
