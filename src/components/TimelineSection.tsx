import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { GlassCard } from "@/components/GlassCard";
import { 
  GraduationCap, 
  Rocket, 
  Globe, 
  Award, 
  Users, 
  Sparkles,
  Building,
  Heart
} from "lucide-react";

const milestones = [
  {
    year: "2010",
    title: "Foundation",
    description: "AlumniConnect was born from a simple idea: keeping graduates connected beyond graduation day.",
    icon: GraduationCap,
    color: "from-cyan-500 to-blue-500",
  },
  {
    year: "2013",
    title: "First 1,000 Members",
    description: "Our community reached its first major milestone with 1,000 active alumni members.",
    icon: Users,
    color: "from-purple-500 to-pink-500",
  },
  {
    year: "2015",
    title: "Global Expansion",
    description: "Expanded to 25 countries with local chapters and regional events.",
    icon: Globe,
    color: "from-green-500 to-emerald-500",
  },
  {
    year: "2017",
    title: "Corporate Partners",
    description: "Launched partnerships with Fortune 500 companies for exclusive job opportunities.",
    icon: Building,
    color: "from-orange-500 to-red-500",
  },
  {
    year: "2019",
    title: "Innovation Award",
    description: "Recognized as the most innovative alumni platform by Education Technology Awards.",
    icon: Award,
    color: "from-yellow-500 to-amber-500",
  },
  {
    year: "2021",
    title: "AI-Powered Matching",
    description: "Introduced smart algorithms to connect alumni based on interests and career goals.",
    icon: Sparkles,
    color: "from-indigo-500 to-violet-500",
  },
  {
    year: "2023",
    title: "15,000 Strong",
    description: "Our community grew to 15,000 active members across 50+ countries.",
    icon: Rocket,
    color: "from-pink-500 to-rose-500",
  },
  {
    year: "2024",
    title: "The Future",
    description: "Launching immersive virtual networking experiences and AI mentorship programs.",
    icon: Heart,
    color: "from-cyan-500 to-purple-500",
  },
];

interface TimelineItemProps {
  milestone: typeof milestones[0];
  index: number;
  isLeft: boolean;
}

function TimelineItem({ milestone, index, isLeft }: TimelineItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: itemRef,
    offset: ["start end", "center center"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [0.2, 1, 1]);
  const x = useTransform(
    scrollYProgress, 
    [0, 0.5, 1], 
    [isLeft ? -50 : 50, isLeft ? -10 : 10, 0]
  );
  const scale = useTransform(scrollYProgress, [0, 0.3, 1], [0.9, 1, 1]);

  return (
    <motion.div
      ref={itemRef}
      className={`flex items-center gap-8 ${isLeft ? "flex-row" : "flex-row-reverse"} relative`}
      style={{ opacity, x, scale }}
    >
      {/* Content Card */}
      <div className={`flex-1 ${isLeft ? "text-right" : "text-left"}`}>
        <GlassCard className="p-6 hover:glass-glow transition-all duration-500 group">
          <motion.div
            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${milestone.color} flex items-center justify-center mb-4 shadow-lg ${isLeft ? "ml-auto" : ""}`}
            whileHover={{ scale: 1.1, rotate: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <milestone.icon className="w-7 h-7 text-white" />
          </motion.div>
          
          <div className="text-aurora font-display font-bold text-2xl mb-2">
            {milestone.year}
          </div>
          
          <h3 className="font-display text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
            {milestone.title}
          </h3>
          
          <p className="text-muted-foreground">
            {milestone.description}
          </p>
        </GlassCard>
      </div>

      {/* Center Line Dot */}
      <motion.div 
        className="relative z-10"
        whileHover={{ scale: 1.3 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <motion.div
          className={`w-6 h-6 rounded-full bg-gradient-to-br ${milestone.color} shadow-lg`}
          animate={{
            boxShadow: [
              "0 0 20px rgba(0, 242, 254, 0.3)",
              "0 0 40px rgba(191, 0, 255, 0.4)",
              "0 0 20px rgba(0, 242, 254, 0.3)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
      </motion.div>

      {/* Spacer for opposite side */}
      <div className="flex-1" />
    </motion.div>
  );
}

export function TimelineSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={containerRef} className="relative py-32 px-4 overflow-visible">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[150px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-secondary/5 blur-[120px]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.span 
            className="inline-block px-4 py-2 rounded-full glass text-sm font-medium text-primary mb-4"
            whileHover={{ scale: 1.05 }}
          >
            Our Journey
          </motion.span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-foreground">Our Journey of </span>
            <span className="text-aurora">Connections</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From humble beginnings to a thriving global community, explore the milestones that shaped AlumniConnect.
          </p>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Center Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-muted-foreground/20 to-transparent -translate-x-1/2">
            <motion.div
              className="absolute top-0 left-0 right-0 bg-gradient-to-b from-primary via-secondary to-accent"
              style={{ height: lineHeight }}
            />
          </div>

          {/* Timeline Items */}
          <div className="space-y-16">
            {milestones.map((milestone, index) => (
              <TimelineItem
                key={milestone.year}
                milestone={milestone}
                index={index}
                isLeft={index % 2 === 0}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <p className="text-muted-foreground text-lg mb-6">
            Be part of the next chapter in our story
          </p>
          <motion.button
            className="px-8 py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold shadow-lg"
            whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(0, 242, 254, 0.4)" }}
            whileTap={{ scale: 0.98 }}
          >
            Join the Community
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
