import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, Icosahedron, Torus, MeshDistortMaterial, Environment } from "@react-three/drei";
import { Suspense, useRef } from "react";
import type { Mesh } from "three";

function Leaf({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) {
  const ref = useRef<Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.3;
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
  });
  return (
    <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.2}>
      <Icosahedron ref={ref} args={[scale, 1]} position={position}>
        <MeshDistortMaterial color={color} speed={2} distort={0.45} roughness={0.2} metalness={0.1} />
      </Icosahedron>
    </Float>
  );
}

function Droplet({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <Float speed={2.2} rotationIntensity={0.2} floatIntensity={2}>
      <Sphere args={[0.35, 32, 32]} position={position}>
        <meshPhysicalMaterial
          color={color}
          transmission={0.9}
          thickness={0.5}
          roughness={0.05}
          ior={1.4}
          clearcoat={1}
        />
      </Sphere>
    </Float>
  );
}

function Ring({ position }: { position: [number, number, number] }) {
  const ref = useRef<Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.4;
    ref.current.rotation.y = state.clock.elapsedTime * 0.2;
  });
  return (
    <Torus ref={ref} args={[1.2, 0.04, 16, 100]} position={position}>
      <meshStandardMaterial color="#d4a64a" emissive="#d4a64a" emissiveIntensity={0.3} />
    </Torus>
  );
}

export function HealingScene({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} color="#fff8e8" />
          <pointLight position={[-3, 2, 2]} intensity={0.8} color="#a3d9a5" />

          <Leaf position={[-2.2, 1, 0]} color="#4a8c5e" scale={0.9} />
          <Leaf position={[2.1, -0.6, -0.5]} color="#6fb27e" scale={0.7} />
          <Leaf position={[0, 1.8, -1]} color="#3d7d52" scale={0.6} />
          <Leaf position={[-1.5, -1.4, 0.5]} color="#85c692" scale={0.5} />

          <Droplet position={[1.3, 1.2, 1]} color="#a3d9c9" />
          <Droplet position={[-0.8, 0, 1.2]} color="#d4ecdc" />
          <Droplet position={[2.5, 0.8, 0.3]} color="#bce5d4" />

          <Ring position={[0, 0, -0.5]} />
          <Environment preset="sunset" />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default HealingScene;
