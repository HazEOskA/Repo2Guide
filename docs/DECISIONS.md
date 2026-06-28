# Decision Log

## D-001 — No React, no build step
**Date:** 2026-06-28
**Decision:** Frontend is plain HTML + CSS + vanilla JS. No React, Vue, or bundler.
**Reason:** Eliminates a build step for a single-page MVP. The UI has four well-defined states that are trivially managed with a `showView()` function. Adding a framework would cost more than it saves at this scale.

## D-002 — No node-fetch; use Node 18 built-in fetch
**Date:** 2026-06-28
**Decision:** All HTTP requests use the global `fetch` available since Node.js 18.
**Reason:** Removes a runtime dependency. `engines.node >= 18` is already required.

## D-003 — Whitelist-only file fetching
**Date:** 2026-06-28
**Decision:** `fetchRepoFiles` only requests a hardcoded list of known filenames (`KNOWN_FILES`). No user-controlled paths ever reach the GitHub API.
**Reason:** Safety. Prevents path traversal, secret leakage, or accidental fetching of large binary blobs.

## D-004 — No database; guides are ephemeral
**Date:** 2026-06-28
**Decision:** No persistence layer of any kind. Each request is self-contained.
**Reason:** MVP simplicity. Sharing or history are out of scope for v0.1 (see MVP_SCOPE.md).

## D-005 — Confidence levels: high / medium / low
**Date:** 2026-06-28
**Decision:** Stack detection returns one of three confidence values rather than a numeric score.
**Reason:** Simpler to display and reason about. The three levels map naturally to UI colour coding (green / amber / red). A numeric score would imply false precision.

## D-006 — Visual layer is a stub in v0.1
**Date:** 2026-06-28
**Decision:** `buildVisualBrief` returns a placeholder `imagePrompt` string prefixed with `[PLACEHOLDER]`. No image generation API is called.
**Reason:** Image generation requires provider selection, cost modelling, and safety review. The stub establishes the data contract (mode, visualBrief, imagePrompt, disclaimer) without committing to a provider.

## D-007 — Visual mode selection hierarchy
**Date:** 2026-06-28
**Decision:** Mode priority is `screenshot-assisted` > `readme-imagined` > `diagram-only`. A repo must have README images with screenshot-like filenames or extensions to trigger `screenshot-assisted`.
**Reason:** Diagram-only is the safest fallback. We only claim screenshot assistance when we have actual image references, and only claim readme-imagined when the README has enough text to base a brief on.

## D-008 — GitHub token is optional
**Date:** 2026-06-28
**Decision:** `GITHUB_TOKEN` is read from the environment but is never required. Unauthenticated requests get 60/hour per IP.
**Reason:** Lowers barrier to running the app locally. The error message for rate-limit 403 explains how to add a token.

## D-009 — Minimal UI: one screen, four states
**Date:** 2026-06-28
**Decision:** The UI never navigates to a different page. All four states (empty, loading, result, error) are rendered in the same `index.html` by toggling CSS classes.
**Reason:** No router, no back-button issues, no code splitting required. Matches the locked UI vision (see UI_VISION_LOCK_v0.1.md).
