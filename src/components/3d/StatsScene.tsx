import { Canvas } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import { Suspense } from "react";
import { AbstractSculpture } from "./AbstractSculpture";
import { GeometricPolyhedron } from "./GeometricPolyhedron";
import { PhysicsOrbs } from "./PhysicsOrbs";

interface StatsSceneProps {
  className?: string;
}

function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1.2} color="#00f2fe" />
      <pointLight position={[-10, -10, -10]} intensity={0.6} color="#bf00ff" />
      
      {/* Central abstract sculpture */}
      <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.6}>
        <AbstractSculpture 
          position={[0, 0, 0]} 
          scale={1.5}
          color1="#00f2fe"
          color2="#bf00ff"
          mouseTrack
        />
      </Float>
      
      {/* Corner polyhedrons */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <GeometricPolyhedron
          position={[-4, 2, -2]}
          scale={0.5}
          color="#00f2fe"
          type="icosahedron"
          mouseTrack
        />
      </Float>
      
      <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.9}>
        <GeometricPolyhedron
          position={[4, -2, -1]}
          scale={0.4}
          color="#bf00ff"
          type="dodecahedron"
          mouseTrack
        />
      </Float>
      
      {/* Physics-based floating orbs */}
      <PhysicsOrbs 
        count={12} 
        bounds={5} 
        mouseAttraction 
        colors={["#00f2fe", "#bf00ff", "#00ff88"]}
      />
      
      <Environment preset="city" />
    </>
  );
}

export function StatsScene({ className = "" }: StatsSceneProps) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
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
