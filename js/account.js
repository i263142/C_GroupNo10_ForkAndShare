/**
 * FORK & SHARE — User Account & Personalization Script
 * Handles authentication (login.html), profile management (profile.html),
 * and saved recipes (saved-recipes.html) via shared localStorage keys.
 * Author: Ibrar Ul Haq (26I-3142)
 */

(function () {
  "use strict";

  var STORAGE_KEYS = {
    USERS: "forkAndShare_users",
    CURRENT_USER: "forkAndShare_currentUser",
    SAVED_RECIPES: "forkAndShare_savedRecipes",
    SAVED_IDS: "forkAndShare_savedRecipeIds",
    SUBMITTED_RECIPES: "forkAndShare_submittedRecipes"
  };

  var DIETARY_OPTIONS = [
    "Halal",
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
    "Dairy-Free",
    "High-Protein",
    "Low-Carb",
    "Nut-Free"
  ];

  var AVATARS = [
    {
      id: "chef-green",
      label: "Forest Chef",
      svg:
        '<svg viewBox="0 0 80 80" aria-hidden="true">' +
        '<rect width="80" height="80" fill="#F5EBDD"/>' +
        '<circle cx="40" cy="30" r="14" fill="#354C37"/>' +
        '<path d="M16 74c2-15 11-24 24-24s22 9 24 24" fill="#87966D"/>' +
        '<path d="M26 21c0-7 6-12 14-12s14 5 14 12H26z" fill="#DDAA79"/>' +
        "</svg>"
    },
    {
      id: "herb-apron",
      label: "Sage Baker",
      svg:
        '<svg viewBox="0 0 80 80" aria-hidden="true">' +
        '<rect width="80" height="80" fill="#EDF5EE"/>' +
        '<circle cx="40" cy="31" r="13" fill="#493A30"/>' +
        '<path d="M18 74c2-14 10-22 22-22s20 8 22 22" fill="#354C37"/>' +
        '<rect x="31" y="54" width="18" height="14" rx="3" fill="#DDAA79"/>' +
        "</svg>"
    },
    {
      id: "warm-spice",
      label: "Warm Spice",
      svg:
        '<svg viewBox="0 0 80 80" aria-hidden="true">' +
        '<rect width="80" height="80" fill="#FDF5E8"/>' +
        '<circle cx="40" cy="30" r="13" fill="#87966D"/>' +
        '<path d="M16 74c3-14 11-22 24-22s21 8 24 22" fill="#493A30"/>' +
        '<circle cx="40" cy="30" r="6" fill="#F5EBDD"/>' +
        "</svg>"
    },
    {
      id: "olive-whisk",
      label: "Olive Whisk",
      svg:
        '<svg viewBox="0 0 80 80" aria-hidden="true">' +
        '<rect width="80" height="80" fill="#F5EBDD"/>' +
        '<circle cx="40" cy="31" r="14" fill="#DDAA79"/>' +
        '<path d="M17 74c2-14 11-22 23-22s21 8 23 22" fill="#354C37"/>' +
        '<path d="M27 21c3-7 8-10 13-10s10 3 13 10H27z" fill="#354C37"/>' +
        "</svg>"
    },
    {
      id: "harvest-leaf",
      label: "Harvest Leaf",
      svg:
        '<svg viewBox="0 0 80 80" aria-hidden="true">' +
        '<rect width="80" height="80" fill="#354C37"/>' +
        '<circle cx="40" cy="31" r="13" fill="#F5EBDD"/>' +
        '<path d="M18 74c2-14 10-22 22-22s20 8 22 22" fill="#87966D"/>' +
        '<circle cx="40" cy="31" r="6" fill="#DDAA79"/>' +
        "</svg>"
    }
  ];

  var DEFAULT_DEMO_USER = {
    id: "usr_ibrar_263142",
    fullName: "Ibrar ul haq",
    email: "ibrar47@example.com",
    password: "ForkShare1",
    avatar: "chef-green",
    bio: "Home cook sharing family Biryani recipes, crisp homemade pizza, and weeknight pasta bowls.",
    location: "Islamabad, Pakistan",
    skillLevel: "Home Chef",
    memberSince: "22 Nov, 2026",
    dietaryPreferences: ["Halal", "High-Protein"],
    newsletterOptIn: true,
    publicProfile: true,
    submittedCount: 4
  };

  var SAMPLE_SAVED_RECIPES = [
    {
      id: "rec_chicken_biryani",
      title: "Chicken Biryani",
      category: "South Asian",
      prepTime: "45 mins",
      servings: 4,
      difficulty: "Medium",
      author: "Ibrar ul haq",
      dietary: ["Halal", "Gluten-Free", "High-Protein"],
      image: "../images/recipe-chicken-biryani.jpg",
      imageAlt: "Overhead photograph of spiced Chicken Biryani with saffron basmati rice, caramelized onions, and fresh mint",
      description:
        "Fragrant basmati rice layered with spiced yogurt-marinated chicken, caramelized onions, and fresh mint.",
      ingredients: [
        "500g bone-in chicken pieces",
        "2 cups aged basmati rice, soaked 30 minutes",
        "2 large onions, thinly sliced and fried golden",
        "1/2 cup plain yogurt, 1 tbsp ginger-garlic paste",
        "1 tsp garam masala, 1/2 tsp turmeric, saffron pinch",
        "Fresh coriander and mint leaves"
      ],
      steps: [
        "Marinate chicken with yogurt, ginger-garlic paste, turmeric, chili, and half the fried onions for 30 minutes.",
        "Parboil soaked basmati rice with whole spices until 70% cooked and drain.",
        "Cook marinated chicken in a heavy pot for 12 minutes, then layer parboiled rice, herbs, and saffron milk on top.",
        "Seal and steam on low heat (dum) for 15 minutes before gently fluffing."
      ],
      savedAt: "2026-11-22T10:00:00.000Z"
    },
    {
      id: "rec_margherita_pizza",
      title: "Pizza",
      category: "Italian",
      prepTime: "30 mins",
      servings: 2,
      difficulty: "Easy",
      author: "Chef Amina",
      dietary: ["Vegetarian", "Halal"],
      image: "../images/recipe-pizza.jpg",
      imageAlt: "Wood-fired Margherita Pizza with blistered sourdough crust, crushed tomato sauce, mozzarella, and fresh basil",
      description:
        "Crisp stone-baked sourdough crust topped with crushed San Marzano tomatoes, mozzarella, and sweet basil.",
      ingredients: [
        "250g homemade or fresh pizza dough ball",
        "1/2 cup crushed plum tomatoes with pinch of sea salt",
        "120g fresh mozzarella, sliced",
        "Fresh basil leaves & 1 tbsp extra-virgin olive oil"
      ],
      steps: [
        "Preheat oven and baking stone to 245 C (475 F) for at least 20 minutes.",
        "Stretch dough onto floured parchment into a 12-inch round.",
        "Spread tomato sauce thinly, scatter mozzarella, and bake 9-11 minutes until blistered.",
        "Finish with fresh basil leaves and a drizzle of olive oil."
      ],
      savedAt: "2026-11-23T14:20:00.000Z"
    },
    {
      id: "rec_herb_pasta",
      title: "Pasta",
      category: "Italian",
      prepTime: "20 mins",
      servings: 3,
      difficulty: "Easy",
      author: "Tariq Mahmood",
      dietary: ["Vegetarian", "Halal"],
      image: "../images/recipe-pasta.jpg",
      imageAlt: "Ceramic bowl of garlic-herb penne pasta with blistered cherry tomatoes, basil, and shaved parmesan",
      description:
        "Silky garlic-herb penne tossed with roasted cherry tomatoes, toasted pine nuts, and aged parmesan.",
      ingredients: [
        "300g penne or rigatoni pasta",
        "3 cloves garlic, thinly sliced",
        "1 cup cherry tomatoes, halved",
        "2 tbsp olive oil, fresh parsley & basil",
        "1/3 cup grated parmesan & pasta cooking water"
      ],
      steps: [
        "Boil pasta in salted water until al dente, reserving 1/2 cup pasta water.",
        "Saute garlic gently in olive oil, add cherry tomatoes until blistered.",
        "Toss drained pasta with tomatoes, herbs, parmesan, and splashes of pasta water until glossy."
      ],
      savedAt: "2026-11-24T18:10:00.000Z"
    },
    {
      id: "rec_chickpea_curry",
      title: "Spiced Chickpea & Spinach Bowl",
      category: "Quick & Easy",
      prepTime: "25 mins",
      servings: 4,
      difficulty: "Easy",
      author: "Sara Khan",
      dietary: ["Vegan", "Vegetarian", "Gluten-Free", "Halal"],
      image: "../images/recipe-chickpea-bowl.jpg",
      imageAlt: "Spiced chickpea and baby spinach curry bowl with fresh coriander, lemon wedges, and warm flatbread",
      description:
        "Warm weeknight chana masala simmered with baby spinach, roasted cumin, ginger, and bright lemon.",
      ingredients: [
        "2 cans chickpeas, rinsed and drained",
        "2 cups baby spinach leaves",
        "1 onion, 2 tomatoes diced, 1 tbsp cumin & coriander",
        "Fresh lemon juice and toasted flatbread to serve"
      ],
      steps: [
        "Cook diced onions and spices in oil until fragrant, then stir in tomatoes.",
        "Add chickpeas and 1/2 cup water; simmer 10 minutes until thickened.",
        "Fold in baby spinach until wilted and finish with fresh lemon juice."
      ],
      savedAt: "2026-11-25T12:00:00.000Z"
    }
  ];

  /* ------------------------------------------------------------------------
     Storage Helpers
     ------------------------------------------------------------------------ */
  function readJSON(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (raw === null) {
        return fallback;
      }
      return JSON.parse(raw);
    } catch (err) {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      return false;
    }
  }

  function getUsers() {
    var users = readJSON(STORAGE_KEYS.USERS, null);
    if (!Array.isArray(users) || users.length === 0) {
      users = [Object.assign({}, DEFAULT_DEMO_USER)];
      writeJSON(STORAGE_KEYS.USERS, users);
    }
    return users;
  }

  function saveUsers(users) {
    writeJSON(STORAGE_KEYS.USERS, users);
  }

  function getCurrentUser() {
    return readJSON(STORAGE_KEYS.CURRENT_USER, null);
  }

  function setCurrentUser(user) {
    if (!user) {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      return;
    }
    writeJSON(STORAGE_KEYS.CURRENT_USER, user);
    var users = getUsers();
    var idx = users.findIndex(function (u) {
      return u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase();
    });
    if (idx >= 0) {
      users[idx] = user;
    } else {
      users.push(user);
    }
    saveUsers(users);
  }

  function normalizeRecipeImagePath(path) {
    if (!path) return "";
    if (/^images\//i.test(path)) {
      return "../" + path;
    }
    return path;
  }

  function resolveRecipeImage(recipe) {
    var fallbackSample =
      SAMPLE_SAVED_RECIPES.find(function (sample) {
        return (
          sample.id === recipe.id ||
          sample.title.toLowerCase() === String(recipe.title || "").toLowerCase()
        );
      }) || SAMPLE_SAVED_RECIPES[0];

    var rawPath = recipe.image || fallbackSample.image;
    return {
      src: normalizeRecipeImagePath(rawPath),
      alt:
        recipe.imageAlt ||
        fallbackSample.imageAlt ||
        (recipe.title ? recipe.title + " dish photograph" : "Fork & Share recipe photograph")
    };
  }

  function getSavedRecipes() {
    var raw = localStorage.getItem(STORAGE_KEYS.SAVED_RECIPES);
    if (raw === null) {
      writeJSON(STORAGE_KEYS.SAVED_RECIPES, SAMPLE_SAVED_RECIPES);
      writeJSON(
        STORAGE_KEYS.SAVED_IDS,
        SAMPLE_SAVED_RECIPES.map(function (r) {
          return r.id;
        })
      );
      return SAMPLE_SAVED_RECIPES.slice();
    }
    var parsed = readJSON(STORAGE_KEYS.SAVED_RECIPES, []);
    if (!Array.isArray(parsed)) return [];

    var updated = false;
    var hydrated = parsed.map(function (recipe) {
      if (!recipe || recipe.image) return recipe;
      var imgInfo = resolveRecipeImage(recipe);
      updated = true;
      return Object.assign({}, recipe, {
        image: imgInfo.src,
        imageAlt: imgInfo.alt
      });
    });
    if (updated) {
      writeJSON(STORAGE_KEYS.SAVED_RECIPES, hydrated);
    }
    return hydrated;
  }

  function setSavedRecipes(recipes) {
    writeJSON(STORAGE_KEYS.SAVED_RECIPES, recipes);
    writeJSON(
      STORAGE_KEYS.SAVED_IDS,
      recipes.map(function (r) {
        return r.id;
      })
    );
  }

  function getSubmittedCount(user) {
    var submitted = readJSON(STORAGE_KEYS.SUBMITTED_RECIPES, null);
    if (Array.isArray(submitted)) {
      return submitted.length;
    }
    return user && typeof user.submittedCount === "number" ? user.submittedCount : 0;
  }

  function getAvatarById(avatarId) {
    return (
      AVATARS.find(function (a) {
        return a.id === avatarId;
      }) || AVATARS[0]
    );
  }

  function formatCurrentDate() {
    var months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    var now = new Date();
    return now.getDate() + " " + months[now.getMonth()] + ", " + now.getFullYear();
  }

  function escapeHTML(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /* ------------------------------------------------------------------------
     Validation Helpers (Shared by Login, Sign Up & Edit Profile)
     ------------------------------------------------------------------------ */
  function validateFullName(value) {
    var trimmed = value.trim();
    if (!trimmed) {
      return { valid: false, message: "Full name is required." };
    }
    if (trimmed.length < 2) {
      return { valid: false, message: "Full name must be at least 2 characters." };
    }
    if (!/^[a-zA-Z\s'.-]+$/.test(trimmed)) {
      return {
        valid: false,
        message: "Use letters, spaces, hyphens, or apostrophes only."
      };
    }
    return { valid: true, message: "Looks good!" };
  }

  function validateEmail(value) {
    var trimmed = value.trim();
    if (!trimmed) {
      return { valid: false, message: "Email address is required." };
    }
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailPattern.test(trimmed)) {
      return { valid: false, message: "Enter a valid email address (e.g., ibrar@gmail.com)." };
    }
    return { valid: true, message: "Valid email format." };
  }

  function evaluatePassword(value) {
    var hasMinLength = value.length >= 8;
    var hasUppercase = /[A-Z]/.test(value);
    var hasNumber = /[0-9]/.test(value);
    var score = (hasMinLength ? 1 : 0) + (hasUppercase ? 1 : 0) + (hasNumber ? 1 : 0);

    var valid = hasMinLength && hasUppercase && hasNumber;
    var level = "weak";
    var label = "Weak";
    if (score === 2) {
      level = "medium";
      label = "Almost there";
    } else if (score === 3) {
      level = "strong";
      label = "Strong password";
    }

    var missing = [];
    if (!hasMinLength) missing.push("8+ characters");
    if (!hasUppercase) missing.push("an uppercase letter");
    if (!hasNumber) missing.push("a number");

    return {
      valid: valid,
      hasMinLength: hasMinLength,
      hasUppercase: hasUppercase,
      hasNumber: hasNumber,
      score: score,
      level: level,
      label: label,
      message: valid
        ? "Strong password meets all requirements."
        : "Password needs " + missing.join(", ") + "."
    };
  }

  function setFieldUI(inputEl, feedbackEl, state, message) {
    if (!inputEl || !feedbackEl) return;
    inputEl.classList.remove("is-invalid", "is-valid");
    feedbackEl.classList.remove("is-error", "is-success", "is-hint");
    inputEl.removeAttribute("aria-invalid");

    if (state === "error") {
      inputEl.classList.add("is-invalid");
      inputEl.setAttribute("aria-invalid", "true");
      feedbackEl.classList.add("is-error");
    } else if (state === "success") {
      inputEl.classList.add("is-valid");
      feedbackEl.classList.add("is-success");
    } else {
      feedbackEl.classList.add("is-hint");
    }
    feedbackEl.textContent = message || "";
  }

  function attachPasswordToggle(btn) {
    if (!btn) return;
    btn.addEventListener("click", function () {
      var targetId = btn.getAttribute("data-toggle-password");
      var input = document.getElementById(targetId);
      if (!input) return;
      var showing = input.type === "text";
      input.type = showing ? "password" : "text";
      btn.textContent = showing ? "Show" : "Hide";
      btn.setAttribute("aria-label", showing ? "Show password" : "Hide password");
    });
  }

  /* ------------------------------------------------------------------------
     Page 1: Sign Up / Login (pages/login.html)
     ------------------------------------------------------------------------ */
  function initLoginPage() {
    var signupTabBtn = document.getElementById("tab-signup");
    var loginTabBtn = document.getElementById("tab-login");
    var signupPanel = document.getElementById("panel-signup");
    var loginPanel = document.getElementById("panel-login");
    var alreadySignedBanner = document.getElementById("already-signed-banner");
    var fillDemoBtn = document.getElementById("fill-demo-login-btn");

    // Sign Up elements
    var signupForm = document.getElementById("signup-form");
    var signupName = document.getElementById("signup-name");
    var signupEmail = document.getElementById("signup-email");
    var signupPassword = document.getElementById("signup-password");
    var signupConfirm = document.getElementById("signup-confirm");
    var signupBanner = document.getElementById("signup-status-banner");

    var nameFeedback = document.getElementById("signup-name-feedback");
    var emailFeedback = document.getElementById("signup-email-feedback");
    var passwordFeedback = document.getElementById("signup-password-feedback");
    var confirmFeedback = document.getElementById("signup-confirm-feedback");

    var strengthBar = document.getElementById("strength-bar-fill");
    var strengthLabel = document.getElementById("strength-label");
    var ruleLength = document.getElementById("rule-length");
    var ruleUpper = document.getElementById("rule-upper");
    var ruleNumber = document.getElementById("rule-number");

    // Login elements
    var loginForm = document.getElementById("login-form");
    var loginEmail = document.getElementById("login-email");
    var loginPassword = document.getElementById("login-password");
    var loginEmailFeedback = document.getElementById("login-email-feedback");
    var loginPasswordFeedback = document.getElementById("login-password-feedback");
    var loginBanner = document.getElementById("login-status-banner");

    // Attach password visibility toggles
    document.querySelectorAll("[data-toggle-password]").forEach(attachPasswordToggle);

    function switchAuthTab(mode) {
      var isSignup = mode === "signup";
      signupTabBtn.classList.toggle("is-active", isSignup);
      loginTabBtn.classList.toggle("is-active", !isSignup);
      signupTabBtn.setAttribute("aria-selected", String(isSignup));
      loginTabBtn.setAttribute("aria-selected", String(!isSignup));
      signupPanel.hidden = !isSignup;
      loginPanel.hidden = isSignup;
    }

    signupTabBtn.addEventListener("click", function () {
      switchAuthTab("signup");
    });

    loginTabBtn.addEventListener("click", function () {
      switchAuthTab("login");
    });

    document.querySelectorAll("[data-switch-auth]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        switchAuthTab(btn.getAttribute("data-switch-auth"));
      });
    });

    // Check URL query or hash for initial mode
    var params = new URLSearchParams(window.location.search);
    if (params.get("tab") === "login" || window.location.hash === "#login") {
      switchAuthTab("login");
    } else {
      switchAuthTab("signup");
    }

    // Check if already logged in
    var activeUser = getCurrentUser();
    if (activeUser && alreadySignedBanner) {
      alreadySignedBanner.hidden = false;
      var activeNameEl = document.getElementById("already-signed-name");
      if (activeNameEl) {
        activeNameEl.textContent = activeUser.fullName;
      }
    }

    function showBanner(bannerEl, type, message) {
      if (!bannerEl) return;
      bannerEl.className = "status-banner status-banner--" + type;
      bannerEl.textContent = message;
      bannerEl.hidden = false;
    }

    function hideBanner(bannerEl) {
      if (bannerEl) {
        bannerEl.hidden = true;
        bannerEl.textContent = "";
      }
    }

    // Real-time Sign Up Validation
    function checkSignupName(showEmptyError) {
      var val = signupName.value;
      if (!val.trim() && !showEmptyError) {
        setFieldUI(signupName, nameFeedback, "hint", "Enter your full name (e.g., Ibrar ul haq).");
        return false;
      }
      var res = validateFullName(val);
      setFieldUI(signupName, nameFeedback, res.valid ? "success" : "error", res.message);
      return res.valid;
    }

    function checkSignupEmail(showEmptyError) {
      var val = signupEmail.value;
      if (!val.trim() && !showEmptyError) {
        setFieldUI(signupEmail, emailFeedback, "hint", "We will use this for your Fork & Share login.");
        return false;
      }
      var res = validateEmail(val);
      if (!res.valid) {
        setFieldUI(signupEmail, emailFeedback, "error", res.message);
        return false;
      }
      var exists = getUsers().some(function (u) {
        return u.email.toLowerCase() === val.trim().toLowerCase();
      });
      if (exists) {
        setFieldUI(
          signupEmail,
          emailFeedback,
          "error",
          "An account with this email already exists. Try logging in instead."
        );
        return false;
      }
      setFieldUI(signupEmail, emailFeedback, "success", "Email is available.");
      return true;
    }

    function updatePasswordMeter(val) {
      var info = evaluatePassword(val);
      var pct = val.length === 0 ? 0 : Math.round((info.score / 3) * 100);
      strengthBar.style.width = pct + "%";
      strengthBar.setAttribute("data-strength", info.level);
      strengthLabel.textContent =
        val.length === 0 ? "Strength: Enter a password" : "Strength: " + info.label;

      ruleLength.classList.toggle("is-met", info.hasMinLength);
      ruleUpper.classList.toggle("is-met", info.hasUppercase);
      ruleNumber.classList.toggle("is-met", info.hasNumber);
      return info;
    }

    function checkSignupPassword(showEmptyError) {
      var val = signupPassword.value;
      var info = updatePasswordMeter(val);
      if (!val && !showEmptyError) {
        setFieldUI(
          signupPassword,
          passwordFeedback,
          "hint",
          "Minimum 8 characters with an uppercase letter and a number."
        );
        return false;
      }
      if (!val && showEmptyError) {
        setFieldUI(signupPassword, passwordFeedback, "error", "Password is required.");
        return false;
      }
      setFieldUI(signupPassword, passwordFeedback, info.valid ? "success" : "error", info.message);
      return info.valid;
    }

    function checkSignupConfirm(showEmptyError) {
      var val = signupConfirm.value;
      var pwd = signupPassword.value;
      if (!val && !showEmptyError) {
        setFieldUI(signupConfirm, confirmFeedback, "hint", "Re-enter your password to confirm.");
        return false;
      }
      if (!val) {
        setFieldUI(signupConfirm, confirmFeedback, "error", "Please confirm your password.");
        return false;
      }
      if (val !== pwd) {
        setFieldUI(signupConfirm, confirmFeedback, "error", "Passwords do not match.");
        return false;
      }
      setFieldUI(signupConfirm, confirmFeedback, "success", "Passwords match.");
      return true;
    }

    signupName.addEventListener("input", function () {
      hideBanner(signupBanner);
      checkSignupName(false);
    });
    signupEmail.addEventListener("input", function () {
      hideBanner(signupBanner);
      checkSignupEmail(false);
    });
    signupPassword.addEventListener("input", function () {
      hideBanner(signupBanner);
      checkSignupPassword(true);
      if (signupConfirm.value) {
        checkSignupConfirm(true);
      }
    });
    signupConfirm.addEventListener("input", function () {
      hideBanner(signupBanner);
      checkSignupConfirm(true);
    });

    signupForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var okName = checkSignupName(true);
      var okEmail = checkSignupEmail(true);
      var okPassword = checkSignupPassword(true);
      var okConfirm = checkSignupConfirm(true);

      if (!okName || !okEmail || !okPassword || !okConfirm) {
        showBanner(
          signupBanner,
          "error",
          "Please fix the highlighted fields before creating your account."
        );
        return;
      }

      var newUser = {
        id: "usr_" + Date.now(),
        fullName: signupName.value.trim(),
        email: signupEmail.value.trim(),
        password: signupPassword.value,
        avatar: "chef-green",
        bio: "Excited to discover and share homemade recipes on Fork & Share!",
        location: "Kitchen Explorer",
        skillLevel: "Home Cook",
        memberSince: formatCurrentDate(),
        dietaryPreferences: ["Halal"],
        newsletterOptIn: true,
        publicProfile: true,
        submittedCount: 0
      };

      setCurrentUser(newUser);
      showBanner(
        signupBanner,
        "success",
        "Account created successfully! Redirecting to your profile..."
      );

      setTimeout(function () {
        window.location.href = "profile.html";
      }, 750);
    });

    // Real-time & Submit Login Validation
    function checkLoginEmail(showEmptyError) {
      var val = loginEmail.value;
      if (!val.trim() && !showEmptyError) {
        setFieldUI(loginEmail, loginEmailFeedback, "hint", "");
        return false;
      }
      var res = validateEmail(val);
      setFieldUI(
        loginEmail,
        loginEmailFeedback,
        res.valid ? "success" : "error",
        res.valid ? "" : res.message
      );
      return res.valid;
    }

    function checkLoginPassword(showEmptyError) {
      var val = loginPassword.value;
      if (!val && showEmptyError) {
        setFieldUI(loginPassword, loginPasswordFeedback, "error", "Enter your password.");
        return false;
      }
      if (val) {
        setFieldUI(loginPassword, loginPasswordFeedback, "hint", "");
      }
      return Boolean(val);
    }

    loginEmail.addEventListener("input", function () {
      hideBanner(loginBanner);
      checkLoginEmail(false);
    });

    loginPassword.addEventListener("input", function () {
      hideBanner(loginBanner);
      checkLoginPassword(false);
    });

    if (fillDemoBtn) {
      fillDemoBtn.addEventListener("click", function () {
        getUsers(); // ensure demo user exists
        switchAuthTab("login");
        loginEmail.value = DEFAULT_DEMO_USER.email;
        loginPassword.value = DEFAULT_DEMO_USER.password;
        checkLoginEmail(true);
        checkLoginPassword(true);
        showBanner(
          loginBanner,
          "info",
          "Demo credentials filled! Click Log In to continue to the profile."
        );
      });
    }

    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var okEmail = checkLoginEmail(true);
      var okPassword = checkLoginPassword(true);
      if (!okEmail || !okPassword) {
        showBanner(loginBanner, "error", "Please enter a valid email and password.");
        return;
      }

      var users = getUsers();
      var matched = users.find(function (u) {
        return (
          u.email.toLowerCase() === loginEmail.value.trim().toLowerCase() &&
          u.password === loginPassword.value
        );
      });

      if (!matched) {
        showBanner(
          loginBanner,
          "error",
          "Invalid email or password. Try again or use the Demo Account."
        );
        setFieldUI(loginPassword, loginPasswordFeedback, "error", "Incorrect credentials.");
        return;
      }

      setCurrentUser(matched);
      showBanner(loginBanner, "success", "Welcome back, " + matched.fullName + "! Redirecting...");
      setTimeout(function () {
        window.location.href = "profile.html";
      }, 650);
    });
  }

  /* ------------------------------------------------------------------------
     Page 2: User Profile (pages/profile.html)
     ------------------------------------------------------------------------ */
  function initProfilePage() {
    var guestCard = document.getElementById("guest-fallback-card");
    var workspace = document.getElementById("profile-workspace");
    var useDemoBtn = document.getElementById("use-demo-profile-btn");

    // Sidebar & Tab Elements
    var sidebarNavBtns = document.querySelectorAll("[data-profile-tab-trigger]");
    var tabButtons = document.querySelectorAll("[data-profile-tab]");
    var tabPanels = document.querySelectorAll("[data-profile-panel]");
    var logoutBtns = document.querySelectorAll("[data-logout-btn]");
    var sidebarSavedBadge = document.getElementById("sidebar-saved-count");

    // Summary Card Elements
    var avatarFrame = document.getElementById("profile-avatar-frame");
    var avatarPicker = document.getElementById("avatar-picker-options");
    var summaryName = document.getElementById("profile-summary-name");
    var summaryEmail = document.getElementById("profile-summary-email");
    var summaryMember = document.getElementById("profile-summary-member");
    var summarySkill = document.getElementById("profile-summary-skill");
    var summaryBio = document.getElementById("profile-summary-bio");
    var summaryTags = document.getElementById("profile-dietary-tags");
    var statSaved = document.getElementById("stat-saved-count");
    var statSubmitted = document.getElementById("stat-submitted-count");
    var statDietary = document.getElementById("stat-dietary-count");

    // Details Tab Elements
    var detailFullName = document.getElementById("detail-full-name");
    var detailEmail = document.getElementById("detail-email");
    var detailMemberSince = document.getElementById("detail-member-since");
    var detailLocation = document.getElementById("detail-location");
    var detailSkill = document.getElementById("detail-skill");
    var detailVisibility = document.getElementById("detail-visibility");

    // Dietary Tab Elements
    var dietaryGrid = document.getElementById("dietary-options-grid");
    var dietaryStatus = document.getElementById("dietary-status-banner");

    // Settings Tab Elements
    var toggleNewsletter = document.getElementById("setting-newsletter");
    var togglePublicProfile = document.getElementById("setting-public-profile");
    var passwordForm = document.getElementById("change-password-form");
    var currentPwdInput = document.getElementById("settings-current-password");
    var newPwdInput = document.getElementById("settings-new-password");
    var confirmPwdInput = document.getElementById("settings-confirm-password");
    var passwordSettingsBanner = document.getElementById("settings-password-banner");

    // Edit Modal Elements
    var openEditBtns = document.querySelectorAll("[data-open-edit-modal]");
    var editModal = document.getElementById("edit-profile-modal");
    var closeEditBtns = document.querySelectorAll("[data-close-edit-modal]");
    var editForm = document.getElementById("edit-profile-form");
    var editName = document.getElementById("edit-full-name");
    var editEmail = document.getElementById("edit-email");
    var editLocation = document.getElementById("edit-location");
    var editSkill = document.getElementById("edit-skill");
    var editBio = document.getElementById("edit-bio");
    var editNameFeedback = document.getElementById("edit-name-feedback");
    var editEmailFeedback = document.getElementById("edit-email-feedback");

    // Toast
    var toastBanner = document.getElementById("profile-toast");
    var toastMsg = document.getElementById("profile-toast-msg");
    var toastTimer = null;

    document.querySelectorAll("[data-toggle-password]").forEach(attachPasswordToggle);

    function showToast(message) {
      if (!toastBanner || !toastMsg) return;
      toastMsg.textContent = message;
      toastBanner.hidden = false;
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () {
        toastBanner.hidden = true;
      }, 3200);
    }

    function switchProfileTab(tabName) {
      tabButtons.forEach(function (btn) {
        var isMatch = btn.getAttribute("data-profile-tab") === tabName;
        btn.classList.toggle("is-active", isMatch);
        btn.setAttribute("aria-selected", String(isMatch));
      });
      sidebarNavBtns.forEach(function (btn) {
        var isMatch = btn.getAttribute("data-profile-tab-trigger") === tabName;
        btn.classList.toggle("is-active", isMatch);
      });
      tabPanels.forEach(function (panel) {
        panel.hidden = panel.getAttribute("data-profile-panel") !== tabName;
      });
    }

    tabButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        switchProfileTab(btn.getAttribute("data-profile-tab"));
      });
    });

    sidebarNavBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        switchProfileTab(btn.getAttribute("data-profile-tab-trigger"));
      });
    });

    if (window.location.hash === "#settings") {
      switchProfileTab("settings");
    } else if (window.location.hash === "#dietary") {
      switchProfileTab("dietary");
    }

    function renderAvatarPicker(user) {
      if (!avatarPicker) return;
      avatarPicker.innerHTML = "";
      AVATARS.forEach(function (av) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "avatar-option-btn" + (user.avatar === av.id ? " is-selected" : "");
        btn.setAttribute("aria-label", "Select " + av.label + " avatar");
        btn.setAttribute("title", av.label);
        btn.innerHTML = av.svg;
        btn.addEventListener("click", function () {
          var latest = getCurrentUser();
          if (!latest) return;
          latest.avatar = av.id;
          setCurrentUser(latest);
          renderProfile(latest);
          showToast("Avatar updated to " + av.label + ".");
        });
        avatarPicker.appendChild(btn);
      });
    }

    function renderDietaryGrid(user) {
      if (!dietaryGrid) return;
      dietaryGrid.innerHTML = "";
      var activePrefs = Array.isArray(user.dietaryPreferences) ? user.dietaryPreferences : [];

      DIETARY_OPTIONS.forEach(function (opt) {
        var isChecked = activePrefs.indexOf(opt) !== -1;
        var label = document.createElement("label");
        label.className = "diet-toggle-card" + (isChecked ? " is-checked" : "");

        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = isChecked;
        checkbox.value = opt;

        checkbox.addEventListener("change", function () {
          var current = getCurrentUser();
          if (!current) return;
          var list = Array.isArray(current.dietaryPreferences)
            ? current.dietaryPreferences.slice()
            : [];
          if (checkbox.checked) {
            if (list.indexOf(opt) === -1) list.push(opt);
          } else {
            list = list.filter(function (item) {
              return item !== opt;
            });
          }
          current.dietaryPreferences = list;
          setCurrentUser(current);
          renderProfile(current);
          if (dietaryStatus) {
            dietaryStatus.className = "status-banner status-banner--success";
            dietaryStatus.textContent = "Dietary preferences saved to your profile.";
            dietaryStatus.hidden = false;
          }
        });

        var span = document.createElement("span");
        span.textContent = opt;
        label.appendChild(checkbox);
        label.appendChild(span);
        dietaryGrid.appendChild(label);
      });
    }

    function renderProfile(user) {
      var savedCount = getSavedRecipes().length;
      if (sidebarSavedBadge) {
        sidebarSavedBadge.textContent = String(savedCount);
      }

      if (!user) {
        guestCard.hidden = false;
        workspace.hidden = true;
        return;
      }

      guestCard.hidden = true;
      workspace.hidden = false;

      var avatarObj = getAvatarById(user.avatar);
      avatarFrame.innerHTML = avatarObj.svg;
      summaryName.textContent = user.fullName;
      summaryEmail.textContent = user.email;
      summaryMember.textContent = "Member since " + (user.memberSince || "22 Nov, 2026");
      summarySkill.textContent = user.skillLevel || "Home Cook";
      summaryBio.textContent =
        user.bio || "Home cook exploring and sharing recipes on Fork & Share.";

      var prefs = Array.isArray(user.dietaryPreferences) ? user.dietaryPreferences : [];
      summaryTags.innerHTML = "";
      if (prefs.length === 0) {
        var emptyTag = document.createElement("span");
        emptyTag.className = "pill-tag";
        emptyTag.textContent = "No dietary tags selected";
        summaryTags.appendChild(emptyTag);
      } else {
        prefs.forEach(function (pref) {
          var badge = document.createElement("span");
          badge.className = "pill-tag";
          badge.textContent = pref;
          summaryTags.appendChild(badge);
        });
      }

      statSaved.textContent = String(savedCount);
      statSubmitted.textContent = String(getSubmittedCount(user));
      statDietary.textContent = String(prefs.length);

      detailFullName.textContent = user.fullName;
      detailEmail.textContent = user.email;
      detailMemberSince.textContent = user.memberSince || "22 Nov, 2026";
      detailLocation.textContent = user.location || "Not specified";
      detailSkill.textContent = user.skillLevel || "Home Cook";
      detailVisibility.textContent = user.publicProfile !== false ? "Public Community Profile" : "Private";

      if (toggleNewsletter) toggleNewsletter.checked = user.newsletterOptIn !== false;
      if (togglePublicProfile) togglePublicProfile.checked = user.publicProfile !== false;

      renderAvatarPicker(user);
      renderDietaryGrid(user);
    }

    // Settings Toggles
    if (toggleNewsletter) {
      toggleNewsletter.addEventListener("change", function () {
        var user = getCurrentUser();
        if (!user) return;
        user.newsletterOptIn = toggleNewsletter.checked;
        setCurrentUser(user);
        showToast("Email recipe digest preference updated.");
      });
    }

    if (togglePublicProfile) {
      togglePublicProfile.addEventListener("change", function () {
        var user = getCurrentUser();
        if (!user) return;
        user.publicProfile = togglePublicProfile.checked;
        setCurrentUser(user);
        renderProfile(user);
        showToast("Profile visibility updated.");
      });
    }

    // Change Password Form
    if (passwordForm) {
      passwordForm.addEventListener("submit", function (event) {
        event.preventDefault();
        var user = getCurrentUser();
        if (!user) return;

        if (currentPwdInput.value !== user.password) {
          passwordSettingsBanner.className = "status-banner status-banner--error";
          passwordSettingsBanner.textContent = "Current password does not match your account.";
          passwordSettingsBanner.hidden = false;
          return;
        }

        var pwdCheck = evaluatePassword(newPwdInput.value);
        if (!pwdCheck.valid) {
          passwordSettingsBanner.className = "status-banner status-banner--error";
          passwordSettingsBanner.textContent = pwdCheck.message;
          passwordSettingsBanner.hidden = false;
          return;
        }

        if (newPwdInput.value !== confirmPwdInput.value) {
          passwordSettingsBanner.className = "status-banner status-banner--error";
          passwordSettingsBanner.textContent = "New password and confirmation do not match.";
          passwordSettingsBanner.hidden = false;
          return;
        }

        user.password = newPwdInput.value;
        setCurrentUser(user);
        passwordForm.reset();
        passwordSettingsBanner.className = "status-banner status-banner--success";
        passwordSettingsBanner.textContent = "Password updated successfully.";
        passwordSettingsBanner.hidden = false;
      });
    }

    // Edit Profile Modal
    function openEditModal() {
      var user = getCurrentUser();
      if (!user || !editModal) return;
      editName.value = user.fullName || "";
      editEmail.value = user.email || "";
      editLocation.value = user.location || "";
      editSkill.value = user.skillLevel || "Home Cook";
      editBio.value = user.bio || "";
      setFieldUI(editName, editNameFeedback, "hint", "");
      setFieldUI(editEmail, editEmailFeedback, "hint", "");
      editModal.hidden = false;
      editName.focus();
    }

    function closeEditModal() {
      if (editModal) {
        editModal.hidden = true;
      }
    }

    openEditBtns.forEach(function (btn) {
      btn.addEventListener("click", openEditModal);
    });

    closeEditBtns.forEach(function (btn) {
      btn.addEventListener("click", closeEditModal);
    });

    if (editModal) {
      editModal.addEventListener("click", function (event) {
        if (event.target === editModal) {
          closeEditModal();
        }
      });
      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && !editModal.hidden) {
          closeEditModal();
        }
      });
    }

    if (editForm) {
      editForm.addEventListener("submit", function (event) {
        event.preventDefault();
        var nameRes = validateFullName(editName.value);
        var emailRes = validateEmail(editEmail.value);
        setFieldUI(editName, editNameFeedback, nameRes.valid ? "success" : "error", nameRes.message);
        setFieldUI(editEmail, editEmailFeedback, emailRes.valid ? "success" : "error", emailRes.message);

        if (!nameRes.valid || !emailRes.valid) {
          return;
        }

        var user = getCurrentUser();
        if (!user) return;
        user.fullName = editName.value.trim();
        user.email = editEmail.value.trim();
        user.location = editLocation.value.trim() || "Not specified";
        user.skillLevel = editSkill.value;
        user.bio = editBio.value.trim() || "Home cook sharing recipes on Fork & Share.";
        setCurrentUser(user);
        renderProfile(user);
        closeEditModal();
        showToast("Profile updated and saved!");
      });
    }

    // Demo Login & Log Out
    if (useDemoBtn) {
      useDemoBtn.addEventListener("click", function () {
        var demo = getUsers()[0] || Object.assign({}, DEFAULT_DEMO_USER);
        setCurrentUser(demo);
        renderProfile(demo);
        showToast("Signed in as " + demo.fullName + ".");
      });
    }

    logoutBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        setCurrentUser(null);
        renderProfile(null);
        showToast("You have been logged out.");
      });
    });

    renderProfile(getCurrentUser());
  }

  /* ------------------------------------------------------------------------
     Page 3: Saved Recipes (pages/saved-recipes.html)
     ------------------------------------------------------------------------ */
  function buildRecipeThumbnail(recipe) {
    var imgInfo = resolveRecipeImage(recipe);
    return (
      '<img class="recipe-thumb-img" src="' +
      escapeHTML(imgInfo.src) +
      '" alt="' +
      escapeHTML(imgInfo.alt) +
      '" loading="lazy">'
    );
  }

  function initSavedRecipesPage() {
    var grid = document.getElementById("saved-recipes-grid");
    var emptyState = document.getElementById("saved-empty-state");
    var noMatchesState = document.getElementById("saved-no-matches");
    var searchInput = document.getElementById("saved-search-input");
    var categorySelect = document.getElementById("saved-category-select");
    var sortSelect = document.getElementById("saved-sort-select");
    var chipRow = document.getElementById("category-chip-row");
    var resultsCountEl = document.getElementById("saved-results-count");
    var headerCountBadge = document.getElementById("saved-total-badge");
    var sidebarBadge = document.getElementById("sidebar-saved-count");
    var restoreSamplesBtn = document.getElementById("restore-samples-btn");
    var resetFiltersBtn = document.getElementById("reset-filters-btn");
    var sidebarLogoutBtn = document.getElementById("saved-sidebar-logout");
    var sidebarAccountNote = document.getElementById("saved-account-status");

    // Recipe Detail Modal
    var recipeModal = document.getElementById("recipe-detail-modal");
    var modalImage = document.getElementById("modal-recipe-image");
    var modalTitle = document.getElementById("modal-recipe-title");
    var modalMeta = document.getElementById("modal-recipe-meta");
    var modalDesc = document.getElementById("modal-recipe-desc");
    var modalIngredients = document.getElementById("modal-recipe-ingredients");
    var modalSteps = document.getElementById("modal-recipe-steps");
    var closeModalBtns = document.querySelectorAll("[data-close-recipe-modal]");

    // Undo Toast
    var toastBanner = document.getElementById("saved-toast");
    var toastMsg = document.getElementById("saved-toast-msg");
    var toastUndoBtn = document.getElementById("saved-toast-undo");
    var toastDismissBtn = document.getElementById("saved-toast-dismiss");
    var lastRemoved = null;
    var toastTimer = null;

    var state = {
      search: "",
      category: "All",
      sort: "recent"
    };

    // Update sidebar login/logout state
    var activeUser = getCurrentUser();
    if (sidebarAccountNote) {
      sidebarAccountNote.textContent = activeUser
        ? "Signed in as " + activeUser.fullName
        : "Browsing as Guest";
    }
    if (sidebarLogoutBtn) {
      if (!activeUser) {
        sidebarLogoutBtn.textContent = "Sign In / Register";
        sidebarLogoutBtn.addEventListener("click", function () {
          window.location.href = "login.html";
        });
      } else {
        sidebarLogoutBtn.addEventListener("click", function () {
          setCurrentUser(null);
          window.location.href = "login.html?tab=login";
        });
      }
    }

    function showUndoToast(removedRecipe, removedIndex) {
      lastRemoved = { recipe: removedRecipe, index: removedIndex };
      toastMsg.textContent = 'Removed "' + removedRecipe.title + '" from Saved Recipes.';
      toastBanner.hidden = false;
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () {
        toastBanner.hidden = true;
        lastRemoved = null;
      }, 6500);
    }

    if (toastUndoBtn) {
      toastUndoBtn.addEventListener("click", function () {
        if (!lastRemoved) return;
        var list = getSavedRecipes();
        var insertAt = Math.min(lastRemoved.index, list.length);
        list.splice(insertAt, 0, lastRemoved.recipe);
        setSavedRecipes(list);
        lastRemoved = null;
        toastBanner.hidden = true;
        renderAll();
      });
    }

    if (toastDismissBtn) {
      toastDismissBtn.addEventListener("click", function () {
        toastBanner.hidden = true;
        lastRemoved = null;
      });
    }

    function openRecipeModal(recipe) {
      var imgInfo = resolveRecipeImage(recipe);
      if (modalImage) {
        modalImage.src = imgInfo.src;
        modalImage.alt = imgInfo.alt;
        modalImage.hidden = false;
      }
      modalTitle.textContent = recipe.title;
      modalMeta.textContent =
        (recipe.category || "Homemade") +
        " • " +
        (recipe.prepTime || "30 mins") +
        " • Serves " +
        (recipe.servings || 2) +
        " • By " +
        (recipe.author || "Fork & Share");
      modalDesc.textContent = recipe.description || "";

      modalIngredients.innerHTML = "";
      (recipe.ingredients || []).forEach(function (ing) {
        var li = document.createElement("li");
        li.textContent = ing;
        modalIngredients.appendChild(li);
      });

      modalSteps.innerHTML = "";
      (recipe.steps || []).forEach(function (step) {
        var li = document.createElement("li");
        li.textContent = step;
        modalSteps.appendChild(li);
      });

      recipeModal.hidden = false;
    }

    function closeRecipeModal() {
      recipeModal.hidden = true;
    }

    closeModalBtns.forEach(function (btn) {
      btn.addEventListener("click", closeRecipeModal);
    });

    if (recipeModal) {
      recipeModal.addEventListener("click", function (event) {
        if (event.target === recipeModal) closeRecipeModal();
      });
      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && !recipeModal.hidden) closeRecipeModal();
      });
    }

    function syncCategoryChips(allRecipes) {
      if (!chipRow || !categorySelect) return;
      var categories = ["All"];
      allRecipes.forEach(function (r) {
        if (r.category && categories.indexOf(r.category) === -1) {
          categories.push(r.category);
        }
      });

      // Keep dropdown synced
      var currentVal = state.category;
      categorySelect.innerHTML = "";
      chipRow.innerHTML = "";

      categories.forEach(function (cat) {
        var opt = document.createElement("option");
        opt.value = cat;
        opt.textContent = cat === "All" ? "All Categories" : cat;
        categorySelect.appendChild(opt);

        var chip = document.createElement("button");
        chip.type = "button";
        chip.className = "category-chip" + (cat === currentVal ? " is-active" : "");
        chip.textContent = cat;
        chip.addEventListener("click", function () {
          state.category = cat;
          categorySelect.value = cat;
          renderAll();
        });
        chipRow.appendChild(chip);
      });

      if (categories.indexOf(currentVal) === -1) {
        state.category = "All";
      }
      categorySelect.value = state.category;
    }

    function getFilteredRecipes(allRecipes) {
      var query = state.search.trim().toLowerCase();
      var filtered = allRecipes.filter(function (recipe) {
        var matchesCat = state.category === "All" || recipe.category === state.category;
        if (!matchesCat) return false;
        if (!query) return true;
        var haystack = [
          recipe.title,
          recipe.category,
          recipe.description,
          recipe.author,
          (recipe.dietary || []).join(" ")
        ]
          .join(" ")
          .toLowerCase();
        return haystack.indexOf(query) !== -1;
      });

      if (state.sort === "az") {
        filtered.sort(function (a, b) {
          return a.title.localeCompare(b.title);
        });
      } else if (state.sort === "time") {
        filtered.sort(function (a, b) {
          return parseInt(a.prepTime, 10) - parseInt(b.prepTime, 10);
        });
      } else {
        filtered.sort(function (a, b) {
          return new Date(b.savedAt || 0) - new Date(a.savedAt || 0);
        });
      }

      return filtered;
    }

    function removeSavedRecipe(recipeId) {
      var all = getSavedRecipes();
      var idx = all.findIndex(function (r) {
        return r.id === recipeId;
      });
      if (idx === -1) return;
      var removed = all[idx];
      all.splice(idx, 1);
      setSavedRecipes(all);
      renderAll();
      showUndoToast(removed, idx);
    }

    function renderAll() {
      var allRecipes = getSavedRecipes();
      syncCategoryChips(allRecipes);

      if (headerCountBadge) {
        headerCountBadge.textContent =
          allRecipes.length + (allRecipes.length === 1 ? " recipe saved" : " recipes saved");
      }
      if (sidebarBadge) {
        sidebarBadge.textContent = String(allRecipes.length);
      }

      if (allRecipes.length === 0) {
        grid.innerHTML = "";
        emptyState.hidden = false;
        noMatchesState.hidden = true;
        resultsCountEl.textContent = "0 recipes saved";
        return;
      }

      emptyState.hidden = true;
      var visible = getFilteredRecipes(allRecipes);
      resultsCountEl.textContent =
        visible.length === allRecipes.length
          ? visible.length + (visible.length === 1 ? " result found" : " results found")
          : "Showing " + visible.length + " of " + allRecipes.length + " saved recipes";

      if (visible.length === 0) {
        grid.innerHTML = "";
        noMatchesState.hidden = false;
        return;
      }

      noMatchesState.hidden = true;
      grid.innerHTML = "";

      visible.forEach(function (recipe) {
        var card = document.createElement("article");
        card.className = "recipe-card";

        var dietaryMarkup = (recipe.dietary || [])
          .slice(0, 2)
          .map(function (tag) {
            return '<span class="pill-tag">' + escapeHTML(tag) + "</span>";
          })
          .join("");

        card.innerHTML =
          '<div class="recipe-thumb">' +
          buildRecipeThumbnail(recipe) +
          '<span class="recipe-category-badge">' +
          escapeHTML(recipe.category || "Homemade") +
          "</span>" +
          "</div>" +
          '<div class="recipe-body">' +
          '<h2 class="recipe-title">' +
          escapeHTML(recipe.title) +
          "</h2>" +
          '<p class="recipe-desc">' +
          escapeHTML(recipe.description || "") +
          "</p>" +
          '<div class="recipe-meta">' +
          "<span>Prep: " +
          escapeHTML(recipe.prepTime || "30 mins") +
          "</span>" +
          "<span>Serves " +
          escapeHTML(recipe.servings || 2) +
          "</span>" +
          "</div>" +
          (dietaryMarkup
            ? '<div class="profile-tags" style="margin-bottom:0.85rem">' + dietaryMarkup + "</div>"
            : "") +
          '<div class="recipe-actions">' +
          '<button type="button" class="btn btn-primary btn-sm" data-view-recipe="' +
          escapeHTML(recipe.id) +
          '">View Recipe</button>' +
          '<button type="button" class="btn btn-danger-outline btn-sm" data-remove-recipe="' +
          escapeHTML(recipe.id) +
          '">Remove</button>' +
          "</div>" +
          "</div>";

        card.querySelector("[data-view-recipe]").addEventListener("click", function () {
          openRecipeModal(recipe);
        });
        card.querySelector("[data-remove-recipe]").addEventListener("click", function () {
          removeSavedRecipe(recipe.id);
        });

        grid.appendChild(card);
      });
    }

    if (searchInput) {
      searchInput.addEventListener("input", function () {
        state.search = searchInput.value;
        renderAll();
      });
    }

    if (categorySelect) {
      categorySelect.addEventListener("change", function () {
        state.category = categorySelect.value;
        renderAll();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener("change", function () {
        state.sort = sortSelect.value;
        renderAll();
      });
    }

    if (resetFiltersBtn) {
      resetFiltersBtn.addEventListener("click", function () {
        state.search = "";
        state.category = "All";
        state.sort = "recent";
        if (searchInput) searchInput.value = "";
        if (sortSelect) sortSelect.value = "recent";
        renderAll();
      });
    }

    if (restoreSamplesBtn) {
      restoreSamplesBtn.addEventListener("click", function () {
        setSavedRecipes(SAMPLE_SAVED_RECIPES.slice());
        renderAll();
      });
    }

    renderAll();
  }

  /* ------------------------------------------------------------------------
     Bootstrap Page Based on <body data-account-page="...">
     ------------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", function () {
    var page = document.body.getAttribute("data-account-page");
    if (page === "login") {
      initLoginPage();
    } else if (page === "profile") {
      initProfilePage();
    } else if (page === "saved-recipes") {
      initSavedRecipesPage();
    }
  });
})();
