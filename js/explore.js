/**
 * FORK & SHARE — Explore Recipes Page Script
 * Powers interactive recipe search, multi-criteria filtering, sorting,
 * URL query-parameter sync, saved-recipe bookmarks, and recipe quick view.
 */

document.addEventListener("DOMContentLoaded", function () {
  var STORAGE_KEY = "forkAndShare_savedRecipes";

  var CATEGORY_LABELS = {
    all: "All Recipes",
    breakfast: "Breakfast & Brunch",
    quick: "Quick Weeknight",
    vegetarian: "Plant-Based",
    comfort: "Comfort Classics",
    soups: "Soups & Salads",
    dessert: "Baked Goods"
  };

  var RECIPES = [
    {
      id: "creamy-lemon-asparagus-pasta",
      title: "Creamy Lemon Asparagus Pasta",
      categoryLabel: "Quick · Vegetarian",
      categories: ["quick", "vegetarian"],
      timeMinutes: 20,
      difficulty: "Easy",
      servings: "2 servings",
      author: "Chef Elena Rossi",
      banner: "banner-sage",
      art: "pasta",
      summary:
        "Bright lemon zest, crisp-tender spring asparagus, and silky parmesan sauce tossed with linguine.",
      tags: ["pasta", "lemon", "30-min", "spring", "weeknight", "vegetarian"],
      ingredients: [
        "200 g linguine pasta",
        "1 bunch fresh asparagus, trimmed and cut into bite-sized pieces",
        "1 large lemon (zest and juice)",
        "2 cloves garlic, finely minced",
        "50 g grated parmesan cheese",
        "2 tbsp olive oil & 1/3 cup reserved pasta water"
      ],
      steps: [
        "Boil linguine in salted water until al dente, adding asparagus during the last 3 minutes.",
        "Warm olive oil in a skillet and gently saute garlic for 1 minute until fragrant.",
        "Toss drained pasta and asparagus with garlic, lemon zest, lemon juice, parmesan, and pasta water.",
        "Season with cracked black pepper and serve immediately."
      ]
    },
    {
      id: "spiced-chickpea-spinach-stew",
      title: "Spiced Chickpea & Spinach Stew",
      categoryLabel: "Plant-Based · One-Pot",
      categories: ["quick", "vegetarian", "soups"],
      timeMinutes: 25,
      difficulty: "Easy",
      servings: "4 servings",
      author: "Tariq Mansoor",
      banner: "banner-peach",
      art: "stew",
      summary:
        "Warm cumin, smoked paprika, ripe tomatoes, and wilted greens simmered into a cozy weeknight bowl.",
      tags: ["chickpeas", "30-min", "vegan", "one-pot", "spinach", "vegetarian"],
      ingredients: [
        "2 cans (400 g each) chickpeas, drained and rinsed",
        "1 can crushed tomatoes",
        "3 cups fresh baby spinach",
        "1 tsp ground cumin & 1 tsp smoked paprika",
        "1 yellow onion, diced, and 3 cloves garlic",
        "2 tbsp olive oil & 1 cup vegetable broth"
      ],
      steps: [
        "Saute onion and garlic in olive oil for 5 minutes until softened.",
        "Stir in cumin and smoked paprika for 30 seconds, then add tomatoes, chickpeas, and broth.",
        "Simmer gently for 12 minutes until rich and thickened.",
        "Fold in spinach until wilted, adjust salt, and serve with warm flatbread."
      ]
    },
    {
      id: "rosemary-sea-salt-focaccia",
      title: "Rosemary & Sea Salt Focaccia",
      categoryLabel: "Comfort · Artisan Bread",
      categories: ["comfort", "dessert"],
      timeMinutes: 35,
      difficulty: "Medium",
      servings: "8 slices",
      author: "Nadia Kowalski",
      banner: "banner-forest",
      art: "focaccia",
      summary:
        "Airy, olive-oil-rich focaccia topped with flaky sea salt and fresh garden rosemary sprigs.",
      tags: ["baking", "bread", "rosemary", "olive oil", "comfort"],
      ingredients: [
        "500 g bread flour",
        "400 ml lukewarm water",
        "7 g instant yeast & 10 g fine sea salt",
        "4 tbsp extra-virgin olive oil",
        "2 sprigs fresh rosemary",
        "1 tsp flaky sea salt for topping"
      ],
      steps: [
        "Whisk flour, yeast, salt, water, and 2 tbsp olive oil into a shaggy dough; rest until doubled.",
        "Transfer to an oiled baking pan, stretch gently to corners, and proof 30 minutes.",
        "Dimple the surface with oiled fingertips and scatter rosemary leaves and flaky salt.",
        "Bake at 220°C (425°F) for 22–25 minutes until deeply golden and crisp."
      ]
    },
    {
      id: "roasted-carrot-ginger-soup",
      title: "Roasted Carrot & Ginger Soup",
      categoryLabel: "Soups · Vegetarian",
      categories: ["vegetarian", "soups", "comfort"],
      timeMinutes: 35,
      difficulty: "Easy",
      servings: "4 servings",
      author: "Clara Bennett",
      banner: "banner-peach",
      art: "soup",
      summary:
        "Caramelized sweet carrots blended with fresh ginger root, coconut milk, and toasted pumpkin seeds.",
      tags: ["soup", "ginger", "carrot", "coconut milk", "vegan", "vegetarian"],
      ingredients: [
        "700 g carrots, peeled and sliced",
        "1 tbsp fresh ginger, grated",
        "1 medium onion, quartered",
        "750 ml vegetable stock",
        "150 ml coconut milk",
        "2 tbsp toasted pumpkin seeds"
      ],
      steps: [
        "Roast carrots and onion tossed in olive oil at 200°C for 25 minutes until caramelized.",
        "Transfer to a pot with ginger and stock, then simmer for 8 minutes.",
        "Blend until velvety smooth and swirl in coconut milk.",
        "Ladle into warm bowls and top with toasted pumpkin seeds."
      ]
    },
    {
      id: "garlic-herb-roast-chicken",
      title: "Garlic Herb & Preserved Lemon Roast Chicken",
      categoryLabel: "Sunday Supper · Comfort",
      categories: ["comfort"],
      timeMinutes: 45,
      difficulty: "Medium",
      servings: "4 servings",
      author: "Chef Maya Lin",
      banner: "banner-forest",
      art: "roast",
      summary:
        "Crisp golden skin, tender rosemary-infused meat, and a bright pan jus ready for Sunday supper.",
      tags: ["chicken", "lemon", "garlic", "roast", "dinner", "comfort"],
      ingredients: [
        "4 bone-in chicken thighs and drumsticks",
        "1 preserved lemon, finely chopped",
        "4 cloves garlic, smashed",
        "3 tbsp softened butter & 1 tbsp olive oil",
        "Fresh thyme and rosemary sprigs",
        "1/2 cup chicken stock for pan jus"
      ],
      steps: [
        "Pat chicken dry and rub thoroughly with garlic, herbs, preserved lemon, butter, and salt.",
        "Sear skin-side down in an oven-safe skillet until golden.",
        "Transfer skillet to a 200°C oven and roast for 30 minutes until cooked through.",
        "Rest chicken while simmering pan drippings with stock to make a bright jus."
      ]
    },
    {
      id: "spiced-peach-oat-crisp",
      title: "Warm Spiced Peach & Oat Crisp",
      categoryLabel: "Baked Goods · Dessert",
      categories: ["dessert", "vegetarian"],
      timeMinutes: 40,
      difficulty: "Easy",
      servings: "6 servings",
      author: "Hannah Brooks",
      banner: "banner-sage",
      art: "crisp",
      summary:
        "Juicy cinnamon-kissed peaches baked beneath a golden brown-butter oat and pecan crumble.",
      tags: ["baking", "dessert", "peach", "oats", "sweet", "vegetarian"],
      ingredients: [
        "6 ripe peaches, sliced",
        "1 cup rolled oats & 1/2 cup all-purpose flour",
        "1/3 cup brown sugar & 1 tsp cinnamon",
        "75 g melted butter",
        "1/3 cup chopped pecans",
        "1 tsp lemon juice & pinch of salt"
      ],
      steps: [
        "Toss sliced peaches with lemon juice, 1 tbsp brown sugar, and half the cinnamon in a baking dish.",
        "Stir oats, flour, remaining sugar, cinnamon, pecans, and melted butter into coarse crumbs.",
        "Scatter crumble evenly over the peaches.",
        "Bake at 190°C (375°F) for 35 minutes until bubbling and golden."
      ]
    },
    {
      id: "buttermilk-berry-oat-pancakes",
      title: "Buttermilk Berry & Oat Pancakes",
      categoryLabel: "Breakfast · Quick",
      categories: ["breakfast", "quick", "vegetarian"],
      timeMinutes: 20,
      difficulty: "Easy",
      servings: "4 servings",
      author: "Samir Patel",
      banner: "banner-peach",
      art: "pancakes",
      summary:
        "Fluffy whole-grain oat and buttermilk pancakes studded with blueberries and warm maple drizzle.",
      tags: ["breakfast", "pancakes", "oats", "30-min", "brunch", "vegetarian"],
      ingredients: [
        "1 cup rolled oats, finely pulsed",
        "1 cup all-purpose flour & 1 tsp baking powder",
        "1 1/4 cups buttermilk",
        "2 large eggs & 2 tbsp melted butter",
        "1 cup fresh blueberries",
        "Maple syrup for serving"
      ],
      steps: [
        "Whisk pulsed oats, flour, baking powder, and a pinch of salt in a bowl.",
        "Beat buttermilk, eggs, and melted butter together, then fold gently into dry ingredients.",
        "Pour batter onto a lightly greased skillet and dot with blueberries.",
        "Cook 2 minutes per side until puffed and golden; serve warm."
      ]
    },
    {
      id: "herb-baked-eggs-skillet",
      title: "Herb & Tomato Baked Eggs Skillet",
      categoryLabel: "Brunch · One-Skillet",
      categories: ["breakfast", "quick", "vegetarian"],
      timeMinutes: 18,
      difficulty: "Easy",
      servings: "2 servings",
      author: "Lucia Fernandez",
      banner: "banner-sage",
      art: "skillet",
      summary:
        "Rich spiced tomato sauce simmered in one pan with gently set eggs, parsley, and crusty toast.",
      tags: ["breakfast", "eggs", "30-min", "brunch", "tomato", "vegetarian"],
      ingredients: [
        "4 large eggs",
        "1 can diced tomatoes",
        "1 red bell pepper, thinly sliced",
        "2 cloves garlic & 1/2 tsp smoked paprika",
        "2 tbsp chopped fresh parsley",
        "2 tbsp olive oil"
      ],
      steps: [
        "Cook bell pepper and garlic in olive oil until tender.",
        "Stir in paprika and diced tomatoes; simmer 6 minutes until thickened.",
        "Make four small wells and crack an egg into each; cover and cook 4–5 minutes.",
        "Scatter with parsley and serve straight from the skillet."
      ]
    },
    {
      id: "rustic-sourdough-ricotta-loaf",
      title: "Crusty Sourdough & Whipped Ricotta Loaf",
      categoryLabel: "Artisan Bake · Breakfast",
      categories: ["breakfast", "comfort", "dessert"],
      timeMinutes: 45,
      difficulty: "Medium",
      servings: "8 slices",
      author: "Jonas Meyer",
      banner: "banner-forest",
      art: "focaccia",
      summary:
        "Tangy blistered sourdough boule paired with lemon-herb whipped ricotta and flaky sea salt.",
      tags: ["sourdough", "baking", "bread", "lemon", "breakfast", "ricotta"],
      ingredients: [
        "1 rustic sourdough country loaf",
        "1 cup whole-milk ricotta",
        "1 tbsp extra-virgin olive oil",
        "1 tsp lemon zest",
        "Fresh thyme leaves",
        "Flaky sea salt & cracked pepper"
      ],
      steps: [
        "Warm or bake the sourdough loaf until crisp on the outside and tender within.",
        "Whip ricotta with olive oil, lemon zest, and salt until smooth and airy.",
        "Slice thick pieces of toasted sourdough.",
        "Spread generously with whipped ricotta and garnish with thyme and pepper."
      ]
    },
    {
      id: "crispy-sage-butter-gnocchi",
      title: "Crispy Sage & Brown Butter Gnocchi",
      categoryLabel: "Quick · Pasta & Comfort",
      categories: ["quick", "comfort", "vegetarian"],
      timeMinutes: 15,
      difficulty: "Easy",
      servings: "2 servings",
      author: "Marco Bellini",
      banner: "banner-peach",
      art: "pasta",
      summary:
        "Pan-seared pillowy potato gnocchi toasted in nutty brown butter with crispy sage and parmesan.",
      tags: ["pasta", "30-min", "sage", "garlic", "weeknight", "vegetarian"],
      ingredients: [
        "400 g shelf-stable or fresh potato gnocchi",
        "4 tbsp unsalted butter",
        "10 fresh sage leaves",
        "1 clove garlic, lightly crushed",
        "1/3 cup grated parmesan",
        "1 tsp fresh lemon juice"
      ],
      steps: [
        "Pan-sear gnocchi in 1 tbsp butter over medium-high heat until golden on one side.",
        "Add remaining butter, garlic, and sage leaves; swirl until butter turns nutty brown.",
        "Remove from heat and stir in lemon juice and parmesan.",
        "Serve immediately with extra cracked pepper."
      ]
    },
    {
      id: "lemon-herb-quinoa-chickpea-salad",
      title: "Lemon Herb Quinoa & Chickpea Salad",
      categoryLabel: "Salads · Plant-Based",
      categories: ["soups", "quick", "vegetarian"],
      timeMinutes: 15,
      difficulty: "Easy",
      servings: "3 servings",
      author: "Amira Haddad",
      banner: "banner-sage",
      art: "soup",
      summary:
        "Refreshing meal-prep bowl of fluffy quinoa, chickpeas, cucumber, and bright lemon-oregano dressing.",
      tags: ["salad", "chickpeas", "lemon", "30-min", "vegan", "vegetarian"],
      ingredients: [
        "2 cups cooked quinoa, cooled",
        "1 can chickpeas, drained and rinsed",
        "1 crisp cucumber, diced",
        "1/2 cup cherry tomatoes, halved",
        "3 tbsp olive oil & juice of 1 lemon",
        "1/4 cup fresh parsley & mint, chopped"
      ],
      steps: [
        "Combine cooled quinoa, chickpeas, cucumber, tomatoes, and herbs in a large bowl.",
        "Whisk olive oil, lemon juice, dried oregano, salt, and pepper.",
        "Toss dressing evenly through the salad.",
        "Serve chilled or pack for easy weekday lunches."
      ]
    },
    {
      id: "brown-butter-cardamom-pear-tart",
      title: "Brown Butter Cardamom Pear Tart",
      categoryLabel: "Baked Goods · Sweet",
      categories: ["dessert", "vegetarian"],
      timeMinutes: 45,
      difficulty: "Medium",
      servings: "8 slices",
      author: "Claire Dubois",
      banner: "banner-forest",
      art: "crisp",
      summary:
        "Tender almond-frangipane tart layered with poached pears, fragrant cardamom, and crisp pastry crust.",
      tags: ["baking", "dessert", "tart", "pear", "sweet", "vegetarian"],
      ingredients: [
        "1 chilled shortcrust tart shell",
        "2 ripe Bartlett pears, thinly sliced",
        "100 g browned butter, cooled",
        "100 g almond flour & 80 g sugar",
        "2 eggs & 1/2 tsp ground cardamom",
        "1 tbsp sliced almonds for topping"
      ],
      steps: [
        "Whisk brown butter, sugar, eggs, almond flour, and cardamom into a smooth filling.",
        "Spread filling into the tart shell and fan sliced pears on top.",
        "Scatter sliced almonds over the edges.",
        "Bake at 180°C (350°F) for 35–40 minutes until golden and set."
      ]
    }
  ];

  function getRecipeImage(recipe) {
    var images = {
      "creamy-lemon-asparagus-pasta": "../images/home/lemon-asparagus-pasta.jpg",
      "spiced-chickpea-spinach-stew": "../images/home/chickpea-spinach-stew.jpg",
      "rosemary-sea-salt-focaccia": "../images/home/rosemary-focaccia.jpg",
      "roasted-carrot-ginger-soup": "../images/home/carrot-ginger-soup.jpg",
      "garlic-herb-roast-chicken": "../images/home/herb-roast-chicken-card.jpg",
      "spiced-peach-oat-crisp": "../images/home/peach-oat-crisp.jpg",
      "buttermilk-berry-oat-pancakes": "../images/explore/berry-oat-pancakes.jpg",
      "herb-baked-eggs-skillet": "../images/explore/herb-baked-eggs.jpg",
      "rustic-sourdough-ricotta-loaf": "../images/explore/sourdough-ricotta.jpg",
      "crispy-sage-butter-gnocchi": "../images/explore/sage-butter-gnocchi.jpg",
      "lemon-herb-quinoa-chickpea-salad": "../images/explore/quinoa-chickpea-salad.jpg",
      "brown-butter-cardamom-pear-tart": "../images/explore/pear-cardamom-tart.jpg"
    };

    return images[recipe.id] || "";
  }

  function createRecipeImage(recipe, className) {
    var image = document.createElement("img");
    image.src = getRecipeImage(recipe);
    image.alt = "";
    image.className = className;
    image.loading = "lazy";
    image.decoding = "async";
    image.style.width = "100%";
    image.style.height = "100%";
    image.style.objectFit = "cover";
    image.style.display = "block";

    return image;
  }

  var state = {
    query: "",
    category: "all",
    maxTime: "all",
    difficulty: "all",
    sortBy: "featured",
    savedOnly: false,
    savedIds: loadSavedIds(STORAGE_KEY)
  };

  var elements = {
    searchForm: document.getElementById("explore-search-form"),
    searchInput: document.getElementById("explore-search-input"),
    clearSearchBtn: document.getElementById("clear-search-btn"),
    quickTags: document.querySelectorAll("[data-quick-query]"),
    categoryButtons: document.querySelectorAll("[data-category]"),
    timeFilter: document.getElementById("time-filter"),
    difficultyFilter: document.getElementById("difficulty-filter"),
    sortSelect: document.getElementById("sort-select"),
    savedOnlyBtn: document.getElementById("saved-only-btn"),
    resetFiltersBtn: document.getElementById("reset-filters-btn"),
    emptyResetBtn: document.getElementById("empty-reset-btn"),
    grid: document.getElementById("explore-recipe-grid"),
    emptyState: document.getElementById("empty-state"),
    resultsStatus: document.getElementById("results-status"),
    totalCountEl: document.getElementById("total-recipes-count"),
    savedCountEl: document.getElementById("saved-recipes-count"),
    modal: document.getElementById("recipe-modal"),
    modalTitle: document.getElementById("modal-recipe-title"),
    modalCategory: document.getElementById("modal-recipe-category"),
    modalBanner: document.getElementById("modal-recipe-banner"),
    modalMeta: document.getElementById("modal-recipe-meta"),
    modalSummary: document.getElementById("modal-recipe-summary"),
    modalIngredients: document.getElementById("modal-ingredients-list"),
    modalSteps: document.getElementById("modal-steps-list"),
    modalAuthor: document.getElementById("modal-recipe-author"),
    modalSaveBtn: document.getElementById("modal-save-btn"),
    modalFullLink: document.getElementById("modal-full-link"),
    modalCloseBtn: document.getElementById("modal-close-btn")
  };

  var lastFocusedElement = null;
  var activeModalRecipeId = null;

  hydrateStateFromUrl();
  bindEvents();
  syncControlsWithState();
  renderRecipes();

  /**
   * Reads ?q= and ?category= query params passed from index.html links.
   */
  function hydrateStateFromUrl() {
    var params = new URLSearchParams(window.location.search);
    var qParam = params.get("q");
    var categoryParam = params.get("category");

    if (qParam) {
      state.query = qParam.trim();
    }

    if (categoryParam && CATEGORY_LABELS[categoryParam]) {
      state.category = categoryParam;
    }
  }

  function bindEvents() {
    if (elements.searchForm) {
      elements.searchForm.addEventListener("submit", function (event) {
        event.preventDefault();
        state.query = elements.searchInput.value.trim();
        syncControlsWithState();
        updateUrlParams();
        renderRecipes();
      });
    }

    if (elements.searchInput) {
      elements.searchInput.addEventListener("input", function () {
        state.query = elements.searchInput.value.trim();
        updateClearButtonVisibility();
        updateActiveQuickTag();
        updateResetButtonVisibility();
        renderRecipes();
      });
    }

    if (elements.clearSearchBtn) {
      elements.clearSearchBtn.addEventListener("click", function () {
        state.query = "";
        elements.searchInput.value = "";
        elements.searchInput.focus();
        syncControlsWithState();
        updateUrlParams();
        renderRecipes();
      });
    }

    elements.quickTags.forEach(function (button) {
      button.addEventListener("click", function () {
        var tagQuery = button.getAttribute("data-quick-query") || "";
        state.query = state.query.toLowerCase() === tagQuery.toLowerCase() ? "" : tagQuery;
        syncControlsWithState();
        updateUrlParams();
        renderRecipes();
      });
    });

    elements.categoryButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        state.category = button.getAttribute("data-category") || "all";
        syncControlsWithState();
        updateUrlParams();
        renderRecipes();
      });
    });

    if (elements.timeFilter) {
      elements.timeFilter.addEventListener("change", function () {
        state.maxTime = elements.timeFilter.value;
        updateResetButtonVisibility();
        renderRecipes();
      });
    }

    if (elements.difficultyFilter) {
      elements.difficultyFilter.addEventListener("change", function () {
        state.difficulty = elements.difficultyFilter.value;
        updateResetButtonVisibility();
        renderRecipes();
      });
    }

    if (elements.sortSelect) {
      elements.sortSelect.addEventListener("change", function () {
        state.sortBy = elements.sortSelect.value;
        updateResetButtonVisibility();
        renderRecipes();
      });
    }

    if (elements.savedOnlyBtn) {
      elements.savedOnlyBtn.addEventListener("click", function () {
        state.savedOnly = !state.savedOnly;
        syncControlsWithState();
        renderRecipes();
      });
    }

    if (elements.resetFiltersBtn) {
      elements.resetFiltersBtn.addEventListener("click", resetAllFilters);
    }

    if (elements.emptyResetBtn) {
      elements.emptyResetBtn.addEventListener("click", resetAllFilters);
    }

    if (elements.grid) {
      elements.grid.addEventListener("click", function (event) {
        var saveBtn = event.target.closest("[data-save-recipe]");
        if (saveBtn) {
          var saveId = saveBtn.getAttribute("data-save-recipe");
          toggleSavedRecipe(saveId);
          return;
        }

        var previewBtn = event.target.closest("[data-preview-recipe]");
        if (previewBtn) {
          var previewId = previewBtn.getAttribute("data-preview-recipe");
          openRecipeModal(previewId, previewBtn);
        }
      });
    }

    if (elements.modal) {
      elements.modal.addEventListener("click", function (event) {
        if (event.target.hasAttribute("data-modal-close")) {
          closeRecipeModal();
        }
      });
    }

    if (elements.modalSaveBtn) {
      elements.modalSaveBtn.addEventListener("click", function () {
        if (activeModalRecipeId) {
          toggleSavedRecipe(activeModalRecipeId);
        }
      });
    }

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && elements.modal && !elements.modal.hidden) {
        closeRecipeModal();
      }
    });
  }

  function resetAllFilters() {
    state.query = "";
    state.category = "all";
    state.maxTime = "all";
    state.difficulty = "all";
    state.sortBy = "featured";
    state.savedOnly = false;
    syncControlsWithState();
    updateUrlParams();
    renderRecipes();
  }

  function syncControlsWithState() {
    if (elements.searchInput) {
      elements.searchInput.value = state.query;
    }

    elements.categoryButtons.forEach(function (button) {
      var isCurrent = button.getAttribute("data-category") === state.category;
      button.classList.toggle("is-selected", isCurrent);
      button.setAttribute("aria-pressed", String(isCurrent));
    });

    if (elements.timeFilter) {
      elements.timeFilter.value = state.maxTime;
    }

    if (elements.difficultyFilter) {
      elements.difficultyFilter.value = state.difficulty;
    }

    if (elements.sortSelect) {
      elements.sortSelect.value = state.sortBy;
    }

    if (elements.savedOnlyBtn) {
      elements.savedOnlyBtn.setAttribute("aria-pressed", String(state.savedOnly));
    }

    updateClearButtonVisibility();
    updateActiveQuickTag();
    updateResetButtonVisibility();
    updateHeaderStats();
  }

  function updateClearButtonVisibility() {
    if (elements.clearSearchBtn) {
      elements.clearSearchBtn.hidden = state.query.length === 0;
    }
  }

  function updateActiveQuickTag() {
    var normalized = state.query.toLowerCase();
    elements.quickTags.forEach(function (button) {
      var q = (button.getAttribute("data-quick-query") || "").toLowerCase();
      button.classList.toggle("is-active", Boolean(normalized) && normalized === q);
    });
  }

  function updateResetButtonVisibility() {
    if (!elements.resetFiltersBtn) {
      return;
    }
    var hasActiveFilters =
      state.query !== "" ||
      state.category !== "all" ||
      state.maxTime !== "all" ||
      state.difficulty !== "all" ||
      state.sortBy !== "featured" ||
      state.savedOnly;
    elements.resetFiltersBtn.hidden = !hasActiveFilters;
  }

  function updateHeaderStats() {
    if (elements.totalCountEl) {
      elements.totalCountEl.textContent = String(RECIPES.length);
    }
    if (elements.savedCountEl) {
      elements.savedCountEl.textContent = String(state.savedIds.length);
    }
  }

  function updateUrlParams() {
    if (!window.history || !window.history.replaceState) {
      return;
    }
    var params = new URLSearchParams();
    if (state.query) {
      params.set("q", state.query);
    }
    if (state.category !== "all") {
      params.set("category", state.category);
    }
    var queryString = params.toString();
    var nextUrl = window.location.pathname + (queryString ? "?" + queryString : "");
    window.history.replaceState(null, "", nextUrl);
  }

  function getFilteredAndSortedRecipes() {
    var normalizedQuery = state.query.toLowerCase();
    var queryTokens = normalizedQuery ? normalizedQuery.split(/\s+/) : [];

    var filtered = RECIPES.filter(function (recipe) {
      if (state.category !== "all" && recipe.categories.indexOf(state.category) === -1) {
        return false;
      }

      if (state.maxTime !== "all" && recipe.timeMinutes > Number(state.maxTime)) {
        return false;
      }

      if (state.difficulty !== "all" && recipe.difficulty !== state.difficulty) {
        return false;
      }

      if (state.savedOnly && state.savedIds.indexOf(recipe.id) === -1) {
        return false;
      }

      if (queryTokens.length) {
        var searchableText = [
          recipe.title,
          recipe.categoryLabel,
          recipe.summary,
          recipe.author,
          recipe.difficulty,
          recipe.tags.join(" "),
          recipe.ingredients.join(" ")
        ]
          .join(" ")
          .toLowerCase();

        var matchesAllTokens = queryTokens.every(function (token) {
          if (token === "30-min" || token === "30min") {
            return recipe.timeMinutes <= 30 || searchableText.indexOf(token) !== -1;
          }
          return searchableText.indexOf(token) !== -1;
        });

        if (!matchesAllTokens) {
          return false;
        }
      }

      return true;
    });

    if (state.sortBy === "time-asc") {
      filtered.sort(function (a, b) {
        return a.timeMinutes - b.timeMinutes;
      });
    } else if (state.sortBy === "time-desc") {
      filtered.sort(function (a, b) {
        return b.timeMinutes - a.timeMinutes;
      });
    } else if (state.sortBy === "title-asc") {
      filtered.sort(function (a, b) {
        return a.title.localeCompare(b.title);
      });
    }

    return filtered;
  }

  function renderRecipes() {
    if (!elements.grid) {
      return;
    }

    var recipes = getFilteredAndSortedRecipes();
    elements.grid.innerHTML = "";

    recipes.forEach(function (recipe) {
      elements.grid.appendChild(createRecipeCard(recipe));
    });

    if (elements.emptyState) {
      elements.emptyState.hidden = recipes.length > 0;
    }

    updateResultsStatus(recipes.length);
  }

  function updateResultsStatus(count) {
    if (!elements.resultsStatus) {
      return;
    }

    var parts = [
      "Showing " + count + " of " + RECIPES.length + " " + (count === 1 ? "recipe" : "recipes")
    ];

    if (state.category !== "all") {
      parts.push("in " + CATEGORY_LABELS[state.category]);
    }
    if (state.query) {
      parts.push('for "' + state.query + '"');
    }
    if (state.savedOnly) {
      parts.push("(Saved only)");
    }

    elements.resultsStatus.textContent = parts.join(" ") + ".";
  }

  function createRecipeCard(recipe) {
    var isSaved = state.savedIds.indexOf(recipe.id) !== -1;
    var detailsUrl = "recipe-details.html?id=" + encodeURIComponent(recipe.id);

    var article = document.createElement("article");
    article.className = "card recipe-card";

    var banner = document.createElement("div");
    banner.className = "recipe-card-banner " + recipe.banner;
    banner.setAttribute("aria-hidden", "true");
    banner.appendChild(createRecipeImage(recipe, "recipe-card-image"));

    var badge = document.createElement("span");
    badge.className = "recipe-badge";
    badge.textContent = recipe.timeMinutes + " mins";
    banner.appendChild(badge);

    var body = document.createElement("div");
    body.className = "recipe-card-body";

    var categoryLabel = document.createElement("p");
    categoryLabel.className = "recipe-category-label";
    categoryLabel.textContent = recipe.categoryLabel;

    var title = document.createElement("h3");
    title.className = "recipe-title";
    var titleLink = document.createElement("a");
    titleLink.href = detailsUrl;
    titleLink.textContent = recipe.title;
    title.appendChild(titleLink);

    var excerpt = document.createElement("p");
    excerpt.className = "recipe-excerpt";
    excerpt.textContent = recipe.summary;

    var authorLine = document.createElement("p");
    authorLine.className = "recipe-author-line";
    authorLine.textContent = "By " + recipe.author;

    var footer = document.createElement("div");
    footer.className = "recipe-card-footer";

    var metaText = document.createElement("span");
    metaText.className = "recipe-meta-text";
    metaText.textContent = recipe.difficulty + " · " + recipe.servings;

    var actions = document.createElement("div");
    actions.className = "recipe-card-actions";

    var previewBtn = document.createElement("button");
    previewBtn.type = "button";
    previewBtn.className = "preview-btn";
    previewBtn.setAttribute("data-preview-recipe", recipe.id);
    previewBtn.textContent = "Quick View";

    var saveBtn = document.createElement("button");
    saveBtn.type = "button";
    saveBtn.className = "save-btn";
    saveBtn.setAttribute("data-save-recipe", recipe.id);
    setSaveButtonState(saveBtn, isSaved);

    var readLink = document.createElement("a");
    readLink.className = "recipe-read-link";
    readLink.href = detailsUrl;
    readLink.textContent = "Cook →";

    actions.appendChild(previewBtn);
    actions.appendChild(saveBtn);
    actions.appendChild(readLink);

    footer.appendChild(metaText);
    footer.appendChild(actions);

    body.appendChild(categoryLabel);
    body.appendChild(title);
    body.appendChild(excerpt);
    body.appendChild(authorLine);
    body.appendChild(footer);

    article.appendChild(banner);
    article.appendChild(body);

    return article;
  }

  function createArtSvg(artType) {
    var svgNS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("class", "recipe-thumb-svg");
    svg.setAttribute("viewBox", "0 0 240 120");

    var markupByType = {
      pasta:
        '<circle cx="120" cy="60" r="40" fill="#F5EBDD" stroke="#354C37" stroke-width="2.5"/>' +
        '<path d="M95 58c12-10 38-10 50 0M98 68c14 8 30 8 44 0" fill="none" stroke="#DDAA79" stroke-width="4" stroke-linecap="round"/>' +
        '<circle cx="136" cy="48" r="7" fill="#DDAA79" stroke="#493A30" stroke-width="1.5"/>' +
        '<path d="M104 50l10 8" stroke="#87966D" stroke-width="4" stroke-linecap="round"/>',
      stew:
        '<path d="M72 56h96c0 24-21 40-48 40s-48-16-48-40Z" fill="#F5EBDD" stroke="#354C37" stroke-width="2.5"/>' +
        '<circle cx="105" cy="54" r="6" fill="#DDAA79"/>' +
        '<circle cx="122" cy="52" r="6" fill="#DDAA79"/>' +
        '<circle cx="138" cy="55" r="5.5" fill="#87966D"/>' +
        '<path d="M102 35c0 4 4 4 4 8M120 32c0 4 4 4 4 8M136 35c0 4 4 4 4 8" fill="none" stroke="#354C37" stroke-width="2" stroke-linecap="round"/>',
      focaccia:
        '<rect x="70" y="34" width="100" height="56" rx="14" fill="#F5EBDD" stroke="#354C37" stroke-width="2.5"/>' +
        '<circle cx="98" cy="54" r="5" fill="#87966D"/>' +
        '<circle cx="122" cy="64" r="5" fill="#87966D"/>' +
        '<circle cx="146" cy="52" r="5" fill="#DDAA79"/>' +
        '<path d="M90 74c12-4 22-4 34 0M130 46l10 8" stroke="#493A30" stroke-width="2" stroke-linecap="round"/>',
      soup:
        '<circle cx="120" cy="64" r="36" fill="#F5EBDD" stroke="#354C37" stroke-width="2.5"/>' +
        '<circle cx="120" cy="64" r="26" fill="#DDAA79" fill-opacity="0.55"/>' +
        '<path d="M108 64c6-7 18-7 24 0" fill="none" stroke="#F5EBDD" stroke-width="3" stroke-linecap="round"/>' +
        '<path d="M148 42l14-14" stroke="#493A30" stroke-width="3" stroke-linecap="round"/>',
      roast:
        '<rect x="74" y="38" width="92" height="50" rx="10" fill="#F5EBDD" stroke="#354C37" stroke-width="2.5"/>' +
        '<ellipse cx="120" cy="63" rx="28" ry="15" fill="#DDAA79" stroke="#493A30" stroke-width="2"/>' +
        '<path d="M108 58c8 5 16 5 24 0" fill="none" stroke="#354C37" stroke-width="2" stroke-linecap="round"/>',
      crisp:
        '<circle cx="120" cy="62" r="36" fill="#F5EBDD" stroke="#354C37" stroke-width="2.5"/>' +
        '<circle cx="120" cy="62" r="24" fill="#DDAA79" fill-opacity="0.55"/>' +
        '<path d="M105 56l8 6 10-8 10 8" fill="none" stroke="#493A30" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<circle cx="120" cy="70" r="6" fill="#F5EBDD" stroke="#87966D" stroke-width="1.5"/>',
      pancakes:
        '<ellipse cx="120" cy="76" rx="44" ry="12" fill="#F5EBDD" stroke="#354C37" stroke-width="2.5"/>' +
        '<ellipse cx="120" cy="63" rx="38" ry="11" fill="#DDAA79" stroke="#493A30" stroke-width="2"/>' +
        '<ellipse cx="120" cy="51" rx="34" ry="10" fill="#DDAA79" stroke="#493A30" stroke-width="2"/>' +
        '<circle cx="110" cy="49" r="3.5" fill="#354C37"/>' +
        '<circle cx="128" cy="47" r="3.5" fill="#354C37"/>',
      skillet:
        '<circle cx="114" cy="62" r="34" fill="#F5EBDD" stroke="#354C37" stroke-width="2.5"/>' +
        '<path d="M148 62h32" stroke="#493A30" stroke-width="5" stroke-linecap="round"/>' +
        '<circle cx="104" cy="56" r="8" fill="#DDAA79"/>' +
        '<circle cx="124" cy="66" r="8" fill="#DDAA79"/>' +
        '<path d="M110 74l8-6" stroke="#87966D" stroke-width="3" stroke-linecap="round"/>'
    };

    svg.innerHTML = markupByType[artType] || markupByType.pasta;
    return svg;
  }

  function toggleSavedRecipe(recipeId) {
    var index = state.savedIds.indexOf(recipeId);
    if (index !== -1) {
      state.savedIds.splice(index, 1);
    } else {
      state.savedIds.push(recipeId);
    }

    persistSavedIds(STORAGE_KEY, state.savedIds);
    updateHeaderStats();

    var isNowSaved = state.savedIds.indexOf(recipeId) !== -1;
    var matchingButtons = document.querySelectorAll('[data-save-recipe="' + recipeId + '"]');
    matchingButtons.forEach(function (button) {
      setSaveButtonState(button, isNowSaved);
    });

    if (activeModalRecipeId === recipeId && elements.modalSaveBtn) {
      setSaveButtonState(elements.modalSaveBtn, isNowSaved);
    }

    if (state.savedOnly) {
      renderRecipes();
    }
  }

  function openRecipeModal(recipeId, triggerElement) {
    var recipe = RECIPES.find(function (item) {
      return item.id === recipeId;
    });

    if (!recipe || !elements.modal) {
      return;
    }

    activeModalRecipeId = recipe.id;
    lastFocusedElement = triggerElement || document.activeElement;

    elements.modalCategory.textContent = recipe.categoryLabel;
    elements.modalTitle.textContent = recipe.title;
    elements.modalMeta.textContent =
      recipe.timeMinutes + " mins · " + recipe.servings + " · " + recipe.difficulty;
    elements.modalSummary.textContent = recipe.summary;
    elements.modalAuthor.textContent = "By " + recipe.author;
    elements.modalFullLink.href = "recipe-details.html?id=" + encodeURIComponent(recipe.id);

  elements.modalBanner.className = "recipe-modal-banner " + recipe.banner;
elements.modalBanner.innerHTML = "";
elements.modalBanner.appendChild(
  createRecipeImage(recipe, "recipe-modal-image")
);

    elements.modalIngredients.innerHTML = "";
    recipe.ingredients.forEach(function (item) {
      var li = document.createElement("li");
      li.textContent = item;
      elements.modalIngredients.appendChild(li);
    });

    elements.modalSteps.innerHTML = "";
    recipe.steps.forEach(function (step) {
      var li = document.createElement("li");
      li.textContent = step;
      elements.modalSteps.appendChild(li);
    });

    setSaveButtonState(elements.modalSaveBtn, state.savedIds.indexOf(recipe.id) !== -1);

    elements.modal.hidden = false;
    document.body.style.overflow = "hidden";
    if (elements.modalCloseBtn) {
      elements.modalCloseBtn.focus();
    }
  }

  function closeRecipeModal() {
    if (!elements.modal || elements.modal.hidden) {
      return;
    }

    elements.modal.hidden = true;
    document.body.style.overflow = "";
    activeModalRecipeId = null;

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
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
});
