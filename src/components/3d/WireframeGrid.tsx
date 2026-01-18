import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface WireframeGridProps {
  position?: [number, number, number];
  scale?: number;
  color?: string;
  segments?: number;
  mouseTrack?: boolean;
}

export function WireframeGrid({
  position = [0, 0, 0],
  scale = 1,
  color = "#00f2fe",
  segments = 20,
  mouseTrack = true,
}: WireframeGridProps) {
  const groupRef = useRef<THREE.Group>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const { mouse, viewport } = useThree();

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime();

    // Slow rotation
    groupRef.current.rotation.x = time * 0.05;
    groupRef.current.rotation.z = time * 0.03;

    // Mouse tracking
    if (mouseTrack) {
      groupRef.current.rotation.x += mouse.y * 0.1;
      groupRef.current.rotation.y += mouse.x * 0.1;
    }

    // Wave effect on vertices
    if (linesRef.current) {
      const positionAttribute = linesRef.current.geometry.attributes.position;
      const vertex = new THREE.Vector3();
      
      for (let i = 0; i < positionAttribute.count; i++) {
        vertex.fromBufferAttribute(positionAttribute, i);
        
        const originalY = vertex.y;
        const wave = Math.sin(vertex.x * 2 + time) * 0.1;
        const wave2 = Math.cos(vertex.z * 2 + time * 0.7) * 0.1;
        
        positionAttribute.setY(i, originalY + wave + wave2);
      }
      
      positionAttribute.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <gridHelper
        args={[10, segments, color, color]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <lineSegments ref={linesRef}>
        <edgesGeometry args={[new THREE.BoxGeometry(10, 10, 10, segments, segments, segments)]} />
        <lineBasicMaterial color={color} transparent opacity={0.3} />
      </lineSegments>
    </group>
  );
}
