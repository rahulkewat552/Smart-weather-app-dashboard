// Geolocation
const geolocation = {
  async getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        position => resolve(position),
        error => reject(error),
        { timeout: 10000, enableHighAccuracy: true }
      );
    });
  },

  async loadCurrentLocationWeather() {
    console.log('Attempting to get current location...');
    try {
      const position = await this.getCurrentPosition();
      const { latitude, longitude } = position.coords;
      console.log('Got current position:', latitude, longitude);

      // Get location name from reverse geocoding (simplified)
      appState.currentLocation = {
        name: 'Current Location',
        latitude,
        longitude
      };

      await weather.loadWeatherData(latitude, longitude);
    } catch (error) {
      console.log('Could not get current location:', error.message);

      // Provide more specific error handling
      if (error.code === 1) {
        console.log('Geolocation permission denied, using default location');
      } else if (error.code === 2) {
        console.log('Geolocation position unavailable, using default location');
      } else if (error.code === 3) {
        console.log('Geolocation timeout, using default location');
      }

      // Fallback to default location (Berlin)
      console.log('Falling back to default location...');
      await this.loadDefaultLocation();
    }
  },

  async loadDefaultLocation() {
    console.log('Loading default location (Berlin)...');
    appState.currentLocation = {
      name: 'Delhi',
      country: 'India',
      latitude: 28.6139,
      longitude: 77.2090
    };

    try {
      await weather.loadWeatherData(28.6139, 77.2090);
    } catch (error) {
      console.error('Failed to load default location weather:', error);
      // Show sample data for demonstration purposes
      console.log('Showing sample data for demonstration...');
      weather.showSampleData();
    }
  }
};