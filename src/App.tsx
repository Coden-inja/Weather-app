import React from 'react';
import WeatherCard from './components/WeatherCard';
import ChatWindow from './components/ChatWindow';
import { useWeather } from './hooks/useWeather';
import { RefreshCw, MapPin } from 'lucide-react';

function App() {
  const { weatherData, loading, error, refetch } = useWeather();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            Weather AI
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Get real-time weather information and chat with our AI assistant about weather conditions and more
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 max-w-7xl mx-auto">
          {/* Weather Section */}
          <div className="xl:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <MapPin className="w-6 h-6 text-blue-400" />
                Current Weather
              </h2>
              {!loading && (
                <button
                  onClick={refetch}
                  className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full border border-white/20 transition-all duration-200"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              )}
            </div>
            
            <WeatherCard 
              weatherData={weatherData} 
              loading={loading} 
              error={error} 
            />

            {/* Weather Tips */}
            {weatherData && weatherData.main && weatherData.wind && (
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl">
                <h3 className="text-lg font-semibold text-white mb-3">Weather Tips</h3>
                <div className="space-y-2 text-gray-300">
                  {weatherData.main.temp > 25 && (
                    <p className="flex items-center gap-2">
                      <span className="text-orange-400">🌡️</span>
                      It's quite warm! Stay hydrated and consider light clothing.
                    </p>
                  )}
                  {weatherData.main.temp < 10 && (
                    <p className="flex items-center gap-2">
                      <span className="text-blue-400">🧥</span>
                      It's cold outside! Don\'t forget to dress warmly.
                    </p>
                  )}
                  {weatherData.main.humidity > 80 && (
                    <p className="flex items-center gap-2">
                      <span className="text-blue-300">💧</span>
                      High humidity today. You might feel a bit sticky.
                    </p>
                  )}
                  {weatherData.wind.speed > 5 && (
                    <p className="flex items-center gap-2">
                      <span className="text-green-400">💨</span>
                      It's windy outside! Secure any loose items.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Chat Section */}
          <div className="xl:col-span-3">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-2xl">🤖</span>
                AI Assistant
              </h2>
              <p className="text-gray-300 mt-1">Ask questions about weather or anything else!</p>
            </div>
            
            <ChatWindow weatherData={weatherData} />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-400">
          <p className="text-sm">
            Weather data provided by OpenWeatherMap • AI powered by Google Gemini
          </p>
        </div>
        <div className="text-center mt-12 text-gray-400">
          <p className="text-sm">
            Made with ❤️ by <a href="https://yogesh-portfolio-nu-swart.vercel.app/" target='blank' className="text-blue-400 hover:underline">Yogesh Kumar</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;