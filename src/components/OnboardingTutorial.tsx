import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  ChevronRight,
  ChevronLeft,
  X,
  Users,
  Calendar,
  Briefcase,
  MessageCircle,
  Settings,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInteractionFeedback } from "@/hooks/useInteractionFeedback";

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight: string;
  position: "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: "Welcome to AlumniConnect!",
    description: "Your gateway to a powerful professional network. Let us show you around the key features.",
    icon: Sparkles,
    highlight: "hero",
    position: "center",
  },
  {
    id: 2,
    title: "Connect with Alumni",
    description: "Browse and connect with fellow alumni from around the world. Build meaningful professional relationships.",
    icon: Users,
    highlight: "network",
    position: "center",
  },
  {
    id: 3,
    title: "Discover Events",
    description: "Stay updated with networking events, workshops, and reunions happening in your area and online.",
    icon: Calendar,
    highlight: "events",
    position: "center",
  },
  {
    id: 4,
    title: "Explore Career Opportunities",
    description: "Access exclusive job postings from companies actively seeking alumni talent.",
    icon: Briefcase,
    highlight: "jobs",
    position: "center",
  },
  {
    id: 5,
    title: "Direct Messaging",
    description: "Communicate privately with your connections. Share ideas, seek advice, or just catch up.",
    icon: MessageCircle,
    highlight: "messages",
    position: "center",
  },
  {
    id: 6,
    title: "Customize Your Experience",
    description: "Access settings to personalize sounds, animations, and other preferences to your liking.",
    icon: Settings,
    highlight: "settings",
    position: "bottom-right",
  },
];

const ONBOARDING_KEY = "alumniconnect-onboarding-complete";

export const OnboardingTutorial = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { trigger } = useInteractionFeedback();

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem(ONBOARDING_KEY);
    if (!hasCompletedOnboarding) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNext = () => {
    trigger("click");
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    trigger("click");
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    trigger("success");
    localStorage.setItem(ONBOARDING_KEY, "true");
    setIsOpen(false);
  };

  const handleSkip = () => {
    trigger("click");
    handleComplete();
  };

  const step = tutorialSteps[currentStep];
  const Icon = step.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-background/80 backdrop-blur-md"
          />

          {/* Tutorial Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[201] w-[90vw] max-w-md"
          >
            <div className="glass-card rounded-3xl p-8 border border-border/50 relative overflow-hidden">
              {/* Animated background gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10"
                animate={{
                  background: [
                    "linear-gradient(135deg, hsl(var(--primary) / 0.1) 0%, transparent 50%, hsl(var(--secondary) / 0.1) 100%)",
                    "linear-gradient(135deg, hsl(var(--secondary) / 0.1) 0%, transparent 50%, hsl(var(--primary) / 0.1) 100%)",
                    "linear-gradient(135deg, hsl(var(--primary) / 0.1) 0%, transparent 50%, hsl(var(--secondary) / 0.1) 100%)",
                  ],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              {/* Close button */}
              <button
                onClick={handleSkip}
                className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors z-10"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <motion.div
                  key={currentStep}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 15, stiffness: 200 }}
                  className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6 shadow-lg"
                >
                  <Icon className="w-10 h-10 text-primary-foreground" />
                </motion.div>

                {/* Title */}
                <motion.h2
                  key={`title-${currentStep}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="font-display text-2xl font-bold text-foreground text-center mb-3"
                >
                  {step.title}
                </motion.h2>

                {/* Description */}
                <motion.p
                  key={`desc-${currentStep}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-muted-foreground text-center mb-8"
                >
                  {step.description}
                </motion.p>

                {/* Progress Dots */}
                <div className="flex justify-center gap-2 mb-6">
                  {tutorialSteps.map((_, index) => (
                    <motion.button
                      key={index}
                      onClick={() => {
                        trigger("click");
                        setCurrentStep(index);
                      }}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentStep
                          ? "bg-primary w-6"
                          : index < currentStep
                          ? "bg-primary/50"
                          : "bg-muted-foreground/30"
                      }`}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    />
                  ))}
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between gap-4">
                  <Button
                    variant="ghost"
                    onClick={handlePrev}
                    disabled={currentStep === 0}
                    className="gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={handleSkip}
                    className="text-muted-foreground"
                  >
                    Skip Tour
                  </Button>

                  <Button
                    onClick={handleNext}
                    className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  >
                    {currentStep === tutorialSteps.length - 1 ? (
                      "Get Started"
                    ) : (
                      <>
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
