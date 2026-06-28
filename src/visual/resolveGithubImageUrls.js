// Resolves relative image paths in a GitHub README to absolute raw.githubusercontent.com URLs.
// Does not fetch or download any image content.
function resolveGithubImageUrls(images, owner, repo, defaultBranch = 'main') {
  return images.map((img) => {
    const src = img.src;

    if (src.startsWith('http://') || src.startsWith('https://')) {
      // Convert github.com blob URLs → raw URLs so they're directly accessible
      const resolvedUrl = src
        .replace(
          /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\//,
          'https://raw.githubusercontent.com/$1/$2/'
        );
      return { ...img, resolvedUrl, isAbsolute: true };
    }

    // Relative path — anchor to the repo root on the default branch
    const cleanPath = src.replace(/^\.\//, '').replace(/^\//, '');
    const resolvedUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/${cleanPath}`;
    return { ...img, resolvedUrl, isAbsolute: false };
  });
}

module.exports = resolveGithubImageUrls;
