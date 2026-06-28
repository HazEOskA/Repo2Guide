// Builds a visual brief for future image generation.
//
// IMPORTANT — STUB STATUS:
//   This function does NOT call any image generation API.
//   It returns structured text only. No image has been generated or fetched.
//   `imagePrompt` is a draft string prefixed with [PLACEHOLDER] to make this
//   unambiguous. It must NOT be forwarded to an image API without explicit
//   product decision and safety review.
//
// `generated` is always false in v0.1. The UI must never display text that
// implies an image was generated or that any generative AI was invoked.
function buildVisualBrief({ meta, stack, readmeContent, mode, screenshots }) {
  const name = meta.name || 'this project';
  const description = meta.description || '';
  const language = meta.language || 'unknown';

  if (mode === 'screenshot-assisted') {
    return {
      mode,
      generated: false,
      visualBrief:
        `Visual assets found for ${name}. ` +
        `${screenshots.length} screenshot(s) detected in README. ` +
        `Stack: ${stack.detected}. Language: ${language}.`,
      // [PLACEHOLDER] — not sent to any API in v0.1
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
      generated: false,
      visualBrief:
        `Conceptual visualization for ${name}. ` +
        (description ? `${description} ` : '') +
        `Stack: ${stack.detected}. Language: ${language}. ` +
        (snippet ? `README excerpt: "${snippet}..."` : ''),
      // [PLACEHOLDER] — not sent to any API in v0.1
      imagePrompt:
        `[PLACEHOLDER] Generate a conceptual UI mockup for "${name}", ` +
        `a ${stack.detected} project. Description: ${description || 'none'}. Language: ${language}.`,
      disclaimer: 'Conceptual visualization based on README text — no image has been generated.',
      screenshots: [],
    };
  }

  // diagram-only
  return {
    mode,
    generated: false,
    visualBrief: `No visual assets found for ${name}. Architecture diagram only. Stack: ${stack.detected}.`,
    // imagePrompt is null when there is nothing to generate from
    imagePrompt: null,
    disclaimer: null,
    screenshots: [],
  };
}

module.exports = buildVisualBrief;
