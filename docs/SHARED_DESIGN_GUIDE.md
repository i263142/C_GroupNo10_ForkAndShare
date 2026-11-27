# FORK & SHARE — Shared Design Guide

Welcome to the shared design foundation for **FORK & SHARE — Recipe Sharing Hub**!

This guide explains the colours, layout structure, CSS classes, file paths, and reusable HTML template so all five team members can build pages that look and work like one unified website using **HTML, CSS, and vanilla JavaScript only** (no frameworks).

---

## 1. Agreed Colour Palette

Use these exact CSS variables from `css/style.css` instead of hardcoding colours:

| Colour Name | HEX Code | CSS Variable | Common Usage |
| :--- | :--- | :--- | :--- |
| **Cream** | `#F5EBDD` | `var(--cream)` | Page background, Brand Header background, Footer text, primary button text |
| **Forest Green** | `#354C37` | `var(--forest-green)` | Brand logo, headings, navigation text, Community Footer background, primary buttons |
| **Sage Green** | `#87966D` | `var(--sage-green)` | Tagline text, card borders, subtle dividers, secondary hover states |
| **Warm Peach** | `#DDAA79` | `var(--warm-peach)` | Accent borders, navigation hover highlights, secondary buttons, dark-background focus ring |
| **Dark Brown** | `#493A30` | `var(--dark-brown)` | Main body text, hover text states |

---

## 2. The Three Common Designs

Every page in the project must include these three shared designs:

1. **Brand Header**
   - Displays the website name **FORK & SHARE** and tagline **Recipe Sharing Hub** using a simple text-based logo.
   - Uses a **Cream (`#F5EBDD`)** background and **Forest Green (`#354C37`)** branding.

2. **Responsive Primary Navigation**
   - Includes these exact 7 menu items in order:
     `Home | Explore | Categories | Meal Planner | Share a Recipe | Community | Profile`
   - **Desktop (`> 768px`):** Displays as a horizontal menu bar.
   - **Mobile (`<= 768px`):** Collapses into a working hamburger menu button controlled by `js/shared.js`.

3. **Community Footer**
   - Includes **FORK & SHARE**, the links **About | Contact | Community**, and **© 2026 FORK & SHARE**.
   - Uses a **Forest Green (`#354C37`)** background and **Cream (`#F5EBDD`)** text.
   - Do **not** create separate About or Contact pages.

---

## 3. Header, Navigation & Footer Structure

Each HTML page follows the same semantic layout structure:

- `<header class="site-header">`
  - `.container.header-inner` holds the `.brand-logo` (`.brand-name` + `.brand-tagline`) and the mobile `.nav-toggle` hamburger button.
  - `<nav class="site-nav" aria-label="Primary Navigation">` holds `.container` and `<ul id="primary-nav" class="nav-list" data-nav-menu>` with the 7 `.nav-link` items.
- `<main class="site-main">`
  - Put your own page content inside `<div class="container"> ... </div>`.
- `<footer class="site-footer">`
  - `.container.footer-inner` holds `.footer-brand`, `<ul class="footer-links">` (`About`, `Contact`, `Community`), and `<p class="footer-copy">`.

Because `body` uses a flex-column layout and `.site-main` has `flex: 1`, the Community Footer automatically stays at the bottom of the screen even on short pages.

---

## 4. Shared CSS Class Names (`css/style.css`)

### Layout & Containers
- `.container` — Centers page content with a max-width of `1120px` and side padding.
- `.site-main` — Main content wrapper between header and footer.
- `.section` — Adds consistent bottom spacing between page sections.
- `.section-title` — Section heading with a Warm Peach bottom border.
- `.card` — Reusable content box with a Sage Green border and rounded corners.
- `.grid`, `.grid-2`, `.grid-3` — Responsive CSS Grid helpers for 2-column or 3-column layouts.
- `.sr-only` — Hides helper text visually while keeping it readable for screen readers.

### Brand Header
- `.site-header` — Top header wrapper (Cream background, Sage Green bottom border).
- `.header-inner` — Flex row aligning the logo and mobile hamburger button.
- `.brand-logo` — Clickable link wrapping the text-based logo.
- `.brand-name` — Styles `FORK & SHARE`.
- `.brand-tagline` — Styles `Recipe Sharing Hub`.

### Primary Navigation
- `.site-nav` — Navigation bar wrapper.
- `.nav-toggle` — Mobile hamburger button (`data-nav-toggle` attribute required for `shared.js`).
- `.hamburger-line` — Each of the 3 horizontal bars inside `.nav-toggle`.
- `.nav-list` — List of navigation links (`data-nav-menu` attribute required for `shared.js`).
- `.nav-link` — Individual navigation link.
- `.nav-link.is-active` (or `aria-current="page"`) — Highlights the current active page.

### Community Footer
- `.site-footer` — Bottom footer wrapper (Forest Green background, Cream text).
- `.footer-inner` — Responsive flex container for footer elements.
- `.footer-brand` — Styles `FORK & SHARE` in the footer.
- `.footer-links` — Horizontal list (`About | Contact | Community`) with automatic `|` separators.
- `.footer-link` — Individual footer link.
- `.footer-copy` — Copyright line (`© 2026 FORK & SHARE`).

### Buttons
- `.btn` — Base button styling (use together with one variant below).
- `.btn-primary` — Forest Green button with Cream text.
- `.btn-secondary` — Warm Peach button with Dark Brown text.
- `.btn-outline` — Transparent button with a Forest Green border.

### Accessibility
- `:focus-visible` is already styled globally for keyboard users (Forest Green outline on light backgrounds, Warm Peach outline inside the dark footer).
- Never remove `aria-expanded`, `aria-controls`, `data-nav-toggle`, or `data-nav-menu` from the hamburger button and navigation list—`js/shared.js` relies on them.

---

## 5. How to Connect `style.css` and `shared.js` (Relative Paths)

Your `<link>` and `<script>` paths depend on **where your HTML file is saved**:

### A. For the Root Home Page (`index.html` in the repository root)
- CSS inside `<head>`:
  ```html
  <link rel="stylesheet" href="css/style.css">
  ```
- JavaScript before `</body>`:
  ```html
  <script src="js/shared.js" defer></script>
  ```
- Navigation link paths from `index.html`:
  - Home: `index.html`
  - Other pages in `pages/`: `pages/explore.html`, `pages/categories.html`, etc.

### B. For Pages Inside the `pages/` Folder (`pages/your-page.html`)
Use `../` to step up one folder from `pages/` back to the repository root:
- CSS inside `<head>`:
  ```html
  <link rel="stylesheet" href="../css/style.css">
  ```
- JavaScript before `</body>`:
  ```html
  <script src="../js/shared.js" defer></script>
  ```
- Navigation link paths from inside `pages/`:
  - Home: `../index.html`
  - Other pages in `pages/`: `explore.html`, `categories.html`, etc.

> **Tip:** Remember to move `class="nav-link is-active"` and `aria-current="page"` to whichever menu item matches the page you are building.

---

## 6. Copy-Pasteable Reusable HTML Template

### Template for Pages Inside `pages/` (e.g., `pages/explore.html`)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Title | FORK &amp; SHARE</title>
  <!-- Common Stylesheet (use "css/style.css" if editing root index.html) -->
  <link rel="stylesheet" href="../css/style.css">
</head>
<body>
  <!-- Design 1: Brand Header + Design 2: Responsive Primary Navigation -->
  <header class="site-header">
    <div class="container header-inner">
      <a class="brand-logo" href="../index.html">
        <span class="brand-name">FORK &amp; SHARE</span>
        <span class="brand-tagline">Recipe Sharing Hub</span>
      </a>

      <button
        type="button"
        class="nav-toggle"
        data-nav-toggle
        aria-controls="primary-nav"
        aria-expanded="false"
        aria-label="Open navigation menu"
      >
        <span class="hamburger-line" aria-hidden="true"></span>
        <span class="hamburger-line" aria-hidden="true"></span>
        <span class="hamburger-line" aria-hidden="true"></span>
      </button>
    </div>

    <nav class="site-nav" aria-label="Primary Navigation">
      <div class="container">
        <ul id="primary-nav" class="nav-list" data-nav-menu>
          <!-- Update href values when all page filenames are finalized -->
          <!-- Move class="is-active" and aria-current="page" to your current page -->
          <li><a class="nav-link" href="../index.html">Home</a></li>
          <li><a class="nav-link is-active" href="explore.html" aria-current="page">Explore</a></li>
          <li><a class="nav-link" href="categories.html">Categories</a></li>
          <li><a class="nav-link" href="meal-planner.html">Meal Planner</a></li>
          <li><a class="nav-link" href="share-recipe.html">Share a Recipe</a></li>
          <li><a class="nav-link" href="community.html">Community</a></li>
          <li><a class="nav-link" href="profile.html">Profile</a></li>
        </ul>
      </div>
    </nav>
  </header>

  <!-- Your Page Content Goes Here -->
  <main class="site-main">
    <div class="container">
      <section class="section">
        <h1 class="section-title">Page Heading</h1>
        <div class="card">
          <p>Replace this section with your page content.</p>
          <a class="btn btn-primary" href="#">Primary Action</a>
          <a class="btn btn-secondary" href="#">Secondary Action</a>
        </div>
      </section>
    </div>
  </main>

  <!-- Design 3: Community Footer -->
  <footer class="site-footer">
    <div class="container footer-inner">
      <span class="footer-brand">FORK &amp; SHARE</span>

      <ul class="footer-links" aria-label="Footer Navigation">
        <!-- Do not create separate About or Contact pages -->
        <li><a class="footer-link" href="../index.html#about">About</a></li>
        <li><a class="footer-link" href="../index.html#contact">Contact</a></li>
        <li><a class="footer-link" href="community.html">Community</a></li>
      </ul>

      <p class="footer-copy">&copy; 2026 FORK &amp; SHARE</p>
    </div>
  </footer>

  <!-- Common JavaScript (use "js/shared.js" if editing root index.html) -->
  <script src="../js/shared.js" defer></script>
</body>
</html>
```

### Quick Adjustments for Root `index.html`

If you are building the root `index.html` page, copy the template above and make these path updates:

1. Stylesheet: `href="css/style.css"`
2. Script: `src="js/shared.js"`
3. Brand logo link: `href="index.html"`
4. Navigation links:
   - `Home` -> `href="index.html"` (add `is-active` and `aria-current="page"`)
   - All other nav links -> prefix with `pages/` (for example, `href="pages/explore.html"`)
5. Footer links:
   - `About` -> `href="#about"`
   - `Contact` -> `href="#contact"`
   - `Community` -> `href="pages/community.html"`
