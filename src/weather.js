import React, { useState, useEffect } from 'react';

const api = {
  key: process.env.REACT_APP_WEATHER_API_KEY,
  base: process.env.REACT_APP_WEATHER_API_BASE
};

function Weather() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});
  const [forecast, setForecast] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [defaultCity, setDefaultCity] = useState('London');
  const [units, setUnits] = useState('metric'); // 'metric' or 'imperial'

  // Fetch weather data on component mount
  useEffect(() => {
    search(defaultCity);
  }, []);

  // Fetch weather data
  const search = async (city) => {
    if (city.trim() === '') return;
    
    setLoading(true);
    setError('');
    
    try {
      // Fetch current weather
      const weatherResponse = await fetch(`${api.base}weather?q=${city}&units=${units}&appid=${api.key}`);
      const weatherResult = await weatherResponse.json();

      if (weatherResponse.ok) {
        setWeather(weatherResult);
        setQuery('');
        
        // Fetch 5-day forecast
        const forecastResponse = await fetch(`${api.base}forecast?q=${city}&units=${units}&appid=${api.key}`);
        const forecastResult = await forecastResponse.json();
        
        if (forecastResponse.ok) {
          setForecast(forecastResult);
        }
      } else {
        setWeather({});
        setForecast({});
        setError(weatherResult.message);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data. Please try again.');
      setWeather({});
      setForecast({});
    } finally {
      setLoading(false);
    }
  };

  // Handle search on Enter key
  const handleKeyPress = (evt) => {
    if (evt.key === 'Enter') {
      search(query);
    }
  };

  // Toggle units between metric and imperial
  const toggleUnits = () => {
    const newUnits = units === 'metric' ? 'imperial' : 'metric';
    setUnits(newUnits);
    if (weather.name) {
      search(weather.name);
    }
  };

  // Date builder function
  const dateBuilder = (d) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const day = days[d.getDay()];
    const date = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();

    return `${day}, ${date} ${month} ${year}`;
  };

  // Get weather icon URL
  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  // Get background class based on weather condition
  const getBackgroundClass = () => {
    if (!weather.weather) return 'bg-gradient-to-br from-indigo-900 to-purple-900';
    
    const condition = weather.weather[0].main.toLowerCase();
    
    if (condition.includes('clear')) return 'bg-gradient-to-br from-amber-500 to-orange-600';
    if (condition.includes('cloud')) return 'bg-gradient-to-br from-slate-600 to-slate-800';
    if (condition.includes('rain') || condition.includes('drizzle')) return 'bg-gradient-to-br from-blue-600 to-indigo-800';
    if (condition.includes('snow')) return 'bg-gradient-to-br from-blue-300 to-blue-500';
    if (condition.includes('thunderstorm')) return 'bg-gradient-to-br from-purple-800 to-gray-900';
    if (condition.includes('mist') || condition.includes('fog')) return 'bg-gradient-to-br from-gray-500 to-gray-700';
    
    return 'bg-gradient-to-br from-indigo-900 to-purple-900';
  };

  // Get temperature unit symbol
  const getTempUnit = () => {
    return units === 'metric' ? '°C' : '°F';
  };

  // Get wind speed unit
  const getWindUnit = () => {
    return units === 'metric' ? 'm/s' : 'mph';
  };

  return (
    <div className="text-center">
      {/* Search and Units Toggle */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="relative w-full md:w-auto">
          <input
            type="text"
            className="w-full md:w-80 p-4 pl-12 bg-black bg-opacity-30 backdrop-blur-md rounded-full text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            placeholder="Search for a city..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <svg 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white" 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        
        <button 
          onClick={toggleUnits}
          className="px-4 py-2 bg-black bg-opacity-30 backdrop-blur-md rounded-full text-white hover:bg-opacity-50 transition"
        >
          {units === 'metric' ? '°C' : '°F'}
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-500 bg-opacity-20 backdrop-blur-md text-white p-4 rounded-lg mb-6">
          <p>{error}</p>
        </div>
      )}

      {/* Weather Information */}
      {weather.main && !loading && (
        <div className="space-y-6">
          {/* Current Weather Card */}
          <div className={`${getBackgroundClass()} rounded-2xl p-6 shadow-xl backdrop-blur-md transition-all duration-500`}>
            <div className="flex flex-col md:flex-row justify-between items-center">
              {/* Location and Date */}
              <div className="text-left mb-4 md:mb-0">
                <h2 className="text-4xl font-bold text-white">{`${weather.name}, ${weather.sys.country}`}</h2>
                <p className="text-lg mt-2 text-white opacity-80">{dateBuilder(new Date())}</p>
              </div>
              
              {/* Temperature and Weather Icon */}
              <div className="flex items-center">
                <img 
                  src={getWeatherIcon(weather.weather[0].icon)} 
                  alt={weather.weather[0].description} 
                  className="w-24 h-24"
                />
                <div className="text-7xl font-bold text-white">
                  {Math.round(weather.main.temp)}<span className="text-4xl">{getTempUnit()}</span>
                </div>
              </div>
            </div>
            
            {/* Weather Description */}
            <div className="text-2xl text-white capitalize mt-4">
              {weather.weather[0].description}
            </div>
            
            {/* Weather Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-black bg-opacity-20 rounded-lg p-4 text-white">
                <div className="text-sm opacity-80">Feels Like</div>
                <div className="text-xl font-semibold">
                  {Math.round(weather.main.feels_like)}{getTempUnit()}
                </div>
              </div>
              <div className="bg-black bg-opacity-20 rounded-lg p-4 text-white">
                <div className="text-sm opacity-80">Humidity</div>
                <div className="text-xl font-semibold">{weather.main.humidity}%</div>
              </div>
              <div className="bg-black bg-opacity-20 rounded-lg p-4 text-white">
                <div className="text-sm opacity-80">Wind</div>
                <div className="text-xl font-semibold">{weather.wind.speed} {getWindUnit()}</div>
              </div>
              <div className="bg-black bg-opacity-20 rounded-lg p-4 text-white">
                <div className="text-sm opacity-80">Pressure</div>
                <div className="text-xl font-semibold">{weather.main.pressure} hPa</div>
              </div>
            </div>
          </div>

          {/* High/Low Temperature Card */}
          <div className="bg-black bg-opacity-30 backdrop-blur-md rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-4">Temperature Range</h3>
            <div className="flex justify-between items-center">
              <div className="text-center">
                <div className="text-sm text-white opacity-80">High</div>
                <div className="text-3xl font-bold text-red-400">
                  {Math.round(weather.main.temp_max)}{getTempUnit()}
                </div>
              </div>
              <div className="w-24 h-1 bg-gradient-to-r from-red-400 to-blue-400 rounded-full"></div>
              <div className="text-center">
                <div className="text-sm text-white opacity-80">Low</div>
                <div className="text-3xl font-bold text-blue-400">
                  {Math.round(weather.main.temp_min)}{getTempUnit()}
                </div>
              </div>
            </div>
          </div>

          {/* Forecast Section */}
          {forecast.list && forecast.list.length > 0 && (
            <div className="bg-black bg-opacity-30 backdrop-blur-md rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-4">5-Day Forecast</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {forecast.list.filter((item, index) => index % 8 === 0).slice(0, 5).map((item, index) => (
                  <div key={index} className="bg-black bg-opacity-20 rounded-lg p-4 text-white">
                    <div className="text-sm font-medium">
                      {new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <img 
                      src={getWeatherIcon(item.weather[0].icon)} 
                      alt={item.weather[0].description} 
                      className="w-16 h-16 mx-auto my-2"
                    />
                    <div className="text-xl font-semibold">{Math.round(item.main.temp)}{getTempUnit()}</div>
                    <div className="text-xs capitalize">{item.weather[0].description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Weather;
