import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial, Torus } from "@react-three/drei";
import * as THREE from "three";

interface GlassTorusProps {
  position?: [number, number, number];
  color?: string;
  size?: number;
  thickness?: number;
  speed?: number;
}

export function GlassTorus({
  position = [0, 0, 0],
  color = "#00f2fe",
  size = 2,
  thickness = 0.3,
  speed = 0.5,
}: GlassTorusProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.5;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <Torus ref={meshRef} args={[size, thickness, 32, 100]} position={position}>
      <MeshTransmissionMaterial
        color={color}
        thickness={0.5}
        roughness={0}
        transmission={0.95}
        ior={1.5}
        chromaticAberration={0.06}
        anisotropy={0.1}
        distortion={0.1}
        distortionScale={0.3}
        temporalDistortion={0.2}
        clearcoat={1}
        attenuationDistance={0.5}
        attenuationColor={color}
        envMapIntensity={1}
      />
    </Torus>
  );
}
