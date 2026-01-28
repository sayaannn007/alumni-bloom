import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  color: THREE.Color;
  life: number;
  size: number;
}

interface ParticleExplosionProps {
  triggerPosition: THREE.Vector3 | null;
  onComplete?: () => void;
}

export function ParticleExplosion({ triggerPosition, onComplete }: ParticleExplosionProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (triggerPosition) {
      const newParticles: Particle[] = [];
      const particleCount = 50;
      
      for (let i = 0; i < particleCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const speed = 2 + Math.random() * 3;
        
        newParticles.push({
          position: triggerPosition.clone(),
          velocity: new THREE.Vector3(
            Math.sin(phi) * Math.cos(theta) * speed,
            Math.sin(phi) * Math.sin(theta) * speed,
            Math.cos(phi) * speed
          ),
          color: new THREE.Color().setHSL(0.5 + Math.random() * 0.3, 1, 0.6),
          life: 1,
          size: 0.05 + Math.random() * 0.1,
        });
      }
      
      setParticles(newParticles);
      setIsActive(true);
    }
  }, [triggerPosition]);

  useFrame((_, delta) => {
    if (!isActive || particles.length === 0) return;

    let allDead = true;
    
    setParticles(prev => {
      const updated = prev.map(p => {
        const newLife = p.life - delta * 1.5;
        if (newLife > 0) allDead = false;
        
        return {
          ...p,
          position: p.position.clone().add(p.velocity.clone().multiplyScalar(delta)),
          velocity: p.velocity.clone().multiplyScalar(0.95),
          life: newLife,
        };
      });
      
      return updated.filter(p => p.life > 0);
    });

    if (allDead) {
      setIsActive(false);
      onComplete?.();
    }
  });

  if (!isActive || particles.length === 0) return null;

  const positions = new Float32Array(particles.length * 3);
  const colors = new Float32Array(particles.length * 3);
  const sizes = new Float32Array(particles.length);

  particles.forEach((p, i) => {
    positions[i * 3] = p.position.x;
    positions[i * 3 + 1] = p.position.y;
    positions[i * 3 + 2] = p.position.z;
    colors[i * 3] = p.color.r;
    colors[i * 3 + 1] = p.color.g;
    colors[i * 3 + 2] = p.color.b;
    sizes[i] = p.size * p.life;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
