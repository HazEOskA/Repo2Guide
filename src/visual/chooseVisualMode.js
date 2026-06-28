const SCREENSHOT_HINTS = ['screenshot', 'preview', 'demo', 'screen', 'capture', 'thumb', 'banner'];
const IMAGE_EXTS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];

// Returns one of: "screenshot-assisted" | "readme-imagined" | "diagram-only"
function chooseVisualMode(resolvedImages, readmeContent) {
  const screenshots = resolvedImages.filter((img) => {
    const lower = img.src.toLowerCase();
    return (
      SCREENSHOT_HINTS.some((hint) => lower.includes(hint)) ||
      IMAGE_EXTS.some((ext) => lower.endsWith(ext))
    );
  });

  if (screenshots.length > 0) {
    return { mode: 'screenshot-assisted', screenshots };
  }

  if (readmeContent && readmeContent.trim().length > 100) {
    return { mode: 'readme-imagined', screenshots: [] };
  }

  return { mode: 'diagram-only', screenshots: [] };
}

module.exports = chooseVisualMode;
