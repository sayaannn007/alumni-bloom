import { Canvas } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import { Suspense } from "react";
import { AudioReactiveVisualizer } from "./AudioReactiveVisualizer";
import { motion } from "framer-motion";

export function AudioVisualizerSection() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Feel the Rhythm
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience our ambient audio visualization that pulses with life
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative h-[500px] rounded-3xl overflow-hidden border border-primary/20 bg-background/30 backdrop-blur-xl"
        >
          {/* Glow effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
          
          <Canvas
            camera={{ position: [0, 3, 6], fov: 50 }}
            style={{ background: "transparent" }}
          >
            <Suspense fallback={null}>
              <ambientLight intensity={0.3} />
              <pointLight position={[10, 10, 10]} intensity={1} color="#00f2fe" />
              <pointLight position={[-10, -10, -10]} intensity={0.5} color="#bf00ff" />
              
              <Float speed={0.5} rotationIntensity={0.1}>
                <AudioReactiveVisualizer isEnabled={true} />
              </Float>
              
              <Environment preset="night" />
            </Suspense>
          </Canvas>
          
          {/* Overlay text */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
            <p className="text-sm text-muted-foreground/60">
              Ambient visualization • Click elements for particle effects
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
