# Validation Checklist — v0.1

Use this checklist before each release to verify core functionality.

## Setup

- [ ] `npm install` completes without errors
- [ ] `cp .env.example .env` works and the file is correct
- [ ] `npm start` starts the server on the configured port
- [ ] `GET /health` returns `{ "status": "ok", "version": "0.1.0" }`

## Safety

- [ ] Submitting `https://gitlab.com/owner/repo` returns 400 with "Only github.com repositories are supported."
- [ ] Submitting `not-a-url` returns 400 with "Invalid URL format."
- [ ] Submitting `https://github.com/owner` (missing repo) returns 400
- [ ] Submitting `https://github.com/owner/repo/blob/main/file.js` (subdirectory) returns 400
- [ ] A private or non-existent repo returns 404

## Stack detection

- [ ] `https://github.com/vitejs/vite` → detected: `vite`, confidence: `high`
- [ ] `https://github.com/vercel/next.js` → detected: `nextjs`, confidence: `high`
- [ ] `https://github.com/expressjs/express` → detected: `express`, confidence: `high`
- [ ] `https://github.com/django/django` → detected: `python`, confidence: `high`
- [ ] A repo with only a Dockerfile → detected: `docker`, confidence: `low`
- [ ] A repo with no known files → detected: `unknown`, confidence: `low`

## Response shape

- [ ] Response includes: `summary`, `stack`, `requirements`, `commands`, `warnings`, `mermaidDiagram`, `guide`, `beginnerExplanation`, `visual`
- [ ] `stack.confidence` is one of: `high`, `medium`, `low`
- [ ] `visual.mode` is one of: `screenshot-assisted`, `readme-imagined`, `diagram-only`
- [ ] `visual.imagePrompt` starts with `[PLACEHOLDER]` (or is null for diagram-only)
- [ ] `visual.disclaimer` is present for `readme-imagined` mode
- [ ] Archived repos include a warning in `warnings[]`

## Manual UI Flow

Run through these steps **in order** in a browser against a live `npm start`. Each step must pass before moving to the next.

### Step 1 — Empty state loads
- [ ] Open `http://localhost:3000`
- [ ] Page renders with white background, logo, and tagline
- [ ] Input field and "Generate Guide" button are visible
- [ ] **If `public/assets/repo2guide-demo.mp4` is absent:** a styled fallback box appears in the video area reading the tagline text (not a broken media element)
- [ ] **If the video file is present:** it autoplays silently in the hero area with no controls visible

### Step 2 — Loading state: 5 scan steps appear
- [ ] Enter `https://github.com/expressjs/express` and click Generate Guide
- [ ] View transitions away from empty state immediately (no blank screen)
- [ ] Loading view is visible (not hidden behind the `hidden` class)
- [ ] Five scan step items appear in sequence: Validating URL → Fetching repository metadata → Scanning configuration files → Detecting tech stack → Building guide
- [ ] Each step shows ⟳ (spinning) while active, then ✓ (done) when complete
- [ ] Steps do not all appear simultaneously

### Step 3 — Result state renders all cards
- [ ] After API responds, result view becomes visible (not blank)
- [ ] Summary card shows repo name, description, language, star count, fork count
- [ ] "View on GitHub ↗" link opens the correct GitHub URL in a new tab
- [ ] Stack badge shows detected stack + confidence level (coloured chip)
- [ ] "What is this project?" card shows a plain-English paragraph
- [ ] "What you need installed" card shows a bullet list of requirements
- [ ] "How to run it" card shows `install` and other commands from actual `package.json` scripts (not invented defaults)
- [ ] Architecture diagram card shows Mermaid `graph TD` text
- [ ] "Copy diagram" button copies diagram text to clipboard; button text changes to "Copied!" briefly

### Step 4 — Visual brief card renders correctly
- [ ] Visual brief card is visible in the result state
- [ ] Card shows `visualBrief` text (plain text, no raw HTML)
- [ ] For `readme-imagined` mode: disclaimer reads "Conceptual visualization based on README text — no image has been generated."
- [ ] For `screenshot-assisted` mode: screenshot links appear as chips with alt text; no disclaimer shown
- [ ] For `diagram-only` mode: brief says "No visual assets found" and no screenshots or disclaimer appear
- [ ] **`imagePrompt` is not visible anywhere on the page** (it is a backend-only stub field)
- [ ] Nothing on the page implies an image was generated or that an image generation API was called

### Step 5 — Invalid URL returns friendly error
- [ ] Enter `https://gitlab.com/some/repo` and click Generate Guide
- [ ] Error view appears (not blank, not loading)
- [ ] Error message says "Only github.com repositories are supported." (no stack trace)
- [ ] Enter `not-a-url` → error message says "Invalid URL format."
- [ ] Enter `https://github.com/this-user-does-not-exist-xyz/repo` → message says "Repository not found or is private."

### Step 6 — Retry works
- [ ] After any error, a "Try a different URL" button is visible
- [ ] Clicking it returns to the empty state (input + video/fallback, no stale result data)
- [ ] Generate Guide button is re-enabled (not greyed out)
- [ ] Entering a valid URL after retry completes successfully (end-to-end)

### Step 7 — "Try another" from result state
- [ ] In the result state, click "← Try another" in the header
- [ ] Returns to empty state; input field is blank or retains the previous URL
- [ ] Generate Guide button is re-enabled
- [ ] Submitting a new URL works correctly

---

## Frontend (automated checks)

- [ ] On mobile (≤375px), input and button stack vertically
- [ ] "Copy diagram" button copies the Mermaid string to clipboard

## Rate limiting

- [ ] Without `GITHUB_TOKEN`: works for low-volume usage
- [ ] A rate-limit 403 from GitHub returns a 429 with a helpful message about setting `GITHUB_TOKEN`
