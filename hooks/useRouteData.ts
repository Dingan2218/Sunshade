import { useState } from 'react';

export interface RouteStep {
  latitude: number;
  longitude: number;
}

export const useRouteData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCoordinates = async (query: string) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
      const data = await res.json();
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
          displayName: data[0].display_name
        };
      }
      return null;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const fetchRoute = async (startQuery: string, endQuery: string) => {
    setLoading(true);
    setError(null);
    try {
      const start = await getCoordinates(startQuery);
      const end = await getCoordinates(endQuery);

      if (!start || !end) {
        setError("Could not find locations. Please try again.");
        setLoading(false);
        return null;
      }

      const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${start.lon},${start.lat};${end.lon},${end.lat}?overview=full&geometries=geojson`);
      const data = await res.json();

      if (data.routes && data.routes.length > 0) {
        const coordinates = data.routes[0].geometry.coordinates.map((coord: any) => ({
          latitude: coord[1],
          longitude: coord[0]
        }));
        setLoading(false);
        return {
          path: coordinates,
          start,
          end,
          distance: data.routes[0].distance,
          duration: data.routes[0].duration
        };
      }
      
      setError("No route found between these locations.");
      setLoading(false);
      return null;
    } catch (err) {
      setError("An error occurred while fetching the route.");
      setLoading(false);
      return null;
    }
  };

  return { fetchRoute, loading, error };
};
