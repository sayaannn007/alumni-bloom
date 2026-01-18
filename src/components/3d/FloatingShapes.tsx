import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Float } from "@react-three/drei";

interface FloatingShapesProps {
  count?: number;
  spread?: number;
  mouseTrack?: boolean;
  colors?: string[];
}

interface ShapeData {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  type: "box" | "tetrahedron" | "octahedron" | "cone" | "torus";
  color: string;
  speed: number;
  floatSpeed: number;
}

export function FloatingShapes({
  count = 15,
  spread = 8,
  mouseTrack = true,
  colors = ["#00f2fe", "#bf00ff", "#00ff88"],
}: FloatingShapesProps) {
  const groupRef = useRef<THREE.Group>(null);
  const shapesRef = useRef<THREE.Mesh[]>([]);
  const { mouse } = useThree();

  const shapesData = useMemo<ShapeData[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread * 0.5,
      ] as [number, number, number],
      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      ] as [number, number, number],
      scale: 0.1 + Math.random() * 0.3,
      type: ["box", "tetrahedron", "octahedron", "cone", "torus"][
        Math.floor(Math.random() * 5)
      ] as ShapeData["type"],
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: 0.2 + Math.random() * 0.5,
      floatSpeed: 1 + Math.random() * 2,
    }));
  }, [count, spread, colors]);

  const getGeometry = (type: ShapeData["type"]) => {
    switch (type) {
      case "box":
        return new THREE.BoxGeometry(1, 1, 1);
      case "tetrahedron":
        return new THREE.TetrahedronGeometry(1);
      case "octahedron":
        return new THREE.OctahedronGeometry(1);
      case "cone":
        return new THREE.ConeGeometry(0.5, 1, 6);
      case "torus":
        return new THREE.TorusGeometry(0.4, 0.15, 8, 16);
      default:
        return new THREE.BoxGeometry(1, 1, 1);
    }
  };

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Mouse influence on group
    if (groupRef.current && mouseTrack) {
      groupRef.current.rotation.x = mouse.y * 0.1;
      groupRef.current.rotation.y = mouse.x * 0.1;
    }

    // Individual shape animations
    shapesRef.current.forEach((mesh, i) => {
      if (!mesh) return;
      const data = shapesData[i];
      
      mesh.rotation.x += data.speed * 0.01;
      mesh.rotation.y += data.speed * 0.015;
      
      // Floating motion
      mesh.position.y = data.position[1] + Math.sin(time * data.floatSpeed + i) * 0.3;
      mesh.position.x = data.position[0] + Math.cos(time * data.floatSpeed * 0.5 + i) * 0.1;
    });
  });

  return (
    <group ref={groupRef}>
      {shapesData.map((shape, i) => (
        <Float
          key={i}
          speed={shape.floatSpeed}
          rotationIntensity={0.2}
          floatIntensity={0.3}
        >
          <mesh
            ref={(el) => { if (el) shapesRef.current[i] = el; }}
            geometry={getGeometry(shape.type)}
            position={shape.position}
            rotation={shape.rotation}
            scale={shape.scale}
          >
            <meshStandardMaterial
              color={shape.color}
              metalness={0.8}
              roughness={0.2}
              transparent
              opacity={0.7}
              envMapIntensity={1.5}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}
