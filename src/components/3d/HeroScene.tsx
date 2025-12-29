import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Float, PerspectiveCamera } from "@react-three/drei";
import { FloatingOrb } from "./FloatingOrb";
import { GlassTorus } from "./GlassTorus";
import { IridescentSphere } from "./IridescentSphere";
import { ParticleField } from "./ParticleField";

export function HeroScene() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        dpr={[1, 2]}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
        style={{ background: 'transparent' }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
        
        <Suspense fallback={null}>
          {/* Ambient lighting */}
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 5, 5]} intensity={0.5} />
          <pointLight position={[-5, 5, -5]} intensity={0.3} color="#ff00ff" />
          <pointLight position={[5, -5, 5]} intensity={0.3} color="#00f2fe" />
          
          {/* Main iridescent sphere */}
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <IridescentSphere position={[0, 0, 0]} size={1.8} speed={0.8} />
          </Float>
          
          {/* Floating orbs */}
          <FloatingOrb 
            position={[-3.5, 1.5, -2]} 
            color="#00f2fe" 
            secondaryColor="#ff00ff"
            size={0.6}
            speed={1.2}
            distort={0.5}
          />
          <FloatingOrb 
            position={[3.5, -1, -1]} 
            color="#ff00ff" 
            secondaryColor="#00ff88"
            size={0.5}
            speed={0.8}
            distort={0.4}
          />
          <FloatingOrb 
            position={[-2, -2, 1]} 
            color="#00ff88" 
            secondaryColor="#00f2fe"
            size={0.4}
            speed={1.5}
            distort={0.6}
          />
          
          {/* Glass torus rings */}
          <GlassTorus 
            position={[2.5, 1.5, -3]} 
            color="#00f2fe"
            size={1}
            thickness={0.15}
            speed={0.3}
          />
          <GlassTorus 
            position={[-3, -1.5, -2]} 
            color="#ff00ff"
            size={0.8}
            thickness={0.12}
            speed={0.4}
          />
          
          {/* Particle field */}
          <ParticleField count={150} spread={20} />
          
          {/* Environment for reflections */}
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
}
