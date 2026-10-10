'use client';

import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Html, useProgress } from '@react-three/drei';
import { motion } from 'framer-motion';

// Subtle floating geometry representing vascular network
function VascularGeometry() {
  const { progress } = useProgress();

  // Create a network of thin tubes/cylinders representing blood vessels
  const tubes = useMemo(() => {
    const count = 12;
    return Array.from({ length: count }).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 3,
      ] as [number, number, number],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [number, number, number],
      scale: 0.3 + Math.random() * 0.4,
      color: Math.random() > 0.5 ? '#1D3C73' : '#68A9F2',
    }));
  }, []);

  return (
    <>
      {/* Central pulsing sphere - aorta/heart representation */}
      <group position={[0, 0, 0]}>
        <mesh>
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshStandardMaterial
            color="#1D3C73"
            emissive="#68A9F2"
            emissiveIntensity={0.4}
          />
        </mesh>
        {/* Pulsing rings around the central sphere */}
        {Array.from({ length: 3 }).map((_, i) => (
          <mesh key={`ring-${i}`} rotation={[0, (i * Math.PI) / 3, 0]}>
            <torusGeometry args={[1.8 + i * 0.5, 0.08, 8, 100]} />
            <meshStandardMaterial color="#68A9F2" emissive="#68A9F2" emissiveIntensity={0.3} />
          </mesh>
        ))}
      </group>

      {/* Floating vessel tubes */}
      {tubes.map((tube, i) => (
        <Float
          key={`tube-${i}`}
          speed={1 + i * 0.1}
          rotationIntensity={0.2}
          floatIntensity={0.3}
        >
          <group position={tube.position as [number, number, number]} rotation={tube.rotation as [number, number, number]} scale={tube.scale}>
            <mesh>
              <cylinderGeometry args={[0.05, 0.05, 3, 16]} />
              <meshStandardMaterial
                color={tube.color}
                emissive={tube.color}
                emissiveIntensity={0.2}
                transparent
                opacity={0.8}
              />
            </mesh>
          </group>
        </Float>
      ))}

      {/* Particle dots along vessels for flow effect */}
      {Array.from({ length: 30 }).map((_, i) => (
        <Float
          key={`particle-${i}`}
          speed={0.5 + i * 0.02}
          rotationIntensity={0}
          floatIntensity={0.5}
        >
          <mesh
            position={[
              (Math.random() - 0.5) * 10,
              (Math.random() - 0.5) * 6,
              (Math.random() - 0.5) * 5,
            ]}
          >
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color="#10B981" emissive="#10B981" emissiveIntensity={0.6} />
          </mesh>
        </Float>
      ))}
    </>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.8}
        color="#FFFFFF"
        castShadow
      />
      <directionalLight
        position={[-5, -5, -5]}
        intensity={0.3}
        color="#68A9F2"
      />
      <pointLight position={[0, 0, 5]} intensity={0.4} color="#1D3C73" />
    </>
  );
}

export function Hero3D() {
  return (
    <div className="relative h-[420px] w-full lg:h-[560px] lg:col-span-5">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        className="h-full w-full"
      >
        <color attach="background" args={['transparent']} />
        <Suspense fallback={null}>
          <Lights />
          <VascularGeometry />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.3}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
