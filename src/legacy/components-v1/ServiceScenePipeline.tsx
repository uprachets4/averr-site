import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 7;

function PipelineFlow() {
  const groupRef = useRef<THREE.Group>(null);
  const particleRefs = useRef<THREE.Mesh[]>([]);

  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.6, -0.5, 0),
        new THREE.Vector3(-0.6, 0.6, 0.3),
        new THREE.Vector3(0.4, -0.4, -0.3),
        new THREE.Vector3(1.5, 0.5, 0),
      ]),
    []
  );

  const tubeGeometry = useMemo(() => new THREE.TubeGeometry(curve, 64, 0.035, 8, false), [curve]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.12;
    }
    particleRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const offset = i / PARTICLE_COUNT;
      const t = (state.clock.elapsedTime * 0.18 + offset) % 1;
      const point = curve.getPointAt(t);
      mesh.position.copy(point);
      const scale = 0.7 + Math.sin(t * Math.PI) * 0.6;
      mesh.scale.setScalar(scale);
    });
  });

  return (
    <group ref={groupRef}>
      <mesh geometry={tubeGeometry}>
        <meshStandardMaterial color="#7C5CFC" transparent opacity={0.18} roughness={0.6} />
      </mesh>
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
        <mesh key={i} ref={(el) => { if (el) particleRefs.current[i] = el; }}>
          <sphereGeometry args={[0.075, 12, 12]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? '#7C5CFC' : '#5B4FD6'}
            emissive={i % 2 === 0 ? '#7C5CFC' : '#5B4FD6'}
            emissiveIntensity={1.4}
            roughness={0.3}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function ServiceScenePipeline() {
  return (
    <div className="w-full h-full" aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 3.6], fov: 42 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[2, 2, 3]} intensity={12} color="#A78BFA" />
        <PipelineFlow />
      </Canvas>
    </div>
  );
}
