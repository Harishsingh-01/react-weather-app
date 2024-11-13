import React, { useState } from 'react';

const api = {
  key: "fcc8de7015bbb202209bbf0261babf4c",
  base: "https://api.openweathermap.org/data/2.5/"
};

function Weather() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});
  const [error, setError] = useState('');

  // Fetch weather data
  const search = async (evt) => {
    if (evt.key === 'Enter' && query.trim() !== '') {
      try {
        const response = await fetch(`${api.base}weather?q=${query}&units=metric&appid=${api.key}`);
        const result = await response.json();

        if (response.ok) {
          setWeather(result);
          setQuery('');
          setError('');
        } else {
          // Handle errors like city not found
          setWeather({});
          setError(result.message);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data. Please try again.');
      }
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

  return (

    <div className="text-center ">
      {/* Search Box */}
      <input
        type="text"
        className="w-full max-w-md p-3 mb-6  bg-opacity-50 rounded-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        placeholder="Search for a city..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={search}
      />

      {/* Error message */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Weather Information */}
      {weather.main && (
        <div>
          {/* Location */}
          <div className="mb-4">
            <h2 className="text-4xl font-bold text-[#003161]">{`${weather.name}, ${weather.sys.country}`}</h2>
            <p className="text-lg mt-2 text-[#003161]">{dateBuilder(new Date())}</p>
          </div>

          {/* Temperature */}
          <div className="text-6xl font-bold my-4 text-[#FEEC37]">
            {Math.round(weather.main.temp)}<span>°C</span>
          </div>

          {/* Weather Description */}
          <div className="text-2xl italic mb-4 text-[#003161]">{weather.weather[0].main}</div>

          {/* High/Low Temperature */}
          <div className="text-xl text-[#003161]">
            {Math.round(weather.main.temp_min)}°C / {Math.round(weather.main.temp_max)}°C
          </div>
        </div>
      )}
    </div>
  );
}

export default Weather;
