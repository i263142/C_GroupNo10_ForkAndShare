/**
 * FORK & SHARE — Recipe Details Page Script
 * Displays recipe details, food images, and saved-recipe bookmarks.
 */

document.addEventListener("DOMContentLoaded", function () {
  var STORAGE_KEY = "forkAndShare_savedRecipes";

  var RECIPES = [
    {
      id: "creamy-lemon-asparagus-pasta",
      title: "Creamy Lemon Asparagus Pasta",
      categoryLabel: "Quick · Vegetarian",
      prepTimeMinutes: 8,
      cookTimeMinutes: 12,
      timeMinutes: 20,
      difficulty: "Easy",
      servings: "2 servings",
      author: "Chef Elena Rossi",
      banner: "banner-sage",
      art: "pasta",
      summary: "Bright lemon zest, crisp-tender spring asparagus, and silky parmesan sauce tossed with linguine.",
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
      prepTimeMinutes: 10,
      cookTimeMinutes: 15,
      timeMinutes: 25,
      difficulty: "Easy",
      servings: "4 servings",
      author: "Tariq Mansoor",
      banner: "banner-peach",
      art: "stew",
      summary: "Warm cumin, smoked paprika, ripe tomatoes, and wilted greens simmered into a cozy weeknight bowl.",
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
      prepTimeMinutes: 10,
      cookTimeMinutes: 25,
      timeMinutes: 35,
      difficulty: "Medium",
      servings: "8 slices",
      author: "Nadia Kowalski",
      banner: "banner-forest",
      art: "focaccia",
      summary: "Airy, olive-oil-rich focaccia topped with flaky sea salt and fresh garden rosemary sprigs.",
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
      prepTimeMinutes: 10,
      cookTimeMinutes: 25,
      timeMinutes: 35,
      difficulty: "Easy",
      servings: "4 servings",
      author: "Clara Bennett",
      banner: "banner-peach",
      art: "soup",
      summary: "Caramelized sweet carrots blended with fresh ginger root, coconut milk, and toasted pumpkin seeds.",
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
      prepTimeMinutes: 15,
      cookTimeMinutes: 30,
      timeMinutes: 45,
      difficulty: "Medium",
      servings: "4 servings",
      author: "Chef Maya Lin",
      banner: "banner-forest",
      art: "roast",
      summary: "Crisp golden skin, tender rosemary-infused meat, and a bright pan jus ready for Sunday supper.",
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
      prepTimeMinutes: 10,
      cookTimeMinutes: 35,
      timeMinutes: 40,
      difficulty: "Easy",
      servings: "6 servings",
      author: "Hannah Brooks",
      banner: "banner-sage",
      art: "crisp",
      summary: "Juicy cinnamon-kissed peaches baked beneath a golden brown-butter oat and pecan crumble.",
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
      prepTimeMinutes: 10,
      cookTimeMinutes: 10,
      timeMinutes: 20,
      difficulty: "Easy",
      servings: "4 servings",
      author: "Samir Patel",
      banner: "banner-peach",
      art: "pancakes",
      summary: "Fluffy whole-grain oat and buttermilk pancakes studded with blueberries and warm maple drizzle.",
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
      prepTimeMinutes: 6,
      cookTimeMinutes: 12,
      timeMinutes: 18,
      difficulty: "Easy",
      servings: "2 servings",
      author: "Lucia Fernandez",
      banner: "banner-sage",
      art: "skillet",
      summary: "Rich spiced tomato sauce simmered in one pan with gently set eggs, parsley, and crusty toast.",
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
      prepTimeMinutes: 15,
      cookTimeMinutes: 30,
      timeMinutes: 45,
      difficulty: "Medium",
      servings: "8 slices",
      author: "Jonas Meyer",
      banner: "banner-forest",
      art: "focaccia",
      summary: "Tangy blistered sourdough boule paired with lemon-herb whipped ricotta and flaky sea salt.",
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
      prepTimeMinutes: 5,
      cookTimeMinutes: 10,
      timeMinutes: 15,
      difficulty: "Easy",
      servings: "2 servings",
      author: "Marco Bellini",
      banner: "banner-peach",
      art: "pasta",
      summary: "Pan-seared pillowy potato gnocchi toasted in nutty brown butter with crispy sage and parmesan.",
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
      prepTimeMinutes: 15,
      cookTimeMinutes: 0,
      timeMinutes: 15,
      difficulty: "Easy",
      servings: "3 servings",
      author: "Amira Haddad",
      banner: "banner-sage",
      art: "soup",
      summary: "Refreshing meal-prep bowl of fluffy quinoa, chickpeas, cucumber, and bright lemon-oregano dressing.",
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
      prepTimeMinutes: 10,
      cookTimeMinutes: 35,
      timeMinutes: 45,
      difficulty: "Medium",
      servings: "8 slices",
      author: "Claire Dubois",
      banner: "banner-forest",
      art: "crisp",
      summary: "Tender almond-frangipane tart layered with poached pears, fragrant cardamom, and crisp pastry crust.",
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

  // Food image paths for all recipes
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

  function createRecipeImage(recipe) {
    var image = document.createElement("img");
    image.src = getRecipeImage(recipe);
    image.alt = recipe.title;
    image.className = "recipe-detail-image";
    image.loading = "lazy";
    image.style.width = "100%";
    image.style.height = "100%";
    image.style.objectFit = "cover";
    image.style.display = "block";
    return image;
  }

  var elements = {
    breadcrumbCurrent: document.getElementById("breadcrumb-current"),
    detailView: document.getElementById("recipe-detail-view"),
    notFoundView: document.getElementById("recipe-not-found"),
    mediaFrame: document.getElementById("recipe-media"),
    timeBadge: document.getElementById("recipe-time-badge"),
    categoryEl: document.getElementById("recipe-category"),
    titleEl: document.getElementById("recipe-title"),
    descriptionEl: document.getElementById("recipe-description"),
    authorEl: document.getElementById("recipe-author"),
    prepTimeEl: document.getElementById("recipe-prep-time"),
    cookTimeEl: document.getElementById("recipe-cook-time"),
    servingsEl: document.getElementById("recipe-servings"),
    difficultyEl: document.getElementById("recipe-difficulty"),
    saveBtn: document.getElementById("save-recipe-btn"),
    saveStatusMsg: document.getElementById("save-status-msg"),
    ingredientsList: document.getElementById("recipe-ingredients-list"),
    stepsList: document.getElementById("recipe-steps-list"),
    stepsCountNote: document.getElementById("steps-count-note"),
    tagsList: document.getElementById("recipe-tags-list")
  };

  var savedIds = loadSavedIds(STORAGE_KEY);
  var requestedId = getRecipeIdFromUrl();
  var recipe = findRecipeById(requestedId);

  if (!recipe) {
    showNotFoundState();
    return;
  }

  renderRecipeDetails(recipe);
  bindSaveAction(recipe.id);

  function getRecipeIdFromUrl() {
    var params = new URLSearchParams(window.location.search);
    var idParam = params.get("id");
    return idParam ? idParam.trim() : "";
  }

  function findRecipeById(rawId) {
    if (!rawId) {
      return null;
    }

    if (/^\d+$/.test(rawId)) {
      var numericIndex = parseInt(rawId, 10) - 1;
      if (numericIndex >= 0 && numericIndex < RECIPES.length) {
        return RECIPES[numericIndex];
      }
      return null;
    }

    var normalized = rawId.toLowerCase();

    for (var i = 0; i < RECIPES.length; i += 1) {
      if (RECIPES[i].id.toLowerCase() === normalized) {
        return RECIPES[i];
      }
    }

    return null;
  }

  function showNotFoundState() {
    document.title = "Recipe Not Found | FORK & SHARE";

    if (elements.breadcrumbCurrent) {
      elements.breadcrumbCurrent.textContent = "Recipe Not Found";
    }

    if (elements.detailView) {
      elements.detailView.hidden = true;
    }

    if (elements.notFoundView) {
      elements.notFoundView.hidden = false;
    }
  }

  function renderRecipeDetails(item) {
    document.title = item.title + " | FORK & SHARE";

    if (elements.notFoundView) {
      elements.notFoundView.hidden = true;
    }

    if (elements.detailView) {
      elements.detailView.hidden = false;
    }

    if (elements.breadcrumbCurrent) {
      elements.breadcrumbCurrent.textContent = item.title;
    }

    // Display real food image instead of the old SVG illustration
    if (elements.mediaFrame) {
      elements.mediaFrame.className = "recipe-media-frame " + item.banner;

      var oldSvg = elements.mediaFrame.querySelector("svg");
      if (oldSvg) {
        oldSvg.remove();
      }

      var oldImage = elements.mediaFrame.querySelector("img");
      if (oldImage) {
        oldImage.remove();
      }

      elements.mediaFrame.insertBefore(
        createRecipeImage(item),
        elements.timeBadge
      );
    }

    if (elements.timeBadge) {
      elements.timeBadge.textContent = item.timeMinutes + " mins total";
    }

    if (elements.categoryEl) {
      elements.categoryEl.textContent = item.categoryLabel;
    }

    if (elements.titleEl) {
      elements.titleEl.textContent = item.title;
    }

    if (elements.descriptionEl) {
      elements.descriptionEl.textContent = item.summary;
    }

    if (elements.authorEl) {
      elements.authorEl.textContent = "Shared by " + item.author;
    }

    if (elements.prepTimeEl) {
      elements.prepTimeEl.textContent = item.prepTimeMinutes + " mins";
    }

    if (elements.cookTimeEl) {
      elements.cookTimeEl.textContent =
        item.cookTimeMinutes === 0 ? "No cook" : item.cookTimeMinutes + " mins";
    }

    if (elements.servingsEl) {
      elements.servingsEl.textContent = item.servings;
    }

    if (elements.difficultyEl) {
      elements.difficultyEl.textContent = item.difficulty;
    }

    renderIngredients(item.ingredients);
    renderSteps(item.steps);
    renderTags(item.tags);
    syncSaveButton(savedIds.indexOf(item.id) !== -1, false);
  }

  function renderIngredients(ingredients) {
    if (!elements.ingredientsList) {
      return;
    }

    elements.ingredientsList.innerHTML = "";

    ingredients.forEach(function (ingredient, index) {
      var li = document.createElement("li");
      li.className = "ingredient-item";

      var label = document.createElement("label");
      label.className = "ingredient-label";
      label.setAttribute("for", "ingredient-" + index);

      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = "ingredient-" + index;
      checkbox.className = "ingredient-checkbox";

      var text = document.createElement("span");
      text.className = "ingredient-text";
      text.textContent = ingredient;

      label.appendChild(checkbox);
      label.appendChild(text);
      li.appendChild(label);
      elements.ingredientsList.appendChild(li);
    });
  }

  function renderSteps(steps) {
    if (!elements.stepsList) {
      return;
    }

    elements.stepsList.innerHTML = "";

    if (elements.stepsCountNote) {
      elements.stepsCountNote.textContent =
        steps.length + " simple " +
        (steps.length === 1 ? "step" : "steps") +
        " to follow.";
    }

    steps.forEach(function (step) {
      var li = document.createElement("li");
      li.className = "step-item";

      var p = document.createElement("p");
      p.className = "step-text";
      p.textContent = step;

      li.appendChild(p);
      elements.stepsList.appendChild(li);
    });
  }

  function renderTags(tags) {
    if (!elements.tagsList) {
      return;
    }

    elements.tagsList.innerHTML = "";

    tags.forEach(function (tag) {
      var link = document.createElement("a");
      link.className = "tag-link";
      link.href = "explore.html?q=" + encodeURIComponent(tag);
      link.textContent = "#" + tag;
      elements.tagsList.appendChild(link);
    });
  }

  function bindSaveAction(recipeId) {
    if (!elements.saveBtn) {
      return;
    }

    elements.saveBtn.addEventListener("click", function () {
      var index = savedIds.indexOf(recipeId);
      var isNowSaved = index === -1;

      if (isNowSaved) {
        savedIds.push(recipeId);
      } else {
        savedIds.splice(index, 1);
      }

      persistSavedIds(STORAGE_KEY, savedIds);
      syncSaveButton(isNowSaved, true);
    });
  }

  function syncSaveButton(isSaved, announceChange) {
    if (!elements.saveBtn) {
      return;
    }

    elements.saveBtn.classList.toggle("is-saved", isSaved);
    elements.saveBtn.setAttribute("aria-pressed", String(isSaved));
    elements.saveBtn.textContent = isSaved ? "Saved Recipe" : "Save Recipe";

    if (elements.saveStatusMsg) {
      if (announceChange) {
        elements.saveStatusMsg.textContent = isSaved
          ? "Saved to your Fork & Share bookmarks."
          : "Removed from your saved recipes.";
      } else {
        elements.saveStatusMsg.textContent = isSaved
          ? "This recipe is currently in your saved recipes."
          : "";
      }
    }
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