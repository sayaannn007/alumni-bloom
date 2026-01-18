import { Canvas } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import { Suspense } from "react";
import { WireframeGrid } from "./WireframeGrid";
import { GeometricPolyhedron } from "./GeometricPolyhedron";
import { FloatingShapes } from "./FloatingShapes";

interface TimelineSceneProps {
  className?: string;
  progress?: number;
}

function SceneContent({ progress = 0 }: { progress?: number }) {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00f2fe" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#bf00ff" />
      <pointLight position={[0, -10, 5]} intensity={0.3} color="#00ff88" />
      
      {/* Animated wireframe grid */}
      <WireframeGrid 
        position={[0, -3, -5]} 
        scale={2}
        color="#00f2fe"
        segments={15}
        mouseTrack
      />
      
      {/* Progress-based polyhedrons */}
      <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8}>
        <GeometricPolyhedron
          position={[-4, 2, 0]}
          scale={0.6 + progress * 0.2}
          color="#00f2fe"
          type="icosahedron"
          mouseTrack
        />
      </Float>
      
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <GeometricPolyhedron
          position={[4, -1, 1]}
          scale={0.5 + progress * 0.15}
          color="#bf00ff"
          type="octahedron"
          mouseTrack
        />
      </Float>
      
      <Float speed={1.8} rotationIntensity={0.3} floatIntensity={0.7}>
        <GeometricPolyhedron
          position={[0, 3, -2]}
          scale={0.4 + progress * 0.1}
          color="#00ff88"
          type="dodecahedron"
          mouseTrack
        />
      </Float>
      
      {/* Scattered floating shapes */}
      <FloatingShapes 
        count={10} 
        spread={10} 
        mouseTrack 
        colors={["#00f2fe", "#bf00ff", "#00ff88"]}
      />
      
      <Environment preset="city" />
    </>
  );
}

export function TimelineScene({ className = "", progress = 0 }: TimelineSceneProps) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ background: "transparent" }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <SceneContent progress={progress} />
        </Suspense>
      </Canvas>
    </div>
  );
}
