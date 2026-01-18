import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface OrbData {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  color: string;
  scale: number;
  mass: number;
}

interface PhysicsOrbsProps {
  count?: number;
  bounds?: number;
  mouseAttraction?: boolean;
  colors?: string[];
}

export function PhysicsOrbs({
  count = 10,
  bounds = 4,
  mouseAttraction = true,
  colors = ["#00f2fe", "#bf00ff", "#00ff88", "#ff6b6b"],
}: PhysicsOrbsProps) {
  const meshRefs = useRef<THREE.Mesh[]>([]);
  const { mouse, viewport } = useThree();

  const orbsData = useMemo<OrbData[]>(() => {
    return Array.from({ length: count }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * bounds * 2,
        (Math.random() - 0.5) * bounds * 2,
        (Math.random() - 0.5) * bounds
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.01
      ),
      color: colors[Math.floor(Math.random() * colors.length)],
      scale: 0.15 + Math.random() * 0.25,
      mass: 0.5 + Math.random() * 0.5,
    }));
  }, [count, bounds, colors]);

  useFrame(() => {
    const mousePos = new THREE.Vector3(
      (mouse.x * viewport.width) / 2,
      (mouse.y * viewport.height) / 2,
      0
    );

    orbsData.forEach((orb, i) => {
      const mesh = meshRefs.current[i];
      if (!mesh) return;

      // Mouse attraction
      if (mouseAttraction) {
        const toMouse = new THREE.Vector3().subVectors(mousePos, orb.position);
        const distance = toMouse.length();
        if (distance < 3) {
          const force = toMouse.normalize().multiplyScalar(0.001 / (distance + 0.5));
          orb.velocity.add(force);
        }
      }

      // Orb-to-orb repulsion
      orbsData.forEach((other, j) => {
        if (i === j) return;
        const toOther = new THREE.Vector3().subVectors(other.position, orb.position);
        const dist = toOther.length();
        if (dist < 1) {
          const repulsion = toOther.normalize().multiplyScalar(-0.0005 / (dist + 0.1));
          orb.velocity.add(repulsion);
        }
      });

      // Apply velocity
      orb.position.add(orb.velocity);

      // Damping
      orb.velocity.multiplyScalar(0.99);

      // Boundary bounce
      ["x", "y", "z"].forEach((axis) => {
        const pos = orb.position[axis as keyof THREE.Vector3] as number;
        const bound = axis === "z" ? bounds * 0.5 : bounds;
        if (Math.abs(pos) > bound) {
          orb.position[axis as "x" | "y" | "z"] = Math.sign(pos) * bound;
          orb.velocity[axis as "x" | "y" | "z"] *= -0.8;
        }
      });

      // Update mesh
      mesh.position.copy(orb.position);
      
      // Subtle pulsing
      const time = Date.now() * 0.001;
      mesh.scale.setScalar(orb.scale * (1 + Math.sin(time * 2 + i) * 0.1));
    });
  });

  return (
    <group>
      {orbsData.map((orb, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) meshRefs.current[i] = el; }}
          position={orb.position}
          scale={orb.scale}
        >
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial
            color={orb.color}
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.8}
            envMapIntensity={2}
          />
        </mesh>
      ))}
    </group>
  );
}
