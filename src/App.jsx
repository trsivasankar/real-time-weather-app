import { useEffect, useState } from "react";
import "./App.css";

import search from "./assets/search.png";
import WeatherDetails from "./WeatherDetails";

function App() {
  const [city, setCity] = useState("Chennai");
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const apiKey = import.meta.env.VITE_API_KEY;

  const handleSearch = async () => {
    setLoading(true);
    if (!city) return;

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
      );
      const data = await res.json();

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
      );
      const forecastData = await forecastRes.json();

      const daily = forecastData.list.filter((f) =>
        f.dt_txt.includes("12:00:00")
      );
      setForecast(daily);

      if (data.cod === 200) {
        updateWeather(data);
      } else {
        alert("City not found!");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSearch = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
            );
            const data = await res.json();
            if (data.cod === 200) {
              updateWeather(data);
            } else {
              alert("Unable to fetch weather for your location.");
            }
          } catch (err) {
            console.error(err);
            alert("Something went wrong with location-based fetch");
          }
        },
        () => {
          alert("Permission denied or error getting location.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const updateWeather = (data) => {
    setWeatherData({
      temp: data.main.temp,
      city: data.name,
      country: data.sys.country,
      lat: data.coord.lat,
      lon: data.coord.lon,
      wind: data.wind.speed,
      hum: data.main.humidity,
      main: data.weather[0].main,
    });
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <>
      {loading && <div className='spinner'>Loading...</div>}
      <div className={`container ${darkMode ? 'dark' : ''}`}>
        <div className="input-container">
          <input
            type="text"
            className="cityInput"
            value={city}
            placeholder="Search City"
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <div className="search-icon" onClick={handleSearch}>
            <img src={search} alt="search" className="img-fluid icon-css" />
          </div>
        </div>
        <div className="button-container">
        <button className="location-btn" onClick={handleLocationSearch}>
          📍 Use My Location
        </button>
        <button className="toggle-btn" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>
        </div>
        
        
        {weatherData && (
          <WeatherDetails data={weatherData} forecast={forecast} />
        )}
    
      </div>
      
    </>
  );
}

export default App;
