// Initialize DOM elements
const initializeElements = () => {
  console.log('Initializing DOM elements...');

  // Weather display elements
  elements.currentLocation = document.getElementById('currentLocation');
  elements.currentDate = document.getElementById('currentDate');
  elements.currentTemp = document.getElementById('currentTemp');
  elements.currentWeatherIcon = document.getElementById('currentWeatherIcon');
  elements.currentDescription = document.getElementById('currentDescription');

  // Metrics elements
  elements.feelsLike = document.getElementById('feelsLike');
  elements.humidity = document.getElementById('humidity');
  elements.windSpeed = document.getElementById('windSpeed');
  elements.precipitation = document.getElementById('precipitation');
  elements.uvIndex = document.getElementById('uvIndex');
  elements.visibility = document.getElementById('visibility');
  elements.pressure = document.getElementById('pressure');
  elements.sunrise = document.getElementById('sunrise');
  elements.sunset = document.getElementById('sunset');

  // Forecast elements
  elements.forecastDays = document.getElementById('forecastDays');
  elements.forecastHours = document.getElementById('forecastHours');
  elements.daySelector = document.getElementById('daySelector');

  // State elements
  elements.loadingState = document.getElementById('loadingState');
  elements.weatherData = document.getElementById('weatherData');
  elements.errorState = document.getElementById('errorState');
  elements.retryButton = document.getElementById('retryButton');

  // Units elements
  elements.unitsButton = document.getElementById('unitsButton');
  elements.unitsMenu = document.getElementById('unitsMenu');

  // Favorites elements
  elements.favoriteButton = document.getElementById('favoriteButton');
  elements.favoritesButton = document.getElementById('favoritesButton');
  elements.favoritesMenu = document.getElementById('favoritesMenu');
  elements.favoritesList = document.getElementById('favoritesList');

  // Debug: Check if critical elements are found
  console.log('Critical elements found:');
  console.log('- loadingState:', !!elements.loadingState);
  console.log('- weatherData:', !!elements.weatherData);
  console.log('- errorState:', !!elements.errorState);
  console.log('- retryButton:', !!elements.retryButton);
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing weather app...');

  // Initialize DOM elements
  initializeElements();
  console.log('DOM elements initialized');

  // Initialize components
  theme.init();
  console.log('Theme initialized');

  search.init();
  console.log('Search initialized');

  units.init();
  console.log('Units initialized');

  favorites.init();
  console.log('Favorites initialized');

  animations.init();
  console.log('Animations initialized');

  // Initialize units dropdown
  if (elements.unitsButton && elements.unitsMenu) {
    elements.unitsButton.addEventListener('click', () => {
      const isOpen = elements.unitsMenu.classList.contains('active');
      if (isOpen) {
        elements.unitsMenu.classList.remove('active');
        elements.unitsButton.setAttribute('aria-expanded', 'false');
      } else {
        elements.unitsMenu.classList.add('active');
        elements.unitsButton.setAttribute('aria-expanded', 'true');
      }
    });

    // Close units menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!elements.unitsButton.contains(e.target) && !elements.unitsMenu.contains(e.target)) {
        elements.unitsMenu.classList.remove('active');
        elements.unitsButton.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Initialize day selector
  if (elements.daySelector) {
    elements.daySelector.addEventListener('change', (e) => {
      const selectedDay = parseInt(e.target.value);
      appState.selectedDay = selectedDay;
      if (appState.weatherData) {
        weather.updateHourlyForecast(appState.weatherData, selectedDay);
      }
    });
  }

  // Initialize retry button
  if (elements.retryButton) {
    elements.retryButton.addEventListener('click', () => {
      if (appState.currentLocation) {
        weather.loadWeatherData(appState.currentLocation.latitude, appState.currentLocation.longitude);
      } else {
        geolocation.loadCurrentLocationWeather();
      }
    });
  }

  // Try to load current location weather//
  geolocation.loadCurrentLocationWeather().catch(error => {
    console.error('Failed to initialize geolocation:', error);
  });

  console.log('Weather App initialized successfully');
});