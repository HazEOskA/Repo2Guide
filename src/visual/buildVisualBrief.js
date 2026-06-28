// Builds a visual brief for future image generation.
// Does NOT call any image generation API — returns placeholders only.
function buildVisualBrief({ meta, stack, readmeContent, mode, screenshots }) {
  const name = meta.name || 'this project';
  const description = meta.description || '';
  const language = meta.language || 'unknown';

  if (mode === 'screenshot-assisted') {
    return {
      mode,
      visualBrief:
        `Visual assets found for ${name}. ` +
        `${screenshots.length} screenshot(s) detected in README. ` +
        `Stack: ${stack.detected}. Language: ${language}.`,
      imagePrompt:
        `[PLACEHOLDER] Generate a UI mockup for "${name}" (${stack.detected} project). ` +
        `Reference screenshots: ${screenshots.map((s) => s.resolvedUrl).join(', ')}.`,
      disclaimer: null,
      screenshots: screenshots.map((s) => ({ alt: s.alt, resolvedUrl: s.resolvedUrl })),
    };
  }

  if (mode === 'readme-imagined') {
    const snippet = readmeContent
      ? readmeContent.replace(/[#*`[\]()>!]/g, '').trim().slice(0, 300)
      : '';
    return {
      mode,
      visualBrief:
        `Conceptual visualization for ${name}. ` +
        (description ? `${description} ` : '') +
        `Stack: ${stack.detected}. Language: ${language}. ` +
        (snippet ? `README excerpt: "${snippet}..."` : ''),
      imagePrompt:
        `[PLACEHOLDER] Generate a conceptual UI mockup for "${name}", ` +
        `a ${stack.detected} project. Description: ${description || 'none'}. Language: ${language}.`,
      disclaimer: 'Conceptual visualization based on README, not an actual screenshot.',
      screenshots: [],
    };
  }

  // diagram-only
  return {
    mode,
    visualBrief: `No visual assets found for ${name}. Architecture diagram only. Stack: ${stack.detected}.`,
    imagePrompt: null,
    disclaimer: null,
    screenshots: [],
  };
}

module.exports = buildVisualBrief;
