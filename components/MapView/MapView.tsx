"use client";

import dynamic from 'next/dynamic';
import React from 'react';

const DynamicMap = dynamic(() => import('./DynamicMap'), {
  ssr: false,
  loading: () => <div style={{ height: '100%', width: '100%', background: 'var(--background)' }} className="fade-in" />
});

interface MapViewProps {
  route?: { latitude: number; longitude: number }[];
}

const MapView: React.FC<MapViewProps> = ({ route }) => {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
      <DynamicMap route={route} />
    </div>
  );
};

export default MapView;
