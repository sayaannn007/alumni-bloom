import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import { Suspense } from "react";
import { HolographicCube } from "@/components/3d/HolographicCube";
import { NeonRings } from "@/components/3d/NeonRings";
import { FloatingDiamond } from "@/components/3d/FloatingDiamond";
import { AnimatedCounter } from "@/components/AnimatedCounter";

const stats = [
  { value: 15000, suffix: "+", label: "Active Alumni", description: "Engaged members worldwide" },
  { value: 500, suffix: "+", label: "Partner Companies", description: "Hiring from our network" },
  { value: 50, suffix: "+", label: "Countries", description: "Global alumni presence" },
  { value: 98, suffix: "%", label: "Satisfaction Rate", description: "Based on member surveys" },
];

function Scene3D() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00f2fe" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#bf00ff" />
      
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
        <HolographicCube position={[-3, 1, 0]} size={1.2} />
      </Float>
      
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.8}>
        <NeonRings position={[3, 0, 0]} scale={0.8} />
      </Float>
      
      <Float speed={1.8} rotationIntensity={0.4} floatIntensity={1.2}>
        <FloatingDiamond position={[0, -1, 2]} scale={1.5} color="#bf00ff" />
      </Float>
      
      <Environment preset="city" />
    </>
  );
}

export function StatsShowcase() {
  return (
    <section className="relative py-32 px-4 overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 opacity-60">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <Suspense fallback={null}>
            <Scene3D />
          </Suspense>
        </Canvas>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background/80 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            <span className="text-aurora">Numbers</span>{" "}
            <span className="text-foreground">That Speak</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Our growing community continues to break records and create lasting impact.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="relative group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <div className="glass rounded-2xl p-8 text-center h-full hover:glass-glow transition-all duration-500 relative overflow-hidden">
                {/* Animated border on hover */}
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: "linear-gradient(135deg, hsl(185 100% 50% / 0.2) 0%, hsl(280 100% 60% / 0.2) 100%)",
                  }}
                />
                
                <motion.div
                  className="text-4xl md:text-5xl font-display font-bold text-aurora mb-2 relative z-10"
                  whileHover={{ scale: 1.05 }}
                >
                  <AnimatedCounter 
                    value={stat.value} 
                    suffix={stat.suffix} 
                    delay={index * 0.15}
                    duration={2.5}
                  />
                </motion.div>
                
                <div className="text-lg font-semibold text-foreground mb-1 relative z-10">
                  {stat.label}
                </div>
                
                <div className="text-sm text-muted-foreground relative z-10">
                  {stat.description}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
