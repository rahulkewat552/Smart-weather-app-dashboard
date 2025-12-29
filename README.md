# 🌤️ Smart Weather App Dashboard

A comprehensive, real-time weather application providing accurate weather data, 7-day forecasts, and hourly predictions with a beautiful responsive interface.

## 📌 Live Demo

**[View Live Demo](https://rahulkewat552.github.io/Smart-weather-app-dashboard/)**

## ✨ Features

### Weather Data
- 🌡️ **Current Conditions** - Temperature, feels like, humidity, wind speed, precipitation
- 📅 **7-Day Forecast** - Daily highs/lows with weather icons
- ⏰ **24-Hour Forecast** - Hourly breakdown with detailed metrics
- 🌍 **Location Detection** - Automatic geolocation or manual search
- ⭐ **Favorites System** - Save and manage multiple locations

### User Experience
- 🌓 **Dark/Light Theme** - Manual toggle with system preference detection
- 📏 **Unit Conversion** - Metric/Imperial (Celsius/Fahrenheit, km/h/mph, mm/inches)
- 🔍 **Search Autocomplete** - Debounced search for efficient API calls
- 📱 **Fully Responsive** - Optimized for mobile, tablet, and desktop
- ♿ **Accessibility** - ARIA labels, keyboard navigation, screen reader support

### Visual Effects
- 🎨 **Dynamic Backgrounds** - Weather-based animations (rain, snow, clouds)
- ✨ **Smooth Animations** - Card hover effects and transitions
- 🎭 **Weather Icons** - Visual representation of current conditions

## 🛠️ Technologies Used

| Technology | Purpose |
|------------|---------|
| HTML5 | Semantic markup, accessibility |
| CSS3 | Custom properties, Grid, Flexbox, animations |
| JavaScript (ES6+) | Modern JS features, async/await |
| Open-Meteo API | Weather data and geocoding |
| LocalStorage API | User preferences and favorites |
| Fetch API | Async data fetching with retry logic |

## 📦 Installation

### Clone the repository
```bash
git clone https://github.com/rahulkewat552/Smart-weather-app-dashboard.git
cd Smart-weather-app-dashboard
```

### 📄 Project Structure
```
Smart-weather-app-dashboard/
├── index.html              # Main HTML file
├── styles.css              # Global styles
├── .gitignore              # Git ignore rules
├── README.md               # Documentation
│
├── assets/
│   ├── fonts/              # Google Fonts (DM Sans, Bricolage Grotesque)
│   └── images/             # Icons and background images
│
└── js/
    ├── config.js           # API endpoints & app state
    ├── utils.js            # Utility functions
    ├── api.js              # API calls with retry logic
    ├── weather.js          # Weather display logic
    ├── search.js           # Location search with debouncing
    ├── favorites.js        # Favorites management
    ├── geolocation.js      # Location services
    ├── theme.js            # Dark/light theme
    ├── units.js            # Unit conversion
    ├── animations.js       # Visual effects
    └── main.js             # App initialization
```

###  🎯 Usage Guide
Getting Started

Allow location access -  Get weather at your current location

Search for cities -  Type any city name in the search bar

Save favorites -  Click the star button to save locations

Toggle theme -  Use the sun/moon icon for dark/light mode

Change units -  Open the Units menu to switch Metric/Imperial

### 📡 API Reference
This app uses the Open-Meteo API (free, no API key required):

Geocoding API
https://geocoding-api.open-meteo.com/v1/search

Weather API
https://api.open-meteo.com/v1/forecast

Parameters include: temperature, humidity, wind speed, precipitation, UV index, visibility, sunrise/sunset times.

## 🐛 Known Issues & Solutions
| Issue | Solution |
|-------|----------|
| Geolocation not working | Ensure HTTPS and allow permission |
| API rate limiting | Free tier allows 10,000+ requests/day |
| Images not loading | Clear browser cache |

## 🔧 Future Enhancements
Progressive Web App (PWA) support

Offline mode with cached data

Weather alerts and notifications

Air quality index (AQI)

Interactive weather maps

Share weather feature

## 🙏 Acknowledgments
Weather data provided by Open-Meteo

Icons from Weather Icons

Fonts from Google Fonts

## 📧 Contact
Rahul Kewat

GitHub: @rahulkewat552

Project Link: https://github.com/rahulkewat552/Smart-weather-app-dashboard

Live Demo: https://rahulkewat552.github.io/Smart-weather-app-dashboard/

