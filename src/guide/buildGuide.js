const REQUIREMENTS = {
  nextjs:  ['Node.js 18+', 'npm, yarn, or pnpm'],
  vite:    ['Node.js 18+', 'npm, yarn, or pnpm'],
  react:   ['Node.js 16+', 'npm or yarn'],
  express: ['Node.js 18+', 'npm'],
  node:    ['Node.js 18+', 'npm'],
  python:  ['Python 3.8+', 'pip', 'virtualenv (recommended)'],
  rust:    ['Rust (latest stable)', 'Cargo (bundled with Rust)'],
  go:      ['Go 1.20+'],
  java:    ['JDK 11+', 'Maven or Gradle'],
  php:     ['PHP 8+', 'Composer'],
  ruby:    ['Ruby 3+', 'Bundler'],
  docker:  ['Docker', 'Docker Compose (optional)'],
  unknown: ['See repository README for requirements'],
};

const NODE_STACKS = new Set(['nextjs', 'vite', 'react', 'express', 'node']);
const WEB_STACKS  = new Set(['nextjs', 'vite', 'react', 'express', 'node', 'python', 'ruby', 'php']);

function buildGuide({ meta, stack, commands, files, readme }) {
  const requirements = REQUIREMENTS[stack.detected] || REQUIREMENTS.unknown;
  const warnings = [];

  // Repo-level warnings
  if (meta.archived) {
    warnings.push('This repository is archived and may no longer be maintained.');
  }
  if (!meta.description) {
    warnings.push('No repository description — documentation may be limited.');
  }

  // Stack detection confidence
  if (stack.confidence === 'low') {
    warnings.push('Stack detection confidence is low — the guide may be inaccurate.');
  }
  if (stack.detected === 'unknown') {
    warnings.push('Could not detect the project type. Manual inspection recommended.');
  }

  // No run/dev script in package.json
  if (NODE_STACKS.has(stack.detected) && files && files['package.json']) {
    let scripts = {};
    try { scripts = (JSON.parse(files['package.json']).scripts) || {}; } catch { /* ignore */ }
    if (!scripts.dev && !scripts.start) {
      warnings.push('No start or dev script found in package.json — check the README for how to run this project.');
    }
  }

  // No .env.example (likely needs environment variables)
  if (files && !files['.env.example'] && WEB_STACKS.has(stack.detected)) {
    warnings.push('No .env.example found. This project may require environment variables or API keys — check the README.');
  }

  // README missing
  if (!readme) {
    warnings.push('README was not found or could not be read. Setup instructions may be missing.');
  }

  const sections = [
    {
      title: 'About this project',
      content: meta.description || 'No description provided.',
    },
    {
      title: 'Tech stack',
      content: `Detected: ${stack.detected} (confidence: ${stack.confidence})\nIndicators: ${stack.indicators.join(', ') || 'none found'}`,
    },
    {
      title: 'Requirements',
      content: requirements.map((r) => `- ${r}`).join('\n'),
    },
    {
      title: 'Getting started',
      content: Object.entries(commands)
        .filter(([, v]) => typeof v === 'string')
        .map(([k, v]) => `${k}: ${v}`)
        .join('\n'),
    },
  ];

  return { requirements, warnings, sections };
}

module.exports = buildGuide;
