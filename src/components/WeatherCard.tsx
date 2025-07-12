import React from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, CloudDrizzle, CloudLightning, Eye, Droplets, Wind, Thermometer } from 'lucide-react';

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

interface WeatherCardProps {
  weatherData: WeatherData | null;
  loading: boolean;
  error: string | null;
}

const getWeatherIcon = (weatherMain: string) => {
  const iconMap: { [key: string]: string } = {
    'Clear': '☀️',
    'Clouds': '☁️',
    'Rain': '🌧️',
    'Drizzle': '🌦️',
    'Thunderstorm': '⛈️',
    'Snow': '❄️',
    'Mist': '🌫️',
    'Fog': '🌫️',
    'Haze': '🌫️',
  };
  return iconMap[weatherMain] || '🌤️';
};

const getLucideIcon = (weatherMain: string) => {
  const iconMap: { [key: string]: React.ComponentType<any> } = {
    'Clear': Sun,
    'Clouds': Cloud,
    'Rain': CloudRain,
    'Drizzle': CloudDrizzle,
    'Thunderstorm': CloudLightning,
    'Snow': CloudSnow,
  };
  return iconMap[weatherMain] || Cloud;
};

export default function WeatherCard({ weatherData, loading, error }: WeatherCardProps) {
  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
        <div className="animate-pulse">
          <div className="h-8 bg-white/20 rounded-full mb-4"></div>
          <div className="h-16 bg-white/20 rounded-full mb-4"></div>
          <div className="h-4 bg-white/20 rounded-full mb-2"></div>
          <div className="h-4 bg-white/20 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 backdrop-blur-md rounded-3xl p-8 border border-red-500/30 shadow-2xl">
        <p className="text-red-200 text-center">{error}</p>
      </div>
    );
  }

  if (!weatherData) return null;

  // Check if weather array exists and has data
  if (!weatherData.weather || weatherData.weather.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
        <p className="text-white text-center">Weather data not available</p>
      </div>
    );
  }

  const IconComponent = getLucideIcon(weatherData.weather[0].main);
  const weatherEmoji = getWeatherIcon(weatherData.weather[0].main);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <span className="text-4xl">{weatherEmoji}</span>
          {weatherData.name}, {weatherData.sys.country}
        </h2>
        <p className="text-gray-200 capitalize">{weatherData.weather[0].description}</p>
      </div>

      <div className="flex items-center justify-center mb-8">
        <div className="text-6xl font-bold text-white">
          {Math.round(weatherData.main.temp)}°C
        </div>
        <IconComponent className="ml-4 w-16 h-16 text-white/80" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/10 rounded-2xl p-4 text-center border border-white/10">
          <Thermometer className="w-6 h-6 text-orange-300 mx-auto mb-2" />
          <p className="text-gray-300 text-sm">Feels like</p>
          <p className="text-white font-semibold">{Math.round(weatherData.main.feels_like)}°C</p>
        </div>

        <div className="bg-white/10 rounded-2xl p-4 text-center border border-white/10">
          <Droplets className="w-6 h-6 text-blue-300 mx-auto mb-2" />
          <p className="text-gray-300 text-sm">Humidity</p>
          <p className="text-white font-semibold">{weatherData.main.humidity}%</p>
        </div>

        <div className="bg-white/10 rounded-2xl p-4 text-center border border-white/10">
          <Wind className="w-6 h-6 text-green-300 mx-auto mb-2" />
          <p className="text-gray-300 text-sm">Wind Speed</p>
          <p className="text-white font-semibold">{weatherData.wind.speed} m/s</p>
        </div>

        <div className="bg-white/10 rounded-2xl p-4 text-center border border-white/10">
          <Eye className="w-6 h-6 text-purple-300 mx-auto mb-2" />
          <p className="text-gray-300 text-sm">Visibility</p>
          <p className="text-white font-semibold">{(weatherData.visibility / 1000).toFixed(1)} km</p>
        </div>
      </div>
    </div>
  );
}