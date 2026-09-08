import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

const PRODUCTS = [
  { name: 'SIFT', pos: [-2.1, 1.1, 0.4] },
  { name: 'CG WALLS', pos: [2.3, 0.7, -0.3] },
  { name: 'CADENCESTACK', pos: [-1.6, -1.3, -0.5] },
  { name: 'CAPITAL COMMAND', pos: [1.9, -1.4, 0.5] },
] as const;

function AmbientField() {
  const nodes = useMemo(() => {
    const arr: THREE.Vector3[] = [];
    for (let i = 0; i < 34; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3.2 * Math.cbrt(Math.random());
      arr.push(
        new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta) * 0.6,
          r * Math.cos(phi) * 0.6
        )
      );
    }
    return arr;
  }, []);

  const positions = useMemo(() => {
    const arr = new Float32Array(nodes.length * 3);
    nodes.forEach((n, i) => {
      arr[i * 3] = n.x;
      arr[i * 3 + 1] = n.y;
      arr[i * 3 + 2] = n.z;
    });
    return arr;
  }, [nodes]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#5B4FD6" size={0.05} sizeAttenuation transparent opacity={0.55} />
    </points>
  );
}

function Constellation() {
  const groupRef = useRef<THREE.Group>(null);
  const hubRef = useRef<THREE.Mesh>(null);

  const linePositions = useMemo(() => {
    const arr: number[] = [];
    PRODUCTS.forEach((p) => {
      arr.push(0, 0, 0, ...p.pos);
    });
    return new Float32Array(arr);
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.09;
      const targetX = state.pointer.y * 0.2;
      const targetY = state.pointer.x * 0.3;
      groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.04;
      groupRef.current.rotation.z += (targetY * 0.25 - groupRef.current.rotation.z) * 0.04;
    }
    if (hubRef.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 1.4) * 0.06;
      hubRef.current.scale.setScalar(s);
    }
  });

  return (
    <group ref={groupRef}>
      <AmbientField />

      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#7C5CFC" transparent opacity={0.35} />
      </lineSegments>

      {/* central Averr hub */}
      <mesh ref={hubRef}>
        <sphereGeometry args={[0.16, 20, 20]} />
        <meshStandardMaterial color="#7C5CFC" emissive="#7C5CFC" emissiveIntensity={1.1} roughness={0.3} />
      </mesh>
      <Html center distanceFactor={9} position={[0, 0.32, 0]} style={{ pointerEvents: 'none' }}>
        <div style={{ fontFamily: 'inherit', fontWeight: 700, fontSize: 11, color: '#F5F5F7', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
          AVERR
        </div>
      </Html>

      {/* one node per real shipped product */}
      {PRODUCTS.map((p) => (
        <group key={p.name} position={p.pos as unknown as [number, number, number]}>
          <mesh>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshStandardMaterial color="#A78BFA" emissive="#A78BFA" emissiveIntensity={0.9} roughness={0.35} />
          </mesh>
          <Html center distanceFactor={9} position={[0, 0.22, 0]} style={{ pointerEvents: 'none' }}>
            <div
              style={{
                fontFamily: 'inherit',
                fontWeight: 600,
                fontSize: 9.5,
                color: '#C7C7CE',
                letterSpacing: '0.06em',
                whiteSpace: 'nowrap',
                textTransform: 'uppercase',
              }}
            >
              {p.name}
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
}

export default function HeroScene() {
  return (
    <div className="hero-scene-canvas w-full h-full" aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 7], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[3, 2, 4]} intensity={10} color="#A78BFA" />
        <Constellation />
      </Canvas>
    </div>
  );
}
