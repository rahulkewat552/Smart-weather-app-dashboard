// API Configuration
const API_CONFIG = {
  geocoding: 'https://geocoding-api.open-meteo.com/v1/search',
  weather: 'https://api.open-meteo.com/v1/forecast'
};

// Weather code mappings for icons
const WEATHER_CODES = {
  0: { description: 'Clear sky', icon: 'sunny' },
  1: { description: 'Mainly clear', icon: 'sunny' },
  2: { description: 'Partly cloudy', icon: 'partly-cloudy' },
  3: { description: 'Overcast', icon: 'overcast' },
  45: { description: 'Fog', icon: 'fog' },
  48: { description: 'Depositing rime fog', icon: 'fog' },
  51: { description: 'Light drizzle', icon: 'drizzle' },
  53: { description: 'Moderate drizzle', icon: 'drizzle' },
  55: { description: 'Dense drizzle', icon: 'drizzle' },
  56: { description: 'Light freezing drizzle', icon: 'drizzle' },
  57: { description: 'Dense freezing drizzle', icon: 'drizzle' },
  61: { description: 'Slight rain', icon: 'rain' },
  63: { description: 'Moderate rain', icon: 'rain' },
  65: { description: 'Heavy rain', icon: 'rain' },
  66: { description: 'Light freezing rain', icon: 'rain' },
  67: { description: 'Heavy freezing rain', icon: 'rain' },
  71: { description: 'Slight snow fall', icon: 'snow' },
  73: { description: 'Moderate snow fall', icon: 'snow' },
  75: { description: 'Heavy snow fall', icon: 'snow' },
  77: { description: 'Snow grains', icon: 'snow' },
  80: { description: 'Slight rain showers', icon: 'rain' },
  81: { description: 'Moderate rain showers', icon: 'rain' },
  82: { description: 'Violent rain showers', icon: 'rain' },
  85: { description: 'Slight snow showers', icon: 'snow' },
  86: { description: 'Heavy snow showers', icon: 'snow' },
  95: { description: 'Thunderstorm', icon: 'storm' },
  96: { description: 'Thunderstorm with slight hail', icon: 'storm' },
  99: { description: 'Thunderstorm with heavy hail', icon: 'storm' }
};

// Application State
const appState = {
  currentLocation: null,
  weatherData: null,
  units: {
    temperature: 'celsius',
    windSpeed: 'kmh',
    precipitation: 'mm'
  },
  theme: 'dark',
  favorites: JSON.parse(localStorage.getItem('weatherAppFavorites') || '[]'),
  selectedDay: 0 // For hourly forecast day selection
};

// DOM Elements (will be populated when DOM is loaded)
const elements = {};