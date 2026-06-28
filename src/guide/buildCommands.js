const STATIC_COMMANDS = {
  rust:    { build: 'cargo build', run: 'cargo run', release: 'cargo build --release' },
  go:      { install: 'go mod download', run: 'go run .', build: 'go build -o app .' },
  php:     { install: 'composer install', run: 'php -S localhost:8000' },
  ruby:    { install: 'bundle install', run: 'ruby app.rb' },
  docker:  { build: 'docker build -t app .', run: 'docker run -p 8080:8080 app' },
  unknown: { note: 'Could not detect project type — check the repository README for setup instructions.' },
};

const NODE_STACKS = new Set(['nextjs', 'vite', 'react', 'express', 'node']);

// For Node-based stacks, parse actual package.json scripts rather than
// inventing filenames. Returns only commands that are actually defined.
function buildNodeCommands(packageJsonContent) {
  let scripts = {};
  if (packageJsonContent) {
    try {
      const pkg = JSON.parse(packageJsonContent);
      scripts = pkg.scripts || {};
    } catch { /* malformed JSON */ }
  }

  const cmds = { install: 'npm install' };

  if (scripts.dev)     cmds.dev     = 'npm run dev';
  if (scripts.start)   cmds.start   = 'npm start';
  if (scripts.build)   cmds.build   = 'npm run build';
  if (scripts.preview) cmds.preview = 'npm run preview';
  if (scripts.test)    cmds.test    = 'npm test';

  return cmds;
}

// Branch on which Python manifest is actually present.
function buildPythonCommands(files) {
  if (files && files['Pipfile']) {
    return {
      shell: 'pipenv shell',
      install: 'pipenv install',
      run: 'python main.py',
    };
  }
  if (files && files['pyproject.toml']) {
    return {
      venv: 'python -m venv venv && source venv/bin/activate',
      install: 'pip install -e .',
      run: 'python -m <module_name>',
    };
  }
  // Default: requirements.txt
  return {
    venv: 'python -m venv venv && source venv/bin/activate',
    install: 'pip install -r requirements.txt',
    run: 'python main.py',
  };
}

// Branch on whether build.gradle or pom.xml triggered detection.
function buildJavaCommands(files) {
  if (files && files['build.gradle'] && !files['pom.xml']) {
    return {
      build: './gradlew build',
      run: './gradlew bootRun',
      test: './gradlew test',
    };
  }
  // Default: Maven
  return {
    install: 'mvn install',
    run: 'mvn spring-boot:run',
    build: 'mvn package',
  };
}

function buildCommands(stack, files) {
  if (NODE_STACKS.has(stack.detected)) {
    return buildNodeCommands(files && files['package.json']);
  }
  if (stack.detected === 'python') {
    return buildPythonCommands(files);
  }
  if (stack.detected === 'java') {
    return buildJavaCommands(files);
  }
  return STATIC_COMMANDS[stack.detected] || STATIC_COMMANDS.unknown;
}

module.exports = buildCommands;
