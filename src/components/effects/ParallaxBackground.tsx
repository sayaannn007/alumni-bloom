import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface ParallaxOrbProps {
  className?: string;
  speed?: number;
  color: string;
  size: string;
  initialPosition: { top?: string; bottom?: string; left?: string; right?: string };
}

function ParallaxOrb({ className = "", speed = 0.5, color, size, initialPosition }: ParallaxOrbProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  
  const y = useTransform(scrollYProgress, [0, 1], [0, -300 * speed]);
  const x = useTransform(scrollYProgress, [0, 1], [0, 100 * speed * (Math.random() > 0.5 ? 1 : -1)]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 0.6, 0.6, 0.3]);

  return (
    <motion.div
      ref={ref}
      className={`absolute rounded-full pointer-events-none ${className}`}
      style={{
        ...initialPosition,
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: "blur(60px)",
        y,
        x,
        scale,
        opacity,
      }}
    />
  );
}

interface ParallaxGridProps {
  className?: string;
}

function ParallaxGrid({ className = "" }: ParallaxGridProps) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.1, 0.2, 0.2, 0.1]);

  return (
    <motion.div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ y, opacity }}
    >
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "100px 100px",
        }}
      />
    </motion.div>
  );
}

interface ParallaxStarsProps {
  count?: number;
}

function ParallaxStars({ count = 50 }: ParallaxStarsProps) {
  const { scrollYProgress } = useScroll();
  
  const stars = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 3 + 1,
    speed: Math.random() * 0.5 + 0.2,
    delay: Math.random() * 2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => {
        const y = useTransform(scrollYProgress, [0, 1], [0, -500 * star.speed]);
        
        return (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              y,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3,
              delay: star.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
}

export function ParallaxBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Grid */}
      <ParallaxGrid />
      
      {/* Stars */}
      <ParallaxStars count={40} />
      
      {/* Gradient Orbs */}
      <ParallaxOrb
        color="hsl(185 100% 50% / 0.15)"
        size="600px"
        speed={0.3}
        initialPosition={{ top: "10%", left: "-10%" }}
      />
      <ParallaxOrb
        color="hsl(280 100% 50% / 0.12)"
        size="500px"
        speed={0.5}
        initialPosition={{ top: "30%", right: "-5%" }}
      />
      <ParallaxOrb
        color="hsl(330 100% 50% / 0.1)"
        size="400px"
        speed={0.4}
        initialPosition={{ top: "60%", left: "20%" }}
      />
      <ParallaxOrb
        color="hsl(160 100% 50% / 0.12)"
        size="550px"
        speed={0.35}
        initialPosition={{ bottom: "10%", right: "10%" }}
      />
      <ParallaxOrb
        color="hsl(220 100% 50% / 0.1)"
        size="350px"
        speed={0.6}
        initialPosition={{ top: "80%", left: "-5%" }}
      />
      
      {/* Floating geometric shapes */}
      <FloatingShape 
        shape="circle" 
        size={20} 
        color="hsl(185 100% 50% / 0.3)"
        position={{ top: "15%", left: "10%" }}
        speed={0.4}
      />
      <FloatingShape 
        shape="square" 
        size={15} 
        color="hsl(280 100% 50% / 0.3)"
        position={{ top: "40%", right: "15%" }}
        speed={0.5}
      />
      <FloatingShape 
        shape="triangle" 
        size={25} 
        color="hsl(160 100% 50% / 0.25)"
        position={{ top: "70%", left: "25%" }}
        speed={0.35}
      />
      <FloatingShape 
        shape="circle" 
        size={12} 
        color="hsl(330 100% 50% / 0.3)"
        position={{ top: "25%", right: "30%" }}
        speed={0.55}
      />
      <FloatingShape 
        shape="square" 
        size={18} 
        color="hsl(220 100% 50% / 0.25)"
        position={{ bottom: "30%", left: "8%" }}
        speed={0.45}
      />
    </div>
  );
}

interface FloatingShapeProps {
  shape: "circle" | "square" | "triangle";
  size: number;
  color: string;
  position: { top?: string; bottom?: string; left?: string; right?: string };
  speed: number;
}

function FloatingShape({ shape, size, color, position, speed }: FloatingShapeProps) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -400 * speed]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360 * speed]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.4, 0.7, 0.7, 0.4]);

  const getShapeStyle = () => {
    switch (shape) {
      case "circle":
        return { borderRadius: "50%" };
      case "square":
        return { borderRadius: "4px" };
      case "triangle":
        return {
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          borderRadius: "0",
        };
    }
  };

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        ...position,
        width: size,
        height: size,
        backgroundColor: color,
        ...getShapeStyle(),
        y,
        rotate,
        opacity,
      }}
    />
  );
}
