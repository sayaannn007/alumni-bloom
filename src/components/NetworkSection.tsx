import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { GlassCard } from "@/components/GlassCard";
import { Users, MessageCircle, Briefcase, Globe, Zap, Shield } from "lucide-react";
import { ScrollReveal } from "@/components/transitions/ScrollReveal";

const networkFeatures = [
  {
    icon: Users,
    title: "Smart Matching",
    description: "AI-powered recommendations connect you with alumni who share your interests, industry, or career goals.",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: MessageCircle,
    title: "Instant Messaging",
    description: "Real-time chat with end-to-end encryption keeps your conversations private and secure.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Briefcase,
    title: "Career Opportunities",
    description: "Exclusive job postings and mentorship opportunities from successful alumni in top companies.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Globe,
    title: "Global Network",
    description: "Connect with alumni across 50+ countries and expand your professional network worldwide.",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: Zap,
    title: "Event Discovery",
    description: "Never miss a reunion, workshop, or networking event with smart notifications and calendar sync.",
    gradient: "from-yellow-500 to-amber-500",
  },
  {
    icon: Shield,
    title: "Verified Profiles",
    description: "Every alumni profile is verified to ensure authentic connections within your trusted network.",
    gradient: "from-indigo-500 to-violet-500",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export function NetworkSection() {
  const sectionRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const orbY1 = useTransform(scrollYProgress, [0, 1], [100, -200]);
  const orbY2 = useTransform(scrollYProgress, [0, 1], [-50, -250]);
  const orbScale1 = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.3, 1]);
  const orbScale2 = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 0.9]);

  return (
    <section ref={sectionRef} className="relative py-24 px-4 overflow-hidden">
      {/* Background effects with parallax */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-[100px]"
          style={{ y: orbY1, scale: orbScale1 }}
          animate={{
            x: [0, 50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-secondary/10 blur-[100px]"
          style={{ y: orbY2, scale: orbScale2 }}
          animate={{
            x: [0, -50, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <ScrollReveal variant="slide-up">
          <div className="text-center mb-16">
            <motion.span 
              className="inline-block px-4 py-2 rounded-full glass text-sm font-medium text-primary mb-4"
              whileHover={{ scale: 1.05 }}
            >
              Why Choose Us
            </motion.span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              <span className="text-foreground">Power Your</span>{" "}
              <span className="text-aurora">Professional Network</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our platform combines cutting-edge technology with meaningful human connections to create the ultimate alumni experience.
            </p>
          </div>
        </ScrollReveal>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {networkFeatures.map((feature, index) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <GlassCard className="h-full p-6 group cursor-pointer">
                <div className="flex flex-col h-full">
                  <motion.div 
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <feature.icon className="w-7 h-7 text-white" />
                  </motion.div>
                  
                  <h3 className="font-display text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground flex-grow">
                    {feature.description}
                  </p>

                  <motion.div 
                    className="mt-4 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent rounded-full"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
