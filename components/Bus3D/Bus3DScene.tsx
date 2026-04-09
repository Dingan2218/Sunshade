"use client";

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, PresentationControls, Float } from '@react-three/drei';
import * as THREE from 'three';

const BusModel = ({ color = "#FFD60A" }: { color?: string }) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group ref={meshRef} position={[0, 0, 0]}>
      {/* Bus Body Base */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[1.5, 0.8, 3.5]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.1} />
      </mesh>
      
      {/* Upper white stripe / roof area */}
      <mesh position={[0, 0.85, 0.1]} castShadow>
        <boxGeometry args={[1.45, 0.1, 3.3]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.1} metalness={0.2} />
      </mesh>

      {/* Windows (Glass) */}
      {/* Left side */}
      <mesh position={[-0.76, 0.4, 0]}>
        <boxGeometry args={[0.02, 0.35, 3]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0} metalness={0.8} />
      </mesh>
      {/* Right side */}
      <mesh position={[0.76, 0.4, 0]}>
        <boxGeometry args={[0.02, 0.35, 3]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0} metalness={0.8} />
      </mesh>
      {/* Front windshield */}
      <mesh position={[0, 0.45, 1.76]}>
        <boxGeometry args={[1.3, 0.4, 0.02]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0} metalness={0.8} />
      </mesh>
      {/* Back windshield */}
      <mesh position={[0, 0.45, -1.76]}>
        <boxGeometry args={[1.3, 0.4, 0.02]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0} metalness={0.8} />
      </mesh>

      {/* Wheels */}
      {/* Front Left */}
      <mesh position={[-0.8, 0, 1.2]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.25, 0.25, 0.2, 32]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      {/* Front Right */}
      <mesh position={[0.8, 0, 1.2]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.25, 0.25, 0.2, 32]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      {/* Back Left */}
      <mesh position={[-0.8, 0, -1.2]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.25, 0.25, 0.2, 32]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      {/* Back Right */}
      <mesh position={[0.8, 0, -1.2]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.25, 0.25, 0.2, 32]} />
        <meshStandardMaterial color="#333" />
      </mesh>

      {/* Headlights */}
      <mesh position={[-0.5, 0.2, 1.76]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={2} />
      </mesh>
      <mesh position={[0.5, 0.2, 1.76]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={2} />
      </mesh>
      
      {/* Taillights */}
      <mesh position={[-0.5, 0.2, -1.76]}>
        <boxGeometry args={[0.2, 0.1, 0.02]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={1} />
      </mesh>
      <mesh position={[0.5, 0.2, -1.76]}>
        <boxGeometry args={[0.2, 0.1, 0.02]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={1} />
      </mesh>
    </group>
  );
};

export const Bus3DScene = () => {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
      <Canvas shadows camera={{ position: [0, 2, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        
        <PresentationControls 
          global 
          snap={true} 
          rotation={[0, 0.3, 0]} 
          polar={[-Math.PI / 3, Math.PI / 3]} 
          azimuth={[-Math.PI / 1.4, Math.PI / 2]}
        >
          <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <BusModel color="var(--primary)" />
          </Float>
        </PresentationControls>

        <ContactShadows position={[0, -0.4, 0]} opacity={0.4} scale={10} blur={2} far={4} />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};
