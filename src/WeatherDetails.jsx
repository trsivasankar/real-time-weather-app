import React, { useState } from "react";

import clear from "./assets/clear.webp";
import cloud from "./assets/cloud.png";
import drizzle from "./assets/drizzle.png";

import rain from "./assets/rain.png";
import windIcon from "./assets/wind.png";
import snow from "./assets/snow.png";
import humidity from "./assets/humidity.png";

const WeatherDetails = ({ data, forecast }) => {
  const { city, temp, country, lat, lon, hum, wind, main } = data;

  const tempInCelsius = temp - 273.15;

  const getWeather = (main) => {
    switch (main.toLowerCase()) {
      case "clear":
        return clear;
      case "clouds":
        return cloud;
      case "drizzle":
        return drizzle;
      case "rain":
        return rain;
      case "snow":
        return snow;
      default:
        return cloud;
    }
  };

  const icon = getWeather(main);

  return (
    <>
      <div className="image">
        <img src={icon} alt="Image" className="img-fluid" />
      </div>
      <div className="temp"> {tempInCelsius.toFixed(1)}°C</div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>
      <div className="cord">
        <div>
          <span className="lat">Latitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className="log">Lognitude</span>
          <span>{lon}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={humidity} alt="humidity" className="img-fluid icon" />
          <div className="data">
            <div className="humidity-percentage">{hum} %</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={windIcon} alt="wind" className="img-fluid icon" />
          <div className="data">
            <div className="humidity-percentage">{wind.toFixed(1)}Km/h</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>
      <h5 className="text-danger text-header">Next 5 days forecast</h5>
      <div className="forecast-container">
        
        {forecast.map((day, index) => (
          <div key={index} className="forecast-day">
            <div>
              {new Date(day.dt_txt).toLocaleDateString("en-US", {
                weekday: "short",
              })}
            </div>
            <img
              src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
              alt={day.weather[0].main}
              className="forecast-icon"
            />
            <div>{day.main.temp.toFixed(1)}°C</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default WeatherDetails;
