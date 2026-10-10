'use client';

import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, useProgress } from '@react-three/drei';
import { motion } from 'framer-motion';

// Premium medical 3D scene: vascular network with flowing particles
function VascularGeometry() {
  const { progress } = useProgress();

  // Generate a network of vessel segments with medical aesthetics
  const vesselNetwork = useMemo(() => {
    const segments = 16;
    return Array.from({ length: segments }).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 4,
      ] as [number, number, number],
      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      ] as [number, number, number],
      length: 2 + Math.random() * 3,
      radius: 0.04 + Math.random() * 0.08,
      color: Math.random() > 0.4 ? '#1D3C73' : '#68A9F2',
    }));
  }, []);

  // Flowing particles representing blood cells
  const flowParticles = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6,
      ] as [number, number, number],
      speed: 0.3 + Math.random() * 0.7,
      delay: Math.random() * 2,
      size: 0.04 + Math.random() * 0.08,
    }));
  }, []);

  return (
    <>
      {/* Central aorta sphere with pulsing emissive glow */}
      <group position={[0, 0, 0]}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0 }}
        >
          <mesh>
            <sphereGeometry args={[0.6, 48, 48]} />
            <meshStandardMaterial
              color="#1D3C73"
              emissive="#68A9F2"
              emissiveIntensity={0.5}
              toneMapped={false}
            />
          </mesh>
        </motion.div>

        {/* Orbiting diagnostic rings (Doppler ultrasound waves) */}
        {Array.from({ length: 4 }).map((_, i) => (
          <mesh
            key={`orbit-${i}`}
            rotation={[0, (i * Math.PI) / 4, Math.PI / 2]}
          >
            <torusGeometry args={[1.5 + i * 0.4, 0.03, 4, 200]} />
            <meshStandardMaterial
              color="#68A9F2"
              emissive="#68A9F2"
              emissiveIntensity={0.2}
              transparent
              opacity={0.5}
            />
          </mesh>
        ))}

        {/* DNA double helix strand using beads */}
        <group position={[0, 0, -1.5]}>
          {Array.from({ length: 15 }).map((_, i) => {
            const angle = (i / 15) * Math.PI * 4;
            const y = (i / 15) * 5 - 2.5;
            const radius = 0.8;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const x2 = Math.cos(angle + Math.PI) * radius;
            const z2 = Math.sin(angle + Math.PI) * radius;
            return (
              <group key={`dna-${i}`}>
                {/* Left strand bead */}
                <mesh position={[x, y, z]}>
                  <sphereGeometry args={[0.04, 12, 12]} />
                  <meshStandardMaterial color="#10B981" emissive="#10B981" emissiveIntensity={0.3} />
                </mesh>
                {/* Right strand bead */}
                <mesh position={[x2, y + 0.1, z2]}>
                  <sphereGeometry args={[0.04, 12, 12]} />
                  <meshStandardMaterial color="#10B981" emissive="#10B981" emissiveIntensity={0.3} />
                </mesh>
                {/* Rung connecting strands */}
                <mesh position={[(x + x2) / 2, y, (z + z2) / 2]} rotation={[0, angle, 0]}>
                  <cylinderGeometry args={[0.01, 0.01, radius * 2, 6]} />
                  <meshStandardMaterial color="#10B981" transparent opacity={0.5} />
                </mesh>
              </group>
            );
          })}
        </group>
      </group>

      {/* Vessel segments */}
      {vesselNetwork.map((v, i) => (
        <Float
          key={`vessel-${i}`}
          speed={0.3 + i * 0.05}
          rotationIntensity={0.1}
          floatIntensity={0.15}
        >
          <group
            position={v.position}
            rotation={v.rotation}
            scale={[1, v.length, 1]}
          >
            <mesh>
              <cylinderGeometry args={[v.radius, v.radius, 1, 12]} />
              <meshStandardMaterial
                color={v.color}
                emissive={v.color}
                emissiveIntensity={0.15}
              />
            </mesh>
          </group>
        </Float>
      ))}

      {/* Flowing particles */}
      {flowParticles.map((p, i) => (
        <Float
          key={`flow-${i}`}
          speed={p.speed}
          rotationIntensity={0}
          floatIntensity={p.speed * 0.5}
        >
          <mesh position={p.position}>
            <sphereGeometry args={[p.size, 12, 12]} />
            <meshStandardMaterial
              color="#EF4444"
              emissive="#EF4444"
              emissiveIntensity={0.8}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.6}
        color="#FFFFFF"
        castShadow
      />
      <directionalLight
        position={[-5, -5, -5]}
        intensity={0.3}
        color="#68A9F2"
      />
      <pointLight position={[0, 0, 5]} intensity={0.3} color="#1D3C73" />
    </>
  );
}

export function VascularScene() {
  return (
    <div className="relative h-full w-full">
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
            autoRotateSpeed={0.2}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

// Keep Hero3D as alias for backward compatibility
export const Hero3D = VascularScene;
