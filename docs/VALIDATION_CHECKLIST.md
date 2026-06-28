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

## Frontend

- [ ] Opening `http://localhost:3000` shows the hero (video or fallback box)
- [ ] Fallback box appears when the video file is absent
- [ ] Submitting a valid URL transitions through all 5 scan steps
- [ ] Result state shows all sections
- [ ] "Copy diagram" button copies the Mermaid string to clipboard
- [ ] "Try another" button returns to the empty state
- [ ] Error state shows a human-readable message and a retry button
- [ ] On mobile (≤375px), input and button stack vertically

## Rate limiting

- [ ] Without `GITHUB_TOKEN`: works for low-volume usage
- [ ] A rate-limit 403 from GitHub returns a 429 with a helpful message about setting `GITHUB_TOKEN`
