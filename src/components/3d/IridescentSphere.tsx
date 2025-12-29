import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface IridescentSphereProps {
  position?: [number, number, number];
  size?: number;
  speed?: number;
}

// Custom shader for iridescent effect
const vertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  uniform float time;
  
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    vUv = uv;
    
    vec3 pos = position;
    float displacement = sin(pos.x * 3.0 + time) * sin(pos.y * 3.0 + time) * sin(pos.z * 3.0 + time) * 0.1;
    pos += normal * displacement;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  uniform float time;
  
  void main() {
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - abs(dot(viewDirection, vNormal)), 3.0);
    
    // Iridescent color based on viewing angle and time
    vec3 color1 = vec3(0.0, 0.95, 1.0);  // Cyan
    vec3 color2 = vec3(1.0, 0.0, 1.0);    // Magenta
    vec3 color3 = vec3(0.0, 1.0, 0.53);   // Green
    
    float t = (sin(time * 0.5 + fresnel * 3.14159) + 1.0) * 0.5;
    float t2 = (sin(time * 0.3 + fresnel * 2.0 + 1.0) + 1.0) * 0.5;
    
    vec3 iridescent = mix(mix(color1, color2, t), color3, t2);
    
    // Add glow
    float glow = pow(fresnel, 2.0) * 0.8;
    vec3 finalColor = iridescent + vec3(glow);
    
    // Add transparency based on fresnel
    float alpha = 0.6 + fresnel * 0.4;
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

export function IridescentSphere({
  position = [0, 0, 0],
  size = 1.5,
  speed = 1,
}: IridescentSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const uniforms = useMemo(() => ({
    time: { value: 0 },
  }), []);

  useFrame((state) => {
    if (meshRef.current) {
      uniforms.time.value = state.clock.elapsedTime * speed;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.15;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <icosahedronGeometry args={[size, 4]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
