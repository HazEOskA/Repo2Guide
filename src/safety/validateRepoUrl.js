function validateRepoUrl(url) {
  if (!url || typeof url !== 'string') {
    return { valid: false, reason: 'URL is required.' };
  }

  const trimmed = url.trim();

  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { valid: false, reason: 'Invalid URL format.' };
  }

  if (parsed.hostname !== 'github.com') {
    return { valid: false, reason: 'Only github.com repositories are supported.' };
  }

  const pathParts = parsed.pathname
    .replace(/\.git$/, '')
    .replace(/\/$/, '')
    .split('/')
    .filter(Boolean);

  if (pathParts.length < 2) {
    return {
      valid: false,
      reason: 'URL must point to a GitHub repository (e.g. https://github.com/owner/repo).',
    };
  }

  if (pathParts.length > 2) {
    return {
      valid: false,
      reason: 'URL must point to a repository root, not a subdirectory or file.',
    };
  }

  const [owner, repo] = pathParts;

  if (!/^[a-zA-Z0-9_.-]+$/.test(owner) || !/^[a-zA-Z0-9_.-]+$/.test(repo)) {
    return { valid: false, reason: 'Invalid repository owner or name.' };
  }

  return { valid: true, owner, repo };
}

module.exports = validateRepoUrl;
