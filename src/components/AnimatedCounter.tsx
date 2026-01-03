import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  delay?: number;
  decimals?: number;
  className?: string;
  glowColor?: string;
}

export function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  duration = 2,
  delay = 0,
  decimals = 0,
  className = "",
  glowColor = "rgba(0, 242, 254, 0.5)",
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const displayValue = useTransform(motionValue, (latest) => {
    if (decimals > 0) {
      return `${prefix}${latest.toFixed(decimals)}${suffix}`;
    }
    return `${prefix}${Math.round(latest).toLocaleString()}${suffix}`;
  });

  useEffect(() => {
    if (isInView) {
      const controls = animate(motionValue, value, {
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      });
      return controls.stop;
    }
  }, [isInView, motionValue, value, duration, delay]);

  return (
    <motion.span
      ref={ref}
      className={`relative inline-block ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
    >
      <motion.span>{displayValue}</motion.span>
      
      {/* Glow effect on animate */}
      {isInView && (
        <motion.span
          className="absolute inset-0 blur-lg pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0] }}
          transition={{ duration: duration * 0.5, delay }}
          style={{ color: glowColor }}
        />
      )}
    </motion.span>
  );
}

interface CounterGridProps {
  stats: Array<{
    value: number;
    suffix?: string;
    prefix?: string;
    label: string;
    description?: string;
  }>;
  className?: string;
}

export function CounterGrid({ stats, className = "" }: CounterGridProps) {
  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          className="relative group"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1, duration: 0.6 }}
        >
          <div className="glass rounded-2xl p-8 text-center h-full hover:glass-glow transition-all duration-500 relative overflow-hidden">
            {/* Animated background gradient */}
            <motion.div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: "linear-gradient(135deg, hsl(185 100% 50% / 0.1) 0%, hsl(280 100% 60% / 0.1) 100%)",
              }}
            />
            
            <div className="text-4xl md:text-5xl font-display font-bold text-aurora mb-2 relative z-10">
              <AnimatedCounter 
                value={stat.value} 
                suffix={stat.suffix} 
                prefix={stat.prefix}
                delay={index * 0.15}
              />
            </div>
            
            <div className="text-lg font-semibold text-foreground mb-1 relative z-10">
              {stat.label}
            </div>
            
            {stat.description && (
              <div className="text-sm text-muted-foreground relative z-10">
                {stat.description}
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
