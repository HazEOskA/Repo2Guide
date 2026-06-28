# Architecture Lock — v0.1

> These constraints are locked for the MVP. Do not introduce components outside
> this list without updating this document and the DECISIONS log.

## Runtime

| Layer | Choice | Reason |
|---|---|---|
| Runtime | Node.js 18+ | Built-in `fetch`, `Buffer`; no extra HTTP client needed |
| Server | Express 4 | Minimal, well-understood, no overhead |
| Frontend | Vanilla HTML/CSS/JS | No build step, no framework dependency |
| Database | None | All data is ephemeral; guides are generated on demand |
| Auth | None | Public API only |

## Module Map

```
server.js                   ← Express entry point
src/
  safety/
    validateRepoUrl.js      ← rejects non-github.com URLs before any network call
  github/
    parseRepoUrl.js         ← extracts owner + repo from validated URL
    fetchRepoMeta.js        ← GET /repos/{owner}/{repo}
    fetchRepoFiles.js       ← fetches KNOWN_FILES whitelist only
    fetchReadme.js          ← GET /repos/{owner}/{repo}/readme
    detectStack.js          ← pure function: files → stack object
  guide/
    buildGuide.js           ← requirements + warnings + sections
    buildCommands.js        ← stack → command map
    buildBeginnerExplanation.js ← stack + meta → plain-English paragraph
  diagrams/
    buildMermaidDiagram.js  ← stack → Mermaid graph string
  visual/
    extractReadmeImages.js  ← parse README for image refs
    resolveGithubImageUrls.js ← relative paths → raw.githubusercontent.com
    chooseVisualMode.js     ← screenshot-assisted | readme-imagined | diagram-only
    buildVisualBrief.js     ← returns brief + imagePrompt placeholder
public/
  index.html                ← single-page UI (4 states)
  style.css                 ← light theme, no framework
  app.js                    ← vanilla JS, state machine for 4 views
  assets/                   ← video + poster (must be provided separately)
docs/                       ← design documents
```

## API Surface

```
GET  /health                → { status, version }
POST /api/generate-guide    → { summary, stack, requirements, commands,
                                warnings, mermaidDiagram, guide,
                                beginnerExplanation, visual }
```

## Safety Constraints (non-negotiable)

1. **No code execution** — the app never clones, runs, or evaluates repo code.
2. **Whitelist-only file fetch** — `fetchRepoFiles` only requests filenames in its `KNOWN_FILES` constant.
3. **URL validation first** — `validateRepoUrl` runs before any GitHub API call.
4. **github.com only** — any other hostname is rejected with a 400.
5. **No arbitrary paths** — file paths are never user-controlled; only the repo URL is accepted.
6. **Image limit: 5 (safety + MVP + performance)** — `extractReadmeImages` caps at 5 unique images.
   - *Safety*: limits the number of third-party URLs entering the pipeline per request, reducing exposure if a README embeds unexpected or adversarial sources.
   - *MVP scope*: a visual brief only needs representative images (typically 1–2); exhaustive scanning adds no product value at this stage.
   - *Performance*: READMEs can contain dozens of badge images; capping keeps the pipeline predictable.
   To change this limit, update `extractReadmeImages.js` and record the decision in `DECISIONS.md`.
7. **No image download** — `resolveGithubImageUrls` returns URLs only; it does not fetch, proxy, or store image content.
8. **No image generation** — `buildVisualBrief` returns a `[PLACEHOLDER]` `imagePrompt` string. `generated` is always `false`. No generative AI API is called. The UI must not imply otherwise.

## Confidence Levels

| Value | Meaning |
|---|---|
| `high` | Two or more strong indicators (e.g. package.json + config file) |
| `medium` | One clear indicator (e.g. only package.json present) |
| `low` | No indicators found; fallback to `unknown` stack |

## Visual Layer Status (stub)

The visual layer is a **stub for v0.1**. It:
- Parses README images
- Resolves URLs
- Returns a `visual` object with `mode`, `visualBrief`, and `imagePrompt`
- Does **not** call any image generation API
- `imagePrompt` values are prefixed with `[PLACEHOLDER]`
