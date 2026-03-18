import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Cloud, Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useSettings } from "@/contexts/SettingsContext";

type TimeOfDay = "dawn" | "day" | "dusk" | "night";

interface TimeConfig {
  skyTop: string;
  skyBottom: string;
  sunColor: string;
  sunPosition: [number, number, number];
  sunIntensity: number;
  ambientIntensity: number;
  fogColor: string;
  starsOpacity: number;
  cloudOpacity: number;
}

const timeConfigs: Record<TimeOfDay, TimeConfig> = {
  dawn: {
    skyTop: "#1a1a4a",
    skyBottom: "#ff9966",
    sunColor: "#ff6b35",
    sunPosition: [-8, 2, -10],
    sunIntensity: 0.8,
    ambientIntensity: 0.3,
    fogColor: "#ffb088",
    starsOpacity: 0.3,
    cloudOpacity: 0.6,
  },
  day: {
    skyTop: "#4a90d9",
    skyBottom: "#87ceeb",
    sunColor: "#fffacd",
    sunPosition: [0, 10, -5],
    sunIntensity: 1.5,
    ambientIntensity: 0.6,
    fogColor: "#e0f0ff",
    starsOpacity: 0,
    cloudOpacity: 0.8,
  },
  dusk: {
    skyTop: "#2d1b4e",
    skyBottom: "#ff6b6b",
    sunColor: "#ff4757",
    sunPosition: [8, 2, -10],
    sunIntensity: 0.7,
    ambientIntensity: 0.25,
    fogColor: "#ff8866",
    starsOpacity: 0.4,
    cloudOpacity: 0.5,
  },
  night: {
    skyTop: "#0a0a23",
    skyBottom: "#16213e",
    sunColor: "#c4c4ff",
    sunPosition: [0, -5, -10],
    sunIntensity: 0.2,
    ambientIntensity: 0.1,
    fogColor: "#0f1729",
    starsOpacity: 1,
    cloudOpacity: 0.2,
  },
};

function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 8) return "dawn";
  if (hour >= 8 && hour < 18) return "day";
  if (hour >= 18 && hour < 21) return "dusk";
  return "night";
}

function Sun({ config, timeOfDay }: { config: TimeConfig; timeOfDay: TimeOfDay }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current || !glowRef.current) return;
    
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    meshRef.current.scale.setScalar(pulse);
    glowRef.current.scale.setScalar(pulse * 2);
    
    meshRef.current.rotation.y += 0.002;
  });

  const sunSize = timeOfDay === "night" ? 0.5 : 1.5;

  return (
    <group position={config.sunPosition}>
      {/* Glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[sunSize * 1.5, 32, 32]} />
        <meshBasicMaterial
          color={config.sunColor}
          transparent
          opacity={0.3}
        />
      </mesh>
      
      {/* Sun/Moon core */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[sunSize, 32, 32]} />
        <MeshDistortMaterial
          color={config.sunColor}
          emissive={config.sunColor}
          emissiveIntensity={timeOfDay === "night" ? 0.3 : 0.8}
          distort={timeOfDay === "night" ? 0 : 0.2}
          speed={1}
        />
      </mesh>
    </group>
  );
}

function FloatingClouds({ opacity }: { opacity: number }) {
  const cloudPositions = useMemo(() => [
    [-15, 8, -20],
    [10, 6, -25],
    [-8, 10, -30],
    [20, 7, -22],
    [0, 12, -35],
  ], []);

  if (opacity < 0.1) return null;

  return (
    <>
      {cloudPositions.map((pos, i) => (
        <Float key={i} speed={0.5} rotationIntensity={0.1} floatIntensity={0.5}>
          <Cloud
            position={pos as [number, number, number]}
            opacity={opacity * 0.5}
            speed={0.2}
            segments={20}
          />
        </Float>
      ))}
    </>
  );
}

function AtmosphericParticles({ timeOfDay }: { timeOfDay: TimeOfDay }) {
  const particlesRef = useRef<THREE.Points>(null);
  
  const { positions, colors } = useMemo(() => {
    const count = 200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    const particleColor = timeOfDay === "night" 
      ? new THREE.Color("#6366f1")
      : timeOfDay === "dawn" || timeOfDay === "dusk"
      ? new THREE.Color("#ff9f43")
      : new THREE.Color("#ffffff");

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = Math.random() * 30 - 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50 - 10;
      
      colors[i * 3] = particleColor.r;
      colors[i * 3 + 1] = particleColor.g;
      colors[i * 3 + 2] = particleColor.b;
    }
    
    return { positions, colors };
  }, [timeOfDay]);

  useFrame((state) => {
    if (!particlesRef.current) return;
    particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < positions.length / 3; i++) {
      positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.002;
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

interface ShootingStar {
  id: number;
  startPos: THREE.Vector3;
  endPos: THREE.Vector3;
  speed: number;
  size: number;
  color: THREE.Color;
  progress: number;
  active: boolean;
  trailLength: number;
}

function ShootingStars({ enabled }: { enabled: boolean }) {
  const [stars, setStars] = useState<ShootingStar[]>([]);
  const groupRef = useRef<THREE.Group>(null);
  const nextIdRef = useRef(0);

  // Spawn shooting stars randomly
  useEffect(() => {
    if (!enabled) return;

    const spawnStar = () => {
      const startX = (Math.random() - 0.5) * 60;
      const startY = 15 + Math.random() * 15;
      const startZ = -20 - Math.random() * 20;
      
      const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.5;
      const distance = 30 + Math.random() * 20;
      
      const newStar: ShootingStar = {
        id: nextIdRef.current++,
        startPos: new THREE.Vector3(startX, startY, startZ),
        endPos: new THREE.Vector3(
          startX + Math.cos(angle) * distance,
          startY - Math.sin(angle) * distance,
          startZ
        ),
        speed: 0.8 + Math.random() * 0.8,
        size: 0.08 + Math.random() * 0.12,
        color: new THREE.Color().setHSL(0.1 + Math.random() * 0.1, 0.8, 0.9),
        progress: 0,
        active: true,
        trailLength: 8 + Math.random() * 12,
      };
      
      setStars(prev => [...prev, newStar]);
    };

    // Initial spawn
    const initialTimeout = setTimeout(spawnStar, 2000);
    
    // Random interval spawning (every 3-8 seconds)
    const interval = setInterval(() => {
      if (Math.random() < 0.6) {
        spawnStar();
      }
    }, 3000 + Math.random() * 5000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [enabled]);

  useFrame((_, delta) => {
    setStars(prev => 
      prev
        .map(star => ({
          ...star,
          progress: star.progress + delta * star.speed,
          active: star.progress < 1.5,
        }))
        .filter(star => star.active)
    );
  });

  if (!enabled) return null;

  return (
    <group ref={groupRef}>
      {stars.map(star => (
        <ShootingStarMesh key={star.id} star={star} />
      ))}
    </group>
  );
}

function ShootingStarMesh({ star }: { star: ShootingStar }) {
  const currentPos = useMemo(() => {
    return new THREE.Vector3().lerpVectors(star.startPos, star.endPos, Math.min(star.progress, 1));
  }, [star.startPos, star.endPos, star.progress]);

  const trailLine = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 20;
    
    for (let i = 0; i <= segments; i++) {
      const t = Math.max(0, Math.min(1, star.progress - (i / segments) * 0.3));
      points.push(new THREE.Vector3().lerpVectors(star.startPos, star.endPos, t));
    }
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: star.color,
      transparent: true,
      opacity: star.progress > 1 ? Math.max(0, 1 - (star.progress - 1) * 2) * 0.6 : 0.6,
    });
    
    return new THREE.Line(geometry, material);
  }, [star.startPos, star.endPos, star.progress, star.color]);

  const opacity = star.progress > 1 ? Math.max(0, 1 - (star.progress - 1) * 2) : 1;

  return (
    <group>
      {/* Main star head */}
      <mesh position={currentPos}>
        <sphereGeometry args={[star.size, 8, 8]} />
        <meshBasicMaterial
          color={star.color}
          transparent
          opacity={opacity}
        />
      </mesh>
      
      {/* Glow around head */}
      <mesh position={currentPos}>
        <sphereGeometry args={[star.size * 2, 8, 8]} />
        <meshBasicMaterial
          color={star.color}
          transparent
          opacity={opacity * 0.4}
        />
      </mesh>
      
      {/* Trail */}
      <primitive object={trailLine} />
    </group>
  );
}

function MeteorShower({ enabled }: { enabled: boolean }) {
  const [meteors, setMeteors] = useState<ShootingStar[]>([]);
  const nextIdRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    // Occasional meteor shower (every 20-40 seconds, spawn 3-6 meteors)
    const showerInterval = setInterval(() => {
      if (Math.random() < 0.3) {
        const count = 3 + Math.floor(Math.random() * 4);
        const newMeteors: ShootingStar[] = [];
        
        for (let i = 0; i < count; i++) {
          const startX = (Math.random() - 0.5) * 40;
          const startY = 20 + Math.random() * 10;
          const startZ = -15 - Math.random() * 15;
          
          newMeteors.push({
            id: nextIdRef.current++,
            startPos: new THREE.Vector3(startX, startY, startZ),
            endPos: new THREE.Vector3(
              startX + 25 + Math.random() * 15,
              startY - 20 - Math.random() * 10,
              startZ
            ),
            speed: 1.2 + Math.random() * 0.6,
            size: 0.15 + Math.random() * 0.15,
            color: new THREE.Color().setHSL(0.08, 1, 0.7),
            progress: i * 0.1, // Stagger the meteors
            active: true,
            trailLength: 15 + Math.random() * 10,
          });
        }
        
        setMeteors(prev => [...prev, ...newMeteors]);
      }
    }, 20000 + Math.random() * 20000);

    return () => clearInterval(showerInterval);
  }, [enabled]);

  useFrame((_, delta) => {
    setMeteors(prev =>
      prev
        .map(meteor => ({
          ...meteor,
          progress: meteor.progress + delta * meteor.speed,
          active: meteor.progress < 1.5,
        }))
        .filter(meteor => meteor.active)
    );
  });

  if (!enabled) return null;

  return (
    <group>
      {meteors.map(meteor => (
        <MeteorMesh key={meteor.id} meteor={meteor} />
      ))}
    </group>
  );
}

function MeteorMesh({ meteor }: { meteor: ShootingStar }) {
  const currentPos = useMemo(() => {
    return new THREE.Vector3().lerpVectors(meteor.startPos, meteor.endPos, Math.min(meteor.progress, 1));
  }, [meteor.startPos, meteor.endPos, meteor.progress]);

  const trailLine = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 30;
    
    for (let i = 0; i <= segments; i++) {
      const t = Math.max(0, Math.min(1, meteor.progress - (i / segments) * 0.4));
      points.push(new THREE.Vector3().lerpVectors(meteor.startPos, meteor.endPos, t));
    }
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const opacity = meteor.progress > 1 ? Math.max(0, 1 - (meteor.progress - 1) * 2) : 1;
    const material = new THREE.LineBasicMaterial({
      color: "#ff6b35",
      transparent: true,
      opacity: opacity * 0.8,
    });
    
    return new THREE.Line(geometry, material);
  }, [meteor.startPos, meteor.endPos, meteor.progress]);

  const opacity = meteor.progress > 1 ? Math.max(0, 1 - (meteor.progress - 1) * 2) : 1;

  return (
    <group>
      {/* Meteor head with fiery glow */}
      <mesh position={currentPos}>
        <sphereGeometry args={[meteor.size, 12, 12]} />
        <meshBasicMaterial color="#ff6b35" transparent opacity={opacity} />
      </mesh>
      
      {/* Outer glow */}
      <mesh position={currentPos}>
        <sphereGeometry args={[meteor.size * 3, 12, 12]} />
        <meshBasicMaterial color="#ff9f43" transparent opacity={opacity * 0.3} />
      </mesh>
      
      {/* Fiery trail */}
      <primitive object={trailLine} />
    </group>
  );
}

function HorizonGlow({ config }: { config: TimeConfig }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const material = meshRef.current.material as THREE.MeshBasicMaterial;
    material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
  });

  return (
    <mesh ref={meshRef} position={[0, -2, -30]} rotation={[-Math.PI / 6, 0, 0]}>
      <planeGeometry args={[100, 20]} />
      <meshBasicMaterial
        color={config.fogColor}
        transparent
        opacity={0.4}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function SkyGradient({ config }: { config: TimeConfig }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const gradientMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        topColor: { value: new THREE.Color(config.skyTop) },
        bottomColor: { value: new THREE.Color(config.skyBottom) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        varying vec2 vUv;
        void main() {
          gl_FragColor = vec4(mix(bottomColor, topColor, vUv.y), 1.0);
        }
      `,
      side: THREE.BackSide,
    });
  }, [config.skyTop, config.skyBottom]);

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[50, 32, 32]} />
      <primitive object={gradientMaterial} attach="material" />
    </mesh>
  );
}

function SceneContent({ timeOfDay, config }: { timeOfDay: TimeOfDay; config: TimeConfig }) {
  const isNightOrDusk = timeOfDay === "night" || timeOfDay === "dusk";
  
  return (
    <>
      <SkyGradient config={config} />
      
      <ambientLight intensity={config.ambientIntensity} />
      <directionalLight
        position={config.sunPosition}
        intensity={config.sunIntensity}
        color={config.sunColor}
        castShadow
      />
      
      <Sun config={config} timeOfDay={timeOfDay} />
      
      {config.starsOpacity > 0 && (
        <Stars
          radius={40}
          depth={50}
          count={timeOfDay === "night" ? 5000 : 1000}
          factor={4}
          saturation={0.5}
          fade
        />
      )}
      
      {/* Shooting stars and meteors during night/dusk */}
      <ShootingStars enabled={isNightOrDusk} />
      <MeteorShower enabled={timeOfDay === "night"} />
      
      <FloatingClouds opacity={config.cloudOpacity} />
      <AtmosphericParticles timeOfDay={timeOfDay} />
      <HorizonGlow config={config} />
      
      <fog attach="fog" args={[config.fogColor, 20, 60]} />
    </>
  );
}

export function TimeOfDayBackground() {
  const { settings } = useSettings();
  const [autoTime, setAutoTime] = useState<TimeOfDay>(getTimeOfDay);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setAutoTime(getTimeOfDay());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const timeOfDay: TimeOfDay = settings.timeOfDayOverride === "auto" ? autoTime : settings.timeOfDayOverride as TimeOfDay;

  const config = timeConfigs[timeOfDay];

  // Respect reduced motion preferences
  if (settings.animationIntensity === 0) {
    return (
      <div 
        className="fixed inset-0 -z-10 transition-colors duration-1000"
        style={{
          background: `linear-gradient(to bottom, ${config.skyTop}, ${config.skyBottom})`,
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <SceneContent timeOfDay={timeOfDay} config={config} />
      </Canvas>
      
      {/* Time indicator */}
      <div className="absolute bottom-4 left-4 glass-card px-3 py-1.5 rounded-full text-xs text-muted-foreground capitalize">
        {timeOfDay}
      </div>
    </div>
  );
}
