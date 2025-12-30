import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function LiquidMetal() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Morph the geometry
    meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.2;
    meshRef.current.rotation.y = time * 0.1;
    
    // Animate scale for liquid-like breathing
    const breathe = 1 + Math.sin(time * 0.5) * 0.1;
    meshRef.current.scale.set(breathe, breathe * 0.9, breathe);
    
    // Shift metalness for iridescent effect
    materialRef.current.metalness = 0.8 + Math.sin(time) * 0.2;
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.5, 4]} />
      <meshPhysicalMaterial
        ref={materialRef}
        color="#00f2fe"
        metalness={0.9}
        roughness={0.1}
        envMapIntensity={2}
        clearcoat={1}
        clearcoatRoughness={0.1}
        iridescence={1}
        iridescenceIOR={1.5}
        sheen={1}
        sheenColor="#ff00ff"
        sheenRoughness={0.2}
      />
    </mesh>
  );
}
