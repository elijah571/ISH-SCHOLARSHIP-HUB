# Countries Navigation + Country Scholarships Page

## TL;DR

> **Quick Summary**: Add a "Countries" dropdown to the Navbar with a hardcoded list of 9 popular countries. Clicking a country navigates to a dedicated `CountryScholarshipsPage` that fetches and displays scholarships filtered by that country.
> 
> **Deliverables**:
> - Shared `countries.js` constants file (9 countries with names + slugs)
> - `CountryDropdown.jsx` reusable dropdown component (desktop + mobile)
> - `Navbar.jsx` updated with Countries dropdown integration
> - `CountryScholarshipsPage.jsx` dedicated country page
> - Route `/countries/:country` added to `App.jsx`
> 
> **Estimated Effort**: Quick
> **Parallel Execution**: YES - 3 parallel tasks in Wave 1, then 2 sequential
> **Critical Path**: Task 1 → Task 2 → Task 3 → Task 4 → Task 5

---

## Context

### Original Request
Add a "Countries" navlink dropdown to the Navbar. When a country is clicked, redirect to a page showing all scholarships for that country. Reference images at `Frontend/src/assets/countries.png` (dropdown) and `Frontend/src/assets/single-country-page.png` (page).

### Interview Summary
**Key Decisions**:
- Country list: hardcoded (same 9 countries from FiltersSidebar.jsx)
- Country page: dedicated page with its own layout, not reusing ScholarshipListingPage
- Mobile: dropdown appears in hamburger menu too
- No backend changes needed — existing `/api/scholarship?country=X` already supports filtering

### Research Findings
- Existing scholarship API accepts `?country=` query param (verified in scholarship.service.js)
- Navbar uses `navLinks` array; no dropdown pattern exists yet in navigation
- `ScholarshipList`, `Pagination`, `PageHeader` components are reusable
- FiltersSidebar.jsx has 9 countries hardcoded: US, UK, Canada, Australia, Germany, France, Netherlands, Japan, Singapore
- All pages use `*Page.jsx` naming, default export
- Tailwind v4 CSS-first config

---

## Work Objectives

### Core Objective
Add country navigation and a country-specific scholarship listing page.

### Concrete Deliverables
- `Frontend/src/data/countries.js` — shared country constants
- `Frontend/src/components/CountryDropdown.jsx` — dropdown component
- `Frontend/src/components/Navbar.jsx` — updated with dropdown
- `Frontend/src/pages/CountryScholarshipsPage.jsx` — country page
- `Frontend/src/App.jsx` — new route added

### Definition of Done
- [ ] Navbar shows "Countries" link with dropdown on desktop
- [ ] Dropdown shows 9 countries, clicking one navigates to `/countries/:country`
- [ ] Mobile hamburger menu also shows country list
- [ ] Country page loads scholarships filtered by country via API
- [ ] Country page shows country name as heading, scholarship cards below
- [ ] No backend changes required

### Must Have
- Dropdown works on both desktop and mobile
- Country page fetches real data from existing API
- Back navigation works correctly

### Must NOT Have (Guardrails)
- No backend/API changes
- No dynamic country discovery
- No modification to existing scholarship listing page
- No new dependencies
- No `.jsx` extensions in import paths (project convention)

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: NO
- **Automated tests**: None
- **Agent-Executed QA**: ALL tasks include manual verification via dev server + browser

### QA Policy
- Start both dev servers: `cd Frontend && npm run dev` + `cd Backend && npm run dev`
- Verify in browser at http://localhost:5173
- Capture screenshots to `.sisyphus/evidence/`

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — 3 parallel tasks):
├── Task 1: Country constants file [quick]
├── Task 2: CountryDropdown component [quick]
└── Task 3: CountryScholarshipsPage [visual-engineering]

Wave 2 (After Wave 1 — 2 tasks, sequential):
├── Task 4: Navbar integration (depends: 2) [quick]
└── Task 5: Route in App.jsx (depends: 3) [quick]

Wave FINAL (After ALL tasks — 2 parallel reviews):
├── Task F1: Plan compliance + QA verification (oracle)
└── Task F2: Manual QA — browser testing (unspecified-high)

Critical Path: Task 1 → Task 2 → Task 4 → Task 5
              Task 1 → Task 3 → Task 5
Parallel Speedup: ~60% faster than sequential
```

---

## TODOs

- [ ] 1. Create shared country constants file

  **What to do**:
  - Create `Frontend/src/data/countries.js` with hardcoded list of 9 countries
  - Each country: `{ name: 'United States', slug: 'united-states' }`
  - Export a `COUNTRIES` array and a `getCountryBySlug(slug)` helper
  - Match the existing 9 countries from `FiltersSidebar.jsx`: United States, United Kingdom, Canada, Australia, Germany, France, Netherlands, Japan, Singapore

  **Must NOT do**:
  - No API calls, no dynamic fetching
  - No new dependencies

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3)
  - **Blocks**: Task 2, Task 3
  - **Blocked By**: None

  **References**:
  - `Frontend/src/components/scholarships/FiltersSidebar.jsx:13-23` — existing hardcoded country list to mirror

  **Acceptance Criteria**:
  - [ ] `Frontend/src/data/countries.js` exists with `COUNTRIES` export (9 items)
  - [ ] `getCountryBySlug('united-states')` returns correct object
  - [ ] `getCountryBySlug('nonexistent')` returns null

  **QA Scenarios**:
  ```
  Scenario: Country list exports correctly
    Tool: Bash (node REPL)
    Steps:
      1. cd Frontend && node -e "import('./src/data/countries.js').then(m => { console.log(JSON.stringify(m.COUNTRIES, null, 2)); console.log('Count:', m.COUNTRIES.length); })"
      2. Assert: 9 countries listed, each has name and slug
    Evidence: .sisyphus/evidence/task-1-country-list-output.txt

  Scenario: getCountryBySlug helper works
    Tool: Bash (node REPL)
    Steps:
      1. cd Frontend && node -e "import('./src/data/countries.js').then(m => { console.log(m.getCountryBySlug('united-kingdom')); console.log(m.getCountryBySlug('nonexistent')); })"
      2. Assert: UK object returned, null for nonexistent
    Evidence: .sisyphus/evidence/task-1-country-slug-output.txt
  ```

  **Commit**: YES
  - Message: `feat(frontend): add shared country constants`
  - Files: `Frontend/src/data/countries.js`

- [ ] 2. Create CountryDropdown component

  **What to do**:
  - Create `Frontend/src/components/CountryDropdown.jsx`
  - Desktop: hover/click shows dropdown panel with country list, each country is a `<Link>` to `/countries/:slug`
  - Mobile: renders as a collapsible section within the hamburger menu
  - Use `COUNTRIES` from the shared constants file
  - Style: white dropdown panel with shadow, country names in gray with blue hover
  - Accept `isMobile` prop or `onCountryClick` prop to handle both modes

  **Must NOT do**:
  - No `.jsx` extension in any import paths
  - No state management library, use React `useState`
  - No modification to other components yet

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3)
  - **Blocks**: Task 4
  - **Blocked By**: Task 1

  **References**:
  - `Frontend/src/data/countries.js` — (Task 1 output) source of country list
  - `Frontend/src/components/Navbar.jsx` — integration target, study styling patterns
  - `Frontend/src/components/Button.jsx` — reusable component pattern to follow

  **Acceptance Criteria**:
  - [ ] `Frontend/src/components/CountryDropdown.jsx` exists with named export
  - [ ] Dropdown renders 9 countries as clickable links
  - [ ] Each link navigates to `/countries/:slug`

  **QA Scenarios**:
  ```
  Scenario: Dropdown renders in browser
    Tool: Playwright (playwright skill)
    Steps:
      1. Navigate to http://localhost:5173
      2. Hover over or click "Countries" in navbar
      3. Assert dropdown panel appears with 9 country names visible
      4. Screenshot the open dropdown
    Evidence: .sisyphus/evidence/task-2-dropdown-visibility.png
  ```

  **Commit**: YES
  - Message: `feat(frontend): add CountryDropdown component`
  - Files: `Frontend/src/components/CountryDropdown.jsx`

- [ ] 3. Create CountryScholarshipsPage

  **What to do**:
  - Create `Frontend/src/pages/CountryScholarshipsPage.jsx`
  - Read `:country` slug from URL params (`useParams`)
  - Look up country name from `COUNTRIES` constants
  - Fetch scholarships filtered by country using `scholarshipService.getAll({ country: countryName, page, limit: 10 })`
  - Display: country name as page heading, scholarship count, ScholarshipList component for cards, Pagination
  - Handle "no scholarships found" state with a friendly message
  - Include Navbar and Footer
  - Show loading state while fetching

  **Must NOT do**:
  - No modification to ScholarshipListingPage
  - No new API endpoints
  - No `.jsx` extensions in imports

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2)
  - **Blocks**: Task 5
  - **Blocked By**: Task 1

  **References**:
  - `Frontend/src/data/countries.js` — (Task 1 output) country name lookup
  - `Frontend/src/pages/ScholarshipListingPage.jsx` — pattern reference for page structure (but create own layout)
  - `Frontend/src/components/scholarships/ScholarshipList.jsx` — reusable component for scholarship cards
  - `Frontend/src/components/scholarships/Pagination.jsx` — reusable pagination
  - `Frontend/src/services/scholarshipService.js:19-30` — API call with country filter

  **Acceptance Criteria**:
  - [ ] `Frontend/src/pages/CountryScholarshipsPage.jsx` exists with default export
  - [ ] Page loads scholarships filtered by country from URL param
  - [ ] Shows country name, scholarship count, loading/error states
  - [ ] Pagination works for countries with >10 scholarships

  **QA Scenarios**:
  ```
  Scenario: Country page loads scholarships
    Tool: Playwright (playwright skill)
    Steps:
      1. Navigate to http://localhost:5173/countries/united-states
      2. Assert: Page heading shows "United States Scholarships" or similar
      3. Assert: Scholarship cards are displayed (or "No scholarships found" if none exist)
      4. Screenshot the page
    Evidence: .sisyphus/evidence/task-3-country-page-loaded.png

  Scenario: Invalid country slug shows appropriate state
    Tool: Playwright (playwright skill)
    Steps:
      1. Navigate to http://localhost:5173/countries/invalid-country-name
      2. Assert: Shows "No scholarships found" or error state (not crash)
      3. Screenshot the page
    Evidence: .sisyphus/evidence/task-3-invalid-country.png
  ```

  **Commit**: YES
  - Message: `feat(frontend): add CountryScholarshipsPage`
  - Files: `Frontend/src/pages/CountryScholarshipsPage.jsx`

- [ ] 4. Integrate CountryDropdown into Navbar

  **What to do**:
  - Update `Frontend/src/components/Navbar.jsx`
  - Add `CountryDropdown` import
  - Add "Countries" entry to navLinks or render CountryDropdown inline
  - Desktop: show dropdown in the nav links area
  - Mobile: show country list in the hamburger menu section (within the `isMenuOpen` block)
  - Ensure the dropdown doesn't break existing nav styling or functionality

  **Must NOT do**:
  - No restructuring of existing navLinks array logic
  - No changes to other nav items
  - No new dependencies

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Sequential**: After Task 2 completes
  - **Blocks**: Task 5 (indirectly, via integration testing)
  - **Blocked By**: Task 2

  **References**:
  - `Frontend/src/components/Navbar.jsx` — file to modify, study full structure
  - `Frontend/src/components/CountryDropdown.jsx` — (Task 2 output) component to integrate

  **Acceptance Criteria**:
  - [ ] "Countries" appears in desktop navbar with working dropdown
  - [ ] Countries list appears in mobile hamburger menu
  - [ ] All existing nav links still work (Scholarships, Blogs, Internships, Chat)
  - [ ] Dropdown closes when clicking outside or navigating

  **QA Scenarios**:
  ```
  Scenario: Desktop Countries dropdown works
    Tool: Playwright (playwright skill)
    Steps:
      1. Navigate to http://localhost:5173
      2. Assert: "Countries" link visible in navbar
      3. Hover/click "Countries" → assert dropdown opens with 9 countries
      4. Click "United States" → assert navigation to /countries/united-states
      5. Screenshot open dropdown
    Evidence: .sisyphus/evidence/task-4-desktop-dropdown.png

  Scenario: Mobile Countries list works
    Tool: Playwright (playwright skill)
    Steps:
      1. Navigate to http://localhost:5173 with mobile viewport (375x812)
      2. Click hamburger menu button
      3. Assert: Country list visible within mobile menu
      4. Click a country → assert navigation to /countries/:slug
      5. Screenshot mobile menu with countries
    Evidence: .sisyphus/evidence/task-4-mobile-countries.png
  ```

  **Commit**: YES
  - Message: `feat(frontend): integrate CountryDropdown into Navbar`
  - Files: `Frontend/src/components/Navbar.jsx`

- [ ] 5. Add route to App.jsx

  **What to do**:
  - Update `Frontend/src/App.jsx`
  - Import `CountryScholarshipsPage`
  - Add route: `<Route path="/countries/:country" element={<CountryScholarshipsPage />} />`
  - Place it logically among existing routes (near scholarship routes)
  - No other changes to App.jsx

  **Must NOT do**:
  - No route protection (country pages are public)
  - No modifications to existing routes

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Sequential**: After Task 3 completes
  - **Blocks**: Final verification
  - **Blocked By**: Task 3

  **References**:
  - `Frontend/src/App.jsx:27-28` — existing scholarship routes as placement reference

  **Acceptance Criteria**:
  - [ ] Route `/countries/:country` navigates to CountryScholarshipsPage
  - [ ] No TypeScript/lint errors

  **QA Scenarios**:
  ```
  Scenario: Route navigates correctly
    Tool: Playwright (playwright skill)
    Steps:
      1. Navigate to http://localhost:5173/countries/canada
      2. Assert: CountryScholarshipsPage renders (page heading visible)
      3. Screenshot the page
    Evidence: .sisyphus/evidence/task-5-route-navigation.png
  ```

  **Commit**: YES
  - Message: `feat(frontend): add countries route to App.jsx`
  - Files: `Frontend/src/App.jsx`

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 2 review agents run in PARALLEL. ALL must APPROVE.

- [ ] F1. **Plan Compliance + QA Verification** — `oracle`
  Read the plan. For each deliverable: verify file exists (read file content), check route works, verify Navbar integration. Confirm all 5 tasks completed. Check evidence files in .sisyphus/evidence/. Verify no backend files were modified.
  Output: `Deliverables [N/N] | Tasks [N/N] | Must Have [N/N] | Must NOT Have [N/N] | VERDICT`

- [ ] F2. **Manual QA — Browser Testing** — `unspecified-high`
  Start both dev servers. Test: 1) Navbar dropdown opens with 9 countries on desktop, 2) Click a country → navigates to correct page, 3) Country page shows scholarships, 4) Mobile hamburger menu shows countries, 5) Invalid country slug doesn't crash. Save screenshots to `.sisyphus/evidence/final-qa/`.
  Output: `Scenarios [N/N pass] | VERDICT`

---

## Commit Strategy

- **1**: `feat(frontend): add shared country constants` — Frontend/src/data/countries.js
- **2**: `feat(frontend): add CountryDropdown component` — Frontend/src/components/CountryDropdown.jsx
- **3**: `feat(frontend): add CountryScholarshipsPage` — Frontend/src/pages/CountryScholarshipsPage.jsx
- **4**: `feat(frontend): integrate CountryDropdown into Navbar` — Frontend/src/components/Navbar.jsx
- **5**: `feat(frontend): add countries route to App.jsx` — Frontend/src/App.jsx

---

## Success Criteria

### Verification Commands
```bash
cd Frontend && npm run build   # Expected: build succeeds, no errors
cd Frontend && npm run lint    # Expected: no lint errors
```

### Final Checklist
- [ ] "Countries" dropdown visible in desktop navbar
- [ ] 9 countries listed in dropdown, all clickable
- [ ] Mobile hamburger menu shows countries
- [ ] Country page loads with filtered scholarships
- [ ] Invalid country handled gracefully
- [ ] No backend files modified
- [ ] No `.jsx` extensions in import paths
