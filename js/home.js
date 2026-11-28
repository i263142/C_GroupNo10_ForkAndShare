/**
 * FORK & SHARE — Home Page Script
 * Handles hero recipe search routing, featured recipe category filtering,
 * and saved-recipe bookmarking in localStorage.
 */

document.addEventListener("DOMContentLoaded", function () {
  var STORAGE_KEY = "forkAndShare_savedRecipes";

  initHeroSearch();
  initFeaturedFilters();
  initSaveButtons(STORAGE_KEY);
});

/**
 * Routes non-empty hero searches to the Explore Recipes page with ?q=...
 */
function initHeroSearch() {
  var form = document.getElementById("home-search-form");
  var input = document.getElementById("home-search-input");
  var feedback = document.getElementById("home-search-feedback");

  if (!form || !input) {
    return;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var query = input.value.trim();

    if (!query) {
      if (feedback) {
        feedback.textContent = "Please enter an ingredient or recipe name to search.";
      }
      input.focus();
      return;
    }

    if (feedback) {
      feedback.textContent = "";
    }

    window.location.href = "pages/explore.html?q=" + encodeURIComponent(query);
  });

  input.addEventListener("input", function () {
    if (feedback && feedback.textContent) {
      feedback.textContent = "";
    }
  });
}

/**
 * Filters the Featured Recipes grid by category button selection.
 */
function initFeaturedFilters() {
  var filterButtons = document.querySelectorAll("[data-filter]");
  var recipeCards = document.querySelectorAll("#featured-grid .recipe-card");
  var statusEl = document.getElementById("filter-status");

  if (!filterButtons.length || !recipeCards.length) {
    return;
  }

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var selectedFilter = button.getAttribute("data-filter");
      var visibleCount = 0;

      filterButtons.forEach(function (btn) {
        var isCurrent = btn === button;
        btn.classList.toggle("is-selected", isCurrent);
        btn.setAttribute("aria-pressed", String(isCurrent));
      });

      recipeCards.forEach(function (card) {
        var categories = (card.getAttribute("data-categories") || "").split(/\s+/);
        var matches = selectedFilter === "all" || categories.indexOf(selectedFilter) !== -1;
        card.hidden = !matches;
        if (matches) {
          visibleCount += 1;
        }
      });

      if (statusEl) {
        var label = button.textContent.trim();
        statusEl.textContent =
          "Showing " +
          visibleCount +
          " " +
          (visibleCount === 1 ? "recipe" : "recipes") +
          (selectedFilter === "all" ? "." : " in " + label + ".");
      }
    });
  });
}

/**
 * Restores and toggles saved recipe state in localStorage.
 */
function initSaveButtons(storageKey) {
  var saveButtons = document.querySelectorAll("[data-save-recipe]");
  if (!saveButtons.length) {
    return;
  }

  var savedIds = loadSavedIds(storageKey);

  saveButtons.forEach(function (button) {
    var recipeId = button.getAttribute("data-save-recipe");
    setSaveButtonState(button, savedIds.indexOf(recipeId) !== -1);

    button.addEventListener("click", function () {
      var isCurrentlySaved = savedIds.indexOf(recipeId) !== -1;

      if (isCurrentlySaved) {
        savedIds = savedIds.filter(function (id) {
          return id !== recipeId;
        });
      } else {
        savedIds.push(recipeId);
      }

      persistSavedIds(storageKey, savedIds);
      setSaveButtonState(button, !isCurrentlySaved);
    });
  });
}

function setSaveButtonState(button, isSaved) {
  button.classList.toggle("is-saved", isSaved);
  button.setAttribute("aria-pressed", String(isSaved));
  button.textContent = isSaved ? "Saved" : "Save";
}

function loadSavedIds(storageKey) {
  try {
    var raw = window.localStorage.getItem(storageKey);
    var parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function persistSavedIds(storageKey, ids) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(ids));
  } catch (error) {
    /* Ignore storage quota or privacy-mode errors gracefully */
  }
}
