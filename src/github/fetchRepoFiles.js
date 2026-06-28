// Only files in this set are ever fetched — no user-controlled paths.
const KNOWN_FILES = new Set([
  'package.json',
  'requirements.txt',
  'Dockerfile',
  'docker-compose.yml',
  'docker-compose.yaml',
  'pyproject.toml',
  'Pipfile',
  'Cargo.toml',
  'go.mod',
  'pom.xml',
  'build.gradle',
  '.nvmrc',
  '.node-version',
  '.python-version',
  'next.config.js',
  'next.config.ts',
  'next.config.mjs',
  'vite.config.js',
  'vite.config.ts',
  'tsconfig.json',
  'Makefile',
  'composer.json',
  'Gemfile',
  '.env.example',
]);

async function fetchRepoFiles(owner, repo) {
  const headers = { Accept: 'application/vnd.github.v3+json' };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  // One call to list the root directory, then only fetch files that are
  // both in our whitelist AND actually present in the repo.
  const rootRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/`,
    { headers }
  );

  if (!rootRes.ok) return {};

  const rootItems = await rootRes.json();
  if (!Array.isArray(rootItems)) return {};

  const toFetch = rootItems.filter(
    (item) => item.type === 'file' && KNOWN_FILES.has(item.name)
  );

  const results = {};

  await Promise.allSettled(
    toFetch.map(async (item) => {
      // item.url is the per-file GitHub Contents API URL
      const res = await fetch(item.url, { headers });
      if (!res.ok) return;
      const data = await res.json();
      if (data.encoding === 'base64' && data.content) {
        results[item.name] = Buffer.from(data.content, 'base64').toString('utf8');
      }
    })
  );

  return results;
}

module.exports = fetchRepoFiles;
