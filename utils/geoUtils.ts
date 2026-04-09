/**
 * Calculates the bearing (direction) between two points
 * @returns Degrees (0-360, 0 is North)
 */
export function calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);

  // atan2 returns radians from -PI to PI
  // Convert to degrees [0, 360) where 0 is North
  return ((θ * 180) / Math.PI + 360) % 360;
}

/**
 * Normalizes SunCalc azimuth to standard degrees (0 North, 90 East)
 * SunCalc azimuth: 0 is South, measured clockwise (West is positive, East is negative)
 */
export function normalizeSunAzimuth(azimuthRad: number): number {
  // Convert from (0=South, positive=West) to (0=North, clockwise=positive)
  // SunCalc: South=0, West=PI/2, North=PI, East=-PI/2
  // We want: North=0, East=90, South=180, West=270
  
  let deg = (azimuthRad * 180) / Math.PI; // radians to degrees
  deg = deg + 180; // Shift so South is 180, North is 360/0
  return deg % 360;
}

/**
 * Determines which side the sun is on relative to the direction of travel
 */
export function getSunSide(sunAzimuth: number, routeBearing: number): 'left' | 'right' {
  let diff = sunAzimuth - routeBearing;
  while (diff < -180) diff += 360;
  while (diff > 180) diff -= 360;

  // diff > 0 means sun is to the right of travel direction
  return diff > 0 ? 'right' : 'left';
}
