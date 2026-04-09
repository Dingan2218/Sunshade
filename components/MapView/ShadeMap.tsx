"use client";

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const FitBounds = ({ route }: { route: { latitude: number; longitude: number }[] }) => {
  const map = useMap();
  useEffect(() => {
    if (route && route.length > 0) {
      const bounds = L.latLngBounds(route.map(r => [r.latitude, r.longitude]));
      map.fitBounds(bounds, { padding: [100, 100], duration: 1 });
    }
  }, [route, map]);
  return null;
};

// Custom Nothing-style marker using a simple white dot
const CustomNothingMarker = ({ position, label }: { position: [number, number], label: string }) => {
  const map = useMap();
  useEffect(() => {
    const icon = L.divIcon({
      className: 'custom-nothing-marker',
      html: `<div style="width: 12px; height: 12px; background: #fff; border: 2px solid #000; border-radius: 50%; box-shadow: 0 0 10px rgba(255,255,255,0.5)"></div>
             <div style="font-family: var(--font-doto); font-size: 10px; color: #fff; position: absolute; top: 18px; left: 50%; transform: translateX(-50%); white-space: nowrap; text-transform: uppercase;">${label}</div>`,
      iconSize: [12, 12],
      iconAnchor: [6, 6]
    });
    const marker = L.marker(position, { icon }).addTo(map);
    return () => { marker.remove(); };
  }, [map, position, label]);
  return null;
};

interface ShadeMapProps {
  route?: { latitude: number; longitude: number }[];
  center?: [number, number];
}

const ShadeMap: React.FC<ShadeMapProps> = ({ route, center = [52.2297, 21.0122] }) => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', filter: 'grayscale(1) contrast(1.2)' }}>
      <MapContainer 
        center={center} 
        zoom={12} 
        style={{ height: '100%', width: '100%', backgroundColor: '#000' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {route && route.length > 0 && (
          <>
            <Polyline 
              positions={route.map(r => [r.latitude, r.longitude])} 
              pathOptions={{ 
                color: '#ffffff', 
                weight: 2, 
                opacity: 0.8,
                dashArray: '5, 10' // Technical dashed line
              }} 
            />
            <FitBounds route={route} />
            
            <CustomNothingMarker position={[route[0].latitude, route[0].longitude]} label="Origin" />
            <CustomNothingMarker position={[route[route.length - 1].latitude, route[route.length - 1].longitude]} label="Dest" />
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default ShadeMap;
