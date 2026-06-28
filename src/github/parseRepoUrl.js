function parseRepoUrl(url) {
  const parts = new URL(url.trim()).pathname
    .replace(/\.git$/, '')
    .replace(/\/$/, '')
    .split('/')
    .filter(Boolean);
  return { owner: parts[0], repo: parts[1] };
}

module.exports = parseRepoUrl;
