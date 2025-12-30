import { motion } from "framer-motion";
import { Scene3D } from "@/components/3d/Scene3D";
import { ScrollReveal } from "@/components/transitions/ScrollReveal";
import { GlassCard } from "@/components/GlassCard";

const testimonials = [
  {
    quote: "AlumniConnect helped me find my dream job through a connection I made at a virtual networking event.",
    author: "Sarah Chen",
    role: "Product Manager at Google",
    avatar: "SC",
  },
  {
    quote: "The mentorship program connected me with an amazing mentor who guided my career transition.",
    author: "James Wilson",
    role: "Senior Engineer at Meta",
    avatar: "JW",
  },
  {
    quote: "I've made lifelong friends and business partners through this incredible platform.",
    author: "Priya Sharma",
    role: "Founder & CEO",
    avatar: "PS",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-32 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] rounded-full bg-secondary/5 blur-[200px] -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[150px] -translate-y-1/2" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <ScrollReveal variant="slide-up" className="text-center mb-16">
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-4">
            <span className="text-foreground">What Alumni </span>
            <span className="text-aurora">Say</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real stories from our community members
          </p>
        </ScrollReveal>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Testimonials */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, index) => (
              <ScrollReveal
                key={testimonial.author}
                variant={index % 2 === 0 ? "slide-left" : "slide-right"}
                delay={index * 0.1}
                className={index === 2 ? "md:col-span-2" : ""}
              >
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <GlassCard premium className="h-full">
                    <div className="flex items-start gap-4 mb-4">
                      <motion.div
                        className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-bold text-primary-foreground flex-shrink-0"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        {testimonial.avatar}
                      </motion.div>
                      <div>
                        <div className="font-semibold">{testimonial.author}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      </div>
                    </div>
                    <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                  </GlassCard>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>

          {/* 3D Element */}
          <ScrollReveal variant="scale" className="h-[300px] lg:h-[400px] hidden lg:block">
            <Scene3D variant="liquid" />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
