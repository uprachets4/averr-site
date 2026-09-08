import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function WavePlane() {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => new THREE.PlaneGeometry(16, 10, 80, 50), []);
  const basePositions = useMemo(() => geometry.attributes.position.array.slice(), [geometry]);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const pos = mesh.geometry.attributes.position;
    const t = state.clock.elapsedTime;

    for (let i = 0; i < pos.count; i++) {
      const x = basePositions[i * 3];
      const y = basePositions[i * 3 + 1];
      const dist = Math.sqrt(x * x + y * y);
      const z = Math.sin(dist * 0.8 - t * 0.9) * 0.35 + Math.sin(x * 0.5 + t * 0.4) * 0.15;
      pos.setZ(i, z);
    }
    pos.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} rotation={[-Math.PI / 2.6, 0, 0]} position={[0, -1.6, 0]}>
      <meshBasicMaterial color="#3A4A7A" wireframe transparent opacity={0.4} />
    </mesh>
  );
}

export default function WaveGrid() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 1.2, 5], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <WavePlane />
      </Canvas>
    </div>
  );
}
