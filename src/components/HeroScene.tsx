import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const NODE_COUNT = 46;
const CONNECT_DISTANCE = 2.1;

function generateNodes(count: number, radius: number) {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = radius * Math.cbrt(Math.random());
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta) * 0.6;
    const z = r * Math.cos(phi) * 0.8;
    points.push(new THREE.Vector3(x, y, z));
  }
  return points;
}

function buildConnections(nodes: THREE.Vector3[], maxDist: number) {
  const positions: number[] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dist = nodes[i].distanceTo(nodes[j]);
      if (dist < maxDist) {
        positions.push(nodes[i].x, nodes[i].y, nodes[i].z);
        positions.push(nodes[j].x, nodes[j].y, nodes[j].z);
      }
    }
  }
  return new Float32Array(positions);
}

function NetworkGroup() {
  const groupRef = useRef<THREE.Group>(null);
  const nodes = useMemo(() => generateNodes(NODE_COUNT, 3.4), []);
  const linePositions = useMemo(() => buildConnections(nodes, CONNECT_DISTANCE), [nodes]);

  const nodePositions = useMemo(() => {
    const arr = new Float32Array(nodes.length * 3);
    nodes.forEach((n, i) => {
      arr[i * 3] = n.x;
      arr[i * 3 + 1] = n.y;
      arr[i * 3 + 2] = n.z;
    });
    return arr;
  }, [nodes]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.06;
    const targetX = state.pointer.y * 0.25;
    const targetY = state.pointer.x * 0.35;
    groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.03;
    groupRef.current.rotation.z += (targetY * 0.3 - groupRef.current.rotation.z) * 0.03;
  });

  return (
    <group ref={groupRef}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#7C5CFC" transparent opacity={0.22} />
      </lineSegments>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#22D3EE" size={0.065} sizeAttenuation transparent opacity={0.9} />
      </points>
    </group>
  );
}

export default function HeroScene() {
  return (
    <div className="hero-scene-canvas w-full h-full" aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 8], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <NetworkGroup />
      </Canvas>
    </div>
  );
}
