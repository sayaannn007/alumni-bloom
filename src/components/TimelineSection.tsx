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
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=250&fit=crop",
  },
  {
    year: "2013",
    title: "First 1,000 Members",
    description: "Our community reached its first major milestone with 1,000 active alumni members.",
    icon: Users,
    color: "from-purple-500 to-pink-500",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=250&fit=crop",
  },
  {
    year: "2015",
    title: "Global Expansion",
    description: "Expanded to 25 countries with local chapters and regional events.",
    icon: Globe,
    color: "from-green-500 to-emerald-500",
    image: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=400&h=250&fit=crop",
  },
  {
    year: "2017",
    title: "Corporate Partners",
    description: "Launched partnerships with Fortune 500 companies for exclusive job opportunities.",
    icon: Building,
    color: "from-orange-500 to-red-500",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop",
  },
  {
    year: "2019",
    title: "Innovation Award",
    description: "Recognized as the most innovative alumni platform by Education Technology Awards.",
    icon: Award,
    color: "from-yellow-500 to-amber-500",
    image: "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=400&h=250&fit=crop",
  },
  {
    year: "2021",
    title: "AI-Powered Matching",
    description: "Introduced smart algorithms to connect alumni based on interests and career goals.",
    icon: Sparkles,
    color: "from-indigo-500 to-violet-500",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop",
  },
  {
    year: "2023",
    title: "15,000 Strong",
    description: "Our community grew to 15,000 active members across 50+ countries.",
    icon: Rocket,
    color: "from-pink-500 to-rose-500",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=250&fit=crop",
  },
  {
    year: "2024",
    title: "The Future",
    description: "Launching immersive virtual networking experiences and AI mentorship programs.",
    icon: Heart,
    color: "from-cyan-500 to-purple-500",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop",
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

  const opacity = useTransform(scrollYProgress, [0, 0.2, 1], [1, 1, 1]);
  const x = useTransform(
    scrollYProgress, 
    [0, 0.5, 1], 
    [isLeft ? -100 : 100, isLeft ? -20 : 20, 0]
  );
  const scale = useTransform(scrollYProgress, [0, 0.3, 1], [0.8, 0.95, 1]);
  const rotateY = useTransform(scrollYProgress, [0, 1], [isLeft ? -15 : 15, 0]);

  return (
    <motion.div
      ref={itemRef}
      className={`flex items-center gap-4 md:gap-8 ${isLeft ? "flex-row" : "flex-row-reverse"} relative`}
      style={{ opacity, x, scale }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
    >
      {/* Content Card */}
      <motion.div 
        className={`flex-1 ${isLeft ? "text-right" : "text-left"}`}
        style={{ rotateY }}
      >
        <GlassCard className="p-4 md:p-6 hover:glass-glow transition-all duration-500 group overflow-hidden">
          {/* Image */}
          <motion.div 
            className="relative h-32 md:h-40 -mx-4 md:-mx-6 -mt-4 md:-mt-6 mb-4 overflow-hidden"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          >
            <img 
              src={milestone.image} 
              alt={milestone.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            <motion.div
              className={`absolute bottom-2 ${isLeft ? 'right-4' : 'left-4'} w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${milestone.color} flex items-center justify-center shadow-lg`}
              whileHover={{ scale: 1.2, rotate: 10 }}
              animate={{
                boxShadow: [
                  "0 0 20px rgba(0,0,0,0.3)",
                  "0 0 40px rgba(0,242,254,0.3)",
                  "0 0 20px rgba(0,0,0,0.3)",
                ],
              }}
              transition={{ 
                boxShadow: { duration: 2, repeat: Infinity },
                scale: { type: "spring", stiffness: 400, damping: 10 }
              }}
            >
              <milestone.icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="text-aurora font-display font-bold text-xl md:text-2xl mb-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {milestone.year}
          </motion.div>
          
          <motion.h3 
            className="font-display text-lg md:text-xl font-semibold mb-2 md:mb-3 text-foreground group-hover:text-primary transition-colors"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            {milestone.title}
          </motion.h3>
          
          <motion.p 
            className="text-muted-foreground text-sm md:text-base"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            {milestone.description}
          </motion.p>
        </GlassCard>
      </motion.div>

      {/* Center Line Dot */}
      <motion.div 
        className="relative z-10 flex-shrink-0"
        whileHover={{ scale: 1.5 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <motion.div
          className={`w-4 h-4 md:w-6 md:h-6 rounded-full bg-gradient-to-br ${milestone.color} shadow-lg`}
          animate={{
            boxShadow: [
              "0 0 20px rgba(0, 242, 254, 0.4)",
              "0 0 50px rgba(191, 0, 255, 0.6)",
              "0 0 20px rgba(0, 242, 254, 0.4)",
            ],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
        />
        <motion.div 
          className="absolute inset-0 rounded-full bg-white/30"
          animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
        />
      </motion.div>

      {/* Spacer for opposite side */}
      <div className="flex-1 hidden md:block" />
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
    <section ref={containerRef} id="timeline" className="relative py-20 md:py-32 px-4 bg-gradient-to-b from-background via-background/95 to-background">
      {/* Animated Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full bg-primary/10 blur-[100px] md:blur-[150px]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full bg-secondary/10 blur-[80px] md:blur-[120px]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/30"
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + (i % 3) * 30}%`,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 md:mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <motion.span 
            className="inline-block px-4 py-2 rounded-full glass text-sm font-medium text-primary mb-4"
            whileHover={{ scale: 1.05 }}
            animate={{
              boxShadow: [
                "0 0 20px rgba(0,242,254,0.2)",
                "0 0 40px rgba(0,242,254,0.4)",
                "0 0 20px rgba(0,242,254,0.2)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            ✨ Our Journey
          </motion.span>
          <motion.h2 
            className="font-display text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <span className="text-foreground">Our Journey of </span>
            <motion.span 
              className="text-aurora inline-block"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{
                backgroundSize: "200% auto",
              }}
            >
              Connections
            </motion.span>
          </motion.h2>
          <motion.p 
            className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            From humble beginnings to a thriving global community, explore the milestones that shaped AlumniConnect.
          </motion.p>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Center Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-muted-foreground/30 to-transparent md:-translate-x-1/2">
            <motion.div
              className="absolute top-0 left-0 right-0 bg-gradient-to-b from-primary via-secondary to-accent rounded-full"
              style={{ height: lineHeight }}
            />
            {/* Glowing orb that follows the line */}
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary shadow-lg"
              style={{ 
                top: lineHeight,
                boxShadow: "0 0 20px rgba(0,242,254,0.8), 0 0 40px rgba(0,242,254,0.4)",
              }}
            />
          </div>

          {/* Timeline Items */}
          <div className="space-y-8 md:space-y-16 pl-8 md:pl-0">
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
          className="text-center mt-16 md:mt-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <motion.p 
            className="text-muted-foreground text-base md:text-lg mb-6"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Be part of the next chapter in our story
          </motion.p>
          <motion.button
            className="px-6 md:px-8 py-3 md:py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold shadow-lg relative overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            animate={{
              boxShadow: [
                "0 0 20px rgba(0, 242, 254, 0.3)",
                "0 0 50px rgba(0, 242, 254, 0.5)",
                "0 0 20px rgba(0, 242, 254, 0.3)",
              ],
            }}
            transition={{ boxShadow: { duration: 2, repeat: Infinity } }}
          >
            <span className="relative z-10">Join the Community</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
