# Repo2Guide

Generate a beginner-friendly developer guide from any public GitHub repository — without cloning or executing code.

## Quick start

```bash
npm install
cp .env.example .env
# (optional) add your GitHub token to .env to raise the API rate limit
npm start
```

Open **http://localhost:3000** in your browser.

---

## What it does

Paste a public GitHub URL → get a structured guide with:

- **Summary** — name, description, language, stars, forks
- **Stack detection** — identifies the primary technology from known config files
- **Requirements** — what a developer needs to install
- **Commands** — install, run, build commands for the detected stack
- **Beginner explanation** — plain-English paragraph describing the project
- **Architecture diagram** — Mermaid graph text ready to paste into [mermaid.live](https://mermaid.live)
- **Visual brief** — stub for future image generation (mode + placeholder prompt)

No code is cloned. No code is executed. Only known config filenames are fetched.

---

## API

### GET /health

```bash
curl http://localhost:3000/health
```

```json
{ "status": "ok", "version": "0.1.0" }
```

### POST /api/generate-guide

**Request**

```bash
curl -s -X POST http://localhost:3000/api/generate-guide \
  -H "Content-Type: application/json" \
  -d '{"url":"https://github.com/expressjs/express"}' | jq .
```

**Response shape**

```json
{
  "summary": {
    "name": "express",
    "description": "Fast, unopinionated, minimalist web framework for node.",
    "stars": 64000,
    "forks": 14000,
    "language": "JavaScript",
    "url": "https://github.com/expressjs/express",
    "owner": "expressjs",
    "repo": "express",
    "defaultBranch": "master",
    "updatedAt": "2024-01-01T00:00:00Z",
    "archived": false
  },
  "stack": {
    "detected": "express",
    "confidence": "high",
    "indicators": ["package.json with express"]
  },
  "requirements": ["Node.js 18+", "npm"],
  "commands": {
    "install": "npm install",
    "run": "node server.js",
    "dev": "npm run dev"
  },
  "warnings": [],
  "mermaidDiagram": "graph TD\n  Client[\"HTTP Client\"] --> Express[\"Express Server\"]\n  ...",
  "guide": [
    { "title": "About this project", "content": "..." },
    { "title": "Tech stack", "content": "..." },
    { "title": "Requirements", "content": "..." },
    { "title": "Getting started", "content": "..." }
  ],
  "beginnerExplanation": "express is a Node.js web server ...",
  "visual": {
    "mode": "screenshot-assisted",
    "visualBrief": "...",
    "imagePrompt": "[PLACEHOLDER] ...",
    "disclaimer": null,
    "screenshots": [{ "alt": "demo", "resolvedUrl": "https://raw.githubusercontent.com/..." }]
  }
}
```

---

## Test examples

Try these URLs in the UI or via curl:

| URL | Expected stack |
|-----|---------------|
| `https://github.com/vitejs/vite` | vite / high |
| `https://github.com/vercel/next.js` | nextjs / high |
| `https://github.com/expressjs/express` | express / high |
| `https://github.com/django/django` | python / high |
| `https://github.com/BurntSushi/ripgrep` | rust / high |
| `https://github.com/gin-gonic/gin` | go / high |

**Error cases to verify:**

```bash
# Non-GitHub URL → 400
curl -s -X POST http://localhost:3000/api/generate-guide \
  -H "Content-Type: application/json" \
  -d '{"url":"https://gitlab.com/owner/repo"}'

# Missing repo → 400
curl -s -X POST http://localhost:3000/api/generate-guide \
  -H "Content-Type: application/json" \
  -d '{"url":"https://github.com/owner"}'

# Non-existent repo → 404
curl -s -X POST http://localhost:3000/api/generate-guide \
  -H "Content-Type: application/json" \
  -d '{"url":"https://github.com/this-owner-does-not-exist-xyz/repo"}'
```

---

## Configuration

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | HTTP server port |
| `GITHUB_TOKEN` | — | GitHub personal access token. Without it: 60 req/hour per IP. With it: 5000/hour. Create at [github.com/settings/tokens](https://github.com/settings/tokens) |

---

## Project structure

```
repo2guide/
├── server.js                        # Express server, API routes
├── package.json
├── .env.example
├── public/
│   ├── index.html                   # Single-page UI (4 states)
│   ├── style.css
│   ├── app.js
│   └── assets/
│       ├── repo2guide-demo.mp4      # (provide separately)
│       └── poster.png               # (provide separately)
├── src/
│   ├── safety/validateRepoUrl.js    # URL validation
│   ├── github/
│   │   ├── parseRepoUrl.js
│   │   ├── fetchRepoMeta.js
│   │   ├── fetchRepoFiles.js        # whitelist-only file fetch
│   │   ├── fetchReadme.js
│   │   └── detectStack.js
│   ├── guide/
│   │   ├── buildGuide.js
│   │   ├── buildCommands.js
│   │   └── buildBeginnerExplanation.js
│   ├── diagrams/buildMermaidDiagram.js
│   └── visual/
│       ├── extractReadmeImages.js
│       ├── resolveGithubImageUrls.js
│       ├── chooseVisualMode.js
│       └── buildVisualBrief.js      # stub — no image API called
└── docs/
    ├── ARCHITECTURE_LOCK_v0.1.md
    ├── MVP_SCOPE.md
    ├── VALIDATION_CHECKLIST.md
    ├── DECISIONS.md
    └── UI_VISION_LOCK_v0.1.md
```

---

## Video asset

The homepage references `/assets/repo2guide-demo.mp4` and `/assets/poster.png`.
If these files are absent the UI automatically shows a styled fallback box.
To add the video, place an MP4 (8–12 seconds, looping, silent) at `public/assets/repo2guide-demo.mp4`.

---

## Safety

- Only `github.com` URLs are accepted
- Only a hardcoded whitelist of known config filenames is ever fetched
- No code is cloned, interpreted, or executed
- Image URLs from READMEs are resolved but never fetched or stored
- The visual layer returns placeholder strings only — no image generation API is called
