import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Text } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "@/contexts/SettingsContext";
import { Map, ChevronUp, ChevronDown } from "lucide-react";

interface Section {
  id: string;
  label: string;
  color: string;
}

const sections: Section[] = [
  { id: "hero", label: "Home", color: "#00f2fe" },
  { id: "features", label: "Features", color: "#bf00ff" },
  { id: "network", label: "Network", color: "#00ff88" },
  { id: "timeline", label: "Timeline", color: "#ff6b6b" },
  { id: "stats", label: "Stats", color: "#ffd93d" },
  { id: "audio", label: "Audio", color: "#6c5ce7" },
  { id: "testimonials", label: "Stories", color: "#00f2fe" },
  { id: "cta", label: "Join", color: "#bf00ff" },
];

interface MarkerProps {
  position: [number, number, number];
  color: string;
  isActive: boolean;
  label: string;
  onClick: () => void;
}

function Marker({ position, color, isActive, onClick }: MarkerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const targetScale = isActive ? 1.5 : hovered ? 1.2 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    
    if (isActive) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 2;
    }
  });

  return (
    <group position={position}>
      <Float speed={isActive ? 3 : 1} rotationIntensity={0.2} floatIntensity={0.3}>
        <mesh
          ref={meshRef}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          onPointerOver={() => {
            setHovered(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = "auto";
          }}
        >
          <octahedronGeometry args={[0.15, 0]} />
          <MeshDistortMaterial
            color={color}
            emissive={color}
            emissiveIntensity={isActive ? 0.8 : 0.3}
            metalness={0.9}
            roughness={0.1}
            distort={isActive ? 0.3 : 0.1}
            speed={2}
            transparent
            opacity={isActive ? 1 : 0.7}
          />
        </mesh>
      </Float>
      
      {/* Connection line */}
      {position[1] > -2.5 && (
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
          <meshBasicMaterial color={color} transparent opacity={0.3} />
        </mesh>
      )}
    </group>
  );
}

function PathLine({ activeIndex }: { activeIndex: number }) {
  const lineRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!lineRef.current) return;
    const material = lineRef.current.material as THREE.MeshBasicMaterial;
    material.opacity = 0.2 + Math.sin(Date.now() * 0.003) * 0.1;
  });

  return (
    <mesh ref={lineRef} position={[0, 0, -0.1]}>
      <planeGeometry args={[0.05, 5]} />
      <meshBasicMaterial color="#00f2fe" transparent opacity={0.2} />
    </mesh>
  );
}

function ProgressIndicator({ progress }: { progress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.position.y = 2.2 - progress * 4.4;
  });

  return (
    <mesh ref={meshRef} position={[0, 2.2, 0.1]}>
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshBasicMaterial color="#00ff88" />
    </mesh>
  );
}

function MapScene({ activeSection, onNavigate }: { activeSection: string; onNavigate: (id: string) => void }) {
  const activeIndex = sections.findIndex(s => s.id === activeSection);
  const progress = activeIndex / (sections.length - 1);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[2, 2, 2]} intensity={1} color="#00f2fe" />
      <pointLight position={[-2, -2, 2]} intensity={0.5} color="#bf00ff" />

      <PathLine activeIndex={activeIndex} />
      <ProgressIndicator progress={progress} />

      {sections.map((section, index) => {
        const y = 2 - index * 0.55;
        return (
          <Marker
            key={section.id}
            position={[0, y, 0]}
            color={section.color}
            isActive={section.id === activeSection}
            label={section.label}
            onClick={() => onNavigate(section.id)}
          />
        );
      })}
    </>
  );
}

export function MiniMap3D() {
  const [activeSection, setActiveSection] = useState("hero");
  const [isExpanded, setIsExpanded] = useState(false);
  const { settings } = useSettings();

  useEffect(() => {
    if (!settings.miniMapEnabled) return;

    const handleScroll = () => {
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [settings.miniMapEnabled]);

  const navigateToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navigatePrev = () => {
    const currentIndex = sections.findIndex(s => s.id === activeSection);
    if (currentIndex > 0) {
      navigateToSection(sections[currentIndex - 1].id);
    }
  };

  const navigateNext = () => {
    const currentIndex = sections.findIndex(s => s.id === activeSection);
    if (currentIndex < sections.length - 1) {
      navigateToSection(sections[currentIndex + 1].id);
    }
  };

  if (!settings.miniMapEnabled) return null;

  const currentSection = sections.find(s => s.id === activeSection);

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 2, duration: 0.5 }}
      className="fixed left-4 top-1/2 -translate-y-1/2 z-50"
    >
      {/* Collapsed view */}
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.button
            key="collapsed"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsExpanded(true)}
            className="glass-card p-3 rounded-full hover:bg-primary/20 transition-colors group"
            title="Open mini-map"
          >
            <Map className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
          </motion.button>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, scale: 0.8, width: 60 }}
            animate={{ opacity: 1, scale: 1, width: 80 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="glass-card rounded-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-2 border-b border-border/30 flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground truncate">
                {currentSection?.label}
              </span>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 hover:bg-muted rounded transition-colors"
              >
                <Map className="w-3 h-3 text-muted-foreground" />
              </button>
            </div>

            {/* Navigation arrows */}
            <button
              onClick={navigatePrev}
              disabled={activeSection === sections[0].id}
              className="w-full p-1 hover:bg-muted/50 transition-colors disabled:opacity-30"
            >
              <ChevronUp className="w-4 h-4 mx-auto text-muted-foreground" />
            </button>

            {/* 3D Map */}
            <div className="w-full h-[300px]">
              <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
                <MapScene activeSection={activeSection} onNavigate={navigateToSection} />
              </Canvas>
            </div>

            {/* Navigation arrows */}
            <button
              onClick={navigateNext}
              disabled={activeSection === sections[sections.length - 1].id}
              className="w-full p-1 hover:bg-muted/50 transition-colors disabled:opacity-30"
            >
              <ChevronDown className="w-4 h-4 mx-auto text-muted-foreground" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
