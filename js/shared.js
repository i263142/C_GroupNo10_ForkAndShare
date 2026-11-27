/**
 * FORK & SHARE — Shared Header & Navigation Script
 *
 * 1. Automatically injects the shared Brand Header and Primary Navigation into
 *    `<div id="site-header"></div>` (or prepends it to `<body>` when neither
 *    `#site-header` nor an existing `header.site-header` is present).
 * 2. Resolves relative links automatically between root pages (`index.html`)
 *    and subpages inside `pages/`.
 * 3. Highlights the active navigation item based on the current page URL.
 * 4. Manages the accessible mobile hamburger navigation menu.
 */

(function () {
  "use strict";

  var MOBILE_BREAKPOINT = 768;

  var NAV_ITEMS = [
    {
      label: "Home",
      file: "index.html",
      isRoot: true,
      matchFiles: ["index.html", "index", ""]
    },
    {
      label: "Explore",
      file: "explore.html",
      matchFiles: ["explore.html", "explore"]
    },
    {
      label: "Categories",
      file: "categories.html",
      matchFiles: ["categories.html", "categories"]
    },
    {
      label: "Meal Planner",
      file: "meal-planner.html",
      matchFiles: ["meal-planner.html", "meal-planner"]
    },
    {
      label: "Share a Recipe",
      file: "share-recipe.html",
      matchFiles: ["share-recipe.html", "share-recipe"]
    },
    {
      label: "Community",
      file: "community.html",
      matchFiles: ["community.html", "community"]
    },
    {
      label: "Profile",
      file: "profile.html",
      matchFiles: [
        "profile.html",
        "profile",
        "my-recipes.html",
        "my-recipes",
        "edit-recipe.html",
        "edit-recipe"
      ]
    }
  ];

  function isInsidePagesDir() {
    var path = (window.location.pathname || "").replace(/\\/g, "/");
    if (/\/pages(\/|$)/i.test(path)) {
      return true;
    }

    var scripts = document.querySelectorAll('script[src*="shared.js"]');
    for (var i = 0; i < scripts.length; i += 1) {
      var src = scripts[i].getAttribute("src") || "";
      if (src.indexOf("../") === 0) {
        return true;
      }
    }

    return false;
  }

  function getCurrentPageFilename(inPages) {
    var path = (window.location.pathname || "").replace(/\\/g, "/");
    var lastSegment = path.split("/").pop() || "";

    if (!lastSegment && !inPages) {
      return "index.html";
    }

    return lastSegment.toLowerCase();
  }

  function isNavItemActive(item, currentFile, inPages) {
    if (item.isRoot) {
      return !inPages && item.matchFiles.indexOf(currentFile) !== -1;
    }
    return item.matchFiles.indexOf(currentFile) !== -1;
  }

  function resolveHref(item, inPages) {
    if (item.isRoot) {
      return inPages ? "../" + item.file : item.file;
    }
    return inPages ? item.file : "pages/" + item.file;
  }

  function buildHeaderHTML() {
    var inPages = isInsidePagesDir();
    var currentFile = getCurrentPageFilename(inPages);
    var homeHref = inPages ? "../index.html" : "index.html";

    var navLinksHTML = NAV_ITEMS.map(function (item) {
      var href = resolveHref(item, inPages);
      var active = isNavItemActive(item, currentFile, inPages);
      var classes = active ? "nav-link is-active" : "nav-link";
      var ariaCurrent = active ? ' aria-current="page"' : "";

      return (
        '          <li><a class="' +
        classes +
        '" href="' +
        href +
        '"' +
        ariaCurrent +
        ">" +
        item.label +
        "</a></li>"
      );
    }).join("\n");

    return [
      '<header class="site-header">',
      '  <div class="container header-inner">',
      '    <a class="brand-logo" href="' + homeHref + '">',
      '      <span class="brand-name">FORK &amp; SHARE</span>',
      '      <span class="brand-tagline">Recipe Sharing Hub</span>',
      "    </a>",
      "",
      "    <button",
      '      type="button"',
      '      class="nav-toggle"',
      "      data-nav-toggle",
      '      aria-controls="primary-nav"',
      '      aria-expanded="false"',
      '      aria-label="Open navigation menu"',
      "    >",
      '      <span class="hamburger-line" aria-hidden="true"></span>',
      '      <span class="hamburger-line" aria-hidden="true"></span>',
      '      <span class="hamburger-line" aria-hidden="true"></span>',
      "    </button>",
      "  </div>",
      "",
      '  <nav class="site-nav" aria-label="Primary Navigation">',
      '    <div class="container">',
      '      <ul id="primary-nav" class="nav-list" data-nav-menu>',
      navLinksHTML,
      "      </ul>",
      "    </div>",
      "  </nav>",
      "</header>"
    ].join("\n");
  }

  function injectSharedHeader() {
    var headerMount = document.getElementById("site-header");
    if (headerMount) {
      headerMount.innerHTML = buildHeaderHTML();
      return;
    }

    // Preserve pages that still render a static <header class="site-header">
    if (!document.querySelector("header.site-header") && document.body) {
      document.body.insertAdjacentHTML("afterbegin", buildHeaderHTML());
    }
  }

  function initMobileNav() {
    var navToggle = document.querySelector("[data-nav-toggle]");
    var navMenu = document.querySelector("[data-nav-menu]");

    if (!navToggle || !navMenu || navToggle.dataset.navInitialized === "true") {
      return;
    }

    navToggle.dataset.navInitialized = "true";

    function setMenuState(isOpen) {
      navMenu.classList.toggle("is-open", isOpen);
      navToggle.classList.toggle("is-open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
      );
    }

    /* Ensure clean initial state */
    setMenuState(false);

    /* Toggle menu on hamburger button click */
    navToggle.addEventListener("click", function () {
      var currentlyOpen = navToggle.getAttribute("aria-expanded") === "true";
      setMenuState(!currentlyOpen);
    });

    /* Close menu when a navigation link is selected on mobile */
    navMenu.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        setMenuState(false);
      }
    });

    /* Close menu on Escape key and return focus to toggle button */
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
        setMenuState(false);
        navToggle.focus();
      }
    });

    /* Close menu if clicking outside the menu and toggle button */
    document.addEventListener("click", function (event) {
      var isOpen = navToggle.getAttribute("aria-expanded") === "true";
      if (!isOpen) {
        return;
      }

      if (!navMenu.contains(event.target) && !navToggle.contains(event.target)) {
        setMenuState(false);
      }
    });

    /* Reset mobile menu state when resizing up to desktop */
    window.addEventListener("resize", function () {
      if (window.innerWidth > MOBILE_BREAKPOINT) {
        setMenuState(false);
      }
    });
  }

  function init() {
    injectSharedHeader();
    initMobileNav();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
