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
  // Also handle the case where the source just doesn't load
  video.addEventListener('loadeddata', () => {
    videoFallback.classList.add('hidden');
    video.classList.remove('hidden');
  });
  // Show fallback immediately if video can't start (no src available)
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

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const url = repoUrlInput.value.trim();
  if (!url) return;

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
const STEP_DELAY = 750; // ms per step

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
  // Mark remaining steps done
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
  const { summary, stack, requirements, commands, warnings, mermaidDiagram, guide, beginnerExplanation, visual } = data;

  // Summary
  el('r-name').textContent = summary.name || '';
  el('r-description').textContent = summary.description || 'No description provided.';
  const ghLink = el('r-link');
  ghLink.href = summary.url || '#';
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

  // Commands
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
    row.appendChild(label);
    row.appendChild(code);
    cmdContainer.appendChild(row);
  });

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
      a.href = s.resolvedUrl;
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

// Copy diagram
document.getElementById('copy-btn').addEventListener('click', () => {
  const text = el('r-diagram').textContent;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('copy-btn');
    btn.textContent = 'Copied!';
    setTimeout(() => { btn.textContent = 'Copy diagram'; }, 2000);
  });
});

function el(id) {
  return document.getElementById(id);
}
