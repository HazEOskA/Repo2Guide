const COMMANDS = {
  nextjs:  { install: 'npm install', run: 'npm run dev', build: 'npm run build', start: 'npm start' },
  vite:    { install: 'npm install', run: 'npm run dev', build: 'npm run build', preview: 'npm run preview' },
  react:   { install: 'npm install', run: 'npm start', build: 'npm run build' },
  express: { install: 'npm install', run: 'node server.js', dev: 'npm run dev' },
  node:    { install: 'npm install', run: 'node index.js', dev: 'npm run dev' },
  python:  { venv: 'python -m venv venv && source venv/bin/activate', install: 'pip install -r requirements.txt', run: 'python main.py' },
  rust:    { build: 'cargo build', run: 'cargo run', release: 'cargo build --release' },
  go:      { install: 'go mod download', run: 'go run .', build: 'go build -o app .' },
  java:    { install: 'mvn install', run: 'mvn spring-boot:run', build: 'mvn package' },
  php:     { install: 'composer install', run: 'php -S localhost:8000' },
  ruby:    { install: 'bundle install', run: 'ruby app.rb' },
  docker:  { build: 'docker build -t app .', run: 'docker run -p 8080:8080 app' },
  unknown: { note: 'Could not detect project type — check the repository README for setup instructions.' },
};

function buildCommands(stack) {
  return COMMANDS[stack.detected] || COMMANDS.unknown;
}

module.exports = buildCommands;
