import { Canvas } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import { Suspense } from "react";
import { CrystalCluster } from "./CrystalCluster";
import { DNAHelix } from "./DNAHelix";
import { LiquidMetal } from "./LiquidMetal";

interface Scene3DProps {
  variant?: "crystals" | "dna" | "liquid";
  className?: string;
}

function SceneContent({ variant }: { variant: Scene3DProps["variant"] }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00f2fe" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#bf00ff" />
      
      <Float
        speed={2}
        rotationIntensity={0.5}
        floatIntensity={1}
      >
        {variant === "crystals" && <CrystalCluster />}
        {variant === "dna" && <DNAHelix />}
        {variant === "liquid" && <LiquidMetal />}
      </Float>
      
      <Environment preset="city" />
    </>
  );
}

export function Scene3D({ variant = "crystals", className = "" }: Scene3DProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <SceneContent variant={variant} />
        </Suspense>
      </Canvas>
    </div>
  );
}
