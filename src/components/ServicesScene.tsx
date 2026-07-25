import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Shape({
  position,
  scale,
  speed,
  color,
}: {
  position: [number, number, number];
  scale: number;
  speed: number;
  color: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * speed;
    ref.current.rotation.y += delta * speed * 0.6;
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <icosahedronGeometry args={[1, 0]} />
      <meshBasicMaterial color={color} wireframe transparent opacity={0.55} />
    </mesh>
  );
}

function Cluster() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
  });

  const shapes = useMemo(
    () => [
      { position: [-1.4, 0.4, 0] as [number, number, number], scale: 1.1, speed: 0.25, color: '#7C5CFC' },
      { position: [1.3, -0.3, -0.5] as [number, number, number], scale: 0.75, speed: 0.4, color: '#22D3EE' },
      { position: [0.2, 1, -1] as [number, number, number], scale: 0.5, speed: 0.55, color: '#7C5CFC' },
    ],
    []
  );

  return (
    <group ref={groupRef}>
      {shapes.map((s, i) => (
        <Shape key={i} {...s} />
      ))}
    </group>
  );
}

export default function ServicesScene() {
  return (
    <div className="w-full h-full" aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 4.5], fov: 40 }}
        style={{ background: 'transparent' }}
      >
        <Cluster />
      </Canvas>
    </div>
  );
}
