// src/pages/HomePage.js
import React from 'react';
import Weather from '../components/Weather'; // Now it exists

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to the WeatherTrack Pro</h1>
      <Weather />
    </div>
  );
};

export default HomePage;
