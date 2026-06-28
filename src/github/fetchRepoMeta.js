async function fetchRepoMeta(owner, repo) {
  const headers = { Accept: 'application/vnd.github.v3+json' };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });

  if (!res.ok) {
    const err = new Error(`GitHub API error: ${res.status}`);
    err.status = res.status;
    throw err;
  }

  return res.json();
}

module.exports = fetchRepoMeta;
