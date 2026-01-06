import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import { Suspense } from "react";
import { HolographicCube } from "@/components/3d/HolographicCube";
import { NeonRings } from "@/components/3d/NeonRings";
import { FloatingDiamond } from "@/components/3d/FloatingDiamond";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { Users, Building, Globe, ThumbsUp } from "lucide-react";

const stats = [
  { 
    value: 15000, 
    suffix: "+", 
    label: "Active Alumni", 
    description: "Engaged members worldwide",
    icon: Users,
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&h=200&fit=crop",
    gradient: "from-cyan-500 to-blue-500"
  },
  { 
    value: 500, 
    suffix: "+", 
    label: "Partner Companies", 
    description: "Hiring from our network",
    icon: Building,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&h=200&fit=crop",
    gradient: "from-purple-500 to-pink-500"
  },
  { 
    value: 50, 
    suffix: "+", 
    label: "Countries", 
    description: "Global alumni presence",
    icon: Globe,
    image: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=300&h=200&fit=crop",
    gradient: "from-green-500 to-emerald-500"
  },
  { 
    value: 98, 
    suffix: "%", 
    label: "Satisfaction Rate", 
    description: "Based on member surveys",
    icon: ThumbsUp,
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=300&h=200&fit=crop",
    gradient: "from-orange-500 to-amber-500"
  },
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
    <section className="relative py-24 md:py-32 px-4 overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 opacity-40">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <Suspense fallback={null}>
            <Scene3D />
          </Suspense>
        </Canvas>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/60 to-background/90 pointer-events-none" />

      {/* Animated background orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-primary/20 blur-[100px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] rounded-full bg-secondary/20 blur-[80px]"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{ duration: 7, repeat: Infinity }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.span 
            className="inline-block px-4 py-2 rounded-full glass text-sm font-medium text-primary mb-4"
            animate={{
              boxShadow: [
                "0 0 20px rgba(0,242,254,0.2)",
                "0 0 40px rgba(0,242,254,0.4)",
                "0 0 20px rgba(0,242,254,0.2)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            📊 Our Impact
          </motion.span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            <motion.span 
              className="text-aurora inline-block"
              animate={{ 
                textShadow: [
                  "0 0 20px rgba(0,242,254,0.3)",
                  "0 0 40px rgba(0,242,254,0.5)",
                  "0 0 20px rgba(0,242,254,0.3)",
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Numbers
            </motion.span>{" "}
            <span className="text-foreground">That Speak</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
            Our growing community continues to break records and create lasting impact.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="relative group"
              initial={{ opacity: 0, y: 50, rotateX: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6, type: "spring" }}
            >
              <motion.div 
                className="glass rounded-2xl overflow-hidden h-full hover:glass-glow transition-all duration-500 relative"
                whileHover={{ scale: 1.03, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Image section */}
                <div className="relative h-28 md:h-32 overflow-hidden">
                  <motion.img 
                    src={stat.image} 
                    alt={stat.label}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                  
                  {/* Icon badge */}
                  <motion.div 
                    className={`absolute bottom-2 right-2 w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}
                    animate={{
                      boxShadow: [
                        "0 0 15px rgba(0,0,0,0.3)",
                        "0 0 25px rgba(0,242,254,0.4)",
                        "0 0 15px rgba(0,0,0,0.3)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                  >
                    <stat.icon className="w-5 h-5 text-white" />
                  </motion.div>
                </div>

                {/* Content */}
                <div className="p-4 md:p-6 text-center">
                  {/* Animated border on hover */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: "linear-gradient(135deg, hsl(185 100% 50% / 0.1) 0%, hsl(280 100% 60% / 0.1) 100%)",
                    }}
                  />
                  
                  <motion.div
                    className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-aurora mb-2 relative z-10"
                    whileHover={{ scale: 1.05 }}
                  >
                    <AnimatedCounter 
                      value={stat.value} 
                      suffix={stat.suffix} 
                      delay={index * 0.15}
                      duration={2.5}
                    />
                  </motion.div>
                  
                  <div className="text-base md:text-lg font-semibold text-foreground mb-1 relative z-10">
                    {stat.label}
                  </div>
                  
                  <div className="text-xs md:text-sm text-muted-foreground relative z-10">
                    {stat.description}
                  </div>
                </div>

                {/* Shimmer effect on hover */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.05) 50%, transparent 70%)",
                    backgroundSize: "200% 200%",
                  }}
                  animate={{
                    backgroundPosition: ["0% 0%", "200% 200%"],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
