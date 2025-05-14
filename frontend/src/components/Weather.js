import React, { useEffect, useState } from 'react';
import { getWeather } from '../services/weatherService';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [favoriteWeatherData, setFavoriteWeatherData] = useState([]);

  // Load history and favorites from localStorage
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('weatherHistory')) || [];
    const savedFavorites = JSON.parse(localStorage.getItem('weatherFavorites')) || [];
    setHistory(savedHistory);
    setFavorites(savedFavorites);
  }, []);

  // Fetch weather for all favorite cities
  useEffect(() => {
    const fetchFavorites = async () => {
      const data = await Promise.all(
        favorites.map(async (cityName) => {
          try {
            return await getWeather(cityName);
          } catch {
            return null;
          }
        })
      );
      setFavoriteWeatherData(data.filter(Boolean));
    };

    fetchFavorites();
  }, [favorites]);

  const fetchWeather = async () => {
    setError('');
    setWeather(null);

    if (!city.trim()) {
      setError('Please enter a city name.');
      return;
    }

    try {
      const data = await getWeather(city);
      setWeather(data);

      // Update history
      const newHistory = [city, ...history.filter((c) => c !== city)].slice(0, 5);
      setHistory(newHistory);
      localStorage.setItem('weatherHistory', JSON.stringify(newHistory));
    } catch (err) {
      setError('Could not fetch weather data. Try another city.');
    }
  };

  const handleDeleteHistory = (c) => {
    const updated = history.filter((item) => item !== c);
    setHistory(updated);
    localStorage.setItem('weatherHistory', JSON.stringify(updated));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('weatherHistory');
  };

  const toggleFavorite = () => {
    if (!weather) return;

    let updatedFavorites;
    if (favorites.includes(weather.city)) {
      updatedFavorites = favorites.filter((c) => c !== weather.city);
    } else {
      updatedFavorites = [...favorites, weather.city];
    }

    setFavorites(updatedFavorites);
    localStorage.setItem('weatherFavorites', JSON.stringify(updatedFavorites));
  };

  return (
    <div style={styles.container}>
      <h2>🌦️ Live Weather Tracker</h2>
      <div style={styles.inputRow}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
          style={styles.input}
        />
        <button onClick={fetchWeather} style={styles.button}>Get Weather</button>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {weather && (
        <div style={styles.card}>
          <h3>{weather.city}</h3>
          <img src={weather.icon} alt="Weather icon" />
          <p><strong>Condition:</strong> {weather.condition}</p>
          <p><strong>Temperature:</strong> {weather.temperature} °C</p>
          <p><strong>Humidity:</strong> {weather.humidity}%</p>
          <p><strong>Wind Speed:</strong> {weather.windSpeed} m/s</p>
          <button onClick={toggleFavorite} style={styles.favoriteButton}>
            {favorites.includes(weather.city) ? '★ Remove from Favorites' : '☆ Save to Favorites'}
          </button>
        </div>
      )}

      {history.length > 0 && (
        <div style={styles.section}>
          <h4>🔍 Search History</h4>
          <ul style={styles.list}>
            {history.map((item, idx) => (
              <li key={idx} style={styles.listItem}>
                <span onClick={() => setCity(item)} style={styles.historyLink}>{item}</span>
                <button onClick={() => handleDeleteHistory(item)} style={styles.removeBtn}>❌</button>
              </li>
            ))}
          </ul>
          <button onClick={clearHistory} style={styles.clearBtn}>Clear History</button>
        </div>
      )}

      {favoriteWeatherData.length > 0 && (
        <div style={styles.gridSection}>
          <h4>🌟 Favorite Cities</h4>
          <div style={styles.grid}>
            {favoriteWeatherData.map((fav, index) => (
              <div key={index} style={styles.card}>
                <h3>{fav.city}</h3>
                <img src={fav.icon} alt="icon" />
                <p><strong>{fav.condition}</strong></p>
                <p>{fav.temperature}°C</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '800px',
    margin: 'auto',
    textAlign: 'center',
  },
  inputRow: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1rem',
    gap: '0.5rem',
  },
  input: {
    padding: '0.5rem',
    fontSize: '1rem',
    width: '200px',
  },
  button: {
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginTop: '1rem',
  },
  card: {
    margin: '1rem',
    padding: '1rem',
    border: '1px solid #ccc',
    borderRadius: '10px',
    backgroundColor: '#f0f8ff',
    width: '220px',
    display: 'inline-block',
  },
  favoriteButton: {
    marginTop: '0.5rem',
    padding: '0.4rem 0.8rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  section: {
    marginTop: '2rem',
  },
  list: {
    listStyle: 'none',
    padding: 0,
  },
  listItem: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '0.5rem',
  },
  historyLink: {
    cursor: 'pointer',
    textDecoration: 'underline',
    color: 'blue',
  },
  removeBtn: {
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
  },
  clearBtn: {
    marginTop: '0.5rem',
    background: '#dc3545',
    color: 'white',
    padding: '0.3rem 0.8rem',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  gridSection: {
    marginTop: '2rem',
    textAlign: 'center',
  },
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '1rem',
  },
};

export default Weather;






