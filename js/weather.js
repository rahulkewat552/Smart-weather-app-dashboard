// Weather data management
const weather = {
  async loadWeatherData(latitude, longitude) {
    console.log('Loading weather data for:', latitude, longitude);
    try {
      this.showLoading();
      const data = await api.getWeatherData(latitude, longitude);
      console.log('Weather data received:', data);

      if (data) {
        appState.weatherData = data;
        this.displayWeatherData(data);
        this.showWeatherData();
        console.log('Weather data displayed successfully');
      } else {
        console.log('No weather data received');
        this.showError('Unable to load weather data. Please check your internet connection and try again.');
      }
    } catch (error) {
      console.error('Weather loading failed:', error);
      this.showError('Unable to connect to weather service. Please check your internet connection and try again.');
    }
  },

  displayWeatherData(data) {
    // Update current weather
    this.updateCurrentWeather(data);

    // Update metrics
    this.updateMetrics(data);

    // Update forecasts
    this.updateDailyForecast(data);
    this.updateHourlyForecast(data);

    // Update favorites UI
    favorites.updateUI();

    // Update weather animations
    if (data.current && data.current.weather_code !== undefined) {
      animations.setWeatherBackground(data.current.weather_code);
    }
  },

  updateCurrentWeather(data) {
    const current = data.current;
    const location = appState.currentLocation;

    if (elements.currentLocation) {
      elements.currentLocation.textContent = location ?
        `${location.name}, ${location.country}` : 'Current Location';
    }

    if (elements.currentDate) {
      elements.currentDate.textContent = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    }

    if (elements.currentTemp) {
      elements.currentTemp.textContent = utils.formatTemperature(current.temperature_2m);
    }

    if (elements.currentWeatherIcon) {
      elements.currentWeatherIcon.src = utils.getWeatherIcon(current.weather_code);
      elements.currentWeatherIcon.alt = utils.getWeatherDescription(current.weather_code);
    }

    if (elements.currentDescription) {
      elements.currentDescription.textContent = utils.getWeatherDescription(current.weather_code);
    }
  },

  updateMetrics(data) {
    const current = data.current;
    const daily = data.daily;

    if (elements.feelsLike) {
      elements.feelsLike.textContent = utils.formatTemperature(current.apparent_temperature);
    }

    if (elements.humidity) {
      elements.humidity.textContent = `${Math.round(current.relative_humidity_2m)}%`;
    }

    if (elements.windSpeed) {
      elements.windSpeed.textContent = utils.formatWindSpeed(current.wind_speed_10m);
    }

    if (elements.precipitation) {
      elements.precipitation.textContent = utils.formatPrecipitation(current.precipitation || 0);
    }

    // Additional metrics
    if (elements.uvIndex && daily && daily.uv_index_max) {
      elements.uvIndex.textContent = Math.round(daily.uv_index_max[0]);
    }

    if (elements.visibility && current.visibility) {
      const visibilityKm = (current.visibility / 1000).toFixed(1);
      elements.visibility.textContent = `${visibilityKm} km`;
    }

    if (elements.pressure) {
      elements.pressure.textContent = `${Math.round(current.surface_pressure)} hPa`;
    }

    // Sun times
    if (elements.sunrise && elements.sunset && daily) {
      const sunrise = new Date(daily.sunrise[0]);
      const sunset = new Date(daily.sunset[0]);

      elements.sunrise.textContent = sunrise.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });

      elements.sunset.textContent = sunset.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
  },

  updateDailyForecast(data) {
    const daily = data.daily;
    if (!elements.forecastDays || !daily) return;

    const forecastHTML = daily.time.slice(0, 7).map((date, index) => `
      <div class="forecast-day" data-day="${index}">
        <div class="day-name">${utils.formatDate(date).split(',')[0]}</div>
        <img src="${utils.getWeatherIcon(daily.weather_code[index])}"
             alt="${utils.getWeatherDescription(daily.weather_code[index])}"
             class="day-icon">
        <div class="day-temps">
          <span class="temp-high">${utils.formatTemperature(daily.temperature_2m_max[index])}</span>
          <span class="temp-low">${utils.formatTemperature(daily.temperature_2m_min[index])}</span>
        </div>
      </div>
    `).join('');

    elements.forecastDays.innerHTML = forecastHTML;

    // Add click listeners for day selection
    elements.forecastDays.querySelectorAll('.forecast-day').forEach(day => {
      day.addEventListener('click', () => {
        const dayIndex = parseInt(day.dataset.day);
        appState.selectedDay = dayIndex;
        this.updateHourlyForecast(data, dayIndex);
        this.updateDaySelector(dayIndex);
      });
    });
  },

  updateHourlyForecast(data, selectedDay = 0) {
    const hourly = data.hourly;
    if (!elements.forecastHours || !hourly) return;

    // Get hours for selected day (24 hours starting from selected day)
    const startIndex = selectedDay * 24;
    const endIndex = startIndex + 24;

    const hoursHTML = hourly.time.slice(startIndex, endIndex).map((time, index) => {
      const actualIndex = startIndex + index;
      return `
        <div class="forecast-hour">
          <div class="hour-time">${utils.formatTime(time)}</div>
          <img src="${utils.getWeatherIcon(hourly.weather_code[actualIndex])}"
               alt="${utils.getWeatherDescription(hourly.weather_code[actualIndex])}"
               class="hour-icon">
          <div class="hour-temp">${utils.formatTemperature(hourly.temperature_2m[actualIndex])}</div>
        </div>
      `;
    }).join('');

    elements.forecastHours.innerHTML = hoursHTML;
  },

  updateDaySelector(selectedDay) {
    if (elements.daySelector) {
      elements.daySelector.selectedIndex = selectedDay;
    }
  },

  showLoading() {
    if (elements.loadingState) elements.loadingState.classList.remove('hidden');
    if (elements.weatherData) elements.weatherData.classList.add('hidden');
    if (elements.errorState) elements.errorState.classList.add('hidden');
  },

  showWeatherData() {
    if (elements.loadingState) elements.loadingState.classList.add('hidden');
    if (elements.weatherData) elements.weatherData.classList.remove('hidden');
    if (elements.errorState) elements.errorState.classList.add('hidden');
  },

  showError(message) {
    console.log('Showing error:', message);
    console.log('Elements available:', {
      loadingState: !!elements.loadingState,
      weatherData: !!elements.weatherData,
      errorState: !!elements.errorState
    });

    if (elements.loadingState) elements.loadingState.classList.add('hidden');
    if (elements.weatherData) elements.weatherData.classList.add('hidden');
    if (elements.errorState) {
      elements.errorState.classList.remove('hidden');
      const errorMessage = elements.errorState.querySelector('#errorMessage');
      if (errorMessage) {
        errorMessage.textContent = message;
        console.log('Error message updated to:', message);
      } else {
        console.log('Error message element not found');
      }
    } else {
      console.log('Error state element not found');
    }
  },

  showSampleData() {
    console.log('Showing sample data for demonstration...');

    // Hide loading and error states
    if (elements.loadingState) elements.loadingState.classList.add('hidden');
    if (elements.errorState) elements.errorState.classList.add('hidden');

    // Show weather data
    if (elements.weatherData) elements.weatherData.classList.remove('hidden');

    // Update current weather with sample data
    if (elements.currentLocation) elements.currentLocation.textContent = 'Delhi, India';
    if (elements.currentDate) elements.currentDate.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
    if (elements.currentTemp) elements.currentTemp.textContent = '20°';
    if (elements.currentDescription) elements.currentDescription.textContent = 'Clear sky';

    // Update metrics with sample data
    if (elements.feelsLike) elements.feelsLike.textContent = '26°C';
  if (elements.humidity) elements.humidity.textContent = '45%';
  if (elements.windSpeed) elements.windSpeed.textContent = '12 km/h';
  if (elements.precipitation) elements.precipitation.textContent = '0%';
  if (elements.uvIndex) elements.uvIndex.textContent = '7';
  if (elements.visibility) elements.visibility.textContent = '10 km';
  if (elements.pressure) elements.pressure.textContent = '1012 hPa';
  if (elements.sunrise) elements.sunrise.textContent = '6:00 AM';
  if (elements.sunset) elements.sunset.textContent = '6:30 PM';

    // Show sample hourly forecast
    this.showSampleHourlyForecast();

    // Show sample daily forecast
    this.showSampleDailyForecast();
  },

  showSampleHourlyForecast() {
    if (!elements.forecastHours) return;

    const sampleHours = [
      { time: '3 PM', temp: '20°', icon: './assets/images/icon-sunny.webp', alt: 'Sunny' },
      { time: '4 PM', temp: '21°', icon: './assets/images/icon-sunny.webp', alt: 'Sunny' },
      { time: '5 PM', temp: '20°', icon: './assets/images/icon-overcast.webp', alt: 'Overcast' },
      { time: '6 PM', temp: '19°', icon: './assets/images/icon-overcast.webp', alt: 'Overcast' },
      { time: '7 PM', temp: '18°', icon: './assets/images/icon-overcast.webp', alt: 'Overcast' },
      { time: '8 PM', temp: '17°', icon: './assets/images/icon-overcast.webp', alt: 'Overcast' },
      { time: '9 PM', temp: '16°', icon: './assets/images/icon-overcast.webp', alt: 'Overcast' },
      { time: '10 PM', temp: '15°', icon: './assets/images/icon-overcast.webp', alt: 'Overcast' }
    ];

    const hoursHTML = sampleHours.map(hour => `
      <div class="forecast-hour">
        <div class="hour-time">${hour.time}</div>
        <img src="${hour.icon}" alt="${hour.alt}" class="hour-icon">
        <div class="hour-temp">${hour.temp}</div>
      </div>
    `).join('');

    elements.forecastHours.innerHTML = hoursHTML;
  },

  showSampleDailyForecast() {
    if (!elements.forecastDays) return;

    const sampleDays = [
      { day: 'Today', high: '20°', low: '12°', icon: './assets/images/icon-sunny.webp', alt: 'Sunny' },
      { day: 'Wed', high: '22°', low: '14°', icon: './assets/images/icon-overcast.webp', alt: 'Overcast' },
      { day: 'Thu', high: '18°', low: '10°', icon: './assets/images/icon-rainy.webp', alt: 'Rainy' },
      { day: 'Fri', high: '25°', low: '16°', icon: './assets/images/icon-sunny.webp', alt: 'Sunny' },
      { day: 'Sat', high: '23°', low: '15°', icon: './assets/images/icon-overcast.webp', alt: 'Overcast' },
      { day: 'Sun', high: '21°', low: '13°', icon: './assets/images/icon-overcast.webp', alt: 'Overcast' },
      { day: 'Mon', high: '19°', low: '11°', icon: './assets/images/icon-rainy.webp', alt: 'Rainy' }
    ];

    const daysHTML = sampleDays.map((day, index) => `
      <div class="forecast-day" data-day="${index}">
        <div class="day-name">${day.day}</div>
        <img src="${day.icon}" alt="${day.alt}" class="day-icon">
        <div class="day-temps">
          <span class="temp-high">${day.high}</span>
          <span class="temp-low">${day.low}</span>
        </div>
      </div>
    `).join('');

    elements.forecastDays.innerHTML = daysHTML;
  }
};