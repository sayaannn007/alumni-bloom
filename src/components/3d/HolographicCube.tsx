import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface HolographicCubeProps {
  position?: [number, number, number];
  size?: number;
  color?: string;
}

export function HolographicCube({ 
  position = [0, 0, 0], 
  size = 1,
  color = "#00f2fe",
}: HolographicCubeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const edgesRef = useRef<THREE.LineSegments>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(color) },
  }), [color]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
    if (edgesRef.current) {
      edgesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      edgesRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
    if (innerRef.current) {
      innerRef.current.rotation.x = -Math.sin(state.clock.elapsedTime * 0.7) * 0.5;
      innerRef.current.rotation.y = -state.clock.elapsedTime * 0.5;
      innerRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
    uniforms.uTime.value = state.clock.elapsedTime;
  });

  const edgesGeometry = useMemo(() => {
    return new THREE.EdgesGeometry(new THREE.BoxGeometry(size, size, size));
  }, [size]);

  return (
    <group position={position}>
      {/* Outer transparent cube */}
      <mesh ref={meshRef}>
        <boxGeometry args={[size, size, size]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.1}
          roughness={0.1}
          transmission={0.9}
          thickness={0.5}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Glowing edges */}
      <lineSegments ref={edgesRef} geometry={edgesGeometry}>
        <lineBasicMaterial color={color} linewidth={2} transparent opacity={0.8} />
      </lineSegments>

      {/* Inner rotating icosahedron */}
      <mesh ref={innerRef} scale={0.4}>
        <icosahedronGeometry args={[size * 0.5, 0]} />
        <meshPhysicalMaterial
          color="#bf00ff"
          metalness={0.8}
          roughness={0.2}
          emissive="#bf00ff"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}
