# AI Session Log — Session 01 (`26i-3142`)

**Date:** 2026-11-28
**Topic:** Audit of Sign Up & Login Implementation (`pages/login.html`, `css/account.css`, `js/account.js`)

---

## User Prompt

> `@pages/login.html` `@css/account.css` `@js/account.js` Review my Sign Up and Login implementation for semantic HTML5 structure, accessible form labels and error announcements, client-side validation rules, and localStorage session handling. Do NOT edit or overwrite any files—provide a structured audit report only.

---

## Assistant Response

Here is the structured audit report for your Sign Up and Login implementation across [login.html](file:///c:/Users/ibrar/Downloads/fork%20and%20share/C_GroupNo10_ForkAndShare/pages/login.html), [account.css](file:///c:/Users/ibrar/Downloads/fork%20and%20share/C_GroupNo10_ForkAndShare/css/account.css), and [account.js](file:///c:/Users/ibrar/Downloads/fork%20and%20share/C_GroupNo10_ForkAndShare/js/account.js). No files were modified.

---

### Audit Summary

| Audit Area | Overall Status | Key Strengths | Primary Gaps |
| :--- | :--- | :--- | :--- |
| **1. Semantic HTML5 Structure** | **Good (Minor Issues)** | Proper landmarks, `novalidate` forms, single `<h1>` | Primary `<h1>` sits inside `<aside>`; footer links lack `<nav>`; Profile nav item marked active |
| **2. Labels & Error Announcements** | **Needs Improvement** | Explicit `<label for>`, `aria-invalid`, `aria-describedby` wiring | Incomplete ARIA tabs keyboard behavior; `role="alert"` + `aria-live="polite"` + `hidden` conflicts; no focus move on submit errors; invisible `:focus-visible` on dark green surfaces |
| **3. Client-Side Validation Rules** | **Fair (Edge-Case Bugs)** | Clear password rules & live strength meter; shared validators | `checkLoginPassword` leaves stale errors on clear; `signupPassword`/`signupConfirm` flash errors on empty backspace; restrictive ASCII-only name regex; double-submit race during redirect |
| **4. `localStorage` Session Handling** | **Needs Improvement** | Safe `JSON.parse` fallback; demo account seeding | `"Keep me signed in"` checkbox is ignored; plaintext passwords stored in both `users` and active session; `writeJSON` failures ignored |

---

### 1. Semantic HTML5 Structure

**What works well:**
* Document skeleton, language, and viewport metadata are properly declared ([login.html](file:///c:/Users/ibrar/Downloads/fork%20and%20share/C_GroupNo10_ForkAndShare/pages/login.html#L1-L5)).
* Core landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`) are used cleanly, and forms use native `<form>`, `<button type="submit">`, and `<button type="button">` controls.

**Findings:**
* **High — Page `<h1>` placed inside `<aside>`:** `<aside class="auth-showcase">` ([login.html](file:///c:/Users/ibrar/Downloads/fork%20and%20share/C_GroupNo10_ForkAndShare/pages/login.html#L56-L88)) contains the page's sole `<h1>` ("Join the Fork & Share Kitchen"). `<aside>` represents tangentially related/complementary content; placing the main page heading inside it inverts the document outline. Consider moving the `<h1>` out above `.auth-layout` or changing `.auth-showcase` to a `<div>`/`<section>`.
* **Medium — Misleading active navigation item:** `<a class="nav-link is-active" href="profile.html">Profile</a>` ([login.html](file:///c:/Users/ibrar/Downloads/fork%20and%20share/C_GroupNo10_ForkAndShare/pages/login.html#L42)) styles "Profile" as active on the Sign Up / Login page without `aria-current="page"`.
* **Low — Footer list uses `aria-label` without `<nav>`:** `<ul class="footer-links" aria-label="Footer Navigation">` ([login.html](file:///c:/Users/ibrar/Downloads/fork%20and%20share/C_GroupNo10_ForkAndShare/pages/login.html#L304)) should be wrapped in `<nav aria-label="Footer Navigation">` so assistive tech exposes it as a navigation landmark.
* **Low — Implicit checkbox label wrapping:** `#login-remember` ([login.html](file:///c:/Users/ibrar/Downloads/fork%20and%20share/C_GroupNo10_ForkAndShare/pages/login.html#L280-L283)) relies on implicit `<label>` wrapping; adding `for="login-remember"` improves compatibility with voice-control and older assistive technologies.

---

### 2. Accessible Form Labels, Keyboard Navigation & Error Announcements

**What works well:**
* Every text, email, and password input has a matching `<label for="...">`, `autocomplete` attribute (`name`, `email`, `new-password`, `current-password`), and `aria-describedby` pointing to its feedback element ([login.html](file:///c:/Users/ibrar/Downloads/fork%20and%20share/C_GroupNo10_ForkAndShare/pages/login.html#L122-L277)).
* `setFieldUI()` ([account.js](file:///c:/Users/ibrar/Downloads/fork%20and%20share/C_GroupNo10_ForkAndShare/js/account.js#L445-L462)) toggles `aria-invalid="true"` cleanly.
* `attachPasswordToggle()` ([account.js](file:///c:/Users/ibrar/Downloads/fork%20and%20share/C_GroupNo10_ForkAndShare/js/account.js#L464-L475)) updates both visible button text and `aria-label`.

**Findings:**
* **High — Incomplete ARIA Tabs keyboard pattern:** `#tab-signup` and `#tab-login` use `role="tablist"`, `role="tab"`, `aria-selected`, and `role="tabpanel"` ([login.html](file:///c:/Users/ibrar/Downloads/fork%20and%20share/C_GroupNo10_ForkAndShare/pages/login.html#L91-L115)), but `switchAuthTab()` ([account.js](file:///c:/Users/ibrar/Downloads/fork%20and%20share/C_GroupNo10_ForkAndShare/js/account.js#L518-L526)) does not manage roving `tabindex` (`0` on active tab, `-1` on inactive tab) or `ArrowLeft`/`ArrowRight`/`Home`/`End` keyboard switching expected by the WAI-ARIA Tabs pattern.
* **High — Conflicting live-region attributes and `hidden` toggling on status banners:** `#signup-status-banner` and `#login-status-banner` declare `role="alert" aria-live="polite" hidden` ([login.html](file:///c:/Users/ibrar/Downloads/fork%20and%20share/C_GroupNo10_ForkAndShare/pages/login.html#L119), [login.html](file:///c:/Users/ibrar/Downloads/fork%20and%20share/C_GroupNo10_ForkAndShare/pages/login.html#L236)):
  * `role="alert"` implies `aria-live="assertive"`, contradicting `aria-live="polite"` (and `"info"`/`"success"` banners shouldn't use `role="alert"`).
  * `showBanner()` ([account.js](file:///c:/Users/ibrar/Downloads/fork%20and%20share/C_GroupNo10_ForkAndShare/js/account.js#L560-L565)) un-hides (`display: none` -> visible via [account.css](file:///c:/Users/ibrar/Downloads/fork%20and%20share/C_GroupNo10_ForkAndShare/css/account.css#L211-L213)) and injects `textContent` in the same tick, which causes several screen readers to miss announcements. Keep the live container mounted in the DOM and update its text, or move focus to it.
* **High — No focus management on failed form submission:** When validation fails in `signupForm` ([account.js](file:///c:/Users/ibrar/Downloads/fork%20and%20share/C_GroupNo10_ForkAndShare/js/account.js#L693-L700)) or `loginForm` ([account.js](file:///c:/Users/ibrar/Downloads/fork%20and%20share/C_GroupNo10_ForkAndShare/js/account.js#L789-L810)), focus stays on the Submit button and `*-feedback` spans lack `aria-live`, so field-specific errors are not announced until the user navigates backward. Focus should move to the first invalid field (or an error summary).
* **Medium — Invisible `:focus-visible` indicator on dark green containers:** The global `:focus-visible` outline in [style.css](file:///c:/Users/ibrar/Downloads/fork%20and%20share/C_GroupNo10_ForkAndShare/css/style.css#L78-L88) uses `var(--forest-green)` (`#354C37`), only overriding it for `.site-footer` and `.btn-primary :focus-visible`. Both `.auth-showcase` ([account.css](file:///c:/Users/ibrar/Downloads/fork%20and%20share/C_GroupNo10_ForkAndShare/css/account.css#L243-L250)) and `.auth-tab.is-active` ([account.css](file:///c:/Users/ibrar/Downloads/fork%20and%20share/C_GroupNo10_ForkAndShare/css/account.css#L358-L361)) also have `#354C37` backgrounds, making the focus ring invisible on `#fill-demo-login-btn` and the active tab. Additionally, `.form-input:focus` ([account.css](file:///c:/Users/ibrar/Downloads/fork%20and%20share/C_GroupNo10_ForkAndShare/css/account.css#L141-L147)) sets `outline: none`, which drops focus visibility in OS forced-colors/High Contrast mode.
* **Medium — Overly chatty password strength live region & CSS-only rule state:** `.password-strength` ([login.html](file:///c:/Users/ibrar/Downloads/fork%20and%20share/C_GroupNo10_ForkAndShare/pages/login.html#L182-L192)) wraps the strength meter and rule list in `aria-live="polite"`, announcing changes on every keystroke while typing, yet `#signup-password`'s `aria-describedby` does not reference the rules list. Also, `.password-rule::before` / `.is-met::before` ([account.css](file:///c:/Users/ibrar/Downloads/fork%20and%20share/C_GroupNo10_ForkAndShare/css/account.css#L435-L447)) rely on CSS pseudo-element glyphs (`○` / `✓`) and color rather than explicit status text.
* **Medium — Duplicate toggle labels & missing `aria-pressed`:** Both `#signup-password` and `#signup-confirm` toggle buttons have `aria-label="Show password"` ([login.html](file:///c:/Users/ibrar/Downloads/fork%20and%20share/C_GroupNo10_ForkAndShare/pages/login.html#L173), [login.html](file:///c:/Users/ibrar/Downloads/fork%20and%20share/C_GroupNo10_ForkAndShare/pages/login.html#L212)), making them indistinguishable out of context, and neither sets `aria-pressed`.
* **Low — Low placeholder contrast:** `.form-input::placeholder` uses `rgba(73, 58, 48, 0.55)` ([account.css](file:///c:/Users/ibrar/Downloads/fork%20and%20share/C_GroupNo10_ForkAndShare/css/account.css#L138)) on `#FFFDF9`, which falls below 4.5:1 contrast.

---

### 3. Client-Side Validation Rules

**What works well:**
* Shared validators (`validateFullName`, `validateEmail`, `evaluatePassword` in [account.js](file:///c:/Users/ibrar/Downloads/fork%20and%20share/C_GroupNo10_ForkAndShare/js/account.js#L380-L443)) keep Sign Up and Edit Profile rules consistent.
* Login only requires a non-empty password rather than enforcing Sign Up complexity rules on existing credentials.
* Changing `#signup-password` re-validates `#signup-confirm` whenever confirmation already has a value ([account.js](file:///c:/Users/ibrar/Downloads/fork%20and%20share/C_GroupNo10_ForkAndShare/js/account.js#L677-L679)).

**Findings:**
* **High — `checkLoginPassword()` leaves stale error state when cleared:** In [account.js](file:///c:/Users/ibrar/Downloads/fork%20and%20share/C_GroupNo10_ForkAndShare/js/account.js#L747-L757), when `val` is empty and `showEmptyError` is `false` (on `input`), nothing resets `loginPassword` / `loginPasswordFeedback`. If a user gets `"Incorrect credentials."` or `"Enter your password."` and clears the field, the red error styling and message remain stuck.
* **Medium — `signupPassword` and `signupConfirm` pass `showEmptyError = true` on `input`:** Unlike `signupName` and `signupEmail` (which pass `false` on `input` and revert to hint text when emptied), `signupPassword` and `signupConfirm` pass `true` ([account.js](file:///c:/Users/ibrar/Downloads/fork%20and%20share/C_GroupNo10_ForkAndShare/js/account.js#L676-L683)), immediately throwing `"Password is required."` / `"Please confirm your password."` if the user backspaces to empty. Additionally, running full error styling on the very first keystroke (before `blur` or `submit`) marks fields invalid mid-entry.
* **Medium — Double-submit race during redirect delay:** Neither `signupForm` ([account.js](file:///c:/Users/ibrar/Downloads/fork%20and%20share/C_GroupNo10_ForkAndShare/js/account.js#L718-L727)) nor `loginForm` ([account.js](file:///c:/Users/ibrar/Downloads/fork%20and%20share/C_GroupNo10_ForkAndShare/js/account.js#L812-L816)) disables its submit button during the 650–750ms `setTimeout` before redirecting to `profile.html`. Clicking "Create Account" twice quickly saves the user on click 1, then triggers `"An account with this email already exists."` on click 2 right before redirecting.
* **Medium — Full name regex rejects international characters and allows punctuation-only strings:** `/^[a-zA-Z\s'.-]+$/` ([account.js](file:///c:/Users/ibrar/Downloads/fork%20and%20share/C_GroupNo10_ForkAndShare/js/account.js#L388)) blocks accented/Unicode names (e.g., `José`, `Åsa`) while permitting punctuation-only values of length ≥ 2 such as `"--"` or `".."`. Neither HTML nor JS enforces a `maxlength`.
* **Low — Switching tabs retains stale errors/banners:** Clicking `#tab-login` / `#tab-signup` or `[data-switch-auth]` does not clear previously displayed status banners or validation states.
* **Low — Real-time email uniqueness check on every keystroke:** `checkSignupEmail()` calls `getUsers()` on every `input` event ([account.js](file:///c:/Users/ibrar/Downloads/fork%20and%20share/C_GroupNo10_ForkAndShare/js/account.js#L597-L608)), re-parsing `localStorage` per keystroke and silently seeding `DEFAULT_DEMO_USER` before any form submission occurs.

---

### 4. `localStorage` Session Handling

**What works well:**
* `readJSON()` and `writeJSON()` ([account.js](file:///c:/Users/ibrar/Downloads/fork%20and%20share/C_GroupNo10_ForkAndShare/js/account.js#L219-L238)) guard against invalid JSON and `localStorage` exceptions when reading/writing.
* `#already-signed-banner` ([login.html](file:///c:/Users/ibrar/Downloads/fork%20and%20share/C_GroupNo10_ForkAndShare/pages/login.html#L50-L53), [account.js](file:///c:/Users/ibrar/Downloads/fork%20and%20share/C_GroupNo10_ForkAndShare/js/account.js#L551-L558)) safely renders `activeUser.fullName` with `.textContent` (preventing XSS) and surfaces links to `profile.html` and `saved-recipes.html`.

**Findings:**
* **High — `"Keep me signed in on this device"` (`#login-remember`) is dead UI:** `#login-remember` ([login.html](file:///c:/Users/ibrar/Downloads/fork%20and%20share/C_GroupNo10_ForkAndShare/pages/login.html#L281)) is never read in [account.js](file:///c:/Users/ibrar/Downloads/fork%20and%20share/C_GroupNo10_ForkAndShare/js/account.js). Unchecking it still calls `setCurrentUser(matched)` ([account.js](file:///c:/Users/ibrar/Downloads/fork%20and%20share/C_GroupNo10_ForkAndShare/js/account.js#L812)), persisting the session permanently in `localStorage` rather than falling back to `sessionStorage`.
* **High — Plaintext passwords persisted in both `forkAndShare_users` and the active session (`forkAndShare_currentUser`):** `signupForm` ([account.js](file:///c:/Users/ibrar/Downloads/fork%20and%20share/C_GroupNo10_ForkAndShare/js/account.js#L706)) and `DEFAULT_DEMO_USER` ([account.js](file:///c:/Users/ibrar/Downloads/fork%20and%20share/C_GroupNo10_ForkAndShare/js/account.js#L92)) store raw plaintext passwords, and `setCurrentUser()` ([account.js](file:///c:/Users/ibrar/Downloads/fork%20and%20share/C_GroupNo10_ForkAndShare/js/account.js#L257-L273)) copies the full user object—including `password`—into `forkAndShare_currentUser`. While client-only apps cannot provide true auth security, storing plaintext credentials inside the active session key (rather than omitting `password` from `currentUser` and hashing stored passwords via `crypto.subtle`) exposes passwords unnecessarily.
* **Medium — `writeJSON()` failure is silently ignored during Sign Up / Login:** `setCurrentUser()` and `saveUsers()` discard `writeJSON()`'s boolean return value ([account.js](file:///c:/Users/ibrar/Downloads/fork%20and%20share/C_GroupNo10_ForkAndShare/js/account.js#L249-L273)). If `localStorage` throws `QuotaExceededError` or is blocked, the form still displays `"Account created successfully!"` / `"Welcome back..."` and redirects to `profile.html` as an unauthenticated guest. (Similarly, `localStorage.removeItem` on [account.js](file:///c:/Users/ibrar/Downloads/fork%20and%20share/C_GroupNo10_ForkAndShare/js/account.js#L259) lacks a `try/catch`.)
* **Medium — Fragile user lookup & lack of schema validation on stored session:** `setCurrentUser()` assumes `u.email` and `user.email` are always strings (`u.email.toLowerCase()`, [account.js](file:///c:/Users/ibrar/Downloads/fork%20and%20share/C_GroupNo10_ForkAndShare/js/account.js#L265)), and `getCurrentUser()` ([account.js](file:///c:/Users/ibrar/Downloads/fork%20and%20share/C_GroupNo10_ForkAndShare/js/account.js#L253-L255)) does not verify the parsed value is a valid user object with `id`, `email`, and `fullName`.
* **Low — Saved recipes & cross-tab sessions are not user-scoped or synced:** `STORAGE_KEYS.SAVED_RECIPES` ([account.js](file:///c:/Users/ibrar/Downloads/fork%20and%20share/C_GroupNo10_ForkAndShare/js/account.js#L14)) is global across all accounts rather than keyed by `user.id`, and there is no `window` `"storage"` listener to keep `#already-signed-banner` or active sessions synchronized across tabs.

---

### Prioritized Action Checklist

1. **Fix functional & session bugs:** Wire `#login-remember` to choose between `localStorage` and `sessionStorage`; fix `checkLoginPassword()` clearing behavior; disable submit buttons during redirect timeouts; check `writeJSON()` return values before redirecting.
2. **Fix accessibility blockers:** Move focus to the first invalid input on failed submit; keep status banner live regions mounted instead of toggling `hidden` + text simultaneously (and resolve `role="alert"` vs `aria-live="polite"`); add roving `tabindex` and arrow-key support to `.auth-tabs`; add light `:focus-visible` outlines inside `.auth-showcase` and `.auth-tab.is-active`.
3. **Tighten semantics & validation polish:** Move `<h1>` out of `<aside>`; wrap footer links in `<nav>`; refine `checkSignupPassword`/`checkSignupConfirm` empty-input handling; widen `validateFullName` beyond ASCII while rejecting punctuation-only inputs; strip `password` from `forkAndShare_currentUser` (and optionally hash passwords in `forkAndShare_users`).
