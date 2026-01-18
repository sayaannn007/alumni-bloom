import { Canvas } from "@react-three/fiber";
import { Environment, Float, MeshTransmissionMaterial } from "@react-three/drei";
import { Suspense, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { GeometricPolyhedron } from "./GeometricPolyhedron";

interface FeaturesSceneProps {
  className?: string;
}

function CrystalFormation() {
  const groupRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    
    groupRef.current.rotation.y = time * 0.1;
    groupRef.current.rotation.x = mouse.y * 0.2;
    groupRef.current.rotation.z = mouse.x * 0.2;
  });

  return (
    <group ref={groupRef}>
      {/* Central crystal */}
      <mesh position={[0, 0, 0]} scale={[0.5, 1.5, 0.5]}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#00f2fe"
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.7}
          envMapIntensity={2}
        />
      </mesh>
      
      {/* Surrounding crystals */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / 6) * Math.PI * 2) * 1.5,
            (Math.random() - 0.5) * 0.5,
            Math.sin((i / 6) * Math.PI * 2) * 1.5,
          ]}
          scale={[0.3, 0.8 + Math.random() * 0.4, 0.3]}
          rotation={[0, (i / 6) * Math.PI * 2, Math.random() * 0.3]}
        >
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? "#bf00ff" : "#00ff88"}
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.6}
            envMapIntensity={2}
          />
        </mesh>
      ))}
    </group>
  );
}

function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#00f2fe" />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#bf00ff" />
      <spotLight position={[0, 10, 0]} intensity={0.5} color="#00ff88" angle={0.5} />
      
      {/* Crystal formation */}
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
        <CrystalFormation />
      </Float>
      
      {/* Orbiting polyhedrons */}
      <Float speed={2} rotationIntensity={0.6} floatIntensity={1.2}>
        <GeometricPolyhedron
          position={[3, 1, 0]}
          scale={0.4}
          color="#00f2fe"
          type="icosahedron"
          mouseTrack
        />
      </Float>
      
      <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.9}>
        <GeometricPolyhedron
          position={[-3, -1, 1]}
          scale={0.35}
          color="#bf00ff"
          type="dodecahedron"
          mouseTrack
        />
      </Float>
      
      <Environment preset="city" />
    </>
  );
}

export function FeaturesScene({ className = "" }: FeaturesSceneProps) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        style={{ background: "transparent" }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
