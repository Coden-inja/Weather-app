import { useState, useEffect } from 'react';
import axios from 'axios';

interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  visibility: number;
  name: string;
  sys: {
    country: string;
  };
}

export const useWeather = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get user's location
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000, // 5 minutes
          });
        });

        const { latitude, longitude } = position.coords;

        // Fetch weather data from our Vercel API
        const response = await axios.get(`/api/weather/${latitude}/${longitude}`);

        setWeatherData(response.data);
      } catch (err: any) {
        console.error('Weather fetch error:', err);
        if (err.code === 1) {
          setError('Location access denied. Please enable location services.');
        } else if (err.code === 2) {
          setError('Location unavailable. Please try again.');
        } else if (err.code === 3) {
          setError('Location request timed out. Please try again.');
        } else {
          setError('Failed to fetch weather data. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  return { weatherData, loading, error, refetch: () => window.location.reload() };
};