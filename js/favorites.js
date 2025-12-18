// Favorites Management
const favorites = {
  init() {
    this.bindEvents();
    this.updateUI();
  },

  bindEvents() {
    // Favorite button in current weather
    const favoriteButton = document.getElementById('favoriteButton');
    if (favoriteButton) {
      favoriteButton.addEventListener('click', () => {
        this.toggleCurrentLocation();
      });
    }

    // Favorites dropdown
    const favoritesButton = document.getElementById('favoritesButton');
    const favoritesMenu = document.getElementById('favoritesMenu');

    if (favoritesButton && favoritesMenu) {
      favoritesButton.addEventListener('click', () => {
        const isOpen = favoritesMenu.classList.contains('active');
        if (isOpen) {
          favoritesMenu.classList.remove('active');
          favoritesButton.setAttribute('aria-expanded', 'false');
        } else {
          favoritesMenu.classList.add('active');
          favoritesButton.setAttribute('aria-expanded', 'true');
          this.updateFavoritesList();
        }
      });

      // Close favorites menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!favoritesButton.contains(e.target) && !favoritesMenu.contains(e.target)) {
          favoritesMenu.classList.remove('active');
          favoritesButton.setAttribute('aria-expanded', 'false');
        }
      });
    }
  },

  toggleCurrentLocation() {
    if (!appState.currentLocation) return;

    const favoriteButton = document.getElementById('favoriteButton');

    if (this.isFavorite(appState.currentLocation)) {
      this.remove(appState.currentLocation);
      favoriteButton.classList.remove('active');
      favoriteButton.setAttribute('aria-label', 'Add to favorites');
    } else {
      this.add(appState.currentLocation);
      favoriteButton.classList.add('active');
      favoriteButton.setAttribute('aria-label', 'Remove from favorites');
    }
  },

  add(location) {
    const favorite = {
      id: Date.now(),
      name: location.name,
      country: location.country,
      latitude: location.latitude,
      longitude: location.longitude
    };

    appState.favorites.push(favorite);
    this.save();
    this.updateUI();
  },

  remove(location) {
    appState.favorites = appState.favorites.filter(fav =>
      !(fav.latitude === location.latitude && fav.longitude === location.longitude)
    );
    this.save();
    this.updateUI();
  },

  removeById(id) {
    appState.favorites = appState.favorites.filter(fav => fav.id !== id);
    this.save();
    this.updateUI();
  },

  save() {
    localStorage.setItem('weatherAppFavorites', JSON.stringify(appState.favorites));
  },

  isFavorite(location) {
    return appState.favorites.some(fav =>
      fav.latitude === location.latitude && fav.longitude === location.longitude
    );
  },

  updateUI() {
    // Update favorite button state
    const favoriteButton = document.getElementById('favoriteButton');
    if (favoriteButton && appState.currentLocation) {
      if (this.isFavorite(appState.currentLocation)) {
        favoriteButton.classList.add('active');
        favoriteButton.setAttribute('aria-label', 'Remove from favorites');
      } else {
        favoriteButton.classList.remove('active');
        favoriteButton.setAttribute('aria-label', 'Add to favorites');
      }
    }
  },

  updateFavoritesList() {
    const favoritesList = document.getElementById('favoritesList');
    const noFavorites = document.getElementById('noFavorites');

    if (!favoritesList) return;

    if (appState.favorites.length === 0) {
      favoritesList.innerHTML = `
        <div class="no-favorites">
          <p>No saved locations yet</p>
          <p class="text-small">Add locations to your favorites for quick access</p>
        </div>
      `;
    } else {
      const favoritesHTML = appState.favorites.map(favorite => `
        <div class="favorite-item" data-favorite-id="${favorite.id}">
          <div class="favorite-info">
            <div class="favorite-name">${favorite.name}</div>
            <div class="favorite-country">${favorite.country}</div>
          </div>
          <button class="favorite-remove" data-favorite-id="${favorite.id}" aria-label="Remove ${favorite.name} from favorites">
            ×
          </button>
        </div>
      `).join('');

      favoritesList.innerHTML = favoritesHTML;

      // Add event listeners
      favoritesList.querySelectorAll('.favorite-item').forEach(item => {
        item.addEventListener('click', (e) => {
          if (e.target.classList.contains('favorite-remove')) return;

          const favoriteId = parseInt(item.dataset.favoriteId);
          const favorite = appState.favorites.find(fav => fav.id === favoriteId);

          if (favorite) {
            appState.currentLocation = favorite;
            weather.loadWeatherData(favorite.latitude, favorite.longitude);

            // Close favorites menu
            const favoritesMenu = document.getElementById('favoritesMenu');
            const favoritesButton = document.getElementById('favoritesButton');
            if (favoritesMenu && favoritesButton) {
              favoritesMenu.classList.remove('active');
              favoritesButton.setAttribute('aria-expanded', 'false');
            }
          }
        });
      });

      favoritesList.querySelectorAll('.favorite-remove').forEach(button => {
        button.addEventListener('click', (e) => {
          e.stopPropagation();
          const favoriteId = parseInt(button.dataset.favoriteId);
          this.removeById(favoriteId);
        });
      });
    }
  }
};