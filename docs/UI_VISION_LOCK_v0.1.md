# UI Vision Lock — v0.1

> This document defines the locked UI direction for Repo2Guide MVP.
> Do not add navigation, dashboards, sidebars, or multi-page flows.

## Core Principle

One screen. One action. One result.

## Layout

```
┌─────────────────────────────────────────┐
│           Repo2Guide                    │  ← logo only, no nav
│   Paste a GitHub repo. Get a guide.     │  ← single tagline
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  [10-second intro video / demo] │    │  ← centered, 16:9
│  │  fallback: styled text if no mp4│    │
│  └─────────────────────────────────┘    │
│                                         │
│  [ github.com/owner/repo          ] [→] │  ← single input + button
│  Public repos only. No code executed.   │  ← hint
└─────────────────────────────────────────┘
```

## States

### 1. Empty state (initial load)
- Video or fallback box is visible and centered
- Input below the video
- No other UI elements visible

### 2. Loading state
- Video and input are replaced by scan-step list
- Steps animate through: validating → fetching → scanning → detecting → building
- Communicates progress without a spinner that feels stuck

### 3. Result state
- Header shrinks: logo left + "Try another" button right
- Generated guide appears below in cards:
  - Summary (name, language, stars, forks)
  - Warnings (if any)
  - "What is this project?" — beginner explanation
  - "What you need installed" — requirements
  - "How to run it" — commands
  - Visual brief (screenshot references or conceptual description)
  - Architecture diagram (Mermaid text, copyable)

### 4. Error state
- Friendly message in plain language
- Single "Try a different URL" button to return to empty state

## What is explicitly NOT in the UI

- No navigation menu or header links
- No sidebar
- No dashboard / history / saved guides
- No user accounts or login
- No React or other SPA framework
- No modal dialogs
- No infinite scroll

## Video asset

- Path: `/assets/repo2guide-demo.mp4`
- Poster: `/assets/poster.png`
- Should be a short (8–12 second) silent looping demo
- If the file is missing, the JS shows a styled fallback div with the tagline text
- Video is `autoplay loop muted playsinline` — no controls shown

## Color and type

- White / very light gray background (`#f9fafb`)
- Indigo accent (`#4f46e5`)
- System font stack
- No custom icon font; use plain Unicode characters where needed

## Responsiveness

- Max content width: 560px for the hero, 720px for the result
- On mobile: input and button stack vertically
