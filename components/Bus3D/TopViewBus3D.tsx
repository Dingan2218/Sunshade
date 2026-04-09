"use client";

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface TopViewBus3DProps {
  side: 'left' | 'right';
  sunAzimuth: number;
  routeBearing: number;
}

const TopDownBus = ({ side, sunLightAngle }: { side: 'left' | 'right', sunLightAngle: number }) => {
  const meshRef = useRef<THREE.Group>(null);

  // Smooth entry animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, 0, 0.05);
    }
  });

  return (
    <group ref={meshRef} position={[0, -5, 0]}>
      {/* Bus Body Base */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.5, 5]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.1} />
      </mesh>

      {/* Windshield */}
      <mesh position={[0, 0.26, 2.3]}>
        <boxGeometry args={[1.8, 0.02, 0.4]} />
        <meshStandardMaterial color="#111" roughness={0} metalness={0.8} />
      </mesh>

      {/* Roof AC */}
      <mesh position={[0, 0.3, -1]}>
        <boxGeometry args={[1.2, 0.2, 1.5]} />
        <meshStandardMaterial color="#EAEAEA" roughness={0.5} />
      </mesh>

      {/* Seats Indication */}
      {/* Left Seats */}
      {[1.5, 0.5, -0.5, -1.5].map((z, i) => (
        <mesh key={`l-${i}`} position={[-0.6, 0.26, z]}>
          <boxGeometry args={[0.5, 0.1, 0.6]} />
          <meshStandardMaterial color={side === 'left' ? '#007AFF' : '#AAA'} />
        </mesh>
      ))}
      
      {/* Right Seats */}
      {[1.5, 0.5, -0.5, -1.5].map((z, i) => (
        <mesh key={`r-${i}`} position={[0.6, 0.26, z]}>
          <boxGeometry args={[0.5, 0.1, 0.6]} />
          <meshStandardMaterial color={side === 'right' ? '#007AFF' : '#AAA'} />
        </mesh>
      ))}

      {/* Sun Ray Indication (Visual representation from where sun is coming) */}
      <mesh position={[Math.sin(sunLightAngle) * 5, 0.5, Math.cos(sunLightAngle) * 5]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshBasicMaterial color="#FFD60A" />
      </mesh>
      
      {/* Sun Ray line */}
      <mesh position={[Math.sin(sunLightAngle) * 2.5, 0.1, Math.cos(sunLightAngle) * 2.5]} rotation={[0, -sunLightAngle, Math.PI/2]}>
         <cylinderGeometry args={[0.05, 0.05, 5]} />
         <meshBasicMaterial color="#FFD60A" transparent opacity={0.5} />
      </mesh>
    </group>
  );
};

export const TopViewBus3D = ({ side, sunAzimuth, routeBearing }: TopViewBus3DProps) => {
  // Calculate relative angle for the sun ray in 3D scene (bus is facing positive Z or negative Z, 
  // let's say bus faces straight up which is -Z in 3D but standard math is 0
  // Actually, bus is facing North (0 deg) in our miniature scene.
  // Sun relative to bus = sunAzimuth - routeBearing
  
  const relativeAngle = useMemo(() => {
    // Convert to radians and adjust so that 0 is "front" (positive z in our model because of how we built it, wait, we put windshield at +Z)
    const diff = sunAzimuth - routeBearing;
    return (diff * Math.PI) / 180;
  }, [sunAzimuth, routeBearing]);

  return (
    <div style={{ width: '100%', height: '200px', position: 'relative', borderRadius: '16px', overflow: 'hidden', background: 'var(--surface)' }}>
      <Canvas orthographic camera={{ position: [0, 10, 0], zoom: 40 }}>
        <ambientLight intensity={0.6} />
        {/* Directional light acting as the sun */}
        <directionalLight 
          position={[Math.sin(relativeAngle) * 10, 5, Math.cos(relativeAngle) * 10]} 
          intensity={1.5} 
          castShadow 
          color="#FFEBB0"
        />
        
        <TopDownBus side={side} sunLightAngle={relativeAngle} />
        
        <ContactShadows position={[0, -0.4, 0]} opacity={0.5} scale={15} blur={2} far={4} />
      </Canvas>
    </div>
  );
};
