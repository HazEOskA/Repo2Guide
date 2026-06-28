// View management
const views = {
  empty:   document.getElementById('view-empty'),
  loading: document.getElementById('view-loading'),
  error:   document.getElementById('view-error'),
  result:  document.getElementById('view-result'),
};

function showView(name) {
  Object.values(views).forEach((v) => v.classList.remove('active'));
  // Remove 'hidden' because non-initial views start with class="view hidden"
  // and .hidden { display: none !important } overrides .view.active { display: flex }
  views[name].classList.remove('hidden');
  views[name].classList.add('active');
}

// Video fallback
const video = document.getElementById('demo-video');
const videoFallback = document.getElementById('video-fallback');

if (video) {
  video.addEventListener('error', () => {
    video.classList.add('hidden');
    videoFallback.classList.remove('hidden');
  });
  video.addEventListener('loadeddata', () => {
    videoFallback.classList.add('hidden');
    video.classList.remove('hidden');
  });
  setTimeout(() => {
    if (video.readyState === 0) {
      video.classList.add('hidden');
      videoFallback.classList.remove('hidden');
    }
  }, 800);
}

// Form submission
const form = document.getElementById('guide-form');
const generateBtn = document.getElementById('generate-btn');
const repoUrlInput = document.getElementById('repo-url');

// Module-level state for the debug helper
let _currentRepoUrl = '';
let _currentStack = 'unknown';

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const url = repoUrlInput.value.trim();
  if (!url) return;

  _currentRepoUrl = url;
  startLoading();

  try {
    const res = await fetch('/api/generate-guide', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    const data = await res.json();

    stopScanTimer();

    if (!res.ok) {
      showError(data.error || 'Something went wrong.');
      return;
    }

    renderResult(data);
  } catch {
    stopScanTimer();
    showError('Network error — could not reach the server. Is it running?');
  }
});

// Scan step animation
let scanTimer = null;
let currentStep = 0;
const STEP_DELAY = 750;

function startLoading() {
  showView('loading');
  generateBtn.disabled = true;
  generateBtn.textContent = 'Analyzing…';
  currentStep = 0;
  resetSteps();
  advanceStep();
}

function resetSteps() {
  document.querySelectorAll('.step').forEach((el) => {
    el.classList.remove('active', 'done');
  });
}

function advanceStep() {
  const steps = document.querySelectorAll('.step');
  if (currentStep > 0 && steps[currentStep - 1]) {
    steps[currentStep - 1].classList.remove('active');
    steps[currentStep - 1].classList.add('done');
  }
  if (currentStep < steps.length) {
    steps[currentStep].classList.add('active');
    currentStep++;
    scanTimer = setTimeout(advanceStep, STEP_DELAY);
  }
}

function stopScanTimer() {
  if (scanTimer) { clearTimeout(scanTimer); scanTimer = null; }
  document.querySelectorAll('.step').forEach((el) => {
    el.classList.remove('active');
    el.classList.add('done');
  });
}

// Error
function showError(msg) {
  document.getElementById('error-message').textContent = msg;
  showView('error');
  generateBtn.disabled = false;
  generateBtn.textContent = 'Generate Guide';
}

document.getElementById('error-retry-btn').addEventListener('click', () => {
  showView('empty');
  generateBtn.disabled = false;
  generateBtn.textContent = 'Generate Guide';
});

// Back button
document.getElementById('result-back-btn').addEventListener('click', () => {
  showView('empty');
  generateBtn.disabled = false;
  generateBtn.textContent = 'Generate Guide';
});

// ── Render result ──────────────────────────────────────
function renderResult(data) {
  const {
    summary, stack, requirements, commands, warnings,
    mermaidDiagram, guide, beginnerExplanation, visual,
    repoMap, validationSteps, commonMistakes,
  } = data;

  // Capture state for debug helper
  _currentStack = (stack && stack.detected) || 'unknown';

  // Summary
  el('r-name').textContent = summary.name || '';
  el('r-description').textContent = summary.description || 'No description provided.';
  const ghLink = el('r-link');
  ghLink.href = safeUrl(summary.url);
  el('r-language').textContent = summary.language ? `Language: ${summary.language}` : 'Language: unknown';
  el('r-stars').textContent = `★ ${(summary.stars || 0).toLocaleString()}`;
  el('r-forks').textContent = `⑂ ${(summary.forks || 0).toLocaleString()}`;
  const archivedChip = el('r-archived');
  if (summary.archived) archivedChip.classList.remove('hidden');
  else archivedChip.classList.add('hidden');

  // Stack
  el('r-stack').textContent = stack.detected;
  const confBadge = el('r-confidence');
  confBadge.textContent = stack.confidence;
  confBadge.className = `confidence-badge confidence-${stack.confidence}`;

  // Warnings
  const warningsCard = document.getElementById('warnings-card');
  const warningsList = el('r-warnings');
  warningsList.innerHTML = '';
  if (warnings && warnings.length > 0) {
    warnings.forEach((w) => {
      const li = document.createElement('li');
      li.textContent = w;
      warningsList.appendChild(li);
    });
    warningsCard.classList.remove('hidden');
  } else {
    warningsCard.classList.add('hidden');
  }

  // Beginner explanation
  el('r-explanation').textContent = beginnerExplanation || '';

  // Requirements
  const reqList = el('r-requirements');
  reqList.innerHTML = '';
  (requirements || []).forEach((r) => {
    const li = document.createElement('li');
    li.textContent = r;
    reqList.appendChild(li);
  });

  // Commands — each gets a copy button
  const cmdContainer = el('r-commands');
  cmdContainer.innerHTML = '';
  Object.entries(commands || {}).forEach(([key, value]) => {
    if (typeof value !== 'string') return;
    if (key === 'note') {
      const p = document.createElement('p');
      p.className = 'cmd-note';
      p.textContent = value;
      cmdContainer.appendChild(p);
      return;
    }
    const row = document.createElement('div');
    row.className = 'cmd-item';
    const label = document.createElement('span');
    label.className = 'cmd-label';
    label.textContent = key;
    const code = document.createElement('code');
    code.className = 'cmd-code';
    code.textContent = value;
    const copyBtn = document.createElement('button');
    copyBtn.className = 'cmd-copy-btn';
    copyBtn.textContent = 'Copy';
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(value).then(() => {
        copyBtn.textContent = 'Copied!';
        setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
      });
    });
    row.appendChild(label);
    row.appendChild(code);
    row.appendChild(copyBtn);
    cmdContainer.appendChild(row);
  });

  // Validation steps
  renderValidationSteps(validationSteps);

  // Common mistakes
  renderCommonMistakes(commonMistakes);

  // Repo map
  renderRepoMap(repoMap);

  // Reset debug helper
  el('debug-input').value = '';
  el('debug-result').innerHTML = '';
  el('debug-result').classList.add('hidden');

  // Visual brief
  const visualCard = document.getElementById('visual-card');
  if (visual) {
    el('r-visual-brief').textContent = visual.visualBrief || '';
    const disclaimerEl = el('r-visual-disclaimer');
    if (visual.disclaimer) {
      disclaimerEl.textContent = visual.disclaimer;
      disclaimerEl.classList.remove('hidden');
    } else {
      disclaimerEl.classList.add('hidden');
    }
    const screenshotsEl = el('r-screenshots');
    screenshotsEl.innerHTML = '';
    (visual.screenshots || []).forEach((s) => {
      const a = document.createElement('a');
      a.className = 'screenshot-chip';
      a.href = safeUrl(s.resolvedUrl);
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = s.alt || 'Image';
      screenshotsEl.appendChild(a);
    });
    visualCard.classList.remove('hidden');
  } else {
    visualCard.classList.add('hidden');
  }

  // Diagram
  el('r-diagram').textContent = mermaidDiagram || '';

  showView('result');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Section renderers ───────────────────────────────────

function renderValidationSteps(steps) {
  const list = el('r-validation');
  list.innerHTML = '';
  (steps || []).forEach((step) => {
    const li = document.createElement('li');
    li.textContent = step;
    list.appendChild(li);
  });
}

function renderCommonMistakes(mistakes) {
  const list = el('r-mistakes');
  list.innerHTML = '';
  (mistakes || []).forEach((mistake) => {
    const li = document.createElement('li');
    li.textContent = mistake;
    list.appendChild(li);
  });
}

function renderRepoMap(rootTree) {
  const container = el('r-repomap');
  container.innerHTML = '';
  if (!rootTree || rootTree.length === 0) {
    const p = document.createElement('p');
    p.className = 'cmd-note';
    p.textContent = 'No file listing available.';
    container.appendChild(p);
    return;
  }
  rootTree.forEach((item) => {
    const div = document.createElement('div');
    div.className = 'repo-map-item';
    const typeTag = document.createElement('span');
    typeTag.className = 'repo-map-type';
    typeTag.textContent = item.type === 'dir' ? 'dir' : '';
    const name = document.createElement('span');
    name.textContent = item.type === 'dir' ? item.name + '/' : item.name;
    div.appendChild(typeTag);
    div.appendChild(name);
    container.appendChild(div);
  });
}

// ── Copy diagram ──────────────────────────────────────
document.getElementById('copy-btn').addEventListener('click', () => {
  const text = el('r-diagram').textContent;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('copy-btn');
    btn.textContent = 'Copied!';
    setTimeout(() => { btn.textContent = 'Copy diagram'; }, 2000);
  });
});

// ── Debug helper ──────────────────────────────────────

const ERROR_PATTERNS = [
  {
    re: /command not found|is not recognized as an internal or external command/i,
    label: 'Command not found',
    fixes: [
      'The command is not installed or not in your PATH.',
      'Make sure you installed the required tool (e.g. Node.js, Python, npm).',
      'On Windows, restart your terminal after installing new software.',
      'Check the README for a list of installation prerequisites.',
    ],
  },
  {
    re: /Cannot find module|Module not found|ERR_MODULE_NOT_FOUND/i,
    label: 'Missing module',
    fixes: [
      'Run npm install (or yarn install) to install dependencies.',
      'Check that you are in the correct project directory (the one with package.json).',
      'Delete node_modules and run npm install again.',
      'Check if the module name in the import is spelled correctly.',
    ],
  },
  {
    re: /missing.*dep|peer dep|ERESOLVE|unmet peer/i,
    label: 'Dependency conflict',
    fixes: [
      'Run npm install --legacy-peer-deps to skip peer dependency conflicts.',
      'Delete node_modules and package-lock.json, then run npm install.',
      'Check that your Node.js version matches what the project requires.',
      'Look at the error output for which package name is listed as conflicting.',
    ],
  },
  {
    re: /npm install|npm ci|No such file.*package\.json/i,
    label: 'npm install needed',
    fixes: [
      'Run npm install in the project root directory.',
      'Make sure you are in the folder that contains package.json.',
      'If using yarn: run yarn instead. If using pnpm: run pnpm install.',
    ],
  },
  {
    re: /\.env|environment variable|MISSING.*KEY|API_KEY|DATABASE_URL.*undefined/i,
    label: 'Missing environment variable',
    fixes: [
      'Copy .env.example to .env: cp .env.example .env',
      'Open .env and fill in the required values.',
      'Make sure .env is in the project root (same folder as package.json).',
      'Restart the server after changing .env — it is not hot-reloaded.',
    ],
  },
  {
    re: /EADDRINUSE|address already in use|port.*in use|listen.*EADDRINUSE/i,
    label: 'Port already in use',
    fixes: [
      'Another process is already using that port.',
      'On Mac/Linux: lsof -ti:3000 | xargs kill -9 (replace 3000 with your port).',
      'On Windows: netstat -ano | findstr :3000, then taskkill /PID <id> /F.',
      'Or change the PORT value in your .env file (e.g. PORT=3001).',
    ],
  },
  {
    re: /EACCES|permission denied|Access is denied/i,
    label: 'Permission denied',
    fixes: [
      'Do NOT run with sudo — fix the permission issue instead.',
      'On Mac/Linux fix npm permissions: sudo chown -R $USER ~/.npm',
      'Check folder ownership with ls -la in the project directory.',
      'On Windows: run your terminal as Administrator.',
    ],
  },
];

function matchError(errorText) {
  for (const pattern of ERROR_PATTERNS) {
    if (pattern.re.test(errorText)) return pattern;
  }
  return null;
}

function buildAIPrompt(errorText) {
  return (
    `I am trying to run a ${_currentStack} project from ${_currentRepoUrl || 'a GitHub repository'}.\n\n` +
    `I got this error:\n${errorText.trim()}\n\n` +
    `Please give me step-by-step instructions to fix this. I am a beginner.`
  );
}

document.getElementById('debug-btn').addEventListener('click', () => {
  const errorText = document.getElementById('debug-input').value.trim();
  const resultEl = document.getElementById('debug-result');
  resultEl.innerHTML = '';

  if (!errorText) {
    const p = document.createElement('p');
    p.className = 'debug-no-match-hint';
    p.textContent = 'Please paste an error message first.';
    resultEl.appendChild(p);
    resultEl.classList.remove('hidden');
    return;
  }

  const match = matchError(errorText);

  if (match) {
    const labelEl = document.createElement('p');
    labelEl.className = 'debug-match-label';
    labelEl.textContent = match.label;
    resultEl.appendChild(labelEl);

    const ul = document.createElement('ul');
    ul.className = 'debug-fix-steps';
    match.fixes.forEach((fix) => {
      const li = document.createElement('li');
      li.textContent = fix;
      ul.appendChild(li);
    });
    resultEl.appendChild(ul);
  } else {
    const hint = document.createElement('p');
    hint.className = 'debug-no-match-hint';
    hint.textContent = 'No pattern matched. Copy this prompt into ChatGPT, Claude, or another AI assistant:';
    resultEl.appendChild(hint);

    const prompt = buildAIPrompt(errorText);
    const box = document.createElement('pre');
    box.className = 'debug-prompt-box';
    box.textContent = prompt;
    resultEl.appendChild(box);

    const copyBtn = document.createElement('button');
    copyBtn.className = 'debug-copy-prompt-btn';
    copyBtn.textContent = 'Copy prompt';
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(prompt).then(() => {
        copyBtn.textContent = 'Copied!';
        setTimeout(() => { copyBtn.textContent = 'Copy prompt'; }, 2000);
      });
    });
    resultEl.appendChild(copyBtn);
  }

  resultEl.classList.remove('hidden');
});

function el(id) {
  return document.getElementById(id);
}

// ── XSS safety notes ──────────────────────────────────────────────────────────
// All API-derived content that reaches the DOM goes through one of:
//   - el.textContent = value          (safe — treated as plain text, no HTML parsing)
//   - el.createElement + textContent  (safe — same reason)
//   - safeUrl(url) for href attrs     (guards against javascript: protocol)
//   - innerHTML = ''                  (clearing only — no injection)
//
// confBadge.className interpolation is NOT innerHTML — className sets a CSS class
// string, not HTML, so it cannot inject markup or execute scripts.
//
// imagePrompt is intentionally never rendered in the UI (it lives in the API
// response as a [PLACEHOLDER] stub only).

function safeUrl(url) {
  if (typeof url !== 'string') return '#';
  return /^https?:\/\//i.test(url.trim()) ? url.trim() : '#';
}
