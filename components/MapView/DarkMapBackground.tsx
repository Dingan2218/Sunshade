"use client";

import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const DarkMapBackground: React.FC = () => {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, filter: 'grayscale(1) brightness(0.7)' }}>
      <MapContainer 
        center={[52.2297, 21.0122]} 
        zoom={12} 
        style={{ height: '100%', width: '100%', backgroundColor: '#000' }}
        zoomControl={false}
        attributionControl={false}
        dragging={false}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
      </MapContainer>
    </div>
  );
};

export default DarkMapBackground;
