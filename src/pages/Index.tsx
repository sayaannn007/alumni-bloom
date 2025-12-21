import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { DashboardCards } from "@/components/DashboardCards";
import { AlumniDirectory } from "@/components/AlumniDirectory";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navigation />
      <main>
        <HeroSection />
        <DashboardCards />
        <AlumniDirectory />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
