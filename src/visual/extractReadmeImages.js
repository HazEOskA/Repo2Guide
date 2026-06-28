// Parses README markdown/HTML for image references.
// Limited to the first 5 unique images found.
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
