import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface GeometricPolyhedronProps {
  position?: [number, number, number];
  scale?: number;
  color?: string;
  wireframe?: boolean;
  type?: "icosahedron" | "dodecahedron" | "octahedron";
  mouseTrack?: boolean;
}

export function GeometricPolyhedron({
  position = [0, 0, 0],
  scale = 1,
  color = "#00f2fe",
  wireframe = false,
  type = "icosahedron",
  mouseTrack = true,
}: GeometricPolyhedronProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);
  const { mouse, viewport } = useThree();

  const geometry = useMemo(() => {
    switch (type) {
      case "dodecahedron":
        return new THREE.DodecahedronGeometry(1, 0);
      case "octahedron":
        return new THREE.OctahedronGeometry(1, 0);
      default:
        return new THREE.IcosahedronGeometry(1, 0);
    }
  }, [type]);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();

    // Base rotation
    meshRef.current.rotation.x = time * 0.2;
    meshRef.current.rotation.y = time * 0.3;

    // Mouse tracking
    if (mouseTrack) {
      const targetX = (mouse.x * viewport.width) / 4;
      const targetY = (mouse.y * viewport.height) / 4;
      meshRef.current.rotation.x += (targetY * 0.5 - meshRef.current.rotation.x) * 0.05;
      meshRef.current.rotation.y += (targetX * 0.5 - meshRef.current.rotation.y) * 0.05;
    }

    // Sync wireframe rotation
    if (wireframeRef.current) {
      wireframeRef.current.rotation.copy(meshRef.current.rotation);
    }
  });

  return (
    <group position={position} scale={scale}>
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial
          color={color}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={wireframe ? 0.1 : 0.7}
          envMapIntensity={2}
        />
      </mesh>
      <mesh ref={wireframeRef} geometry={geometry} scale={1.01}>
        <meshBasicMaterial
          color={color}
          wireframe
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  );
}
