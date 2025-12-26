// Search functionality
const search = {
  init() {
    elements.searchInput = document.getElementById('searchInput');
    elements.searchButton = document.getElementById('searchButton');
    elements.searchResults = document.getElementById('searchResults');

    if (!elements.searchInput || !elements.searchButton || !elements.searchResults) {
      console.error('Search elements not found');
      return;
    }

    // Debounced search function
    const debouncedSearch = utils.debounce(this.performSearch.bind(this), 300);

    // Event listeners
    elements.searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      if (query.length >= 2) {
        debouncedSearch(query);
      } else {
        this.hideResults();
      }
    });

    elements.searchButton.addEventListener('click', () => {
      const query = elements.searchInput.value.trim();
      if (query) {
        this.performSearch(query);
      }
    });

    elements.searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const query = elements.searchInput.value.trim();
        if (query) {
          this.performSearch(query);
        }
      } else if (e.key === 'Escape') {
        this.hideResults();
      }
    });

    // Hide results when clicking outside
    document.addEventListener('click', (e) => {
      if (!elements.searchInput.contains(e.target) && !elements.searchResults.contains(e.target)) {
        this.hideResults();
      }
    });

    // Handle keyboard navigation in search results
    elements.searchInput.addEventListener('keydown', (e) => {
      const results = elements.searchResults.querySelectorAll('.search-result-item');
      const activeResult = elements.searchResults.querySelector('.search-result-item.active');
      let currentIndex = Array.from(results).indexOf(activeResult);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        currentIndex = Math.min(currentIndex + 1, results.length - 1);
        this.highlightResult(results, currentIndex);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        currentIndex = Math.max(currentIndex - 1, 0);
        this.highlightResult(results, currentIndex);
      } else if (e.key === 'Enter' && activeResult) {
        e.preventDefault();
        activeResult.click();
      }
    });
  },

  async performSearch(query) {
    try {
      utils.showLoading(elements.searchButton);
      const locations = await api.searchLocations(query);
      this.displayResults(locations);
    } catch (error) {
      console.error('Search failed:', error);
      this.showSearchError();
    } finally {
      utils.hideLoading(elements.searchButton);
    }
  },

  displayResults(locations) {
    if (!locations || locations.length === 0) {
      this.showNoResults();
      return;
    }

    const resultsHTML = locations.map(location => `
      <div class="search-result-item" data-location='${JSON.stringify(location)}'>
        <div class="search-result-name">${location.name}</div>
        <div class="search-result-details">
          ${location.admin1 ? location.admin1 + ', ' : ''}${location.country}
        </div>
      </div>
    `).join('');

    elements.searchResults.innerHTML = resultsHTML;
    this.showResults();

    // Add click listeners to results
    elements.searchResults.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        const location = JSON.parse(item.dataset.location);
        this.selectLocation(location);
      });
    });
  },

  selectLocation(location) {
    appState.currentLocation = location;
    elements.searchInput.value = `${location.name}, ${location.country}`;
    this.hideResults();

    // Load weather for selected location
    weather.loadWeatherData(location.latitude, location.longitude);
  },

  showResults() {
    elements.searchResults.classList.add('active');
  },

  hideResults() {
    elements.searchResults.classList.remove('active');
  },

  showNoResults() {
    elements.searchResults.innerHTML = `
      <div class="search-result-item">
        <div class="search-result-name">No results found</div>
        <div class="search-result-details">Try a different search term</div>
      </div>
    `;
    this.showResults();
  },

  showSearchError() {
    elements.searchResults.innerHTML = `
      <div class="search-result-item">
        <div class="search-result-name">Search failed</div>
        <div class="search-result-details">Please try again</div>
      </div>
    `;
    this.showResults();
  },

  highlightResult(results, index) {
    results.forEach((result, i) => {
      if (i === index) {
        result.classList.add('active');
        result.scrollIntoView({ block: 'nearest' });
      } else {
        result.classList.remove('active');
      }
    });
  }
};