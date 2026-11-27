/**
 * FORK & SHARE — My Recipes Page Logic (pages/my-recipes.html)
 *
 * Responsibilities:
 * 1. Render the responsive "My Recipes" card grid with the "Create New" action card
 *    always pinned first.
 * 2. Load and persist user recipes in localStorage (seeded with realistic mock data).
 * 3. Navigate to Submit Recipe ("share-recipe.html") on Create New click, and to
 *    Edit Recipe ("edit-recipe.html?id=...") with pre-filled recipe data on pencil
 *    icon click (stopping event propagation so card details don't open).
 * 4. Save the selected recipe to storage and navigate to
 *    Recipe Details ("recipe-details.html?id=...") when clicking a recipe card.
 * 5. Support search query & category filtering via in-body controls, URL params,
 *    custom events ("forkAndShare:filterChange"), and window.ForkAndShareMyRecipes.
 */

(function () {
  "use strict";

  /* ------------------------------------------------------------------------
     1. Configuration, Routes & Category Contract
     ------------------------------------------------------------------------ */
  var ROUTES = {
    createRecipe: "share-recipe.html",
    editRecipe: "edit-recipe.html",
    recipeDetails: "recipe-details.html"
  };

  var STORAGE_KEYS = {
    MY_RECIPES: "forkAndShare_myRecipes",
    EDIT_RECIPE_DRAFT: "forkAndShare_editRecipe",
    SELECTED_RECIPE: "forkAndShare_selectedRecipe"
  };

  var FALLBACK_IMAGE = "../images/meal-placeholder.jpg";

  var CATEGORIES = [
    "All",
    "Breakfast",
    "Lunch",
    "Snack",
    "Dinner",
    "Starter",
    "Dessert",
    "Sweet-Snack",
    "Hot",
    "Cold"
  ];

  /* ------------------------------------------------------------------------
     2. Initial Mock Recipes Dataset
     ------------------------------------------------------------------------ */
  var DEFAULT_RECIPES = [
    {
      id: "sandwiches",
      title: "Sandwiches",
      categories: ["Lunch", "Snack", "Cold"],
      prepTime: "10 mins",
      cookTime: "0 mins",
      servings: 2,
      image: "../images/meal-placeholder.jpg",
      imageAlt: "Freshly prepared garden club sandwiches plated for lunch",
      description:
        "Crisp cucumber, vine-ripened tomato, herb cream cheese, and shaved cheddar layered between toasted whole-grain slices.",
      ingredients: [
        "4 slices whole-grain sandwich bread",
        "3 tbsp herb cream cheese",
        "1/2 cucumber, thinly sliced",
        "1 ripe tomato, sliced",
        "2 slices sharp cheddar cheese",
        "Handful of baby arugula leaves",
        "Pinch of black pepper and sea salt"
      ],
      steps: [
        "Spread herb cream cheese evenly on all four slices of bread.",
        "Layer cheddar slices, cucumber ribbons, tomato, and baby arugula on two slices.",
        "Season lightly with salt and freshly cracked black pepper.",
        "Top with the remaining slices, press gently, and slice diagonally before serving."
      ]
    },
    {
      id: "nankhatai",
      title: "Nankhatai",
      categories: ["Dessert", "Sweet-Snack", "Snack"],
      prepTime: "15 mins",
      cookTime: "18 mins",
      servings: 16,
      image: "../images/meal-placeholder.jpg",
      imageAlt: "Traditional cardamom-scented Nankhatai shortbread cookies",
      description:
        "Melt-in-the-mouth traditional shortbread biscuits infused with green cardamom, nutmeg, and toasted almond slivers.",
      ingredients: [
        "1 cup all-purpose flour",
        "1/2 cup besan (gram flour)",
        "2 tbsp fine semolina (sooji)",
        "3/4 cup powdered sugar",
        "1/2 cup clarified butter (ghee), softened",
        "1/2 tsp green cardamom powder",
        "1/4 tsp baking powder",
        "2 tbsp sliced almonds for topping"
      ],
      steps: [
        "Cream softened ghee and powdered sugar together until pale and fluffy.",
        "Sift in all-purpose flour, besan, semolina, cardamom powder, and baking powder.",
        "Gently bring together into a smooth dough without over-kneading.",
        "Roll into small balls, flatten slightly, score a light cross, and press almond slivers on top.",
        "Bake at 165°C (330°F) for 16–18 minutes until lightly golden at the edges; cool completely."
      ]
    },
    {
      id: "spinach-feta-omelette",
      title: "Spinach & Feta Omelette",
      categories: ["Breakfast", "Hot"],
      prepTime: "5 mins",
      cookTime: "8 mins",
      servings: 2,
      image: "../images/spinach-feta-omelette.jpg",
      imageAlt: "Golden folded omelette filled with baby spinach, feta cheese, and dill",
      description:
        "Fluffy folded eggs filled with sautéed baby spinach, tangy crumbled feta cheese, and fragrant fresh dill.",
      ingredients: [
        "6 large eggs",
        "2 cups baby spinach",
        "1/2 cup crumbled feta cheese",
        "2 tbsp chopped fresh dill",
        "1 tbsp olive oil",
        "Salt and black pepper to taste"
      ],
      steps: [
        "Whisk eggs with a pinch of salt, pepper, and chopped dill.",
        "Wilt baby spinach in a warm non-stick skillet with olive oil.",
        "Pour in the whisked eggs and cook gently until edges set.",
        "Scatter feta over one half, fold carefully, and serve hot."
      ]
    },
    {
      id: "warm-berry-oat-bowl",
      title: "Warm Berry Oat Bowl",
      categories: ["Breakfast", "Sweet-Snack", "Hot"],
      prepTime: "5 mins",
      cookTime: "10 mins",
      servings: 2,
      image: "../images/oat-berry-bowl.jpg",
      imageAlt: "Warm berry and honey oat bowl topped with blueberries, banana, and walnuts",
      description:
        "Creamy rolled oats simmered with milk and topped with blueberries, banana slices, toasted walnuts, and wildflower honey.",
      ingredients: [
        "1 cup rolled oats",
        "2 cups milk or oat milk",
        "3/4 cup fresh blueberries",
        "1 ripe banana, sliced",
        "1/4 cup chopped walnuts",
        "2 tbsp wildflower honey"
      ],
      steps: [
        "Simmer rolled oats with milk over medium-low heat for 7–8 minutes, stirring occasionally.",
        "Spoon into warm bowls and top with banana slices, blueberries, and walnuts.",
        "Finish with a drizzle of wildflower honey and serve warm."
      ]
    },
    {
      id: "herb-chicken-flatbread",
      title: "Herb Chicken Flatbread",
      categories: ["Lunch", "Starter", "Hot"],
      prepTime: "10 mins",
      cookTime: "12 mins",
      servings: 2,
      image: "../images/herb-chicken-flatbread.jpg",
      imageAlt: "Whole-wheat flatbread topped with pesto, grilled herb chicken, arugula, and parmesan",
      description:
        "Crisp whole-wheat flatbread brushed with basil pesto and finished with grilled herb chicken, peppery arugula, and shaved parmesan.",
      ingredients: [
        "2 whole-wheat flatbreads",
        "300g grilled herb chicken breast, sliced",
        "3 tbsp basil pesto",
        "2 cups baby arugula",
        "1/4 cup shaved parmesan"
      ],
      steps: [
        "Warm flatbreads in a 200°C (400°F) oven for 4 minutes until lightly crisp.",
        "Spread basil pesto across each warm flatbread and arrange sliced chicken on top.",
        "Finish with baby arugula and shaved parmesan before slicing into shares."
      ]
    },
    {
      id: "coconut-red-lentil-curry",
      title: "Coconut Red Lentil Curry",
      categories: ["Dinner", "Hot"],
      prepTime: "10 mins",
      cookTime: "25 mins",
      servings: 4,
      image: "../images/coconut-red-lentil-curry.jpg",
      imageAlt: "Bowl of coconut red lentil and spinach curry served with basmati rice",
      description:
        "Velvety red lentils simmered with coconut milk, fresh ginger, turmeric, diced tomatoes, and wilted spinach.",
      ingredients: [
        "1 1/2 cups red lentils, rinsed",
        "1 can coconut milk",
        "1 can diced tomatoes",
        "3 cups baby spinach",
        "2 tbsp grated fresh ginger",
        "1 1/2 cups cooked basmati rice"
      ],
      steps: [
        "Sauté fresh ginger and spices briefly, then stir in rinsed red lentils, tomatoes, and coconut milk.",
        "Simmer gently for 20 minutes until lentils are tender and creamy.",
        "Fold in baby spinach until wilted and serve alongside steamed basmati rice."
      ]
    }
  ];

  /* ------------------------------------------------------------------------
     3. Application State & DOM Cache
     ------------------------------------------------------------------------ */
  var state = {
    recipes: [],
    searchQuery: "",
    categoryFilter: "All"
  };

  var dom = {};

  /* ------------------------------------------------------------------------
     4. Storage & URL Helpers
     ------------------------------------------------------------------------ */
  function cloneRecipe(recipe) {
    return JSON.parse(JSON.stringify(recipe));
  }

  function loadRecipes() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEYS.MY_RECIPES);
      if (!raw) {
        var initial = DEFAULT_RECIPES.map(cloneRecipe);
        window.localStorage.setItem(STORAGE_KEYS.MY_RECIPES, JSON.stringify(initial));
        return initial;
      }

      var parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (error) {
      // Fall back to in-memory default mock recipes if storage is unavailable
    }

    return DEFAULT_RECIPES.map(cloneRecipe);
  }

  function saveRecipes(recipes) {
    try {
      window.localStorage.setItem(STORAGE_KEYS.MY_RECIPES, JSON.stringify(recipes));
    } catch (error) {
      // Ignore storage quota / privacy-mode errors gracefully
    }
  }

  function normalizeCategory(value) {
    if (!value || typeof value !== "string") {
      return "All";
    }

    var trimmed = value.trim();
    var matched = CATEGORIES.find(function (cat) {
      return cat.toLowerCase() === trimmed.toLowerCase();
    });

    return matched || "All";
  }

  function readInitialFiltersFromContext() {
    var params = new URLSearchParams(window.location.search);
    var urlQuery = params.get("q") || params.get("search") || "";
    var urlCategory = params.get("category") || "";

    var rootQuery = dom.pageRoot ? dom.pageRoot.getAttribute("data-search-query") || "" : "";
    var rootCategory = dom.pageRoot ? dom.pageRoot.getAttribute("data-category-filter") || "" : "";

    state.searchQuery = (urlQuery || rootQuery).trim();
    state.categoryFilter = normalizeCategory(urlCategory || rootCategory);
  }

  function syncRootAttributes() {
    if (!dom.pageRoot) {
      return;
    }

    dom.pageRoot.setAttribute("data-search-query", state.searchQuery);
    dom.pageRoot.setAttribute("data-category-filter", state.categoryFilter);
  }

  /* ------------------------------------------------------------------------
     5. Filtering Logic
     ------------------------------------------------------------------------ */
  function getRecipeCategories(recipe) {
    if (Array.isArray(recipe.categories) && recipe.categories.length > 0) {
      return recipe.categories;
    }
    if (typeof recipe.category === "string" && recipe.category.trim()) {
      return [recipe.category.trim()];
    }
    return [];
  }

  function filterRecipes() {
    var query = state.searchQuery.trim().toLowerCase();
    var activeCategory = state.categoryFilter;

    return state.recipes.filter(function (recipe) {
      var categories = getRecipeCategories(recipe);

      var matchesCategory =
        activeCategory === "All" ||
        categories.some(function (cat) {
          return cat.toLowerCase() === activeCategory.toLowerCase();
        });

      if (!matchesCategory) {
        return false;
      }

      if (!query) {
        return true;
      }

      var searchableParts = [
        recipe.title || "",
        recipe.description || "",
        categories.join(" "),
        Array.isArray(recipe.ingredients) ? recipe.ingredients.join(" ") : ""
      ];

      return searchableParts.join(" ").toLowerCase().indexOf(query) !== -1;
    });
  }

  /* ------------------------------------------------------------------------
     6. Navigation Actions
     ------------------------------------------------------------------------ */
  function navigateToCreateRecipe(event) {
    var customEvent = new CustomEvent("forkAndShare:navigate", {
      cancelable: true,
      detail: {
        target: "create-recipe",
        url: ROUTES.createRecipe
      }
    });

    var shouldProceed = document.dispatchEvent(customEvent);
    if (!shouldProceed && event) {
      event.preventDefault();
    }
  }

  function handleEditRecipe(recipe, event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      window.localStorage.setItem(STORAGE_KEYS.EDIT_RECIPE_DRAFT, JSON.stringify(recipe));
      window.sessionStorage.setItem(STORAGE_KEYS.EDIT_RECIPE_DRAFT, JSON.stringify(recipe));
    } catch (error) {
      // Ignore storage restrictions; URL query param still identifies the recipe
    }

    var editUrl = ROUTES.editRecipe + "?id=" + encodeURIComponent(recipe.id);

    var customEvent = new CustomEvent("forkAndShare:editRecipe", {
      cancelable: true,
      detail: {
        recipe: cloneRecipe(recipe),
        url: editUrl
      }
    });

    var shouldProceed = document.dispatchEvent(customEvent);
    if (shouldProceed) {
      window.location.href = editUrl;
    }
  }

  function handleViewRecipe(recipe, event) {
    if (event) {
      event.preventDefault();
    }

    try {
      var serialized = JSON.stringify(recipe);
      window.localStorage.setItem(STORAGE_KEYS.SELECTED_RECIPE, serialized);
      window.sessionStorage.setItem(STORAGE_KEYS.SELECTED_RECIPE, serialized);
    } catch (error) {
      // Ignore storage restrictions; URL query param still identifies the recipe
    }

    var detailsUrl = ROUTES.recipeDetails + "?id=" + encodeURIComponent(recipe.id);

    var customEvent = new CustomEvent("forkAndShare:viewRecipe", {
      cancelable: true,
      detail: {
        recipe: cloneRecipe(recipe),
        url: detailsUrl
      }
    });

    var shouldProceed = document.dispatchEvent(customEvent);
    if (shouldProceed) {
      window.location.href = detailsUrl;
    }
  }

  /* ------------------------------------------------------------------------
     7. DOM Rendering
     ------------------------------------------------------------------------ */
  function createEditIconSvg() {
    var svgNS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "16");
    svg.setAttribute("height", "16");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");

    var path1 = document.createElementNS(svgNS, "path");
    path1.setAttribute("d", "M12 20h9");

    var path2 = document.createElementNS(svgNS, "path");
    path2.setAttribute("d", "M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z");

    svg.appendChild(path1);
    svg.appendChild(path2);
    return svg;
  }

  function createEmptyStateElement() {
    var emptyBox = document.createElement("div");
    emptyBox.className = "my-recipes-empty";
    emptyBox.setAttribute("role", "status");

    var iconWrap = document.createElement("span");
    iconWrap.className = "my-recipes-empty__icon";
    iconWrap.setAttribute("aria-hidden", "true");
    iconWrap.innerHTML =
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>';

    var heading = document.createElement("h2");
    heading.className = "my-recipes-empty__title";
    heading.textContent = "No matching recipes found";

    var copy = document.createElement("p");
    copy.className = "my-recipes-empty__copy";

    if (state.searchQuery && state.categoryFilter !== "All") {
      copy.textContent =
        'No recipes matched "' +
        state.searchQuery +
        '" in the ' +
        state.categoryFilter +
        " category. Try clearing your filters or create a new recipe.";
    } else if (state.searchQuery) {
      copy.textContent =
        'No recipes matched "' +
        state.searchQuery +
        '". Try a different search term or create a new recipe.';
    } else if (state.categoryFilter !== "All") {
      copy.textContent =
        "You do not have any recipes tagged under " +
        state.categoryFilter +
        " yet. Switch categories or add a new recipe.";
    } else {
      copy.textContent = "You have not added any recipes yet. Use Create New to share your first dish.";
    }

    var clearBtn = document.createElement("button");
    clearBtn.type = "button";
    clearBtn.className = "btn btn-outline";
    clearBtn.textContent = "Reset Filters";
    clearBtn.addEventListener("click", function () {
      resetFilters();
    });

    emptyBox.appendChild(iconWrap);
    emptyBox.appendChild(heading);
    emptyBox.appendChild(copy);
    if (state.searchQuery || state.categoryFilter !== "All") {
      emptyBox.appendChild(clearBtn);
    }

    return emptyBox;
  }

  function createRecipeCardElement(recipe) {
    var categories = getRecipeCategories(recipe);

    var card = document.createElement("article");
    card.className = "recipe-card recipe-card--item";
    card.dataset.recipeId = recipe.id;

    // Subtle top-right Edit button (pencil icon)
    var editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "recipe-card__edit-btn";
    editBtn.setAttribute("aria-label", "Edit " + recipe.title);
    editBtn.setAttribute("title", "Edit " + recipe.title);
    editBtn.appendChild(createEditIconSvg());
    editBtn.addEventListener("click", function (event) {
      handleEditRecipe(recipe, event);
    });

    // Top image thumbnail area
    var media = document.createElement("div");
    media.className = "recipe-card__media";

    var img = document.createElement("img");
    img.className = "recipe-card__img";
    img.src = recipe.image || FALLBACK_IMAGE;
    img.alt = recipe.imageAlt || recipe.title;
    img.loading = "lazy";
    img.onerror = function () {
      this.onerror = null;
      this.src = FALLBACK_IMAGE;
    };
    media.appendChild(img);

    // Card footer/body displaying title below image
    var body = document.createElement("div");
    body.className = "recipe-card__body";

    var title = document.createElement("h2");
    title.className = "recipe-card__title";

    var detailTrigger = document.createElement("button");
    detailTrigger.type = "button";
    detailTrigger.className = "recipe-card__detail-trigger";
    detailTrigger.textContent = recipe.title;
    detailTrigger.setAttribute("aria-label", "View recipe details for " + recipe.title);
    detailTrigger.addEventListener("click", function (event) {
      handleViewRecipe(recipe, event);
    });
    title.appendChild(detailTrigger);

    var meta = document.createElement("div");
    meta.className = "recipe-card__meta";

    var primaryCategory = document.createElement("span");
    primaryCategory.className = "recipe-card__category";
    primaryCategory.textContent = categories[0] || "Recipe";
    meta.appendChild(primaryCategory);

    if (recipe.prepTime || recipe.cookTime) {
      var timeText = document.createElement("span");
      timeText.className = "recipe-card__time";
      timeText.textContent = recipe.cookTime && recipe.cookTime !== "0 mins"
        ? recipe.cookTime
        : recipe.prepTime;
      meta.appendChild(timeText);
    }

    body.appendChild(title);
    body.appendChild(meta);

    card.appendChild(editBtn);
    card.appendChild(media);
    card.appendChild(body);

    return card;
  }

  function renderCategoryChips() {
    if (!dom.categoriesBar) {
      return;
    }

    dom.categoriesBar.innerHTML = "";
    CATEGORIES.forEach(function (category) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "category-chip" + (state.categoryFilter === category ? " is-active" : "");
      btn.textContent = category;
      btn.setAttribute("aria-pressed", String(state.categoryFilter === category));
      btn.addEventListener("click", function () {
        setCategoryFilter(category);
      });
      dom.categoriesBar.appendChild(btn);
    });
  }

  function renderGrid() {
    if (!dom.grid || !dom.createCard) {
      return;
    }

    syncRootAttributes();

    var filtered = filterRecipes();

    // Remove everything except the pinned "Create New" first card
    Array.prototype.slice.call(dom.grid.children).forEach(function (child) {
      if (child !== dom.createCard) {
        dom.grid.removeChild(child);
      }
    });

    if (filtered.length === 0) {
      dom.grid.appendChild(createEmptyStateElement());
    } else {
      filtered.forEach(function (recipe) {
        dom.grid.appendChild(createRecipeCardElement(recipe));
      });
    }

    if (dom.countLabel) {
      var total = state.recipes.length;
      dom.countLabel.textContent =
        filtered.length === total
          ? total + (total === 1 ? " recipe" : " recipes")
          : filtered.length + " of " + total + " shown";
    }
  }

  /* ------------------------------------------------------------------------
     8. Public Filter & Data API (for Shared Header Integration)
     ------------------------------------------------------------------------ */
  function setSearchQuery(query) {
    state.searchQuery = typeof query === "string" ? query : "";
    if (dom.searchInput && dom.searchInput.value !== state.searchQuery) {
      dom.searchInput.value = state.searchQuery;
    }
    renderGrid();
  }

  function setCategoryFilter(category) {
    state.categoryFilter = normalizeCategory(category);
    renderCategoryChips();
    renderGrid();
  }

  function setFilters(options) {
    if (!options || typeof options !== "object") {
      return;
    }
    if (Object.prototype.hasOwnProperty.call(options, "searchQuery")) {
      state.searchQuery = typeof options.searchQuery === "string" ? options.searchQuery : "";
    } else if (Object.prototype.hasOwnProperty.call(options, "query")) {
      state.searchQuery = typeof options.query === "string" ? options.query : "";
    }

    if (Object.prototype.hasOwnProperty.call(options, "category")) {
      state.categoryFilter = normalizeCategory(options.category);
    }

    if (dom.searchInput && dom.searchInput.value !== state.searchQuery) {
      dom.searchInput.value = state.searchQuery;
    }
    renderCategoryChips();
    renderGrid();
  }

  function resetFilters() {
    setFilters({ searchQuery: "", category: "All" });
  }

  /* ------------------------------------------------------------------------
     9. Event Binding & Initialization
     ------------------------------------------------------------------------ */
  function cacheDom() {
    dom.pageRoot = document.getElementById("my-recipes-page");
    dom.grid = document.getElementById("my-recipes-grid");
    dom.createCard = document.getElementById("create-new-recipe-card");
    dom.searchInput = document.getElementById("my-recipes-search");
    dom.categoriesBar = document.getElementById("my-recipes-categories");
    dom.countLabel = document.getElementById("my-recipes-count");
  }

  function bindEvents() {
    if (dom.createCard) {
      dom.createCard.setAttribute("href", ROUTES.createRecipe);
      dom.createCard.addEventListener("click", navigateToCreateRecipe);
    }

    if (dom.searchInput) {
      dom.searchInput.addEventListener("input", function (event) {
        setSearchQuery(event.target.value);
      });
    }

    // Listen for shared header search/filter events
    document.addEventListener("forkAndShare:filterChange", function (event) {
      if (event && event.detail) {
        setFilters(event.detail);
      }
    });

    document.addEventListener("forkAndShare:search", function (event) {
      if (event && event.detail) {
        setSearchQuery(event.detail.query || event.detail.searchQuery || "");
      }
    });

    document.addEventListener("forkAndShare:categoryChange", function (event) {
      if (event && event.detail) {
        setCategoryFilter(event.detail.category || "All");
      }
    });
  }

  function init() {
    cacheDom();
    state.recipes = loadRecipes();
    readInitialFiltersFromContext();

    if (dom.searchInput) {
      dom.searchInput.value = state.searchQuery;
    }

    bindEvents();
    renderCategoryChips();
    renderGrid();

    window.ForkAndShareMyRecipes = {
      CATEGORIES: CATEGORIES.slice(),
      ROUTES: Object.assign({}, ROUTES),
      setSearchQuery: setSearchQuery,
      setCategoryFilter: setCategoryFilter,
      setFilters: setFilters,
      resetFilters: resetFilters,
      getFilters: function () {
        return {
          searchQuery: state.searchQuery,
          category: state.categoryFilter
        };
      },
      getRecipes: function () {
        return state.recipes.map(cloneRecipe);
      },
      setRecipes: function (nextRecipes) {
        if (Array.isArray(nextRecipes)) {
          state.recipes = nextRecipes.map(cloneRecipe);
          saveRecipes(state.recipes);
          renderGrid();
        }
      }
    };
  }

  document.addEventListener("DOMContentLoaded", init);
})();
