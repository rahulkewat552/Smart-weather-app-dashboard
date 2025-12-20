// Theme Management
const theme = {
  init() {
    console.log('Initializing theme system...');
    this.bindEvents();

    const savedTheme = localStorage.getItem('weatherAppTheme');
    const autoTheme = localStorage.getItem('weatherAppAutoTheme') !== 'false';

    console.log('Saved theme:', savedTheme);
    console.log('Auto theme enabled:', autoTheme);

    if (autoTheme && !savedTheme) {
      this.setAutoTheme();
    } else {
      const themeToUse = savedTheme || 'dark';
      this.setTheme(themeToUse);
    }

    this.updateThemeIcon();
    console.log('Theme system initialized with theme:', appState.theme);
  },

  bindEvents() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        this.toggle();
      });

      // Add keyboard support
      themeToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggle();
        }
      });
    }

    // Add keyboard shortcut (Ctrl/Cmd + Shift + T)
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        this.toggle();
      }
    });
  },

  // theme persistance
  setTheme(themeName) {
    console.log('Setting theme to:', themeName);
    appState.theme = themeName;
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('weatherAppTheme', themeName);
    localStorage.setItem('weatherAppAutoTheme', 'false');
    this.updateThemeIcon();

    // Dispatch custom event for theme change
    window.dispatchEvent(new CustomEvent('themeChanged', {
      detail: { theme: themeName }
    }));
  },

  setAutoTheme() {
    const hour = new Date().getHours();
    const isNight = hour < 6 || hour >= 18;
    const autoTheme = isNight ? 'dark' : 'light';

    appState.theme = autoTheme;
    document.documentElement.setAttribute('data-theme', autoTheme);
    localStorage.setItem('weatherAppAutoTheme', 'true');
    this.updateThemeIcon();
  },

  toggle() {
    const themeToggle = document.getElementById('themeToggle');

    // Add visual feedback
    if (themeToggle) {
      themeToggle.style.transform = 'scale(0.95)';
      setTimeout(() => {
        themeToggle.style.transform = 'scale(1)';
      }, 150);
    }

    const newTheme = appState.theme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);

    // Log theme change for debugging
    console.log(`Theme switched to: ${newTheme}`);
  },

  updateThemeIcon() {
    const themeIcon = document.getElementById('themeIcon');
    const themeToggle = document.getElementById('themeToggle');

    if (themeIcon && themeToggle) {
      // Add transition class for smooth icon change
      themeIcon.style.transition = 'opacity 0.2s ease-in-out';

      if (appState.theme === 'dark') {
        themeIcon.src = './assets/images/icon-sunny.webp';
        themeIcon.alt = 'Switch to light mode';
        themeToggle.setAttribute('aria-label', 'Switch to light mode');
        themeToggle.setAttribute('title', 'Switch to light mode');
      } else {
        themeIcon.src = './assets/images/icon-overcast.webp';
        themeIcon.alt = 'Switch to dark mode';
        themeToggle.setAttribute('aria-label', 'Switch to dark mode');
        themeToggle.setAttribute('title', 'Switch to dark mode');
      }
    }
  }
};