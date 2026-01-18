import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface AbstractSculptureProps {
  position?: [number, number, number];
  scale?: number;
  color1?: string;
  color2?: string;
  mouseTrack?: boolean;
}

export function AbstractSculpture({
  position = [0, 0, 0],
  scale = 1,
  color1 = "#00f2fe",
  color2 = "#bf00ff",
  mouseTrack = true,
}: AbstractSculptureProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRefs = useRef<THREE.Mesh[]>([]);
  const { mouse } = useThree();

  const shapes = useMemo(() => {
    return [
      { 
        geometry: new THREE.TorusKnotGeometry(0.5, 0.15, 100, 16),
        position: [0, 0, 0] as [number, number, number],
        rotation: [0, 0, 0] as [number, number, number],
        scale: 1,
      },
      { 
        geometry: new THREE.TorusGeometry(0.8, 0.05, 16, 100),
        position: [0, 0, 0] as [number, number, number],
        rotation: [Math.PI / 2, 0, 0] as [number, number, number],
        scale: 1.2,
      },
      { 
        geometry: new THREE.TorusGeometry(1, 0.03, 16, 100),
        position: [0, 0, 0] as [number, number, number],
        rotation: [Math.PI / 3, Math.PI / 4, 0] as [number, number, number],
        scale: 1.4,
      },
      { 
        geometry: new THREE.OctahedronGeometry(0.15, 0),
        position: [0.6, 0.4, 0.2] as [number, number, number],
        rotation: [0, 0, 0] as [number, number, number],
        scale: 1,
      },
      { 
        geometry: new THREE.OctahedronGeometry(0.12, 0),
        position: [-0.5, -0.3, 0.4] as [number, number, number],
        rotation: [0, 0, 0] as [number, number, number],
        scale: 1,
      },
      { 
        geometry: new THREE.OctahedronGeometry(0.1, 0),
        position: [0.2, -0.5, -0.3] as [number, number, number],
        rotation: [0, 0, 0] as [number, number, number],
        scale: 1,
      },
    ];
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime();

    // Group rotation
    groupRef.current.rotation.y = time * 0.2;
    
    // Mouse influence on group
    if (mouseTrack) {
      groupRef.current.rotation.x = mouse.y * 0.3;
      groupRef.current.rotation.z = mouse.x * 0.2;
    }

    // Individual shape animations
    meshRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      
      if (i === 0) {
        mesh.rotation.x = time * 0.3;
        mesh.rotation.z = time * 0.2;
      } else if (i === 1 || i === 2) {
        mesh.rotation.z = time * 0.5 * (i === 1 ? 1 : -1);
      } else {
        // Floating octahedrons
        mesh.position.y = shapes[i].position[1] + Math.sin(time * 2 + i) * 0.1;
        mesh.rotation.x = time * 0.5;
        mesh.rotation.y = time * 0.7;
      }
    });
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {shapes.map((shape, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) meshRefs.current[i] = el; }}
          geometry={shape.geometry}
          position={shape.position}
          rotation={shape.rotation}
          scale={shape.scale}
        >
          <meshStandardMaterial
            color={i < 3 ? color1 : color2}
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={i < 3 ? 0.7 : 0.9}
            envMapIntensity={2}
            wireframe={i === 1 || i === 2}
          />
        </mesh>
      ))}
    </group>
  );
}
