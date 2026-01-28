import { Canvas, ThreeEvent } from "@react-three/fiber";
import { Environment, Float, OrbitControls } from "@react-three/drei";
import { Suspense, useState, useCallback } from "react";
import * as THREE from "three";
import { GeometricPolyhedron } from "./GeometricPolyhedron";
import { MorphingBlob } from "./MorphingBlob";
import { AbstractSculpture } from "./AbstractSculpture";
import { ParticleExplosion } from "./ParticleExplosion";
import { AudioReactiveVisualizer } from "./AudioReactiveVisualizer";

interface InteractiveSceneProps {
  variant?: "geometric" | "organic" | "audio";
  className?: string;
  enableAudio?: boolean;
}

function ClickableElement({ 
  position, 
  onExplosion 
}: { 
  position: [number, number, number]; 
  onExplosion: (pos: THREE.Vector3) => void;
}) {
  const handleClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const worldPos = new THREE.Vector3(...position);
    onExplosion(worldPos);
  }, [position, onExplosion]);

  return (
    <group position={position} onClick={handleClick}>
      <Float speed={2} rotationIntensity={0.5}>
        <mesh
          onPointerOver={() => document.body.style.cursor = 'pointer'}
          onPointerOut={() => document.body.style.cursor = 'auto'}
        >
          <octahedronGeometry args={[0.3, 0]} />
          <meshPhysicalMaterial
            color="#00f2fe"
            emissive="#bf00ff"
            emissiveIntensity={0.5}
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.9}
          />
        </mesh>
      </Float>
    </group>
  );
}

function SceneContent({ 
  variant, 
  enableAudio,
  explosionPosition,
  onExplosion,
  onExplosionComplete
}: { 
  variant: InteractiveSceneProps["variant"];
  enableAudio?: boolean;
  explosionPosition: THREE.Vector3 | null;
  onExplosion: (pos: THREE.Vector3) => void;
  onExplosionComplete: () => void;
}) {
  const clickPositions: [number, number, number][] = [
    [-2, 1, 0],
    [2, 1, 0],
    [0, -1, 1],
    [-1.5, -1, -1],
    [1.5, 0.5, -1],
  ];

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00f2fe" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#bf00ff" />
      <spotLight
        position={[0, 10, 0]}
        intensity={0.8}
        color="#00ff88"
        angle={0.5}
        penumbra={1}
      />

      {variant === "geometric" && (
        <>
          <Float speed={1.5} rotationIntensity={0.3}>
            <GeometricPolyhedron position={[0, 0, 0]} scale={1.2} />
          </Float>
          {clickPositions.map((pos, i) => (
            <ClickableElement key={i} position={pos} onExplosion={onExplosion} />
          ))}
        </>
      )}

      {variant === "organic" && (
        <>
          <Float speed={1} rotationIntensity={0.2}>
            <MorphingBlob position={[0, 0, 0]} scale={1.5} />
          </Float>
          <AbstractSculpture position={[-2, 0, -1]} scale={0.6} />
          <AbstractSculpture position={[2, 0, -1]} scale={0.6} />
          {clickPositions.slice(0, 3).map((pos, i) => (
            <ClickableElement key={i} position={pos} onExplosion={onExplosion} />
          ))}
        </>
      )}

      {variant === "audio" && (
        <>
          <AudioReactiveVisualizer isEnabled={enableAudio} />
          {clickPositions.map((pos, i) => (
            <ClickableElement key={i} position={pos} onExplosion={onExplosion} />
          ))}
        </>
      )}

      <ParticleExplosion 
        triggerPosition={explosionPosition} 
        onComplete={onExplosionComplete}
      />

      <Environment preset="night" />
    </>
  );
}

export function InteractiveScene({ 
  variant = "geometric", 
  className = "",
  enableAudio = true
}: InteractiveSceneProps) {
  const [explosionPosition, setExplosionPosition] = useState<THREE.Vector3 | null>(null);
  const [explosionKey, setExplosionKey] = useState(0);

  const handleExplosion = useCallback((pos: THREE.Vector3) => {
    setExplosionPosition(pos);
    setExplosionKey(k => k + 1);
  }, []);

  const handleExplosionComplete = useCallback(() => {
    setExplosionPosition(null);
  }, []);

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <SceneContent 
            key={explosionKey}
            variant={variant}
            enableAudio={enableAudio}
            explosionPosition={explosionPosition}
            onExplosion={handleExplosion}
            onExplosionComplete={handleExplosionComplete}
          />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 3}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
