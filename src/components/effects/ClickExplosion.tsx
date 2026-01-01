import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  angle: number;
  speed: number;
  size: number;
  color: string;
  type: "circle" | "star" | "ring";
}

interface Explosion {
  id: number;
  x: number;
  y: number;
  particles: Particle[];
}

const colors = [
  "hsl(185 100% 50%)",
  "hsl(280 100% 60%)",
  "hsl(155 100% 50%)",
  "hsl(35 100% 55%)",
  "hsl(350 100% 55%)",
];

function generateParticles(x: number, y: number): Particle[] {
  const particles: Particle[] = [];
  const particleCount = 12 + Math.floor(Math.random() * 8);

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      id: i,
      x,
      y,
      angle: (i / particleCount) * 360 + Math.random() * 30,
      speed: 60 + Math.random() * 80,
      size: 4 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      type: ["circle", "star", "ring"][Math.floor(Math.random() * 3)] as Particle["type"],
    });
  }

  return particles;
}

function ParticleElement({ particle, explosionX, explosionY }: { 
  particle: Particle; 
  explosionX: number;
  explosionY: number;
}) {
  const radians = (particle.angle * Math.PI) / 180;
  const endX = Math.cos(radians) * particle.speed;
  const endY = Math.sin(radians) * particle.speed;

  return (
    <motion.div
      className="absolute"
      style={{
        left: explosionX,
        top: explosionY,
        width: particle.size,
        height: particle.size,
      }}
      initial={{ 
        x: 0, 
        y: 0, 
        opacity: 1, 
        scale: 1,
        rotate: 0,
      }}
      animate={{ 
        x: endX, 
        y: endY, 
        opacity: 0, 
        scale: 0.3,
        rotate: particle.type === "star" ? 180 : 0,
      }}
      transition={{ 
        duration: 0.6 + Math.random() * 0.3, 
        ease: "easeOut",
      }}
    >
      {particle.type === "circle" && (
        <div 
          className="w-full h-full rounded-full"
          style={{ background: particle.color, boxShadow: `0 0 ${particle.size}px ${particle.color}` }}
        />
      )}
      {particle.type === "star" && (
        <svg viewBox="0 0 24 24" className="w-full h-full" fill={particle.color}>
          <polygon points="12,2 15,9 22,9 17,14 19,22 12,17 5,22 7,14 2,9 9,9" />
        </svg>
      )}
      {particle.type === "ring" && (
        <div 
          className="w-full h-full rounded-full border-2"
          style={{ borderColor: particle.color, boxShadow: `0 0 ${particle.size}px ${particle.color}` }}
        />
      )}
    </motion.div>
  );
}

export function ClickExplosion() {
  const [explosions, setExplosions] = useState<Explosion[]>([]);

  const createExplosion = useCallback((e: MouseEvent) => {
    const id = Date.now();
    const particles = generateParticles(e.clientX, e.clientY);
    
    setExplosions((prev) => [...prev, { id, x: e.clientX, y: e.clientY, particles }]);

    setTimeout(() => {
      setExplosions((prev) => prev.filter((exp) => exp.id !== id));
    }, 1000);
  }, []);

  useEffect(() => {
    window.addEventListener("click", createExplosion);
    return () => window.removeEventListener("click", createExplosion);
  }, [createExplosion]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9998]">
      <AnimatePresence>
        {explosions.map((explosion) => (
          <div key={explosion.id}>
            {/* Central flash */}
            <motion.div
              className="absolute rounded-full"
              style={{
                left: explosion.x - 30,
                top: explosion.y - 30,
                width: 60,
                height: 60,
                background: "radial-gradient(circle, hsl(185 100% 80% / 0.8) 0%, transparent 70%)",
              }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2.5, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
            
            {/* Ripple rings */}
            {[0, 1, 2].map((ringIndex) => (
              <motion.div
                key={ringIndex}
                className="absolute rounded-full border-2"
                style={{
                  left: explosion.x,
                  top: explosion.y,
                  borderColor: colors[ringIndex % colors.length],
                }}
                initial={{ 
                  width: 0, 
                  height: 0, 
                  x: 0, 
                  y: 0, 
                  opacity: 0.8 
                }}
                animate={{ 
                  width: 120 + ringIndex * 40, 
                  height: 120 + ringIndex * 40, 
                  x: -(60 + ringIndex * 20), 
                  y: -(60 + ringIndex * 20), 
                  opacity: 0,
                  borderWidth: 1,
                }}
                transition={{ 
                  duration: 0.5 + ringIndex * 0.1, 
                  ease: "easeOut",
                  delay: ringIndex * 0.05,
                }}
              />
            ))}
            
            {/* Particles */}
            {explosion.particles.map((particle) => (
              <ParticleElement 
                key={particle.id} 
                particle={particle} 
                explosionX={explosion.x}
                explosionY={explosion.y}
              />
            ))}
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
