import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface NeonRingsProps {
  position?: [number, number, number];
  scale?: number;
}

export function NeonRings({ position = [0, 0, 0], scale = 1 }: NeonRingsProps) {
  const group = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (group.current) {
      group.current.rotation.y = t * 0.1;
    }
    
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.5;
      ring1Ref.current.rotation.z = Math.sin(t * 0.3) * 0.2;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = t * 0.4;
      ring2Ref.current.rotation.x = Math.cos(t * 0.4) * 0.3;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z = t * 0.3;
      ring3Ref.current.rotation.y = Math.sin(t * 0.5) * 0.4;
    }
  });

  return (
    <group ref={group} position={position} scale={scale}>
      {/* Ring 1 - Cyan */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.5, 0.02, 16, 100]} />
        <meshPhysicalMaterial
          color="#00f2fe"
          emissive="#00f2fe"
          emissiveIntensity={2}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Ring 2 - Purple */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.2, 0.02, 16, 100]} />
        <meshPhysicalMaterial
          color="#bf00ff"
          emissive="#bf00ff"
          emissiveIntensity={2}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Ring 3 - Green */}
      <mesh ref={ring3Ref} rotation={[0, Math.PI / 3, Math.PI / 6]}>
        <torusGeometry args={[0.9, 0.02, 16, 100]} />
        <meshPhysicalMaterial
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={2}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Center orb */}
      <mesh>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshPhysicalMaterial
          color="#ffffff"
          emissive="#00f2fe"
          emissiveIntensity={3}
          metalness={1}
          roughness={0}
        />
      </mesh>
    </group>
  );
}
