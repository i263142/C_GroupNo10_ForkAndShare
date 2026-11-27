/**
 * FORK & SHARE — Recipe Categories Page Script
 * File: js/recipe-categories.js
 *
 * What this file does:
 *   1. Holds the data for all six recipe categories.
 *   2. Builds the category cards on the page from that data.
 *   3. Filters the cards when the user types in the search bar.
 *   4. Filters the cards when the user changes the cuisine or diet dropdowns.
 *   5. Shows a friendly message when no cards match.
 *   6. Handles the "Explore" button on each card.
 *   7. Handles the "Reset Filters" button in the empty state.
 *
 * NOTE: The hamburger navigation is handled by js/shared.js.
 *       Do not add navigation code here.
 */

/* ============================================================
   STEP 1 — CATEGORY DATA
   This array holds the information for all six category cards.
   Each category is an object with these properties:
     id       — a unique text ID (used to identify the card)
     name     — the category name shown on the card
     image    — path to the food photo (from the images/ folder)
     alt      — description of the image for screen readers
     cuisines — which cuisine filters this category appears under
     diets    — which diet filters this category appears under
   ============================================================ */
var categories = [
  {
    id: "breakfast",
    name: "Breakfast",
    image: "../images/cat-breakfast.jpg",
    alt: "A warm breakfast spread with pancakes, eggs, and orange juice",
    cuisines: ["all", "american", "mediterranean", "pakistani"],
    diets: ["all", "vegetarian", "gluten-free"]
  },
  {
    id: "main-course",
    name: "Main Course",
    image: "../images/cat-maincourse.jpg",
    alt: "A plated grilled chicken main course with roasted vegetables",
    cuisines: ["all", "american", "italian", "mediterranean", "indian", "pakistani"],
    diets: ["all", "gluten-free", "dairy-free", "high-protein", "keto"]
  },
  {
    id: "desserts",
    name: "Desserts",
    image: "../images/cat-desserts.jpg",
    alt: "A selection of desserts including chocolate cake and macarons",
    cuisines: ["all", "italian", "american", "pakistani"],
    diets: ["all", "vegetarian"]
  },
  {
    id: "snacks",
    name: "Snacks",
    image: "../images/cat-snacks.jpg",
    alt: "A snack board with cheese, crackers, hummus, and mixed nuts",
    cuisines: ["all", "mediterranean", "american", "mexican", "pakistani", "indian"],
    diets: ["all", "vegetarian", "vegan", "gluten-free", "keto"]
  },
  {
    id: "soups",
    name: "Soups",
    image: "../images/cat-soups.jpg",
    alt: "A steaming bowl of creamy tomato bisque with fresh basil",
    cuisines: ["all", "italian", "asian", "american", "indian", "pakistani"],
    diets: ["all", "vegetarian", "vegan", "gluten-free", "dairy-free"]
  },
  {
    id: "drinks",
    name: "Drinks",
    image: "../images/cat-drinks.jpg",
    alt: "Colourful refreshing drinks including smoothies and iced coffee",
    cuisines: ["all", "american", "asian", "mediterranean", "pakistani"],
    diets: ["all", "vegetarian", "vegan", "gluten-free", "dairy-free"]
  }
];


/* ============================================================
   STEP 2 — WAIT FOR THE PAGE TO FINISH LOADING
   Everything runs inside this block so the HTML elements
   exist before the JavaScript tries to find them.
   ============================================================ */
document.addEventListener("DOMContentLoaded", function () {

  /* ---- Get references to the HTML elements we need ---- */
  var grid       = document.getElementById("categories-grid");
  var noResults  = document.getElementById("no-results");
  var searchInput  = document.getElementById("category-search");
  var cuisineSelect = document.getElementById("cuisine-filter");
  var dietSelect   = document.getElementById("diet-filter");
  var resetBtn   = document.getElementById("reset-filters");


  /* ==========================================================
     STEP 3 — BUILD A CARD
     This function takes one category object and returns a
     complete <article> element (the card) ready to put on page.
     ========================================================== */
  function buildCard(category) {
    /* Create the outer card element */
    var article = document.createElement("article");
    article.className = "category-card";
    article.setAttribute("data-id", category.id);

    /*
      Build the card HTML using a template string.
      The card has three parts:
        1. Image wrapper
        2. Card body (name + Explore button)
    */
    article.innerHTML =
      '<div class="category-card__image-wrapper">' +
        '<img' +
          ' class="category-card__image"' +
          ' src="' + category.image + '"' +
          ' alt="' + category.alt + '"' +
          ' loading="lazy"' +
        '>' +
      '</div>' +
      '<div class="category-card__body">' +
        '<h2 class="category-card__name">' + category.name + '</h2>' +
        '<button' +
          ' type="button"' +
          ' class="btn btn-primary category-card__btn"' +
          ' data-explore="' + category.id + '"' +
          ' aria-label="Explore ' + category.name + ' recipes"' +
        '>Explore</button>' +
      '</div>';

    return article;
  }


  /* ==========================================================
     STEP 4 — RENDER CARDS
     This function clears the grid and fills it with the cards
     that match the current search term and filter selections.
     It also shows or hides the "no results" message.
     ========================================================== */
  function renderCards() {

    /* Read what the user has typed and selected */
    var searchTerm   = searchInput.value.trim().toLowerCase();
    var selectedCuisine = cuisineSelect.value;
    var selectedDiet    = dietSelect.value;

    /* Filter the categories array — keep only matching ones */
    var matched = categories.filter(function (cat) {

      /* 1. Check if the category name contains the search text */
      var nameMatches = cat.name.toLowerCase().indexOf(searchTerm) !== -1;

      /*
        2. Check if the selected cuisine applies to this category.
           "all" always matches everything.
      */
      var cuisineMatches =
        selectedCuisine === "all" ||
        cat.cuisines.indexOf(selectedCuisine) !== -1;

      /*
        3. Check if the selected diet applies to this category.
           "all" always matches everything.
      */
      var dietMatches =
        selectedDiet === "all" ||
        cat.diets.indexOf(selectedDiet) !== -1;

      /* The category passes all three checks to be shown */
      return nameMatches && cuisineMatches && dietMatches;
    });

    /* Clear the grid so we can rebuild it */
    grid.innerHTML = "";

    if (matched.length === 0) {
      /* No categories matched — show the friendly message */
      noResults.removeAttribute("hidden");
    } else {
      /* Hide the "no results" message (if it was visible) */
      noResults.setAttribute("hidden", "");

      /* Build and add each matching card to the grid */
      matched.forEach(function (cat) {
        var card = buildCard(cat);
        grid.appendChild(card);
      });
    }
  }


  /* ==========================================================
     STEP 5 — EXPLORE BUTTON HANDLER
     When the user clicks "Explore" on a card, we show an alert
     telling them which category they picked. In a real finished
     site this would navigate to a filtered recipe list page.
     We use event delegation — one listener on the grid catches
     all button clicks so we don't need to add listeners to each
     card individually.
     ========================================================== */
  grid.addEventListener("click", function (event) {
    /* Find the button that was clicked (if any) */
    var btn = event.target.closest("[data-explore]");
    if (!btn) {
      return; /* Click was not on an Explore button — ignore it */
    }

    /* Get the category id stored on the button */
    var categoryId = btn.getAttribute("data-explore");

    /* Find the matching category object from our data */
    var cat = categories.find(function (c) {
      return c.id === categoryId;
    });

    if (cat) {
      /*
        Show a friendly message.
        In a real project this would go to a recipes page like:
          window.location.href = "explore.html?category=" + cat.id;
        For now, alert() lets you see it working clearly.
      */
      alert(
        "Exploring " + cat.name + " recipes!\n\n" +
        "In the full site, this button will take you to a list of " +
        cat.name.toLowerCase() + " recipes."
      );
    }
  });


  /* ==========================================================
     STEP 6 — FILTER EVENT LISTENERS
     Listen for any change in the search box or dropdowns,
     then re-render the cards to match the new selection.
     ========================================================== */

  /* Re-render every time the user types in the search box */
  searchInput.addEventListener("input", renderCards);

  /* Re-render when the cuisine dropdown changes */
  cuisineSelect.addEventListener("change", renderCards);

  /* Re-render when the diet dropdown changes */
  dietSelect.addEventListener("change", renderCards);


  /* ==========================================================
     STEP 7 — RESET FILTERS BUTTON
     Clicking "Reset Filters" in the empty state clears everything
     and shows all six cards again.
     ========================================================== */
  resetBtn.addEventListener("click", function () {
    searchInput.value   = "";           /* Clear the search box */
    cuisineSelect.value = "all";        /* Reset cuisine to "All" */
    dietSelect.value    = "all";        /* Reset diet to "All" */
    renderCards();                      /* Rebuild the full grid */
    searchInput.focus();                /* Move cursor back to search bar */
  });


  /* ==========================================================
     STEP 8 — FIRST RENDER
     Show all six cards when the page first loads.
     ========================================================== */
  renderCards();

}); /* End of DOMContentLoaded */
