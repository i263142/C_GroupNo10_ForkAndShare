/**
 * FORK & SHARE — Meal Planner Logic (pages/meal-planner.html)
 *
 * Responsibilities:
 * 1. Manage a multi-week, 7-day, 3-slot (Breakfast, Lunch, Dinner) meal plan.
 * 2. Populate the recipe selector dynamically from a structured JS dataset.
 * 3. Support searching, filtering, servings scaling, and custom meal entry.
 * 4. Render accessible meal images from ../images/ with safe fallback handling.
 * 5. Persist plans & sync shopping list ingredients via localStorage so
 *    weekly-schedule.html and shopping-list.html stay in sync.
 */

(function () {
  "use strict";

  /* ------------------------------------------------------------------------
     1. Storage Keys & Constants (Shared Contract Across Planner Pages)
     ------------------------------------------------------------------------ */
  var STORAGE_KEYS = {
    MEAL_PLANS: "forkAndShare_mealPlans",
    SHOPPING_LIST: "forkAndShare_shoppingList",
    RECIPE_CATALOG: "forkAndShare_recipes"
  };

  var FALLBACK_IMAGE = "../images/meal-placeholder.jpg";
  var FALLBACK_IMAGE_ALT =
    "Empty stoneware plate with fork, knife, and fresh sage sprig ready for a planned meal";

  var WEEKS = [
    { id: "week-1", label: "Week 1" },
    { id: "week-2", label: "Week 2" },
    { id: "week-3", label: "Week 3" },
    { id: "week-4", label: "Week 4" }
  ];

  var DAYS = [
    { id: "monday", label: "Monday", shortLabel: "Mon" },
    { id: "tuesday", label: "Tuesday", shortLabel: "Tue" },
    { id: "wednesday", label: "Wednesday", shortLabel: "Wed" },
    { id: "thursday", label: "Thursday", shortLabel: "Thu" },
    { id: "friday", label: "Friday", shortLabel: "Fri" },
    { id: "saturday", label: "Saturday", shortLabel: "Sat" },
    { id: "sunday", label: "Sunday", shortLabel: "Sun" }
  ];

  var MEAL_SLOTS = ["breakfast", "lunch", "dinner"];

  var SLOT_LABELS = {
    breakfast: "Breakfast",
    lunch: "Lunch",
    dinner: "Dinner"
  };

  /* ------------------------------------------------------------------------
     2. Realistic Recipe Dataset
     Every recipe maps to an existing meal image in ../images/ and includes
     { name, quantity, unit, category } ingredients so shopping-list.html
     can group and total items automatically.
     ------------------------------------------------------------------------ */
  var RECIPES = [
    {
      id: "oat-berry-bowl",
      title: "Warm Berry & Honey Oat Bowl",
      mealType: "breakfast",
      prepMinutes: 5,
      cookMinutes: 10,
      baseServings: 2,
      dietaryTags: ["Vegetarian", "Quick"],
      image: "../images/oat-berry-bowl.jpg",
      imageAlt: "Warm Berry and Honey Oat Bowl topped with blueberries, banana slices, and walnuts",
      description: "Creamy rolled oats simmered with milk, topped with blueberries, sliced banana, toasted walnuts, and wildflower honey.",
      ingredients: [
        { name: "Rolled oats", quantity: 1, unit: "cup", category: "Bakery & Grains" },
        { name: "Whole or oat milk", quantity: 2, unit: "cups", category: "Dairy & Eggs" },
        { name: "Fresh blueberries", quantity: 0.75, unit: "cup", category: "Produce" },
        { name: "Ripe banana", quantity: 1, unit: "whole", category: "Produce" },
        { name: "Chopped walnuts", quantity: 0.25, unit: "cup", category: "Pantry" },
        { name: "Honey", quantity: 2, unit: "tbsp", category: "Pantry" }
      ]
    },
    {
      id: "spinach-feta-omelette",
      title: "Spinach, Feta & Dill Folded Omelette",
      mealType: "breakfast",
      prepMinutes: 5,
      cookMinutes: 8,
      baseServings: 2,
      dietaryTags: ["Vegetarian", "High-Protein", "Quick"],
      image: "../images/spinach-feta-omelette.jpg",
      imageAlt: "Golden folded omelette filled with baby spinach, crumbled feta cheese, and fresh dill",
      description: "Fluffy three-egg omelettes folded around sautéed baby spinach, crumbled feta cheese, and fresh dill.",
      ingredients: [
        { name: "Large eggs", quantity: 6, unit: "whole", category: "Dairy & Eggs" },
        { name: "Baby spinach", quantity: 2, unit: "cups", category: "Produce" },
        { name: "Crumbled feta cheese", quantity: 0.5, unit: "cup", category: "Dairy & Eggs" },
        { name: "Fresh dill", quantity: 2, unit: "tbsp", category: "Produce" },
        { name: "Olive oil", quantity: 1, unit: "tbsp", category: "Pantry" }
      ]
    },
    {
      id: "herb-chicken-flatbread",
      title: "Grilled Herb Chicken & Pesto Flatbread",
      mealType: "lunch",
      prepMinutes: 10,
      cookMinutes: 12,
      baseServings: 2,
      dietaryTags: ["High-Protein"],
      image: "../images/herb-chicken-flatbread.jpg",
      imageAlt: "Whole-wheat flatbread topped with basil pesto, grilled herb chicken, arugula, and parmesan",
      description: "Warm whole-wheat flatbread spread with basil pesto, sliced lemon-herb chicken breast, arugula, and shaved parmesan.",
      ingredients: [
        { name: "Whole-wheat flatbreads", quantity: 2, unit: "pieces", category: "Bakery & Grains" },
        { name: "Chicken breast", quantity: 300, unit: "g", category: "Proteins" },
        { name: "Basil pesto", quantity: 3, unit: "tbsp", category: "Pantry" },
        { name: "Baby arugula", quantity: 2, unit: "cups", category: "Produce" },
        { name: "Shaved parmesan", quantity: 0.25, unit: "cup", category: "Dairy & Eggs" }
      ]
    },
    {
      id: "lemon-herb-salmon",
      title: "Pan-Seared Lemon Herb Salmon & Asparagus",
      mealType: "dinner",
      prepMinutes: 10,
      cookMinutes: 15,
      baseServings: 2,
      dietaryTags: ["Dairy-Free", "High-Protein"],
      image: "../images/lemon-herb-salmon.jpg",
      imageAlt: "Pan-seared lemon herb salmon fillet served with roasted asparagus spears and baby potatoes",
      description: "Crispy-skin salmon fillets basted with garlic, thyme, and lemon alongside tender roasted asparagus and baby potatoes.",
      ingredients: [
        { name: "Salmon fillets", quantity: 2, unit: "fillets", category: "Proteins" },
        { name: "Asparagus spears", quantity: 1, unit: "bunch", category: "Produce" },
        { name: "Baby potatoes", quantity: 400, unit: "g", category: "Produce" },
        { name: "Fresh lemon", quantity: 1, unit: "whole", category: "Produce" },
        { name: "Garlic cloves", quantity: 3, unit: "cloves", category: "Produce" },
        { name: "Olive oil", quantity: 2, unit: "tbsp", category: "Pantry" }
      ]
    },
    {
      id: "coconut-red-lentil-curry",
      title: "Coconut Red Lentil & Spinach Curry",
      mealType: "dinner",
      prepMinutes: 10,
      cookMinutes: 25,
      baseServings: 4,
      dietaryTags: ["Vegetarian", "Dairy-Free", "High-Protein"],
      image: "../images/coconut-red-lentil-curry.jpg",
      imageAlt: "Warm bowl of coconut red lentil and spinach curry served alongside steamed basmati rice",
      description: "Fragrant red lentils simmered in coconut milk with ginger, turmeric, and tomatoes, served over steamed basmati rice.",
      ingredients: [
        { name: "Red lentils", quantity: 1.5, unit: "cups", category: "Pantry" },
        { name: "Coconut milk", quantity: 1, unit: "can", category: "Pantry" },
        { name: "Basmati rice", quantity: 1.5, unit: "cups", category: "Bakery & Grains" },
        { name: "Baby spinach", quantity: 3, unit: "cups", category: "Produce" },
        { name: "Diced tomatoes", quantity: 1, unit: "can", category: "Pantry" },
        { name: "Fresh ginger", quantity: 2, unit: "tbsp", category: "Produce" }
      ]
    }
  ];

  /* ------------------------------------------------------------------------
     3. Application State & DOM References
     ------------------------------------------------------------------------ */
  var state = {
    mealPlans: null,
    activeModalSlot: null,
    lastFocusedTrigger: null
  };

  var dom = {};

  /* ------------------------------------------------------------------------
     4. LocalStorage Persistence & Migration Helpers
     ------------------------------------------------------------------------ */
  function createEmptyWeek(weekLabel) {
    var daysObj = {};
    DAYS.forEach(function (day) {
      daysObj[day.id] = {
        breakfast: null,
        lunch: null,
        dinner: null
      };
    });

    return {
      label: weekLabel,
      days: daysObj
    };
  }

  function createDefaultMealPlans() {
    var weeksObj = {};
    WEEKS.forEach(function (week) {
      weeksObj[week.id] = createEmptyWeek(week.label);
    });

    return {
      activeWeek: "week-1",
      activeDay: "monday",
      weeks: weeksObj
    };
  }

  function enrichMealWithImage(meal) {
    if (!meal || typeof meal !== "object") {
      return meal;
    }

    var matchedRecipe = RECIPES.find(function (r) {
      return r.id === meal.recipeId;
    });

    if (matchedRecipe) {
      if (!meal.image || meal.image.slice(-4) === ".png") {
        meal.image = matchedRecipe.image;
      }
      if (!meal.imageAlt) {
        meal.imageAlt = matchedRecipe.imageAlt;
      }
    } else {
      if (!meal.image) {
        meal.image = FALLBACK_IMAGE;
      }
      if (!meal.imageAlt) {
        meal.imageAlt = "Planned meal: " + (meal.title || "Recipe");
      }
    }

    return meal;
  }

  function loadMealPlans() {
    var fallback = createDefaultMealPlans();

    try {
      var raw = window.localStorage.getItem(STORAGE_KEYS.MEAL_PLANS);
      if (!raw) {
        return fallback;
      }

      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object" || !parsed.weeks) {
        return fallback;
      }

      // Ensure all expected weeks and days exist even if older/partial data is stored
      WEEKS.forEach(function (week) {
        if (!parsed.weeks[week.id]) {
          parsed.weeks[week.id] = createEmptyWeek(week.label);
        } else {
          parsed.weeks[week.id].label = week.label;
          if (!parsed.weeks[week.id].days) {
            parsed.weeks[week.id].days = {};
          }
          DAYS.forEach(function (day) {
            if (!parsed.weeks[week.id].days[day.id]) {
              parsed.weeks[week.id].days[day.id] = {
                breakfast: null,
                lunch: null,
                dinner: null
              };
            } else {
              MEAL_SLOTS.forEach(function (slotKey) {
                if (parsed.weeks[week.id].days[day.id][slotKey]) {
                  enrichMealWithImage(parsed.weeks[week.id].days[day.id][slotKey]);
                }
              });
            }
          });
        }
      });

      if (!parsed.weeks[parsed.activeWeek]) {
        parsed.activeWeek = "week-1";
      }
      if (!DAYS.some(function (d) { return d.id === parsed.activeDay; })) {
        parsed.activeDay = "monday";
      }

      return parsed;
    } catch (error) {
      return fallback;
    }
  }

  function saveMealPlans() {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.MEAL_PLANS,
        JSON.stringify(state.mealPlans)
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  function saveRecipeCatalogReference() {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.RECIPE_CATALOG,
        JSON.stringify(RECIPES)
      );
    } catch (error) {
      // Ignore storage quota errors for optional catalog cache
    }
  }

  /* ------------------------------------------------------------------------
     5. Recipe Scaling & Shopping List Generation
     ------------------------------------------------------------------------ */
  function roundQuantity(value) {
    var rounded = Math.round(value * 100) / 100;
    return Number.isInteger(rounded) ? rounded : Number(rounded.toFixed(2));
  }

  function scaleIngredients(ingredients, baseServings, targetServings) {
    var safeBase = baseServings > 0 ? baseServings : 1;
    var factor = targetServings / safeBase;

    return ingredients.map(function (item) {
      return {
        name: item.name,
        quantity: roundQuantity(item.quantity * factor),
        unit: item.unit,
        category: item.category || "Pantry"
      };
    });
  }

  function buildAssignedMealFromRecipe(recipe, targetServings) {
    var safeServings = clampServings(targetServings);

    return {
      recipeId: recipe.id,
      title: recipe.title,
      mealType: recipe.mealType,
      prepMinutes: recipe.prepMinutes,
      cookMinutes: recipe.cookMinutes,
      baseServings: recipe.baseServings,
      servings: safeServings,
      dietaryTags: recipe.dietaryTags.slice(),
      image: recipe.image || FALLBACK_IMAGE,
      imageAlt: recipe.imageAlt || ("Meal photo of " + recipe.title),
      description: recipe.description,
      baseIngredients: recipe.ingredients.map(function (ing) {
        return {
          name: ing.name,
          quantity: ing.quantity,
          unit: ing.unit,
          category: ing.category || "Pantry"
        };
      }),
      ingredients: scaleIngredients(recipe.ingredients, recipe.baseServings, safeServings),
      updatedAt: new Date().toISOString()
    };
  }

  function generateShoppingListForWeek(weekId) {
    var week = state.mealPlans.weeks[weekId];
    var aggregatedMap = {};
    var mealCount = 0;

    // Preserve checked state for items already ticked off in shopping-list.html
    var existingCheckedMap = {};
    try {
      var prevRaw = window.localStorage.getItem(STORAGE_KEYS.SHOPPING_LIST);
      if (prevRaw) {
        var prevData = JSON.parse(prevRaw);
        if (prevData && prevData.weekId === weekId && Array.isArray(prevData.items)) {
          prevData.items.forEach(function (item) {
            existingCheckedMap[item.id] = Boolean(item.checked);
          });
        }
      }
    } catch (error) {
      // Ignore malformed previous shopping list data
    }

    DAYS.forEach(function (day) {
      var dayMeals = week.days[day.id];
      MEAL_SLOTS.forEach(function (slotKey) {
        var meal = dayMeals[slotKey];
        if (!meal) {
          return;
        }

        mealCount += 1;
        var items = Array.isArray(meal.ingredients) ? meal.ingredients : [];

        items.forEach(function (ing) {
          var normalizedName = ing.name.trim().toLowerCase();
          var normalizedUnit = (ing.unit || "").trim().toLowerCase();
          var mapKey = normalizedName + "__" + normalizedUnit;

          if (!aggregatedMap[mapKey]) {
            aggregatedMap[mapKey] = {
              id: mapKey,
              name: ing.name.trim(),
              quantity: 0,
              unit: ing.unit || "",
              category: ing.category || "Pantry",
              checked: Boolean(existingCheckedMap[mapKey]),
              sources: []
            };
          }

          aggregatedMap[mapKey].quantity = roundQuantity(
            aggregatedMap[mapKey].quantity + (Number(ing.quantity) || 1)
          );

          var sourceLabel = day.shortLabel + " " + SLOT_LABELS[slotKey] + ": " + meal.title;
          if (aggregatedMap[mapKey].sources.indexOf(sourceLabel) === -1) {
            aggregatedMap[mapKey].sources.push(sourceLabel);
          }
        });
      });
    });

    var itemsList = Object.keys(aggregatedMap)
      .map(function (key) {
        return aggregatedMap[key];
      })
      .sort(function (a, b) {
        if (a.category !== b.category) {
          return a.category.localeCompare(b.category);
        }
        return a.name.localeCompare(b.name);
      });

    var payload = {
      weekId: weekId,
      weekLabel: week.label,
      mealCount: mealCount,
      generatedAt: new Date().toISOString(),
      items: itemsList
    };

    try {
      window.localStorage.setItem(STORAGE_KEYS.SHOPPING_LIST, JSON.stringify(payload));
    } catch (error) {
      return null;
    }

    return payload;
  }

  /* ------------------------------------------------------------------------
     6. Meal Image Renderer & Broken-Image Fallback Handler
     ------------------------------------------------------------------------ */
  function createMealImageElement(src, altText, className, isLazy) {
    var img = document.createElement("img");
    img.className = className;
    img.alt = altText || FALLBACK_IMAGE_ALT;
    if (isLazy) {
      img.loading = "lazy";
    }

    // Attach fallback handler before setting src so broken local paths recover once
    img.addEventListener("error", function () {
      if (img.dataset.fallbackApplied === "true") {
        return;
      }
      img.dataset.fallbackApplied = "true";
      img.src = FALLBACK_IMAGE;
      img.alt = FALLBACK_IMAGE_ALT;
    });

    img.src = src || FALLBACK_IMAGE;
    return img;
  }

  function createMealImageFigure(slotKey, meal) {
    var wrapper = document.createElement("figure");
    wrapper.className = "plate-preview";

    var frame = document.createElement("div");
    frame.className = "meal-image-wrap";

    var imgSrc = meal && meal.image ? meal.image : FALLBACK_IMAGE;
    var imgAlt = meal
      ? meal.imageAlt || ("Prepared dish for " + SLOT_LABELS[slotKey] + ": " + meal.title)
      : "Empty ceramic plate ready for a " + SLOT_LABELS[slotKey].toLowerCase() + " recipe";

    frame.appendChild(createMealImageElement(imgSrc, imgAlt, "meal-slot-img", false));
    wrapper.appendChild(frame);

    var caption = document.createElement("figcaption");
    caption.className = "plate-caption";
    caption.textContent = meal
      ? SLOT_LABELS[slotKey] + " selection"
      : "Empty " + SLOT_LABELS[slotKey].toLowerCase() + " plate";
    wrapper.appendChild(caption);

    return wrapper;
  }

  /* ------------------------------------------------------------------------
     7. Utility Helpers
     ------------------------------------------------------------------------ */
  function clampServings(value) {
    var num = parseInt(value, 10);
    if (isNaN(num) || num < 1) {
      return 1;
    }
    if (num > 12) {
      return 12;
    }
    return num;
  }

  function getActiveWeek() {
    return state.mealPlans.weeks[state.mealPlans.activeWeek];
  }

  function getActiveDayObject() {
    return getActiveWeek().days[state.mealPlans.activeDay];
  }

  function getDayMeta(dayId) {
    return DAYS.find(function (d) {
      return d.id === dayId;
    }) || DAYS[0];
  }

  function countPlannedMealsInWeek(weekObj) {
    var count = 0;
    DAYS.forEach(function (day) {
      var dayData = weekObj.days[day.id];
      MEAL_SLOTS.forEach(function (slotKey) {
        if (dayData && dayData[slotKey]) {
          count += 1;
        }
      });
    });
    return count;
  }

  function showStatus(message, isWarning, includeShoppingLink) {
    dom.statusBanner.textContent = "";
    dom.statusBanner.classList.toggle("planner-status--warning", Boolean(isWarning));

    var textSpan = document.createElement("span");
    textSpan.textContent = message;
    dom.statusBanner.appendChild(textSpan);

    if (includeShoppingLink) {
      var link = document.createElement("a");
      link.href = "shopping-list.html";
      link.className = "planner-status-link";
      link.textContent = "Open Shopping List";
      dom.statusBanner.appendChild(link);
    }

    dom.statusBanner.hidden = false;
  }

  /* ------------------------------------------------------------------------
     8. Rendering: Week Controls, Day Tabs, and Three Meal Slots
     ------------------------------------------------------------------------ */
  function renderWeekControls() {
    var activeWeekId = state.mealPlans.activeWeek;
    var activeIndex = WEEKS.findIndex(function (w) {
      return w.id === activeWeekId;
    });

    dom.weekSelect.value = activeWeekId;
    dom.prevWeekBtn.disabled = activeIndex <= 0;
    dom.nextWeekBtn.disabled = activeIndex >= WEEKS.length - 1;

    var weekObj = getActiveWeek();
    var plannedCount = countPlannedMealsInWeek(weekObj);
    dom.weekSummaryText.textContent =
      plannedCount + " of 21 meals planned in " + weekObj.label;
  }

  function renderDayTabs() {
    var activeWeek = getActiveWeek();
    var activeDayId = state.mealPlans.activeDay;
    var activeDayMeta = getDayMeta(activeDayId);

    dom.activeDayHeading.textContent =
      "Planning " + activeWeek.label + " — " + activeDayMeta.label;

    var hasAnyMealToday = MEAL_SLOTS.some(function (slotKey) {
      return Boolean(activeWeek.days[activeDayId][slotKey]);
    });
    dom.clearDayBtn.disabled = !hasAnyMealToday;

    dom.dayTabs.textContent = "";

    DAYS.forEach(function (day) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "day-tab" + (day.id === activeDayId ? " is-active" : "");
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", String(day.id === activeDayId));
      btn.dataset.dayId = day.id;

      var labelSpan = document.createElement("span");
      labelSpan.textContent = day.shortLabel;
      btn.appendChild(labelSpan);

      var dots = document.createElement("span");
      dots.className = "day-tab-dots";
      dots.setAttribute("aria-hidden", "true");

      MEAL_SLOTS.forEach(function (slotKey) {
        var dot = document.createElement("span");
        dot.className = "day-dot" + (activeWeek.days[day.id][slotKey] ? " is-filled" : "");
        dots.appendChild(dot);
      });

      btn.appendChild(dots);
      btn.setAttribute("aria-label", day.label + " meal plan");
      dom.dayTabs.appendChild(btn);
    });
  }

  function renderMealSlots() {
    var dayMeals = getActiveDayObject();

    MEAL_SLOTS.forEach(function (slotKey) {
      var meal = dayMeals[slotKey];
      var cardEl = document.querySelector('[data-meal-slot="' + slotKey + '"]');
      var badgeEl = document.querySelector('[data-slot-badge="' + slotKey + '"]');
      var bodyEl = document.querySelector('[data-slot-body="' + slotKey + '"]');

      if (!cardEl || !badgeEl || !bodyEl) {
        return;
      }

      bodyEl.textContent = "";

      if (!meal) {
        cardEl.classList.remove("meal-slot--assigned");
        badgeEl.className = "slot-badge slot-badge--empty";
        badgeEl.textContent = "Unassigned";

        bodyEl.appendChild(createMealImageFigure(slotKey, null));

        var emptyCopy = document.createElement("p");
        emptyCopy.className = "empty-slot-copy";
        emptyCopy.textContent =
          "No recipe selected for " + SLOT_LABELS[slotKey] + " yet.";
        bodyEl.appendChild(emptyCopy);

        var emptyActions = document.createElement("div");
        emptyActions.className = "slot-actions slot-actions--centered";

        var addBtn = document.createElement("button");
        addBtn.type = "button";
        addBtn.className = "btn btn-primary";
        addBtn.textContent = "+ Add Recipe";
        addBtn.dataset.action = "open-picker";
        addBtn.dataset.slot = slotKey;

        emptyActions.appendChild(addBtn);
        bodyEl.appendChild(emptyActions);
        return;
      }

      cardEl.classList.add("meal-slot--assigned");
      badgeEl.className = "slot-badge slot-badge--assigned";
      badgeEl.textContent = "Planned";

      bodyEl.appendChild(createMealImageFigure(slotKey, meal));

      var detailsWrap = document.createElement("div");

      var title = document.createElement("h4");
      title.className = "assigned-meal-name";
      title.textContent = meal.title;
      detailsWrap.appendChild(title);

      if (meal.description) {
        var desc = document.createElement("p");
        desc.className = "assigned-meal-desc";
        desc.textContent = meal.description;
        detailsWrap.appendChild(desc);
      }

      if (Array.isArray(meal.dietaryTags) && meal.dietaryTags.length > 0) {
        var tagList = document.createElement("div");
        tagList.className = "meal-tag-list";
        meal.dietaryTags.forEach(function (tag) {
          var tagSpan = document.createElement("span");
          tagSpan.className = "meal-tag";
          tagSpan.textContent = tag;
          tagList.appendChild(tagSpan);
        });
        detailsWrap.appendChild(tagList);
      }

      bodyEl.appendChild(detailsWrap);

      // Prep/Cook Time & Servings Meta Box
      var metaRow = document.createElement("div");
      metaRow.className = "meal-meta-row";

      var timeItem = document.createElement("div");
      timeItem.className = "meta-item";
      var timeLabel = document.createElement("span");
      timeLabel.className = "meta-label";
      timeLabel.textContent = "Prep / Cook";
      var timeValue = document.createElement("span");
      timeValue.className = "meta-value";
      var totalMin = (meal.prepMinutes || 0) + (meal.cookMinutes || 0);
      timeValue.textContent =
        (meal.prepMinutes || 0) + "m + " + (meal.cookMinutes || 0) + "m (" + totalMin + "m)";
      timeItem.appendChild(timeLabel);
      timeItem.appendChild(timeValue);

      var servingsItem = document.createElement("div");
      servingsItem.className = "meta-item";
      var servingsLabel = document.createElement("span");
      servingsLabel.className = "meta-label";
      servingsLabel.textContent = "Servings";
      var stepper = document.createElement("div");
      stepper.className = "servings-stepper";

      var decBtn = document.createElement("button");
      decBtn.type = "button";
      decBtn.className = "stepper-btn";
      decBtn.textContent = "-";
      decBtn.setAttribute("aria-label", "Decrease servings for " + meal.title);
      decBtn.dataset.action = "adjust-servings";
      decBtn.dataset.slot = slotKey;
      decBtn.dataset.delta = "-1";
      decBtn.disabled = meal.servings <= 1;

      var servingsVal = document.createElement("span");
      servingsVal.className = "meta-value";
      servingsVal.textContent = String(meal.servings);

      var incBtn = document.createElement("button");
      incBtn.type = "button";
      incBtn.className = "stepper-btn";
      incBtn.textContent = "+";
      incBtn.setAttribute("aria-label", "Increase servings for " + meal.title);
      incBtn.dataset.action = "adjust-servings";
      incBtn.dataset.slot = slotKey;
      incBtn.dataset.delta = "1";
      incBtn.disabled = meal.servings >= 12;

      stepper.appendChild(decBtn);
      stepper.appendChild(servingsVal);
      stepper.appendChild(incBtn);
      servingsItem.appendChild(servingsLabel);
      servingsItem.appendChild(stepper);

      metaRow.appendChild(timeItem);
      metaRow.appendChild(servingsItem);
      bodyEl.appendChild(metaRow);

      // Ingredient Summary List
      var ingBox = document.createElement("div");
      ingBox.className = "ingredient-summary-box";
      var ingTitle = document.createElement("h5");
      ingTitle.className = "ingredient-summary-title";
      ingTitle.textContent = "Ingredient Summary";
      ingBox.appendChild(ingTitle);

      var ingList = document.createElement("ul");
      ingList.className = "ingredient-summary-list";
      (meal.ingredients || []).forEach(function (ing) {
        var li = document.createElement("li");
        var qtyPart = ing.quantity ? ing.quantity + (ing.unit ? " " + ing.unit : "") + " " : "";
        li.textContent = qtyPart + ing.name;
        ingList.appendChild(li);
      });
      ingBox.appendChild(ingList);
      bodyEl.appendChild(ingBox);

      // Slot Action Buttons
      var actions = document.createElement("div");
      actions.className = "slot-actions";

      var changeBtn = document.createElement("button");
      changeBtn.type = "button";
      changeBtn.className = "btn btn-secondary";
      changeBtn.textContent = "Change Recipe";
      changeBtn.dataset.action = "open-picker";
      changeBtn.dataset.slot = slotKey;

      var removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "btn btn-outline";
      removeBtn.textContent = "Remove";
      removeBtn.dataset.action = "remove-meal";
      removeBtn.dataset.slot = slotKey;

      actions.appendChild(changeBtn);
      actions.appendChild(removeBtn);
      bodyEl.appendChild(actions);
    });
  }

  function renderAll() {
    renderWeekControls();
    renderDayTabs();
    renderMealSlots();
  }

  /* ------------------------------------------------------------------------
     9. Modal: Dynamic Recipe Picker & Custom Meal Assignment
     ------------------------------------------------------------------------ */
  function openRecipeModal(slotKey, triggerEl) {
    state.activeModalSlot = slotKey;
    state.lastFocusedTrigger = triggerEl || document.activeElement;

    var existingMeal = getActiveDayObject()[slotKey];
    var defaultServings = existingMeal ? String(existingMeal.servings) : "2";

    dom.modalTitle.textContent =
      (existingMeal ? "Change Recipe for " : "Assign Recipe to ") + SLOT_LABELS[slotKey];
    dom.searchInput.value = "";
    dom.mealFilterSelect.value = "recommended";
    dom.dietaryFilterSelect.value = "all";
    dom.modalServingsInput.value = defaultServings;
    dom.modalValidationError.hidden = true;
    dom.customMealError.hidden = true;
    dom.customMealForm.reset();
    dom.customMealServings.value = defaultServings;
    dom.customMealTime.value = "25";

    switchModalMode("browse");
    renderRecipePickerList();

    dom.modal.hidden = false;
    document.body.style.overflow = "hidden";
    dom.searchInput.focus();
  }

  function closeRecipeModal() {
    dom.modal.hidden = true;
    document.body.style.overflow = "";
    state.activeModalSlot = null;

    if (state.lastFocusedTrigger && typeof state.lastFocusedTrigger.focus === "function") {
      state.lastFocusedTrigger.focus();
    }
  }

  function switchModalMode(mode) {
    var isBrowse = mode === "browse";

    dom.tabBrowse.classList.toggle("is-active", isBrowse);
    dom.tabBrowse.setAttribute("aria-selected", String(isBrowse));
    dom.panelBrowse.hidden = !isBrowse;

    dom.tabCustom.classList.toggle("is-active", !isBrowse);
    dom.tabCustom.setAttribute("aria-selected", String(!isBrowse));
    dom.panelCustom.hidden = isBrowse;

    if (!isBrowse) {
      dom.customMealTitle.focus();
    }
  }

  function getFilteredRecipes() {
    var query = dom.searchInput.value.trim().toLowerCase();
    var mealFilter = dom.mealFilterSelect.value;
    var dietaryFilter = dom.dietaryFilterSelect.value;

    var targetMealType =
      mealFilter === "recommended" ? state.activeModalSlot : mealFilter;

    return RECIPES.filter(function (recipe) {
      if (targetMealType !== "all" && recipe.mealType !== targetMealType) {
        return false;
      }

      if (dietaryFilter !== "all") {
        if (dietaryFilter === "Quick") {
          if (recipe.prepMinutes + recipe.cookMinutes > 20) {
            return false;
          }
        } else if (recipe.dietaryTags.indexOf(dietaryFilter) === -1) {
          return false;
        }
      }

      if (query) {
        var inTitle = recipe.title.toLowerCase().indexOf(query) !== -1;
        var inDesc = recipe.description.toLowerCase().indexOf(query) !== -1;
        var inIngredients = recipe.ingredients.some(function (ing) {
          return ing.name.toLowerCase().indexOf(query) !== -1;
        });

        if (!inTitle && !inDesc && !inIngredients) {
          return false;
        }
      }

      return true;
    });
  }

  function renderRecipePickerList() {
    var filtered = getFilteredRecipes();
    dom.recipePickerList.textContent = "";

    if (filtered.length === 0) {
      var emptyBox = document.createElement("div");
      emptyBox.className = "empty-search-state";

      var msg = document.createElement("p");
      msg.textContent =
        "No matching recipes found. Try clearing a filter, switching to 'All meal types', or adding a Custom Meal.";
      emptyBox.appendChild(msg);

      var resetBtn = document.createElement("button");
      resetBtn.type = "button";
      resetBtn.className = "btn btn-outline";
      resetBtn.textContent = "Reset Filters";
      resetBtn.addEventListener("click", function () {
        dom.searchInput.value = "";
        dom.mealFilterSelect.value = "all";
        dom.dietaryFilterSelect.value = "all";
        renderRecipePickerList();
      });
      emptyBox.appendChild(resetBtn);

      dom.recipePickerList.appendChild(emptyBox);
      return;
    }

    filtered.forEach(function (recipe) {
      var card = document.createElement("article");
      card.className = "recipe-option-card";

      var top = document.createElement("div");

      var thumbWrap = document.createElement("div");
      thumbWrap.className = "recipe-option-thumb-wrap";
      thumbWrap.appendChild(
        createMealImageElement(
          recipe.image,
          recipe.imageAlt || ("Meal photo of " + recipe.title),
          "recipe-option-thumb",
          true
        )
      );
      top.appendChild(thumbWrap);

      var header = document.createElement("div");
      header.className = "recipe-option-header";

      var title = document.createElement("h3");
      title.className = "recipe-option-title";
      title.textContent = recipe.title;

      var typeBadge = document.createElement("span");
      typeBadge.className = "recipe-option-type";
      typeBadge.textContent = recipe.mealType;

      header.appendChild(title);
      header.appendChild(typeBadge);
      top.appendChild(header);

      var meta = document.createElement("p");
      meta.className = "recipe-option-meta";
      var totalMin = recipe.prepMinutes + recipe.cookMinutes;
      meta.textContent =
        totalMin + " min total • Base " + recipe.baseServings + " servings • " +
        recipe.dietaryTags.join(", ");
      top.appendChild(meta);

      var desc = document.createElement("p");
      desc.className = "recipe-option-desc";
      desc.textContent = recipe.description;
      top.appendChild(desc);

      var ingNames = recipe.ingredients
        .slice(0, 4)
        .map(function (i) {
          return i.name;
        })
        .join(", ");
      var ingLine = document.createElement("p");
      ingLine.className = "recipe-option-ingredients";
      ingLine.textContent =
        "Key ingredients: " + ingNames + (recipe.ingredients.length > 4 ? ", ..." : "");
      top.appendChild(ingLine);

      card.appendChild(top);

      var selectBtn = document.createElement("button");
      selectBtn.type = "button";
      selectBtn.className = "btn btn-primary";
      selectBtn.textContent = "Select for " + SLOT_LABELS[state.activeModalSlot];
      selectBtn.dataset.recipeId = recipe.id;
      card.appendChild(selectBtn);

      dom.recipePickerList.appendChild(card);
    });
  }

  /* ------------------------------------------------------------------------
     10. Meal Assignment & Mutation Handlers
     ------------------------------------------------------------------------ */
  function assignRecipeToActiveSlot(recipeId) {
    var rawServings = Number(dom.modalServingsInput.value);
    if (!Number.isInteger(rawServings) || rawServings < 1 || rawServings > 12) {
      dom.modalValidationError.textContent =
        "Please enter a valid whole number of servings between 1 and 12.";
      dom.modalValidationError.hidden = false;
      dom.modalServingsInput.focus();
      return;
    }

    dom.modalValidationError.hidden = true;

    var recipe = RECIPES.find(function (r) {
      return r.id === recipeId;
    });
    if (!recipe || !state.activeModalSlot) {
      return;
    }

    var slotKey = state.activeModalSlot;
    var assignedMeal = buildAssignedMealFromRecipe(recipe, rawServings);
    getActiveDayObject()[slotKey] = assignedMeal;
    saveMealPlans();
    generateShoppingListForWeek(state.mealPlans.activeWeek);
    renderAll();

    var dayMeta = getDayMeta(state.mealPlans.activeDay);
    showStatus(
      "Assigned '" + assignedMeal.title + "' (" + assignedMeal.servings + " servings) to " +
        dayMeta.label + " " + SLOT_LABELS[slotKey] + " in " + getActiveWeek().label + ".",
      false,
      false
    );

    closeRecipeModal();
  }

  function handleCustomMealSubmit(event) {
    event.preventDefault();

    var title = dom.customMealTitle.value.trim();
    var servings = Number(dom.customMealServings.value);
    var totalMinutes = Number(dom.customMealTime.value);
    var rawIngredients = dom.customMealIngredients.value
      .split(",")
      .map(function (item) {
        return item.trim();
      })
      .filter(Boolean);

    if (title.length < 2) {
      dom.customMealError.textContent = "Please enter a meal name (at least 2 characters).";
      dom.customMealError.hidden = false;
      dom.customMealTitle.focus();
      return;
    }

    if (!Number.isInteger(servings) || servings < 1 || servings > 12) {
      dom.customMealError.textContent = "Servings must be a whole number between 1 and 12.";
      dom.customMealError.hidden = false;
      dom.customMealServings.focus();
      return;
    }

    if (!Number.isFinite(totalMinutes) || totalMinutes < 1 || totalMinutes > 240) {
      dom.customMealError.textContent = "Total time must be between 1 and 240 minutes.";
      dom.customMealError.hidden = false;
      dom.customMealTime.focus();
      return;
    }

    if (rawIngredients.length === 0) {
      dom.customMealError.textContent =
        "Please enter at least one ingredient separated by commas.";
      dom.customMealError.hidden = false;
      dom.customMealIngredients.focus();
      return;
    }

    dom.customMealError.hidden = true;

    var slotKey = state.activeModalSlot;
    var ingredients = rawIngredients.map(function (name) {
      return {
        name: name,
        quantity: 1,
        unit: "portion",
        category: "Custom Items"
      };
    });

    var customMeal = {
      recipeId: "custom-" + Date.now(),
      title: title,
      mealType: slotKey,
      prepMinutes: Math.round(totalMinutes * 0.4),
      cookMinutes: Math.round(totalMinutes * 0.6),
      baseServings: servings,
      servings: servings,
      dietaryTags: ["Custom"],
      image: FALLBACK_IMAGE,
      imageAlt: "Custom planned meal plate for " + title,
      description: "Custom planned meal added for " + SLOT_LABELS[slotKey] + ".",
      baseIngredients: ingredients,
      ingredients: ingredients,
      updatedAt: new Date().toISOString()
    };

    getActiveDayObject()[slotKey] = customMeal;
    saveMealPlans();
    generateShoppingListForWeek(state.mealPlans.activeWeek);
    renderAll();

    var dayMeta = getDayMeta(state.mealPlans.activeDay);
    showStatus(
      "Added custom meal '" + customMeal.title + "' to " + dayMeta.label + " " +
        SLOT_LABELS[slotKey] + ".",
      false,
      false
    );

    closeRecipeModal();
  }

  function adjustAssignedServings(slotKey, delta) {
    var meal = getActiveDayObject()[slotKey];
    if (!meal) {
      return;
    }

    var nextServings = clampServings(meal.servings + delta);
    if (nextServings === meal.servings) {
      return;
    }

    meal.servings = nextServings;
    if (Array.isArray(meal.baseIngredients)) {
      meal.ingredients = scaleIngredients(
        meal.baseIngredients,
        meal.baseServings || 1,
        nextServings
      );
    }
    meal.updatedAt = new Date().toISOString();

    saveMealPlans();
    generateShoppingListForWeek(state.mealPlans.activeWeek);
    renderAll();
    showStatus(
      "Updated " + meal.title + " to " + nextServings + " servings.",
      false,
      false
    );
  }

  function removeMealFromSlot(slotKey) {
    var dayMeals = getActiveDayObject();
    var existing = dayMeals[slotKey];
    if (!existing) {
      return;
    }

    dayMeals[slotKey] = null;
    saveMealPlans();
    generateShoppingListForWeek(state.mealPlans.activeWeek);
    renderAll();

    showStatus(
      "Removed '" + existing.title + "' from " + getDayMeta(state.mealPlans.activeDay).label +
        " " + SLOT_LABELS[slotKey] + ".",
      false,
      false
    );
  }

  /* ------------------------------------------------------------------------
     11. Event Binding & Initialization
     ------------------------------------------------------------------------ */
  function cacheDom() {
    dom.weekSelect = document.getElementById("week-select");
    dom.prevWeekBtn = document.getElementById("prev-week-btn");
    dom.nextWeekBtn = document.getElementById("next-week-btn");
    dom.weekSummaryText = document.getElementById("week-summary-text");
    dom.activeDayHeading = document.getElementById("active-day-heading");
    dom.clearDayBtn = document.getElementById("clear-day-btn");
    dom.dayTabs = document.getElementById("day-tabs");
    dom.statusBanner = document.getElementById("planner-status");
    dom.slotsContainer = document.getElementById("meal-slots-container");
    dom.generateShoppingBtn = document.getElementById("generate-shopping-list-btn");

    dom.modal = document.getElementById("recipe-modal");
    dom.modalTitle = document.getElementById("recipe-modal-title");
    dom.closeModalBtn = document.getElementById("close-modal-btn");
    dom.tabBrowse = document.getElementById("tab-browse-recipes");
    dom.tabCustom = document.getElementById("tab-custom-meal");
    dom.panelBrowse = document.getElementById("panel-browse-recipes");
    dom.panelCustom = document.getElementById("panel-custom-meal");

    dom.searchInput = document.getElementById("recipe-search-input");
    dom.mealFilterSelect = document.getElementById("meal-filter-select");
    dom.dietaryFilterSelect = document.getElementById("dietary-filter-select");
    dom.modalServingsInput = document.getElementById("modal-servings-input");
    dom.modalValidationError = document.getElementById("modal-validation-error");
    dom.recipePickerList = document.getElementById("recipe-picker-list");

    dom.customMealForm = document.getElementById("custom-meal-form");
    dom.customMealTitle = document.getElementById("custom-meal-title");
    dom.customMealServings = document.getElementById("custom-meal-servings");
    dom.customMealTime = document.getElementById("custom-meal-time");
    dom.customMealIngredients = document.getElementById("custom-meal-ingredients");
    dom.customMealError = document.getElementById("custom-meal-error");
    dom.cancelCustomMealBtn = document.getElementById("cancel-custom-meal-btn");
  }

  function bindEvents() {
    // Week dropdown & arrow navigation
    dom.weekSelect.addEventListener("change", function () {
      state.mealPlans.activeWeek = dom.weekSelect.value;
      saveMealPlans();
      renderAll();
    });

    dom.prevWeekBtn.addEventListener("click", function () {
      var idx = WEEKS.findIndex(function (w) {
        return w.id === state.mealPlans.activeWeek;
      });
      if (idx > 0) {
        state.mealPlans.activeWeek = WEEKS[idx - 1].id;
        saveMealPlans();
        renderAll();
      }
    });

    dom.nextWeekBtn.addEventListener("click", function () {
      var idx = WEEKS.findIndex(function (w) {
        return w.id === state.mealPlans.activeWeek;
      });
      if (idx < WEEKS.length - 1) {
        state.mealPlans.activeWeek = WEEKS[idx + 1].id;
        saveMealPlans();
        renderAll();
      }
    });

    // Day selector tabs
    dom.dayTabs.addEventListener("click", function (event) {
      var tab = event.target.closest("[data-day-id]");
      if (!tab) {
        return;
      }
      state.mealPlans.activeDay = tab.dataset.dayId;
      saveMealPlans();
      renderAll();
    });

    // Clear all 3 meal slots for the current day
    dom.clearDayBtn.addEventListener("click", function () {
      var dayMeals = getActiveDayObject();
      MEAL_SLOTS.forEach(function (slotKey) {
        dayMeals[slotKey] = null;
      });
      saveMealPlans();
      generateShoppingListForWeek(state.mealPlans.activeWeek);
      renderAll();
      showStatus(
        "Cleared all meal slots for " + getDayMeta(state.mealPlans.activeDay).label +
          " in " + getActiveWeek().label + ".",
        false,
        false
      );
    });

    // Delegated click handler inside the 3 Meal Slot cards
    dom.slotsContainer.addEventListener("click", function (event) {
      var actionBtn = event.target.closest("[data-action]");
      if (!actionBtn) {
        return;
      }

      var action = actionBtn.dataset.action;
      var slotKey = actionBtn.dataset.slot;

      if (action === "open-picker") {
        openRecipeModal(slotKey, actionBtn);
      } else if (action === "remove-meal") {
        removeMealFromSlot(slotKey);
      } else if (action === "adjust-servings") {
        adjustAssignedServings(slotKey, Number(actionBtn.dataset.delta));
      }
    });

    // Generate Shopping List button
    dom.generateShoppingBtn.addEventListener("click", function () {
      var activeWeek = getActiveWeek();
      var result = generateShoppingListForWeek(state.mealPlans.activeWeek);

      if (!result) {
        showStatus("Could not save shopping list to browser storage.", true, false);
        return;
      }

      if (result.mealCount === 0) {
        showStatus(
          "No meals are planned in " + activeWeek.label +
            " yet. Add at least one recipe before generating a shopping list.",
          true,
          false
        );
        return;
      }

      showStatus(
        "Synced " + result.items.length + " unique ingredients from " +
          result.mealCount + " planned meal(s) in " + result.weekLabel + ".",
        false,
        true
      );
    });

    // Modal controls
    dom.closeModalBtn.addEventListener("click", closeRecipeModal);
    dom.cancelCustomMealBtn.addEventListener("click", closeRecipeModal);

    dom.modal.addEventListener("click", function (event) {
      if (event.target === dom.modal) {
        closeRecipeModal();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (dom.modal.hidden) {
        return;
      }

      if (event.key === "Escape") {
        closeRecipeModal();
        return;
      }

      // Keep keyboard Tab focus inside the open modal dialog
      if (event.key === "Tab") {
        var focusables = Array.prototype.slice.call(
          dom.modal.querySelectorAll(
            'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
          )
        ).filter(function (el) {
          return el.offsetParent !== null;
        });

        if (focusables.length === 0) {
          return;
        }

        var firstEl = focusables[0];
        var lastEl = focusables[focusables.length - 1];

        if (event.shiftKey && document.activeElement === firstEl) {
          event.preventDefault();
          lastEl.focus();
        } else if (!event.shiftKey && document.activeElement === lastEl) {
          event.preventDefault();
          firstEl.focus();
        }
      }
    });

    dom.tabBrowse.addEventListener("click", function () {
      switchModalMode("browse");
    });

    dom.tabCustom.addEventListener("click", function () {
      switchModalMode("custom");
    });

    dom.searchInput.addEventListener("input", renderRecipePickerList);
    dom.mealFilterSelect.addEventListener("change", renderRecipePickerList);
    dom.dietaryFilterSelect.addEventListener("change", renderRecipePickerList);

    dom.recipePickerList.addEventListener("click", function (event) {
      var btn = event.target.closest("[data-recipe-id]");
      if (!btn) {
        return;
      }
      assignRecipeToActiveSlot(btn.dataset.recipeId);
    });

    dom.customMealForm.addEventListener("submit", handleCustomMealSubmit);
  }

  document.addEventListener("DOMContentLoaded", function () {
    cacheDom();
    state.mealPlans = loadMealPlans();
    saveMealPlans();
    saveRecipeCatalogReference();
    bindEvents();
    renderAll();
  });
})();
