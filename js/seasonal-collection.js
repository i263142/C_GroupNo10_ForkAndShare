/**
 * FORK & SHARE — Seasonal Collection Page Script
 * File: js/seasonal-collection.js
 *
 * What this file does:
 *   1. Holds the data for all six seasonal collections.
 *   2. Builds the seasonal cards on the page from that data.
 *   3. Handles clicking on a seasonal card to show collection details.
 *   4. Handles the "Explore Collection" button on the Winter Warmers banner.
 *   5. Builds and displays Featured Recipes below the cards.
 *
 * NOTE: The hamburger navigation is handled by js/shared.js.
 *       Do not add navigation code here.
 */

/* ============================================================
   STEP 1 — SEASONAL COLLECTION DATA
   This array holds the information for all six seasonal cards.
   Each collection is an object with these properties:
     id          — a unique text ID (used to identify the card)
     name        — the season name shown on the card
     image       — path to the image (from the images/ folder)
     alt         — description of the image for screen readers
     description — a short description of the collection
     recipes     — an array of recipe names in this collection
   ============================================================ */
var seasonalCollections = [
  {
    id: "winter",
    name: "Winter",
    image: "../images/cat-soups.jpg",
    alt: "A steaming bowl of hot soup — perfect for cold winter days",
    description: "Warm and hearty recipes to keep you cosy through the cold months.",
    recipes: ["Nihari", "Hot Chocolate", "Chicken Corn Soup", "Gajar Ka Halwa"]
  },
  {
    id: "summer",
    name: "Summer",
    image: "../images/cat-drinks.jpg",
    alt: "Refreshing colourful drinks and smoothies for hot summer days",
    description: "Light, refreshing dishes and cool drinks to beat the summer heat.",
    recipes: ["Mango Lassi", "Fruit Chaat", "Cold Pasta Salad", "Lemonade"]
  },
  {
    id: "spring",
    name: "Spring",
    image: "../images/cat-salads.svg",
    alt: "A fresh green salad representing the freshness of spring",
    description: "Fresh and vibrant recipes celebrating the colours of spring.",
    recipes: ["Garden Salad", "Herb Omelette", "Lemon Chicken", "Spring Rolls"]
  },
  {
    id: "autumn",
    name: "Autumn",
    image: "../images/cat-karahi.jpg",
    alt: "A sizzling karahi dish with rich autumn flavours",
    description: "Rich and warming flavours that capture the essence of autumn.",
    recipes: ["Chicken Karahi", "Pumpkin Soup", "Apple Pie", "Roasted Vegetables"]
  },
  {
    id: "monsoon",
    name: "Monsoon",
    image: "../images/cat-halwapuri.jpg",
    alt: "Halwa puri — a classic comfort food enjoyed during the monsoon season",
    description: "Comforting snacks and hot treats for rainy monsoon days.",
    recipes: ["Halwa Puri", "Pakoras", "Chai", "Samosa Chaat"]
  },
  {
    id: "eid",
    name: "Eid",
    image: "../images/cat-biryani.jpg",
    alt: "A festive plate of biryani prepared for Eid celebrations",
    description: "Festive and celebratory dishes for joyous Eid gatherings.",
    recipes: ["Biryani", "Sheer Khurma", "Seekh Kebabs", "Korma"]
  }
];


/* ============================================================
   STEP 2 — FEATURED RECIPES DATA
   These recipes appear in the Featured Recipes section below
   the six seasonal cards, as shown in the prototype.
   ============================================================ */
var featuredRecipes = [
  {
    id: "nihari",
    name: "Nihari",
    season: "Winter",
    image: "../images/cat-nihari.jpg",
    alt: "A rich and spicy bowl of nihari, slow-cooked overnight"
  },
  {
    id: "biryani",
    name: "Biryani",
    season: "Eid",
    image: "../images/cat-biryani.jpg",
    alt: "A fragrant plate of biryani with layers of rice and meat"
  },
  {
    id: "samosa",
    name: "Samosa",
    season: "Monsoon",
    image: "../images/cat-samosa.jpg",
    alt: "Golden crispy samosas served with chutney"
  }
];


/* ============================================================
   STEP 3 — WAIT FOR THE PAGE TO FINISH LOADING
   Everything runs inside this block so the HTML elements
   exist before the JavaScript tries to find them.
   ============================================================ */
document.addEventListener("DOMContentLoaded", function () {

  /* ---- Get references to the HTML elements we need ---- */
  var grid = document.getElementById("seasonal-grid");
  var featuredGrid = document.getElementById("featured-recipes");
  var exploreBannerBtn = document.getElementById("explore-winter-warmers");


  /* ==========================================================
     STEP 4 — BUILD A SEASONAL CARD
     This function takes one collection object and returns a
     complete <article> element (the card) ready to put on page.
     ========================================================== */
  function buildSeasonalCard(collection) {
    /* Create the outer card element */
    var article = document.createElement("article");
    article.className = "seasonal-card";
    article.setAttribute("data-season", collection.id);
    article.setAttribute("role", "button");
    article.setAttribute("tabindex", "0");
    article.setAttribute("aria-label", "View " + collection.name + " collection");

    /*
      Build the card HTML.
      The card has two parts:
        1. Image wrapper
        2. Card body (season name)
    */
    article.innerHTML =
      '<div class="seasonal-card__image-wrapper">' +
        '<img' +
          ' class="seasonal-card__image"' +
          ' src="' + collection.image + '"' +
          ' alt="' + collection.alt + '"' +
          ' loading="lazy"' +
        '>' +
      '</div>' +
      '<div class="seasonal-card__body">' +
        '<h2 class="seasonal-card__name">' + collection.name + '</h2>' +
      '</div>';

    return article;
  }


  /* ==========================================================
     STEP 5 — BUILD A FEATURED RECIPE CARD
     ========================================================== */
  function buildFeaturedCard(recipe) {
    var article = document.createElement("article");
    article.className = "featured-card";

    article.innerHTML =
      '<div class="featured-card__image-wrapper">' +
        '<img' +
          ' class="featured-card__image"' +
          ' src="' + recipe.image + '"' +
          ' alt="' + recipe.alt + '"' +
          ' loading="lazy"' +
        '>' +
      '</div>' +
      '<div class="featured-card__body">' +
        '<h3 class="featured-card__name">' + recipe.name + '</h3>' +
        '<p class="featured-card__season">' + recipe.season + ' Collection</p>' +
        '<button' +
          ' type="button"' +
          ' class="btn btn-primary featured-card__btn"' +
          ' data-recipe="' + recipe.id + '"' +
          ' aria-label="View ' + recipe.name + ' recipe"' +
        '>View Recipe</button>' +
      '</div>';

    return article;
  }


  /* ==========================================================
     STEP 6 — RENDER ALL SEASONAL CARDS
     Builds and places all six seasonal cards into the grid.
     ========================================================== */
  function renderSeasonalCards() {
    grid.innerHTML = "";

    seasonalCollections.forEach(function (collection) {
      var card = buildSeasonalCard(collection);
      grid.appendChild(card);
    });
  }


  /* ==========================================================
     STEP 7 — RENDER FEATURED RECIPES
     Builds and places the featured recipe cards.
     ========================================================== */
  function renderFeaturedRecipes() {
    featuredGrid.innerHTML = "";

    featuredRecipes.forEach(function (recipe) {
      var card = buildFeaturedCard(recipe);
      featuredGrid.appendChild(card);
    });
  }


  /* ==========================================================
     STEP 8 — SHOW COLLECTION DETAILS
     When a seasonal card is clicked, show an informative message
     about the collection and its recipes.
     ========================================================== */
  function showCollectionDetails(collectionId) {
    var collection = seasonalCollections.find(function (c) {
      return c.id === collectionId;
    });

    if (collection) {
      alert(
        collection.name + " Collection\n\n" +
        collection.description + "\n\n" +
        "Popular recipes:\n• " +
        collection.recipes.join("\n• ") +
        "\n\nIn the full site, this will open the " +
        collection.name + " collection page."
      );
    }
  }


  /* ==========================================================
     STEP 9 — SEASONAL CARD CLICK HANDLER
     Uses event delegation — one listener on the grid catches
     all card clicks.
     ========================================================== */
  grid.addEventListener("click", function (event) {
    var card = event.target.closest("[data-season]");
    if (!card) {
      return;
    }

    var seasonId = card.getAttribute("data-season");
    showCollectionDetails(seasonId);
  });

  /* Allow keyboard activation (Enter or Space) on cards */
  grid.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") {
      var card = event.target.closest("[data-season]");
      if (!card) {
        return;
      }

      event.preventDefault();
      var seasonId = card.getAttribute("data-season");
      showCollectionDetails(seasonId);
    }
  });


  /* ==========================================================
     STEP 10 — EXPLORE COLLECTION BUTTON (BANNER)
     When "Explore Collection" on the Winter Warmers banner is
     clicked, show the Winter collection details.
     ========================================================== */
  exploreBannerBtn.addEventListener("click", function () {
    showCollectionDetails("winter");
  });


  /* ==========================================================
     STEP 11 — FEATURED RECIPE CLICK HANDLER
     Uses event delegation for View Recipe buttons.
     ========================================================== */
  featuredGrid.addEventListener("click", function (event) {
    var btn = event.target.closest("[data-recipe]");
    if (!btn) {
      return;
    }

    var recipeId = btn.getAttribute("data-recipe");
    var recipe = featuredRecipes.find(function (r) {
      return r.id === recipeId;
    });

    if (recipe) {
      alert(
        recipe.name + "\n\n" +
        "From the " + recipe.season + " Collection.\n\n" +
        "In the full site, this will open the full recipe page."
      );
    }
  });


  /* ==========================================================
     STEP 12 — FIRST RENDER
     Show all six seasonal cards and featured recipes when
     the page first loads.
     ========================================================== */
  renderSeasonalCards();
  renderFeaturedRecipes();

}); /* End of DOMContentLoaded */
