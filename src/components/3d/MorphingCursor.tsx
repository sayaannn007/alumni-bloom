import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { useSettings } from "@/contexts/SettingsContext";

type CursorShape = "sphere" | "cube" | "octahedron" | "torus" | "cone";

interface MorphingMeshProps {
  shape: CursorShape;
  targetPosition: { x: number; y: number };
}

function MorphingMesh({ shape, targetPosition }: MorphingMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const x = (targetPosition.x / window.innerWidth) * viewport.width - viewport.width / 2;
    const y = -(targetPosition.y / window.innerHeight) * viewport.height + viewport.height / 2;
    
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, x, 0.15);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, y, 0.15);
    
    meshRef.current.rotation.x += 0.02;
    meshRef.current.rotation.y += 0.03;
    
    const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
    meshRef.current.scale.setScalar(scale);
  });

  const getGeometry = () => {
    switch (shape) {
      case "cube":
        return <boxGeometry args={[0.3, 0.3, 0.3]} />;
      case "octahedron":
        return <octahedronGeometry args={[0.2]} />;
      case "torus":
        return <torusGeometry args={[0.15, 0.06, 16, 32]} />;
      case "cone":
        return <coneGeometry args={[0.15, 0.3, 8]} />;
      default:
        return <sphereGeometry args={[0.15, 32, 32]} />;
    }
  };

  return (
    <mesh ref={meshRef}>
      {getGeometry()}
      <MeshDistortMaterial
        color="#00f2fe"
        emissive="#bf00ff"
        emissiveIntensity={0.5}
        metalness={0.8}
        roughness={0.2}
        distort={0.3}
        speed={2}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

const sectionShapeMap: Record<string, CursorShape> = {
  hero: "sphere",
  features: "octahedron",
  network: "cube",
  timeline: "torus",
  stats: "cone",
  testimonials: "sphere",
  audio: "octahedron",
  cta: "cube",
};

export function MorphingCursor() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [currentShape, setCurrentShape] = useState<CursorShape>("sphere");
  const { settings } = useSettings();

  useEffect(() => {
    if (!settings.morphingCursorEnabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      const sections = Object.keys(sectionShapeMap);
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            setCurrentShape(sectionShapeMap[section]);
            break;
          }
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [settings.morphingCursorEnabled]);

  if (!settings.morphingCursorEnabled) return null;

  return (
    <motion.div
      className="fixed pointer-events-none z-[9998]"
      style={{
        left: mousePos.x - 40,
        top: mousePos.y - 40,
        width: 80,
        height: 80,
      }}
      animate={{
        left: mousePos.x - 40,
        top: mousePos.y - 40,
      }}
      transition={{ type: "spring", damping: 30, stiffness: 200 }}
    >
      <Canvas camera={{ position: [0, 0, 2], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[2, 2, 2]} intensity={1} color="#00f2fe" />
        <pointLight position={[-2, -2, 2]} intensity={0.5} color="#bf00ff" />
        <MorphingMesh shape={currentShape} targetPosition={mousePos} />
      </Canvas>
    </motion.div>
  );
}
