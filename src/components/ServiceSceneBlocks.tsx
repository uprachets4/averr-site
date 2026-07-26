import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

const BLOCKS = [
  { target: [-0.55, -0.4, 0], scatter: [-1.6, 1.1, -0.8], phase: 0 },
  { target: [0.55, -0.4, 0], scatter: [1.7, -1.2, 0.6], phase: 0.15 },
  { target: [-0.55, 0.4, 0], scatter: [-1.4, -1.3, 0.9], phase: 0.3 },
  { target: [0.55, 0.4, 0], scatter: [1.5, 1.4, -0.6], phase: 0.45 },
  { target: [0, -0.4, 0.55], scatter: [0.2, -1.8, -1.2], phase: 0.6 },
  { target: [0, 0.4, 0.55], scatter: [-0.3, 1.8, 1.1], phase: 0.75 },
] as const;

function AssemblingBlocks() {
  const groupRef = useRef<THREE.Group>(null);
  const blockRefs = useRef<THREE.Group[]>([]);

  const vecs = useMemo(
    () =>
      BLOCKS.map((b) => ({
        target: new THREE.Vector3(...b.target),
        scatter: new THREE.Vector3(...b.scatter),
        phase: b.phase,
      })),
    []
  );

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
    const t = state.clock.elapsedTime * 0.22;
    vecs.forEach((v, i) => {
      const mesh = blockRefs.current[i];
      if (!mesh) return;
      // cycles 0..1..0 with per-block phase offset: assembled -> scattered -> assembled
      const cycle = (Math.sin((t + v.phase) * Math.PI * 2) + 1) / 2;
      mesh.position.lerpVectors(v.target, v.scatter, cycle * 0.85);
      mesh.rotation.x = cycle * 0.6;
      mesh.rotation.z = cycle * 0.3;
    });
  });

  const colors = ['#7C5CFC', '#5B4FD6', '#A78BFA', '#7C5CFC', '#5B4FD6', '#A78BFA'];

  return (
    <group ref={groupRef}>
      {vecs.map((v, i) => (
        <group key={i} ref={(el) => { if (el) blockRefs.current[i] = el; }} position={v.target}>
          <RoundedBox args={[0.42, 0.42, 0.42]} radius={0.08} smoothness={4}>
            <meshStandardMaterial
              color={colors[i]}
              roughness={0.35}
              metalness={0.2}
              emissive={colors[i]}
              emissiveIntensity={0.15}
            />
          </RoundedBox>
        </group>
      ))}
    </group>
  );
}

export default function ServiceSceneBlocks() {
  return (
    <div className="w-full h-full" aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 3.2], fov: 42 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 3]} intensity={1.1} />
        <pointLight position={[-2, -2, 2]} intensity={5} color="#A78BFA" />
        <AssemblingBlocks />
      </Canvas>
    </div>
  );
}
