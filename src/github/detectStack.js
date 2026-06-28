function detectStack(files) {
  const indicators = [];
  let detected = 'unknown';
  let confidence = 'low';

  if (files['package.json']) {
    let pkg = {};
    try { pkg = JSON.parse(files['package.json']); } catch { /* malformed JSON */ }

    const deps = { ...pkg.dependencies, ...pkg.devDependencies };

    if (deps['next'] || files['next.config.js'] || files['next.config.ts'] || files['next.config.mjs']) {
      detected = 'nextjs';
      confidence = 'high';
      if (deps['next']) indicators.push('package.json with next');
      if (files['next.config.js'] || files['next.config.ts'] || files['next.config.mjs']) {
        indicators.push('next.config file present');
      }
    } else if (deps['vite'] || files['vite.config.js'] || files['vite.config.ts']) {
      detected = 'vite';
      confidence = 'high';
      if (deps['vite']) indicators.push('package.json with vite');
      if (files['vite.config.js'] || files['vite.config.ts']) indicators.push('vite.config file present');
    } else if (deps['react']) {
      detected = 'react';
      confidence = 'medium';
      indicators.push('package.json with react');
    } else if (deps['express']) {
      detected = 'express';
      confidence = 'high';
      indicators.push('package.json with express');
    } else {
      detected = 'node';
      confidence = 'medium';
      indicators.push('package.json (generic node)');
    }
  }

  if (files['requirements.txt'] || files['pyproject.toml'] || files['Pipfile']) {
    if (detected === 'unknown') { detected = 'python'; confidence = 'high'; }
    if (files['requirements.txt']) indicators.push('requirements.txt');
    if (files['pyproject.toml']) indicators.push('pyproject.toml');
    if (files['Pipfile']) indicators.push('Pipfile');
  }

  if (files['Cargo.toml']) {
    if (detected === 'unknown') { detected = 'rust'; confidence = 'high'; }
    indicators.push('Cargo.toml');
  }

  if (files['go.mod']) {
    if (detected === 'unknown') { detected = 'go'; confidence = 'high'; }
    indicators.push('go.mod');
  }

  if (files['pom.xml'] || files['build.gradle']) {
    if (detected === 'unknown') { detected = 'java'; confidence = 'medium'; }
    indicators.push(files['pom.xml'] ? 'pom.xml' : 'build.gradle');
  }

  if (files['composer.json']) {
    if (detected === 'unknown') { detected = 'php'; confidence = 'medium'; }
    indicators.push('composer.json');
  }

  if (files['Gemfile']) {
    if (detected === 'unknown') { detected = 'ruby'; confidence = 'medium'; }
    indicators.push('Gemfile');
  }

  if (files['Dockerfile']) {
    indicators.push('Dockerfile');
    if (detected === 'unknown') { detected = 'docker'; confidence = 'low'; }
  }

  if (indicators.length === 0) confidence = 'low';

  return { detected, confidence, indicators };
}

module.exports = detectStack;
