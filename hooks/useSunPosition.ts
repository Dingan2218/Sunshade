import SunCalc from 'suncalc';
import { normalizeSunAzimuth, calculateBearing, getSunSide } from '@/utils/geoUtils';

export interface Recommendation {
  side: 'left' | 'right';
  confidence: number;
  sunAzimuth: number;
  routeBearing: number;
}

export const useSunPosition = () => {
  const getRecommendation = (route: { latitude: number; longitude: number }[], time: Date): Recommendation => {
    if (route.length < 2) return { side: 'left', confidence: 0, sunAzimuth: 0, routeBearing: 0 };

    // Calculate average bearing of the route
    // For a simple MVP, we take start and end points
    // For better accuracy, we could average all segments
    const start = route[0];
    const end = route[route.length - 1];
    const avgBearing = calculateBearing(start.latitude, start.longitude, end.latitude, end.longitude);

    // Calculate sun position at the midpoint of the journey or start point
    const midPoint = route[Math.floor(route.length / 2)];
    const sunPos = SunCalc.getPosition(time, midPoint.latitude, midPoint.longitude);
    const sunAzimuth = normalizeSunAzimuth(sunPos.azimuth);

    const sunSide = getSunSide(sunAzimuth, avgBearing);
    const side = sunSide === 'left' ? 'right' : 'left';

    // Confidence can be based on how far the sun is from the direct front/back
    let diff = Math.abs(sunAzimuth - avgBearing);
    while (diff > 180) diff = 360 - diff;
    
    // If sun is directly in front (0) or back (180), confidence is low
    // If sun is directly to the side (90), confidence is high
    const confidence = Math.round(Math.abs(Math.sin((diff * Math.PI) / 180)) * 100);

    return {
      side,
      confidence,
      sunAzimuth,
      routeBearing: avgBearing
    };
  };

  return { getRecommendation };
};
