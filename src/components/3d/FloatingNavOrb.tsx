import { useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Text } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

interface NavOrbMeshProps {
  isExpanded: boolean;
  onToggle: () => void;
}

function NavOrbMesh({ isExpanded, onToggle }: NavOrbMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const targetX = pointer.x * 0.3;
    const targetY = pointer.y * 0.3;
    
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.05);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.05);
    
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    
    if (glowRef.current) {
      glowRef.current.position.copy(meshRef.current.position);
      glowRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.1);
    }
  });

  return (
    <group>
      <mesh ref={glowRef} scale={1.3}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial
          color="#00f2fe"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
      
      <mesh 
        ref={meshRef} 
        onClick={onToggle}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >
        <icosahedronGeometry args={[0.4, 1]} />
        <MeshDistortMaterial
          color={isExpanded ? "#00ff88" : "#00f2fe"}
          emissive={isExpanded ? "#00ff88" : "#bf00ff"}
          emissiveIntensity={0.3}
          metalness={0.9}
          roughness={0.1}
          distort={isExpanded ? 0.6 : 0.3}
          speed={2}
        />
      </mesh>
      
      <pointLight color="#00f2fe" intensity={1} distance={5} />
    </group>
  );
}

const navItems = [
  { id: "hero", label: "Home", icon: "🏠" },
  { id: "features", label: "Features", icon: "✨" },
  { id: "network", label: "Network", icon: "🌐" },
  { id: "timeline", label: "Journey", icon: "📅" },
  { id: "stats", label: "Stats", icon: "📊" },
  { id: "testimonials", label: "Stories", icon: "💬" },
];

export function FloatingNavOrb() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsExpanded(false);
    }
  };

  return (
    <div 
      className="fixed bottom-8 right-8 z-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-20 right-0 mb-4"
          >
            <div className="bg-background/80 backdrop-blur-xl border border-primary/30 rounded-2xl p-4 shadow-2xl shadow-primary/20">
              <div className="flex flex-col gap-2">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => scrollToSection(item.id)}
                    className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-primary/20 transition-colors text-left group"
                  >
                    <span className="text-xl group-hover:scale-125 transition-transform">{item.icon}</span>
                    <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">
                      {item.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div
        animate={{ 
          scale: isHovered ? 1.1 : 1,
          boxShadow: isHovered 
            ? "0 0 40px rgba(0, 242, 254, 0.5)" 
            : "0 0 20px rgba(0, 242, 254, 0.3)"
        }}
        className="w-16 h-16 rounded-full overflow-hidden cursor-pointer"
      >
        <Canvas camera={{ position: [0, 0, 2], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[5, 5, 5]} intensity={1} color="#00f2fe" />
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <NavOrbMesh isExpanded={isExpanded} onToggle={() => setIsExpanded(!isExpanded)} />
          </Float>
        </Canvas>
      </motion.div>
      
      <motion.div
        initial={false}
        animate={{ 
          opacity: isExpanded ? 1 : 0,
          scale: isExpanded ? 1 : 0.5 
        }}
        className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"
      />
    </div>
  );
}
