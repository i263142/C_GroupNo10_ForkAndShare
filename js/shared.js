/**
 * FORK & SHARE — Shared Navigation Script
 * Handles only the common mobile hamburger navigation menu and its
 * aria-expanded accessibility state across all pages.
 */

document.addEventListener("DOMContentLoaded", function () {
  var navToggle = document.querySelector("[data-nav-toggle]");
  var navMenu = document.querySelector("[data-nav-menu]");

  if (!navToggle || !navMenu) {
    return;
  }

  var MOBILE_BREAKPOINT = 768;

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
});
