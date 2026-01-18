import { Canvas } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import { Suspense } from "react";
import { GeometricPolyhedron } from "./GeometricPolyhedron";
import { MorphingBlob } from "./MorphingBlob";
import { AbstractSculpture } from "./AbstractSculpture";
import { FloatingShapes } from "./FloatingShapes";
import { IridescentSphere } from "./IridescentSphere";

interface EnhancedHeroSceneProps {
  className?: string;
}

function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#00f2fe" />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#bf00ff" />
      <pointLight position={[0, 10, -10]} intensity={0.5} color="#00ff88" />
      
      {/* Central morphing blob */}
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
        <MorphingBlob 
          position={[0, 0, 0]} 
          scale={1.5}
          color1="#00f2fe"
          color2="#bf00ff"
          mouseTrack
        />
      </Float>
      
      {/* Geometric polyhedrons orbiting */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <GeometricPolyhedron
          position={[-3, 1.5, 0]}
          scale={0.6}
          color="#00f2fe"
          type="icosahedron"
          mouseTrack
        />
      </Float>
      
      <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.9}>
        <GeometricPolyhedron
          position={[3, -1, 1]}
          scale={0.5}
          color="#bf00ff"
          type="dodecahedron"
          mouseTrack
        />
      </Float>
      
      <Float speed={2.2} rotationIntensity={0.6} floatIntensity={1.1}>
        <GeometricPolyhedron
          position={[2, 2, -2]}
          scale={0.4}
          color="#00ff88"
          type="octahedron"
          mouseTrack
        />
      </Float>
      
      {/* Small floating iridescent spheres */}
      <Float speed={3} rotationIntensity={0.2} floatIntensity={0.5}>
        <IridescentSphere position={[-2, -1.5, 1]} size={0.3} />
      </Float>
      
      <Float speed={2.5} rotationIntensity={0.3} floatIntensity={0.6}>
        <IridescentSphere position={[1.5, 1, 2]} size={0.25} />
      </Float>
      
      {/* Floating geometric shapes in background */}
      <FloatingShapes count={20} spread={12} mouseTrack />
      
      <Environment preset="city" />
    </>
  );
}

export function EnhancedHeroScene({ className = "" }: EnhancedHeroSceneProps) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
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
