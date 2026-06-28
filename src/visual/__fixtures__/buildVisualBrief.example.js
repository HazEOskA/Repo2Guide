// Example inputs and expected outputs for buildVisualBrief.
// Use these as reference for testing and future image-generation integration.
// Run this file directly to verify: node src/visual/__fixtures__/buildVisualBrief.example.js

'use strict';

const buildVisualBrief = require('../buildVisualBrief');

// ── Shared inputs ──────────────────────────────────────────────────────────────

const META_EXPRESS = {
  name: 'express',
  description: 'Fast, unopinionated, minimalist web framework for Node.',
  language: 'JavaScript',
};

const STACK_EXPRESS = { detected: 'express', confidence: 'high', indicators: ['package.json with express'] };

const README_SNIPPET = `# express\n\nFast web framework.\n\n![demo screenshot](./docs/screenshot.png)`;

// ── Example 1: screenshot-assisted ────────────────────────────────────────────

const screenshotInput = {
  meta: META_EXPRESS,
  stack: STACK_EXPRESS,
  readmeContent: README_SNIPPET,
  mode: 'screenshot-assisted',
  screenshots: [
    {
      alt: 'demo screenshot',
      resolvedUrl: 'https://raw.githubusercontent.com/expressjs/express/master/docs/screenshot.png',
    },
  ],
};

const screenshotExpected = {
  mode: 'screenshot-assisted',
  generated: false,
  visualBrief: 'Visual assets found for express. 1 screenshot(s) detected in README. Stack: express. Language: JavaScript.',
  imagePrompt: '[PLACEHOLDER] Generate a UI mockup for "express" (express project). Reference screenshots: https://raw.githubusercontent.com/expressjs/express/master/docs/screenshot.png.',
  disclaimer: null,
  screenshots: [
    {
      alt: 'demo screenshot',
      resolvedUrl: 'https://raw.githubusercontent.com/expressjs/express/master/docs/screenshot.png',
    },
  ],
};

// ── Example 2: readme-imagined ────────────────────────────────────────────────

const readmeInput = {
  meta: META_EXPRESS,
  stack: STACK_EXPRESS,
  readmeContent: README_SNIPPET,
  mode: 'readme-imagined',
  screenshots: [],
};

const readmeExpected = {
  mode: 'readme-imagined',
  generated: false,
  // visualBrief and imagePrompt contain README-derived text (varies with content)
  disclaimer: 'Conceptual visualization based on README text — no image has been generated.',
  screenshots: [],
};

// ── Example 3: diagram-only ───────────────────────────────────────────────────

const diagramInput = {
  meta: META_EXPRESS,
  stack: STACK_EXPRESS,
  readmeContent: null,
  mode: 'diagram-only',
  screenshots: [],
};

const diagramExpected = {
  mode: 'diagram-only',
  generated: false,
  visualBrief: 'No visual assets found for express. Architecture diagram only. Stack: express.',
  imagePrompt: null,
  disclaimer: null,
  screenshots: [],
};

// ── Verification ──────────────────────────────────────────────────────────────

function assertEqual(label, actual, expected) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) {
    console.error(`FAIL ${label}\n  expected: ${e}\n  actual:   ${a}`);
    process.exitCode = 1;
  } else {
    console.log(`PASS ${label}`);
  }
}

const r1 = buildVisualBrief(screenshotInput);
assertEqual('screenshot-assisted mode',    r1.mode,        screenshotExpected.mode);
assertEqual('screenshot-assisted generated', r1.generated, screenshotExpected.generated);
assertEqual('screenshot-assisted brief',   r1.visualBrief, screenshotExpected.visualBrief);
assertEqual('screenshot-assisted prompt',  r1.imagePrompt, screenshotExpected.imagePrompt);
assertEqual('screenshot-assisted disclaimer', r1.disclaimer, screenshotExpected.disclaimer);
assertEqual('screenshot-assisted screenshots length', r1.screenshots.length, 1);

const r2 = buildVisualBrief(readmeInput);
assertEqual('readme-imagined mode',        r2.mode,        readmeExpected.mode);
assertEqual('readme-imagined generated',   r2.generated,   readmeExpected.generated);
assertEqual('readme-imagined disclaimer',  r2.disclaimer,  readmeExpected.disclaimer);
assertEqual('readme-imagined imagePrompt starts with [PLACEHOLDER]',
  r2.imagePrompt.startsWith('[PLACEHOLDER]'), true);
assertEqual('readme-imagined screenshots', r2.screenshots.length, 0);

const r3 = buildVisualBrief(diagramInput);
assertEqual('diagram-only mode',           r3.mode,        diagramExpected.mode);
assertEqual('diagram-only generated',      r3.generated,   diagramExpected.generated);
assertEqual('diagram-only brief',          r3.visualBrief, diagramExpected.visualBrief);
assertEqual('diagram-only imagePrompt',    r3.imagePrompt, diagramExpected.imagePrompt);
assertEqual('diagram-only disclaimer',     r3.disclaimer,  diagramExpected.disclaimer);

if (process.exitCode !== 1) console.log('\nAll fixture checks passed.');
