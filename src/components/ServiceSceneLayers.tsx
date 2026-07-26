import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const LAYER_COUNT = 4;

function ExplodedLayers() {
  const groupRef = useRef<THREE.Group>(null);
  const layerRefs = useRef<THREE.Mesh[]>([]);
  const geometry = useMemo(() => new THREE.PlaneGeometry(1.5, 1.5), []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
      groupRef.current.rotation.x = 0.3 + Math.sin(state.clock.elapsedTime * 0.15) * 0.05;
    }
    const breathe = (Math.sin(state.clock.elapsedTime * 0.5) + 1) / 2; // 0..1
    layerRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const baseGap = 0.22;
      const spread = 0.3 + breathe * 0.35;
      mesh.position.z = (i - (LAYER_COUNT - 1) / 2) * (baseGap + spread * 0.15);
    });
  });

  const colors = ['#7C5CFC', '#5B4FD6', '#A78BFA', '#7C5CFC'];

  return (
    <group ref={groupRef} rotation={[0.3, 0, 0]}>
      {Array.from({ length: LAYER_COUNT }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) layerRefs.current[i] = el; }}
          geometry={geometry}
          scale={1 - i * 0.12}
        >
          <meshStandardMaterial
            color={colors[i]}
            transparent
            opacity={0.5 - i * 0.06}
            roughness={0.4}
            metalness={0.15}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function ServiceSceneLayers() {
  return (
    <div className="w-full h-full" aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 3.4], fov: 40 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[2, 3, 2]} intensity={1.2} color="#ffffff" />
        <pointLight position={[-2, -1, 2]} intensity={6} color="#A78BFA" />
        <ExplodedLayers />
      </Canvas>
    </div>
  );
}
