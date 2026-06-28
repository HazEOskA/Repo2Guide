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

function buildGuide({ meta, stack, commands }) {
  const requirements = REQUIREMENTS[stack.detected] || REQUIREMENTS.unknown;
  const warnings = [];

  if (meta.archived) warnings.push('This repository is archived and may no longer be maintained.');
  if (!meta.description) warnings.push('No repository description — documentation may be limited.');
  if (stack.confidence === 'low') warnings.push('Stack detection confidence is low — the guide may be inaccurate.');
  if (stack.detected === 'unknown') warnings.push('Could not detect the project type. Manual inspection recommended.');

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
