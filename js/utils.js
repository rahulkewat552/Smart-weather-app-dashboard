// Utility Functions
const utils = {
  // Format temperature based on current units
  formatTemperature(temp) {
    if (appState.units.temperature === 'fahrenheit') {
      return `${Math.round(temp * 9/5 + 32)}°F`;
    }
    return `${Math.round(temp)}°C`;
  },

  // Format wind speed based on current units
  formatWindSpeed(speed) {
    if (appState.units.windSpeed === 'mph') {
      return `${Math.round(speed * 0.621371)} mph`;
    }
    return `${Math.round(speed)} km/h`;
  },

  // Format precipitation based on current units
  formatPrecipitation(amount) {
    if (appState.units.precipitation === 'inches') {
      return `${(amount * 0.0393701).toFixed(1)} in`;
    }
    return `${amount.toFixed(1)} mm`;
  },

  // Get weather icon path
  getWeatherIcon(weatherCode) {
    const weather = WEATHER_CODES[weatherCode] || WEATHER_CODES[0];
    return `./assets/images/icon-${weather.icon}.webp`;
  },

  // Get weather description
  getWeatherDescription(weatherCode) {
    const weather = WEATHER_CODES[weatherCode] || WEATHER_CODES[0];
    return weather.description;
  },

  // Format date
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  },

  // Format time
  formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      hour12: true 
    });
  },

  // Debounce function for search
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Show loading state
  showLoading(element) {
    element.classList.add('loading');
  },

  // Hide loading state
  hideLoading(element) {
    element.classList.remove('loading');
  },

  // Show error message
  showError(message) {
    // TODO: Implement error display
    console.error(message);
  }
};