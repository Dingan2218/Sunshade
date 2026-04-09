import { useState } from 'react';

export interface WeatherData {
  temperature: number;
  precipitationProbability: number;
  weatherCode: number;
  description: string;
}

// Map WMO weather codes to descriptions
const getWeatherDescription = (code: number): string => {
  if (code === 0) return 'Clear sky';
  if (code === 1 || code === 2 || code === 3) return 'Mainly clear, partly cloudy, and overcast';
  if (code === 45 || code === 48) return 'Fog';
  if (code >= 51 && code <= 55) return 'Drizzle';
  if (code >= 61 && code <= 65) return 'Rain';
  if (code >= 71 && code <= 75) return 'Snow fall';
  if (code >= 80 && code <= 82) return 'Rain showers';
  if (code >= 95 && code <= 99) return 'Thunderstorm';
  return 'Unknown';
}

export const useWeather = () => {
  const [loading, setLoading] = useState(false);

  const fetchWeather = async (lat: number, lon: number): Promise<WeatherData | null> => {
    setLoading(true);
    try {
      // Free open-meteo API
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation_probability,weather_code`);
      const data = await res.json();
      
      setLoading(false);
      if (data && data.current) {
        return {
          temperature: data.current.temperature_2m,
          precipitationProbability: data.current.precipitation_probability || 0,
          weatherCode: data.current.weather_code,
          description: getWeatherDescription(data.current.weather_code),
        };
      }
      return null;
    } catch(err) {
      console.error("Failed to fetch weather", err);
      setLoading(false);
      return null;
    }
  }

  return { fetchWeather, loading };
}
