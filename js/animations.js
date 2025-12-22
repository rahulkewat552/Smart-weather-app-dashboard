// Animations and Visual Effects
const animations = {
  init() {
    this.app = document.getElementById('app');
    this.particlesContainer = document.getElementById('weatherParticles');
  },

  setWeatherBackground(weatherCode) {
    if (!this.app) return;

    // Remove existing weather classes
    this.app.classList.remove('weather-clear', 'weather-cloudy', 'weather-rainy', 'weather-snowy', 'weather-stormy');

    // Add appropriate weather class based on weather code
    if (weatherCode === 0 || weatherCode === 1) {
      this.app.classList.add('weather-clear');
      this.createParticles('clear');
    } else if (weatherCode === 2 || weatherCode === 3) {
      this.app.classList.add('weather-cloudy');
      this.createParticles('cloudy');
    } else if (weatherCode >= 51 && weatherCode <= 67) {
      this.app.classList.add('weather-rainy');
      this.createParticles('rain');
    } else if (weatherCode >= 71 && weatherCode <= 86) {
      this.app.classList.add('weather-snowy');
      this.createParticles('snow');
    } else if (weatherCode >= 95) {
      this.app.classList.add('weather-stormy');
      this.createParticles('storm');
    } else {
      this.app.classList.add('weather-cloudy');
      this.createParticles('cloudy');
    }
  },

  createParticles(weatherType) {
    if (!this.particlesContainer) return;

    // Clear existing particles
    this.particlesContainer.innerHTML = '';

    let particleCount = 0;
    let particleClass = '';

    switch (weatherType) {
      case 'rain':
        particleCount = 50;
        particleClass = 'rain';
        break;
      case 'snow':
        particleCount = 30;
        particleClass = 'snow';
        break;
      case 'clear':
        particleCount = 10;
        particleClass = 'clear';
        break;
      case 'storm':
        particleCount = 60;
        particleClass = 'rain';
        break;
      default:
        particleCount = 5;
        particleClass = 'clear';
    }

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = `particle ${particleClass}`;

      // Random positioning
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 3 + 's';
      particle.style.animationDuration = (Math.random() * 2 + 1) + 's';

      if (particleClass === 'clear') {
        particle.style.width = Math.random() * 4 + 2 + 'px';
        particle.style.height = particle.style.width;
      }

      this.particlesContainer.appendChild(particle);
    }
  },

  animateValue(element, start, end, duration = 1000) {
    const startTime = performance.now();
    const startValue = parseFloat(start) || 0;
    const endValue = parseFloat(end) || 0;
    const difference = endValue - startValue;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (difference * easeOut);

      if (element.textContent.includes('°')) {
        element.textContent = Math.round(currentValue) + '°';
      } else if (element.textContent.includes('%')) {
        element.textContent = Math.round(currentValue) + '%';
      } else {
        element.textContent = Math.round(currentValue);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }
};