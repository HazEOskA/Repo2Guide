// Parses README markdown/HTML for image references.
//
// WHY the 5-image limit:
//   Safety   — caps the number of third-party URLs that enter the pipeline and
//              get resolved/returned to clients, limiting the blast radius if a
//              README embeds unexpected or adversarial image sources.
//   MVP scope — the visual brief only needs representative images (typically 1–2)
//              to build a meaningful description; exhaustive coverage adds no value.
//   Performance — READMEs can contain dozens of badges and inline images; capping
//              keeps response size predictable without truncating meaningful content.
//
// This limit is intentional and not a bug. Raise it only with justification in DECISIONS.md.
function extractReadmeImages(readmeContent) {
  if (!readmeContent || typeof readmeContent !== 'string') return [];

  const images = [];

  // ![alt text](url)
  const mdRegex = /!\[([^\]]*)\]\(([^)\s]+)\)/g;
  let match;
  while ((match = mdRegex.exec(readmeContent)) !== null) {
    images.push({ alt: match[1], src: match[2], type: 'markdown' });
  }

  // <img src="url" alt="text">  (attribute order may vary)
  const htmlSrcRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  while ((match = htmlSrcRegex.exec(readmeContent)) !== null) {
    const altMatch = match[0].match(/alt=["']([^"']*)["']/i);
    images.push({ alt: altMatch ? altMatch[1] : '', src: match[1], type: 'html' });
  }

  const seen = new Set();
  return images
    .filter((img) => {
      if (seen.has(img.src)) return false;
      seen.add(img.src);
      return true;
    })
    .slice(0, 5);
}

module.exports = extractReadmeImages;
