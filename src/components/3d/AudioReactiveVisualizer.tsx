import { useRef, useMemo, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface AudioReactiveVisualizerProps {
  audioLevel?: number;
  isEnabled?: boolean;
}

export function AudioReactiveVisualizer({ audioLevel = 0, isEnabled = true }: AudioReactiveVisualizerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const barsRef = useRef<THREE.Mesh[]>([]);
  const [internalLevel, setInternalLevel] = useState(0);
  
  const barCount = 24;
  const radius = 2;
  
  const bars = useMemo(() => {
    return Array.from({ length: barCount }, (_, i) => {
      const angle = (i / barCount) * Math.PI * 2;
      return {
        angle,
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        phase: i * 0.2,
        baseHeight: 0.3 + Math.random() * 0.2,
      };
    });
  }, [barCount]);

  // Simulate audio levels with ambient animation
  useEffect(() => {
    if (!isEnabled) return;
    
    const interval = setInterval(() => {
      const newLevel = 0.3 + Math.random() * 0.7 * Math.sin(Date.now() * 0.001);
      setInternalLevel(newLevel);
    }, 50);
    
    return () => clearInterval(interval);
  }, [isEnabled]);

  const effectiveLevel = audioLevel || internalLevel;

  useFrame((state) => {
    if (!groupRef.current) return;
    
    const time = state.clock.elapsedTime;
    groupRef.current.rotation.y = time * 0.1;

    barsRef.current.forEach((bar, i) => {
      if (!bar) return;
      
      const barData = bars[i];
      const wave = Math.sin(time * 2 + barData.phase) * 0.5 + 0.5;
      const reactiveHeight = barData.baseHeight + effectiveLevel * wave * 2;
      
      bar.scale.y = THREE.MathUtils.lerp(bar.scale.y, reactiveHeight, 0.15);
      bar.position.y = bar.scale.y / 2;
      
      // Pulse color based on level
      const material = bar.material as THREE.MeshPhysicalMaterial;
      const hue = 0.5 + effectiveLevel * 0.2 + Math.sin(time + i * 0.1) * 0.1;
      material.emissiveIntensity = 0.5 + effectiveLevel * 1.5;
      material.color.setHSL(hue, 1, 0.5);
      material.emissive.setHSL(hue, 1, 0.3);
    });
  });

  return (
    <group ref={groupRef}>
      {bars.map((bar, i) => (
        <mesh
          key={i}
          ref={el => { if (el) barsRef.current[i] = el; }}
          position={[bar.x, 0.15, bar.z]}
          rotation={[0, -bar.angle, 0]}
        >
          <boxGeometry args={[0.15, 0.3, 0.08]} />
          <meshPhysicalMaterial
            color="#00f2fe"
            emissive="#00f2fe"
            emissiveIntensity={1}
            metalness={0.8}
            roughness={0.2}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}
      
      {/* Center orb */}
      <mesh scale={0.3 + effectiveLevel * 0.3}>
        <icosahedronGeometry args={[1, 2]} />
        <meshPhysicalMaterial
          color="#bf00ff"
          emissive="#bf00ff"
          emissiveIntensity={1 + effectiveLevel * 2}
          metalness={1}
          roughness={0}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Outer ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius + 0.3, 0.02, 16, 64]} />
        <meshPhysicalMaterial
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={0.5 + effectiveLevel}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
}
