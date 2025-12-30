import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function CrystalCluster() {
  const groupRef = useRef<THREE.Group>(null);
  
  const crystals = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 2,
        Math.random() * 1.5,
        (Math.random() - 0.5) * 2,
      ] as [number, number, number],
      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      ] as [number, number, number],
      scale: 0.3 + Math.random() * 0.5,
      color: new THREE.Color().setHSL(0.5 + Math.random() * 0.3, 0.8, 0.6),
    }));
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    
    groupRef.current.children.forEach((child, i) => {
      child.rotation.x += 0.002 * (i % 2 === 0 ? 1 : -1);
      child.rotation.z += 0.001;
      child.position.y = crystals[i].position[1] + Math.sin(state.clock.elapsedTime + i) * 0.1;
    });
  });

  return (
    <group ref={groupRef}>
      {crystals.map((crystal, i) => (
        <mesh
          key={i}
          position={crystal.position}
          rotation={crystal.rotation}
          scale={crystal.scale}
        >
          <octahedronGeometry args={[1, 0]} />
          <meshPhysicalMaterial
            color={crystal.color}
            metalness={0.1}
            roughness={0.1}
            transmission={0.9}
            thickness={0.5}
            envMapIntensity={1}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}
