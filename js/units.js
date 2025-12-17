// Units management
const units = {
  init() {
    // Load saved units from localStorage
    const savedUnits = localStorage.getItem('weatherAppUnits');
    if (savedUnits) {
      appState.units = { ...appState.units, ...JSON.parse(savedUnits) };
    }

    this.updateUI();
    this.bindEvents();
  },

  bindEvents() {
    // Listen for unit changes
    const unitInputs = document.querySelectorAll('input[name="system"], input[name="temperature"], input[name="windSpeed"], input[name="precipitation"]');

    unitInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        this.handleUnitChange(e.target.name, e.target.value);
      });
    });
  },

   // ========== EXTENDED UNIT CONVERSION TO WIND AND PRECIPITATION ==========
  handleUnitChange(unitType, value) {
    // Handle system-wide changes
    if (unitType === 'system') {
      if (value === 'imperial') {
        appState.units.temperature = 'fahrenheit';
        appState.units.windSpeed = 'mph';
        appState.units.precipitation = 'inches';
      } else {
        appState.units.temperature = 'celsius';
        appState.units.windSpeed = 'kmh';
        appState.units.precipitation = 'mm';
      }
    } else {
      // Handle individual unit changes
      appState.units[unitType] = value;
    }

    this.updateUI();
    this.saveUnits();

    // Refresh weather display if data is available
    if (appState.weatherData) {
      weather.displayWeatherData(appState.weatherData);
    }
  },

  updateUI() {
    // Update radio button states
    const systemRadios = document.querySelectorAll('input[name="system"]');
    const tempRadios = document.querySelectorAll('input[name="temperature"]');
    const windRadios = document.querySelectorAll('input[name="windSpeed"]');
    const precipRadios = document.querySelectorAll('input[name="precipitation"]');

    // Determine system setting
    const isImperial = appState.units.temperature === 'fahrenheit' &&
                      appState.units.windSpeed === 'mph' &&
                      appState.units.precipitation === 'inches';

    systemRadios.forEach(radio => {
      if (radio.value === 'imperial' && isImperial) {
        radio.checked = true;
      } else if (radio.value === 'metric' && !isImperial) {
        radio.checked = true;
      }
    });

    // Update individual unit radios
    tempRadios.forEach(radio => {
      radio.checked = radio.value === appState.units.temperature;
    });

    windRadios.forEach(radio => {
      radio.checked = radio.value === appState.units.windSpeed;
    });

    precipRadios.forEach(radio => {
      radio.checked = radio.value === appState.units.precipitation;
    });
  },

  saveUnits() {
    localStorage.setItem('weatherAppUnits', JSON.stringify(appState.units));
  }
};

