/**
 * FORK & SHARE — Community Reviews & Cooking Tips Page Script
 * File: js/community.js
 *
 * What this file does:
 *   1. Holds the sample community reviews and cooking tips / FAQs data.
 *   2. Renders the rating summary (4.8 / 5, star rating, 24 Reviews).
 *   3. Implements the four prototype states:
 *        - no-reviews     (State 1: "No reviews yet" + "Write a review" button)
 *        - write-review   (State 2: active review submission form)
 *        - invalid-review (State 3: validation errors & highlighted fields)
 *        - published      (State 4: "Review published" banner + new review card)
 *   4. Validates review form inputs and appends valid reviews safely.
 *   5. Builds and toggles the Cooking Tips / FAQs accordion.
 *
 * NOTE: The hamburger navigation is handled by js/shared.js.
 *       Do not add navigation code here.
 */

/* ============================================================
   STEP 1 — INITIAL DATA (REVIEWS & COOKING TIPS / FAQs)
   ============================================================ */
var BASELINE_REVIEW_COUNT = 24;
var BASELINE_RATING_AVERAGE = 4.8;

var initialReviews = [
  {
    id: "rev-ayesha",
    author: "Ayesha",
    rating: 5,
    comment: "Love this recipe! Simple steps and delicious results every single time.",
    dateLabel: "2 days ago",
    image: "../images/cat-desserts.jpg",
    alt: "Freshly baked dessert slice shared by Ayesha",
    isNew: false
  },
  {
    id: "rev-ziad",
    author: "Ziad",
    rating: 5,
    comment: "A1! Followed the tips closely and my whole family enjoyed dinner.",
    dateLabel: "5 days ago",
    image: "../images/cat-biryani.jpg",
    alt: "Plate of aromatic biryani shared by Ziad",
    isNew: false
  }
];

var cookingTipsFaqs = [
  {
    id: "faq-soft-cake",
    question: "How can I make cake softer?",
    answer:
      "Use room-temperature eggs and butter, avoid overmixing the batter once you add flour, and substitute a splash of milk with plain yogurt or buttermilk for extra moisture."
  },
  {
    id: "faq-store-leftovers",
    question: "How do I store leftover food?",
    answer:
      "Let cooked dishes cool to room temperature within two hours, then transfer them into clean airtight glass or BPA-free containers. Refrigerate for 3 to 4 days or freeze portions for longer storage."
  },
  {
    id: "faq-spices-fresh",
    question: "How do I keep spices fresh for longer?",
    answer:
      "Store whole and ground spices in airtight jars away from direct sunlight, heat, and stove steam. Whole spices keep their flavour for up to a year when stored in a cool, dark cupboard."
  },
  {
    id: "faq-pasta-sticking",
    question: "How can I stop pasta from sticking together?",
    answer:
      "Boil pasta in a large pot with plenty of salted water, stir well during the first two minutes of cooking, and toss it directly with your sauce right after draining."
  }
];


/* ============================================================
   STEP 2 — WAIT FOR THE PAGE TO FINISH LOADING
   ============================================================ */
document.addEventListener("DOMContentLoaded", function () {

  /* ---- DOM References ---- */
  var workspace        = document.getElementById("community-workspace");
  var ratingAverageEl  = document.getElementById("rating-average");
  var ratingStarsEl    = document.getElementById("rating-stars");
  var ratingCountEl    = document.getElementById("rating-count");

  var writeSection     = document.getElementById("write-review-section");
  var reviewForm       = document.getElementById("review-form");
  var formErrorBanner  = document.getElementById("form-error-banner");
  var nameInput        = document.getElementById("reviewer-name");
  var ratingSelect     = document.getElementById("review-rating");
  var textInput        = document.getElementById("review-text");
  var nameErrorEl      = document.getElementById("name-error");
  var ratingErrorEl    = document.getElementById("rating-error");
  var textErrorEl      = document.getElementById("text-error");

  var publishedBanner  = document.getElementById("published-banner");
  var noReviewsState   = document.getElementById("no-reviews-state");
  var emptyWriteBtn    = document.getElementById("empty-write-btn");
  var reviewsList      = document.getElementById("reviews-list");
  var clearReviewsBtn  = document.getElementById("clear-reviews-btn");
  var restoreBtn       = document.getElementById("restore-reviews-btn");
  var faqAccordion     = document.getElementById("faq-accordion");

  /* ---- Page State ---- */
  var reviews = initialReviews.slice();
  var addedRatings = [];
  var isEmptyView = false;


  /* ==========================================================
     STEP 3 — HELPER: STAR CHARACTERS
     ========================================================== */
  function buildStarString(rating) {
    var filled = Math.max(0, Math.min(5, Math.round(rating)));
    var empty = 5 - filled;
    return "\u2605".repeat(filled) + "\u2606".repeat(empty);
  }


  /* ==========================================================
     STEP 4 — MANAGE THE FOUR PROTOTYPE STATES
     States: "no-reviews", "write-review", "invalid-review", "published"
     ========================================================== */
  function setPrototypeState(stateName) {
    workspace.setAttribute("data-review-state", stateName);

    writeSection.classList.toggle("is-writing", stateName === "write-review");
    publishedBanner.hidden = stateName !== "published";

    if (stateName !== "invalid-review") {
      formErrorBanner.hidden = true;
      formErrorBanner.textContent = "";
    }
  }


  /* ==========================================================
     STEP 5 — RENDER RATING SUMMARY
     Starts at 4.8 / 5 and 24 Reviews; updates as new reviews
     are published, or displays 0 Reviews in the No Reviews state.
     ========================================================== */
  function renderRatingSummary() {
    if (isEmptyView || reviews.length === 0) {
      ratingAverageEl.textContent = "0.0 / 5";
      ratingStarsEl.innerHTML = '<span aria-hidden="true">' + buildStarString(0) + "</span>";
      ratingStarsEl.setAttribute("aria-label", "No ratings yet");
      ratingCountEl.textContent = "0 Reviews";
      return;
    }

    var totalCount = BASELINE_REVIEW_COUNT + addedRatings.length;
    var weightedSum = BASELINE_REVIEW_COUNT * BASELINE_RATING_AVERAGE;
    addedRatings.forEach(function (value) {
      weightedSum += value;
    });

    var average = (weightedSum / totalCount).toFixed(1);
    ratingAverageEl.textContent = average + " / 5";
    ratingStarsEl.innerHTML = '<span aria-hidden="true">' + buildStarString(Number(average)) + "</span>";
    ratingStarsEl.setAttribute("aria-label", "Rated " + average + " out of 5 stars");
    ratingCountEl.textContent = totalCount + (totalCount === 1 ? " Review" : " Reviews");
  }


  /* ==========================================================
     STEP 6 — BUILD & RENDER COMMUNITY REVIEW CARDS
     ========================================================== */
  function buildReviewCard(review) {
    var article = document.createElement("article");
    article.className = "review-card" + (review.isNew ? " review-card--new" : "");

    var topRow = document.createElement("div");
    topRow.className = "review-card__top";

    var avatarWrap = document.createElement("div");
    avatarWrap.className = "review-card__avatar";

    var img = document.createElement("img");
    img.src = review.image;
    img.alt = review.alt;
    img.loading = "lazy";
    avatarWrap.appendChild(img);

    var meta = document.createElement("div");
    meta.className = "review-card__meta";

    var author = document.createElement("h3");
    author.className = "review-card__author";
    author.textContent = review.author;

    var stars = document.createElement("p");
    stars.className = "review-card__stars";
    stars.setAttribute("aria-label", review.rating + " out of 5 stars");
    stars.textContent = buildStarString(review.rating);

    meta.appendChild(author);
    meta.appendChild(stars);

    topRow.appendChild(avatarWrap);
    topRow.appendChild(meta);

    var comment = document.createElement("p");
    comment.className = "review-card__comment";
    comment.textContent = review.comment;

    var date = document.createElement("span");
    date.className = "review-card__date";
    date.textContent = review.dateLabel;

    article.appendChild(topRow);
    article.appendChild(comment);
    article.appendChild(date);

    return article;
  }

  function renderReviews() {
    reviewsList.innerHTML = "";

    if (isEmptyView || reviews.length === 0) {
      noReviewsState.hidden = false;
      reviewsList.hidden = true;
      clearReviewsBtn.hidden = true;
      restoreBtn.hidden = false;
      return;
    }

    noReviewsState.hidden = true;
    reviewsList.hidden = false;
    clearReviewsBtn.hidden = false;
    restoreBtn.hidden = true;

    reviews.forEach(function (review) {
      reviewsList.appendChild(buildReviewCard(review));
    });
  }


  /* ==========================================================
     STEP 7 — VALIDATION HELPERS (STATE 3: INVALID REVIEW)
     ========================================================== */
  function setFieldError(inputEl, errorEl, message) {
    if (message) {
      inputEl.classList.add("is-invalid");
      inputEl.setAttribute("aria-invalid", "true");
      errorEl.textContent = message;
      errorEl.hidden = false;
    } else {
      inputEl.classList.remove("is-invalid");
      inputEl.removeAttribute("aria-invalid");
      errorEl.textContent = "";
      errorEl.hidden = true;
    }
  }

  function clearAllFieldErrors() {
    setFieldError(nameInput, nameErrorEl, "");
    setFieldError(ratingSelect, ratingErrorEl, "");
    setFieldError(textInput, textErrorEl, "");
  }

  function validateReviewForm() {
    var nameValue = nameInput.value.trim();
    var ratingValue = ratingSelect.value;
    var textValue = textInput.value.trim();

    var nameMessage = "";
    var ratingMessage = "";
    var textMessage = "";

    if (!nameValue) {
      nameMessage = "Please enter your name.";
    } else if (nameValue.length < 2) {
      nameMessage = "Name must be at least 2 characters long.";
    }

    if (!ratingValue) {
      ratingMessage = "Please select a rating from 1 to 5 stars.";
    }

    if (!textValue) {
      textMessage = "Please write your review before submitting.";
    } else if (textValue.length < 5) {
      textMessage = "Your review must be at least 5 characters long.";
    }

    setFieldError(nameInput, nameErrorEl, nameMessage);
    setFieldError(ratingSelect, ratingErrorEl, ratingMessage);
    setFieldError(textInput, textErrorEl, textMessage);

    var firstInvalid = null;
    if (nameMessage) {
      firstInvalid = nameInput;
    } else if (ratingMessage) {
      firstInvalid = ratingSelect;
    } else if (textMessage) {
      firstInvalid = textInput;
    }

    if (firstInvalid) {
      setPrototypeState("invalid-review");
      formErrorBanner.textContent = "Please complete the highlighted fields to submit your review.";
      formErrorBanner.hidden = false;
      firstInvalid.focus();
      return null;
    }

    return {
      author: nameValue,
      rating: Number(ratingValue),
      comment: textValue
    };
  }


  /* ==========================================================
     STEP 8 — FORM EVENTS (WRITE REVIEW, INVALID, PUBLISHED)
     ========================================================== */
  [nameInput, ratingSelect, textInput].forEach(function (field) {
    field.addEventListener("focus", function () {
      if (workspace.getAttribute("data-review-state") !== "invalid-review") {
        setPrototypeState("write-review");
      }
    });

    field.addEventListener("input", function () {
      if (field === nameInput) {
        setFieldError(nameInput, nameErrorEl, "");
      } else if (field === ratingSelect) {
        setFieldError(ratingSelect, ratingErrorEl, "");
      } else if (field === textInput) {
        setFieldError(textInput, textErrorEl, "");
      }

      if (
        nameErrorEl.hidden &&
        ratingErrorEl.hidden &&
        textErrorEl.hidden &&
        workspace.getAttribute("data-review-state") === "invalid-review"
      ) {
        setPrototypeState("write-review");
      }
    });
  });

  reviewForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var validData = validateReviewForm();
    if (!validData) {
      return;
    }

    /* Valid submission -> transition to State 4: Published */
    isEmptyView = false;
    var newReview = {
      id: "rev-" + Date.now(),
      author: validData.author,
      rating: validData.rating,
      comment: validData.comment,
      dateLabel: "Just now",
      image: "../images/cat-karahi.jpg",
      alt: "Home-cooked recipe dish shared by " + validData.author,
      isNew: true
    };

    reviews.unshift(newReview);
    addedRatings.push(validData.rating);

    clearAllFieldErrors();
    reviewForm.reset();

    renderRatingSummary();
    renderReviews();
    setPrototypeState("published");
  });


  /* ==========================================================
     STEP 9 — NO REVIEWS & RESTORE HANDLERS (STATE 1)
     ========================================================== */
  clearReviewsBtn.addEventListener("click", function () {
    isEmptyView = true;
    reviews = [];
    addedRatings = [];
    renderRatingSummary();
    renderReviews();
    setPrototypeState("no-reviews");
  });

  restoreBtn.addEventListener("click", function () {
    isEmptyView = false;
    reviews = initialReviews.slice();
    addedRatings = [];
    renderRatingSummary();
    renderReviews();
    setPrototypeState("default");
  });

  emptyWriteBtn.addEventListener("click", function () {
    setPrototypeState("write-review");
    writeSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
    nameInput.focus();
  });


  /* ==========================================================
     STEP 10 — COOKING TIPS / FAQs ACCORDION
     ========================================================== */
  function buildFaqItem(faq) {
    var item = document.createElement("div");
    item.className = "faq-item";

    var heading = document.createElement("h3");
    heading.className = "faq-item__heading";

    var trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "faq-trigger";
    trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute("aria-controls", faq.id + "-panel");
    trigger.id = faq.id + "-btn";

    var questionSpan = document.createElement("span");
    questionSpan.textContent = faq.question;

    var iconSpan = document.createElement("span");
    iconSpan.className = "faq-trigger__icon";
    iconSpan.setAttribute("aria-hidden", "true");
    iconSpan.textContent = "+";

    trigger.appendChild(questionSpan);
    trigger.appendChild(iconSpan);
    heading.appendChild(trigger);

    var panel = document.createElement("div");
    panel.id = faq.id + "-panel";
    panel.className = "faq-panel";
    panel.setAttribute("role", "region");
    panel.setAttribute("aria-labelledby", trigger.id);
    panel.hidden = true;

    var answerP = document.createElement("p");
    answerP.textContent = faq.answer;
    panel.appendChild(answerP);

    item.appendChild(heading);
    item.appendChild(panel);

    return item;
  }

  function renderFaqAccordion() {
    faqAccordion.innerHTML = "";
    cookingTipsFaqs.forEach(function (faq) {
      faqAccordion.appendChild(buildFaqItem(faq));
    });
  }

  faqAccordion.addEventListener("click", function (event) {
    var trigger = event.target.closest(".faq-trigger");
    if (!trigger) {
      return;
    }

    var item = trigger.closest(".faq-item");
    var panel = document.getElementById(trigger.getAttribute("aria-controls"));
    var icon = trigger.querySelector(".faq-trigger__icon");
    var isExpanded = trigger.getAttribute("aria-expanded") === "true";

    trigger.setAttribute("aria-expanded", String(!isExpanded));
    panel.hidden = isExpanded;
    item.classList.toggle("is-open", !isExpanded);
    icon.textContent = isExpanded ? "+" : "\u2212";
  });


  /* ==========================================================
     STEP 11 — INITIAL RENDER
     ========================================================== */
  renderRatingSummary();
  renderReviews();
  renderFaqAccordion();

}); /* End of DOMContentLoaded */
