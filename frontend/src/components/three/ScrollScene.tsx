import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Icosahedron, Sphere, Torus, MeshDistortMaterial, Environment, Stars } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import type { Group, Mesh } from "three";

function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setP(h > 0 ? window.scrollY / h : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return p;
}

function SceneContent({ scrollRef }: { scrollRef: React.MutableRefObject<number> }) {
  const group = useRef<Group>(null);
  const ring1 = useRef<Mesh>(null);
  const ring2 = useRef<Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const s = scrollRef.current;
    if (group.current) {
      group.current.rotation.y = t * 0.08 + s * Math.PI * 2;
      group.current.rotation.x = s * Math.PI * 0.6;
      group.current.position.y = -s * 4;
    }
    if (ring1.current) {
      ring1.current.rotation.x = t * 0.25;
      ring1.current.rotation.y = t * 0.18 + s * 3;
    }
    if (ring2.current) {
      ring2.current.rotation.x = -t * 0.2 + s * 2;
      ring2.current.rotation.z = t * 0.15;
    }
    state.camera.position.z = 7 + Math.sin(s * Math.PI) * 1.5;
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.1} color="#fff8e8" />
      <pointLight position={[-4, -2, 3]} intensity={0.8} color="#a3d9a5" />
      <pointLight position={[3, 4, -2]} intensity={0.6} color="#d4a64a" />

      <group ref={group}>
        <Float speed={1.2} rotationIntensity={0.5} floatIntensity={1.2}>
          <Icosahedron args={[1.1, 1]} position={[-2.5, 0.8, 0]}>
            <MeshDistortMaterial color="#4a8c5e" speed={2} distort={0.45} roughness={0.2} />
          </Icosahedron>
        </Float>
        <Float speed={1.6} rotationIntensity={0.4} floatIntensity={1.5}>
          <Icosahedron args={[0.7, 1]} position={[2.6, -0.4, -1]}>
            <MeshDistortMaterial color="#6fb27e" speed={2.5} distort={0.5} roughness={0.25} />
          </Icosahedron>
        </Float>
        <Float speed={2} rotationIntensity={0.3} floatIntensity={2}>
          <Sphere args={[0.45, 32, 32]} position={[1.2, 1.6, 1]}>
            <meshPhysicalMaterial color="#a3d9c9" transmission={0.9} thickness={0.5} roughness={0.05} ior={1.4} clearcoat={1} />
          </Sphere>
        </Float>
        <Float speed={2.4} rotationIntensity={0.2} floatIntensity={1.8}>
          <Sphere args={[0.3, 32, 32]} position={[-1.4, -1.5, 1.2]}>
            <meshPhysicalMaterial color="#d4ecdc" transmission={0.95} thickness={0.4} roughness={0.05} ior={1.4} clearcoat={1} />
          </Sphere>
        </Float>
        <Float speed={1.8} rotationIntensity={0.6} floatIntensity={1.2}>
          <Icosahedron args={[0.5, 1]} position={[0, -2, -0.5]}>
            <MeshDistortMaterial color="#85c692" speed={1.8} distort={0.4} roughness={0.3} />
          </Icosahedron>
        </Float>

        <Torus ref={ring1} args={[1.6, 0.035, 16, 100]} position={[0, 0, -0.5]}>
          <meshStandardMaterial color="#d4a64a" emissive="#d4a64a" emissiveIntensity={0.35} />
        </Torus>
        <Torus ref={ring2} args={[2.2, 0.02, 16, 100]} position={[0, 0, -1]} rotation={[Math.PI / 3, 0, 0]}>
          <meshStandardMaterial color="#a3d9a5" emissive="#a3d9a5" emissiveIntensity={0.25} />
        </Torus>
      </group>

      <Stars radius={50} depth={30} count={1200} factor={3} saturation={0} fade speed={0.6} />
      <Environment preset="sunset" />
    </>
  );
}

export function ScrollScene() {
  const scrollRef = useRef(0);
  const progress = useScrollProgress();
  scrollRef.current = progress;

  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ opacity: 0.55 }}
    >
      <Canvas camera={{ position: [0, 0, 7], fov: 50 }} dpr={[1, 1.5]}>
        <Suspense fallback={null}>
          <SceneContent scrollRef={scrollRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default ScrollScene;
