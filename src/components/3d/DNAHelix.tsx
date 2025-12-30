import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface DNAHelixProps {
  color1?: string;
  color2?: string;
}

export function DNAHelix({ color1 = "#00f2fe", color2 = "#bf00ff" }: DNAHelixProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  const spheres = useMemo(() => {
    const items: { position: [number, number, number]; color: THREE.Color }[] = [];
    const turns = 3;
    const pointsPerTurn = 12;
    const totalPoints = turns * pointsPerTurn;
    const radius = 0.8;
    const height = 4;
    
    for (let i = 0; i < totalPoints; i++) {
      const t = i / totalPoints;
      const angle = t * Math.PI * 2 * turns;
      const y = (t - 0.5) * height;
      
      // First strand
      items.push({
        position: [Math.cos(angle) * radius, y, Math.sin(angle) * radius],
        color: new THREE.Color(color1),
      });
      
      // Second strand (opposite)
      items.push({
        position: [Math.cos(angle + Math.PI) * radius, y, Math.sin(angle + Math.PI) * radius],
        color: new THREE.Color(color2),
      });
    }
    
    return items;
  }, [color1, color2]);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
  });

  return (
    <group ref={groupRef}>
      {spheres.map((sphere, i) => (
        <mesh key={i} position={sphere.position}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshPhysicalMaterial
            color={sphere.color}
            metalness={0.3}
            roughness={0.2}
            emissive={sphere.color}
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
      
      {/* Connecting lines */}
      {spheres.filter((_, i) => i % 2 === 0).map((sphere, i) => {
        const nextSphere = spheres[i * 2 + 1];
        if (!nextSphere) return null;
        
        const start = new THREE.Vector3(...sphere.position);
        const end = new THREE.Vector3(...nextSphere.position);
        const mid = start.clone().lerp(end, 0.5);
        const length = start.distanceTo(end);
        
        return (
          <mesh
            key={`line-${i}`}
            position={[mid.x, mid.y, mid.z]}
            rotation={[0, 0, Math.atan2(end.y - start.y, end.x - start.x)]}
          >
            <cylinderGeometry args={[0.02, 0.02, length, 8]} />
            <meshPhysicalMaterial
              color="#ffffff"
              metalness={0.5}
              roughness={0.3}
              opacity={0.3}
              transparent
            />
          </mesh>
        );
      })}
    </group>
  );
}
