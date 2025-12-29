import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere } from "@react-three/drei";
import * as THREE from "three";

interface FloatingOrbProps {
  position?: [number, number, number];
  color?: string;
  secondaryColor?: string;
  size?: number;
  speed?: number;
  distort?: number;
}

export function FloatingOrb({
  position = [0, 0, 0],
  color = "#00f2fe",
  secondaryColor = "#ff00ff",
  size = 1,
  speed = 1,
  distort = 0.4,
}: FloatingOrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.3;
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2 * speed;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.1 * speed;
    }
  });

  return (
    <Sphere ref={meshRef} args={[size, 64, 64]} position={position}>
      <MeshDistortMaterial
        color={color}
        attach="material"
        distort={distort}
        speed={speed * 2}
        roughness={0.1}
        metalness={0.8}
        envMapIntensity={1}
        emissive={secondaryColor}
        emissiveIntensity={0.1}
      />
    </Sphere>
  );
}
