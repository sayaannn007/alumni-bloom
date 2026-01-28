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
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { FloatingNavOrb } from "@/components/3d/FloatingNavOrb";
import { AudioVisualizerSection } from "@/components/3d/AudioVisualizerSection";
import { MorphingCursor } from "@/components/3d/MorphingCursor";
import { LiquidSceneTransition } from "@/components/transitions/LiquidSceneTransition";

const Index = () => {

  return (
    <>
      <LoadingScreen />
      <OnboardingTutorial />
      <MorphingCursor />
      
      <div className="min-h-screen overflow-x-hidden relative scroll-snap-container">
        {/* Parallax Background */}
        <ParallaxBackground />
        
        {/* Aurora Scroll Progress Bar */}
        <ScrollProgress variant="aurora" height={3} />
        
        <Navigation />
        <main className="relative z-10">
          <LiquidSceneTransition variant="morph">
            <section id="hero" className="scroll-snap-section">
              <HeroSection />
            </section>
          </LiquidSceneTransition>
          
          <DashboardCards />
          
          <LiquidSceneTransition variant="wave">
            <section id="features" className="scroll-snap-section">
              <FeaturesSection />
            </section>
          </LiquidSceneTransition>
          
          <LiquidSceneTransition variant="ripple">
            <section id="network" className="scroll-snap-section">
              <NetworkSection />
            </section>
          </LiquidSceneTransition>
          
          <LiquidSceneTransition variant="dissolve">
            <section id="timeline" className="scroll-snap-section">
              <TimelineSection />
            </section>
          </LiquidSceneTransition>
          
          <LiquidSceneTransition variant="morph">
            <section id="stats" className="scroll-snap-section">
              <StatsShowcase />
            </section>
          </LiquidSceneTransition>
          
          <LiquidSceneTransition variant="wave">
            <section id="audio" className="scroll-snap-section">
              <AudioVisualizerSection />
            </section>
          </LiquidSceneTransition>
          
          <LiquidSceneTransition variant="ripple">
            <section id="testimonials" className="scroll-snap-section">
              <TestimonialsSection />
            </section>
          </LiquidSceneTransition>
          
          <AlumniDirectory />
          
          <LiquidSceneTransition variant="dissolve">
            <section id="cta" className="scroll-snap-section">
              <CTASection />
            </section>
          </LiquidSceneTransition>
        </main>
        <Footer />
        <FloatingNavOrb />
      </div>
    </>
  );
};

export default Index;
