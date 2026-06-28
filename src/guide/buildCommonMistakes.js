'use strict';

const MISTAKES = {
  nextjs: [
    'Running npm start instead of npm run dev for development mode',
    'Forgetting to copy .env.example to .env before starting',
    'Using Node.js older than 18 — Next.js 13+ requires Node 18+',
    'Missing NEXTAUTH_URL or NEXTAUTH_SECRET when authentication is included',
    'Port 3000 already in use — stop any other server running on that port first',
  ],
  vite: [
    'Running npm install in the wrong directory — check you are in the project root',
    'Forgetting environment variables — Vite only exposes vars prefixed with VITE_',
    'Expecting the app at port 3000 — Vite defaults to port 5173',
    'Using an old Node.js version — Vite requires Node 18+',
  ],
  react: [
    'Forgetting to run npm install before npm start',
    'Using Node.js older than 16',
    'Missing .env file with required REACT_APP_ prefixed variables',
    'Opening the app before compilation finishes — wait for "Compiled successfully"',
  ],
  express: [
    'Forgetting to copy .env.example to .env',
    'Missing required environment variables like DATABASE_URL or API keys',
    'Not running npm install before npm start',
    'Port 3000 already in use — stop any other server on that port',
  ],
  node: [
    'Running the wrong entry file — check the "main" field in package.json',
    'Forgetting to run npm install first',
    'Missing environment variables in .env file',
    'Using require() in a module that uses ES imports — check "type" in package.json',
  ],
  python: [
    'Not activating the virtual environment before running the app',
    'Installing packages globally instead of in the virtual environment',
    'Python 2 vs Python 3 mismatch — always use python3 and pip3',
    'Missing environment variables in .env file (python-dotenv must be installed)',
    'Port conflict on macOS — Flask defaults to port 5000, which conflicts with AirPlay',
  ],
  rust: [
    'Rust not installed — get it with: curl --proto =https --tlsv1.2 -sSf https://sh.rustup.rs | sh',
    'Not waiting for the full compilation — first cargo build can take 1-5 minutes',
    'Missing system dependencies for crates that link to native libraries',
    'Forgetting to set environment variables in .env before running',
  ],
  go: [
    'Running go run before downloading dependencies with go mod download',
    'GOPATH conflicts when using an older Go version — use Go 1.18+',
    'Missing CGO dependencies if the project uses C bindings',
    'Forgetting to set required environment variables before running',
  ],
  java: [
    'Using the wrong Java version — check the README for the required JDK version',
    'Running mvn or gradle without JDK installed — JRE alone is not enough',
    'Missing values in application.properties or application.yml',
    'Forgetting to wait for "BUILD SUCCESS" before opening the browser',
  ],
  php: [
    'PHP not installed or wrong version — run php -v to check',
    'Missing Composer — install it from https://getcomposer.org',
    'Forgetting to copy .env.example to .env and set APP_KEY for Laravel apps',
    'Skipping composer install before running the app',
    'Missing PHP extensions like mbstring or pdo',
  ],
  ruby: [
    'Wrong Ruby version — use rbenv or rvm to switch Ruby versions',
    'Forgetting to run bundle install before starting the server',
    'Missing database setup — run rails db:create db:migrate for Rails apps',
    'Forgetting to copy .env.example to .env',
  ],
  docker: [
    'Docker daemon not running — open Docker Desktop or run sudo systemctl start docker',
    'Insufficient disk space — Docker images can be several gigabytes',
    'Port already mapped — change the host port in docker-compose.yml if needed',
    'Forgetting to rebuild after code changes — run docker compose up --build',
  ],
  unknown: [
    'Not reading the README fully before starting — look for a "Getting Started" section',
    'Missing dependencies — always check if there is an install step first',
    'Forgetting to set required environment variables',
    'Running commands in the wrong directory',
  ],
};

function buildCommonMistakes(stack) {
  return MISTAKES[stack.detected] || MISTAKES.unknown;
}

module.exports = buildCommonMistakes;
