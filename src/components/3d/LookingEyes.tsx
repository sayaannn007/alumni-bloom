import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

interface LookingEyesProps {
  size?: number;
  eyeColor?: string;
  pupilColor?: string;
  className?: string;
}

export function LookingEyes({ 
  size = 80, 
  eyeColor = "hsl(var(--primary))",
  pupilColor = "hsl(var(--foreground))",
  className = ""
}: LookingEyesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 30, stiffness: 200 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Transform mouse position to pupil movement (limited range)
  const pupilX = useTransform(smoothX, [-500, 500], [-size * 0.15, size * 0.15]);
  const pupilY = useTransform(smoothY, [-500, 500], [-size * 0.12, size * 0.12]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const eyeSize = size;
  const irisSize = eyeSize * 0.5;
  const pupilSize = irisSize * 0.5;

  return (
    <div 
      ref={containerRef}
      className={`flex gap-4 ${className}`}
    >
      {[0, 1].map((eyeIndex) => (
        <motion.div
          key={eyeIndex}
          className="relative rounded-full flex items-center justify-center"
          style={{
            width: eyeSize,
            height: eyeSize,
            background: `radial-gradient(circle at 30% 30%, white, hsl(0 0% 90%))`,
            boxShadow: `
              inset 0 0 ${eyeSize * 0.2}px rgba(0,0,0,0.1),
              0 ${eyeSize * 0.1}px ${eyeSize * 0.3}px rgba(0,0,0,0.2),
              0 0 ${eyeSize * 0.5}px ${eyeColor}40
            `,
          }}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 15,
            delay: eyeIndex * 0.1 
          }}
          whileHover={{ scale: 1.1 }}
        >
          {/* Iris */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: irisSize,
              height: irisSize,
              background: `radial-gradient(circle at 30% 30%, ${eyeColor}, hsl(var(--secondary)))`,
              x: pupilX,
              y: pupilY,
            }}
          >
            {/* Pupil */}
            <motion.div
              className="absolute top-1/2 left-1/2 rounded-full"
              style={{
                width: pupilSize,
                height: pupilSize,
                background: pupilColor,
                x: "-50%",
                y: "-50%",
              }}
              animate={{
                scale: [1, 0.9, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {/* Reflection */}
              <motion.div
                className="absolute rounded-full bg-white"
                style={{
                  width: pupilSize * 0.3,
                  height: pupilSize * 0.3,
                  top: "20%",
                  left: "20%",
                }}
                animate={{
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
            </motion.div>
          </motion.div>

          {/* Eyelid blink effect */}
          <motion.div
            className="absolute inset-0 rounded-full origin-top"
            style={{
              background: "linear-gradient(to bottom, hsl(var(--muted)), transparent 50%)",
            }}
            animate={{
              scaleY: [0, 1, 0],
            }}
            transition={{
              duration: 0.15,
              repeat: Infinity,
              repeatDelay: 4,
              times: [0, 0.5, 1],
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}
