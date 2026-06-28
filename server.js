require('dotenv').config();
const express = require('express');
const path = require('path');

const validateRepoUrl = require('./src/safety/validateRepoUrl');
const parseRepoUrl = require('./src/github/parseRepoUrl');
const fetchRepoMeta = require('./src/github/fetchRepoMeta');
const fetchRepoFiles = require('./src/github/fetchRepoFiles');
const fetchReadme = require('./src/github/fetchReadme');
const detectStack = require('./src/github/detectStack');
const buildGuide = require('./src/guide/buildGuide');
const buildCommands = require('./src/guide/buildCommands');
const buildBeginnerExplanation = require('./src/guide/buildBeginnerExplanation');
const buildValidationSteps = require('./src/guide/buildValidationSteps');
const buildCommonMistakes = require('./src/guide/buildCommonMistakes');
const buildMermaidDiagram = require('./src/diagrams/buildMermaidDiagram');
const extractReadmeImages = require('./src/visual/extractReadmeImages');
const resolveGithubImageUrls = require('./src/visual/resolveGithubImageUrls');
const chooseVisualMode = require('./src/visual/chooseVisualMode');
const buildVisualBrief = require('./src/visual/buildVisualBrief');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', version: '0.1.0' });
});

app.post('/api/generate-guide', async (req, res) => {
  try {
    const { url } = req.body;

    const validation = validateRepoUrl(url);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.reason });
    }

    const { owner, repo } = parseRepoUrl(url);

    const [meta, filesResult, readme] = await Promise.all([
      fetchRepoMeta(owner, repo),
      fetchRepoFiles(owner, repo),
      fetchReadme(owner, repo),
    ]);

    const { files, rootTree } = filesResult;
    const stack = detectStack(files);
    const commands = buildCommands(stack, files);
    const guide = buildGuide({ meta, stack, commands, files, readme });
    const beginnerExplanation = buildBeginnerExplanation({ meta, stack });
    const validationSteps = buildValidationSteps(stack);
    const commonMistakes = buildCommonMistakes(stack);
    const mermaidDiagram = buildMermaidDiagram(stack);

    const rawImages = extractReadmeImages(readme);
    const resolvedImages = resolveGithubImageUrls(rawImages, owner, repo, meta.default_branch || 'main');
    const { mode, screenshots } = chooseVisualMode(resolvedImages, readme);
    const visual = buildVisualBrief({ meta, stack, readmeContent: readme, mode, screenshots });

    res.json({
      summary: {
        name: meta.name,
        description: meta.description || null,
        stars: meta.stargazers_count,
        forks: meta.forks_count,
        language: meta.language || null,
        url: meta.html_url,
        owner,
        repo,
        defaultBranch: meta.default_branch,
        updatedAt: meta.updated_at,
        archived: meta.archived || false,
      },
      stack,
      requirements: guide.requirements,
      commands,
      warnings: guide.warnings,
      mermaidDiagram,
      guide: guide.sections,
      beginnerExplanation,
      visual,
      repoMap: rootTree,
      validationSteps,
      commonMistakes,
    });
  } catch (err) {
    if (err.status === 404) {
      return res.status(404).json({ error: 'Repository not found or is private.' });
    }
    if (err.status === 403) {
      return res.status(429).json({
        error: 'GitHub API rate limit reached. Add a GITHUB_TOKEN to your .env to increase the limit.',
      });
    }
    console.error('[generate-guide]', err.message);
    res.status(500).json({ error: 'Failed to generate guide. Please try again.' });
  }
});

app.listen(PORT, () => {
  console.log(`Repo2Guide running at http://localhost:${PORT}`);
});
