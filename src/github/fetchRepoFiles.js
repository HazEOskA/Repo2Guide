// Only these known filenames are ever fetched — no user-controlled paths.
const KNOWN_FILES = [
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
];

async function fetchRepoFiles(owner, repo) {
  const headers = { Accept: 'application/vnd.github.v3+json' };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const results = {};

  await Promise.allSettled(
    KNOWN_FILES.map(async (filename) => {
      const res = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${filename}`,
        { headers }
      );
      if (!res.ok) return;
      const data = await res.json();
      if (data.encoding === 'base64' && data.content) {
        results[filename] = Buffer.from(data.content, 'base64').toString('utf8');
      }
    })
  );

  return results;
}

module.exports = fetchRepoFiles;
