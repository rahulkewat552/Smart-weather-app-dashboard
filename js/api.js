// API Functions
const api = {
  // Search for locations
  async searchLocations(query) {
    try {
      const response = await fetch(
        `${API_CONFIG.geocoding}?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
      );
      
      if (!response.ok) {
        throw new Error('Failed to search locations');
      }
      
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      utils.showError('Failed to search locations');
      return [];
    }
  },

  // Get weather data
  async getWeatherData(latitude, longitude, retryCount = 0) {
    console.log('API: Fetching weather data for:', latitude, longitude, 'Retry:', retryCount);
    try {
      const params = new URLSearchParams({
        latitude: latitude,
        longitude: longitude,
        hourly: [
          'temperature_2m',
          'relative_humidity_2m',
          'apparent_temperature',
          'precipitation_probability',
          'precipitation',
          'weather_code',
          'surface_pressure',
          'wind_speed_10m',
          'wind_direction_10m'
        ].join(','),
        daily: [
          'weather_code',
          'temperature_2m_max',
          'temperature_2m_min',
          'sunrise',
          'sunset',
          'uv_index_max',
          'precipitation_sum',
          'wind_speed_10m_max'
        ].join(','),
        current: [
          'temperature_2m',
          'relative_humidity_2m',
          'apparent_temperature',
          'precipitation',
          'weather_code',
          'surface_pressure',
          'wind_speed_10m',
          'wind_direction_10m',
          'visibility'
        ].join(','),
        timezone: 'auto',
        forecast_days: 7
      });

      const url = `${API_CONFIG.weather}?${params}`;
      console.log('API: Making request to:', url);

      // Add timeout to the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error('API: Response not ok:', response.status, response.statusText);
        throw new Error(`Failed to fetch weather data: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API: Successfully received data');
      return data;
    } catch (error) {
      console.error('API: Error fetching weather data:', error);

      // Retry up to 2 times with exponential backoff
      if (retryCount < 2) {
        const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s delays
        console.log(`API: Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.getWeatherData(latitude, longitude, retryCount + 1);
      }

      utils.showError('Failed to fetch weather data');
      return null;
    }
  }
};