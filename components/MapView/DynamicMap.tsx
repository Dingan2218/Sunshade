"use client";

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for leaflet markers in Next.js
const setupLeafletIcon = () => {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
};

interface DynamicMapProps {
  route?: { latitude: number; longitude: number }[];
  center?: [number, number];
}

const FitBounds = ({ route }: { route: { latitude: number; longitude: number }[] }) => {
  const map = useMap();
  useEffect(() => {
    if (route && route.length > 0) {
      const bounds = L.latLngBounds(route.map(r => [r.latitude, r.longitude]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [route, map]);
  return null;
};

const DynamicMap: React.FC<DynamicMapProps> = ({ route, center = [10.8505, 76.2711] }) => {
  useEffect(() => {
    setupLeafletIcon();
  }, []);

  return (
    <MapContainer 
      center={center} 
      zoom={13} 
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
      />
      {route && route.length > 0 && (
        <>
          <Polyline 
            positions={route.map(r => [r.latitude, r.longitude])} 
            pathOptions={{ color: 'var(--primary)', weight: 5, opacity: 0.8 }} 
          />
          <FitBounds route={route} />
          <Marker position={[route[0].latitude, route[0].longitude]} />
          <Marker position={[route[route.length - 1].latitude, route[route.length - 1].longitude]} />
        </>
      )}
    </MapContainer>
  );
};

export default DynamicMap;
