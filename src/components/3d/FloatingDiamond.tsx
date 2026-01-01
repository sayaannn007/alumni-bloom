import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface FloatingDiamondProps {
  position?: [number, number, number];
  scale?: number;
  color?: string;
}

export function FloatingDiamond({ 
  position = [0, 0, 0], 
  scale = 1,
  color = "#00f2fe" 
}: FloatingDiamondProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.5;
      meshRef.current.position.y = Math.sin(t * 1.5) * 0.15;
    }
    if (glowRef.current) {
      glowRef.current.rotation.y = -t * 0.3;
      glowRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.1);
    }
  });

  // Create diamond geometry
  const diamondGeometry = useMemo(() => {
    const geometry = new THREE.OctahedronGeometry(0.5, 0);
    // Stretch the top to create diamond shape
    const positions = geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      if (positions[i + 1] > 0) {
        positions[i + 1] *= 1.5;
      }
    }
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
    return geometry;
  }, []);

  return (
    <group position={position} scale={scale}>
      {/* Main diamond */}
      <mesh ref={meshRef} geometry={diamondGeometry}>
        <meshPhysicalMaterial
          color={color}
          metalness={0.0}
          roughness={0.0}
          transmission={0.95}
          thickness={1.5}
          ior={2.4}
          clearcoat={1}
          clearcoatRoughness={0}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Glow effect */}
      <mesh ref={glowRef} scale={1.2}>
        <octahedronGeometry args={[0.5, 0]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Inner light */}
      <pointLight color={color} intensity={0.5} distance={3} />
    </group>
  );
}
