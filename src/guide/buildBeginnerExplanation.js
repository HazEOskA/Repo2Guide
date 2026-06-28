const EXPLANATIONS = {
  nextjs: (meta) =>
    `${meta.name} is a web app built with Next.js — a React framework that handles both the pages you see and the server-side logic in one codebase. You install it with npm install, then run npm run dev to start a local development server. Open http://localhost:3000 in your browser to see it running.`,

  vite: (meta) =>
    `${meta.name} is a frontend app powered by Vite, a fast build tool for modern JavaScript. Vite reloads your browser instantly as you edit code. Run npm install then npm run dev to launch it locally.`,

  react: (meta) =>
    `${meta.name} is a React app. React is a JavaScript library that builds interactive UIs from reusable components. Run npm install to set it up and npm start to open it in your browser.`,

  express: (meta) =>
    `${meta.name} is a Node.js web server using Express. Express handles HTTP requests and returns responses — it runs on your computer, not in a browser. Run npm install then node server.js to start the server.`,

  node: (meta) =>
    `${meta.name} is a Node.js project. Node.js lets you run JavaScript outside the browser — useful for scripts, APIs, and backend services. Run npm install to get dependencies, then node <entry-file>.js to start it.`,

  python: (meta) =>
    `${meta.name} is a Python project. Create an isolated environment first (python -m venv venv), activate it, then install dependencies using the project's manifest (requirements.txt, pyproject.toml, or Pipfile). Run the main file to start the app.`,

  rust: (meta) =>
    `${meta.name} is written in Rust, a language built for speed and safety. Rust uses Cargo as its package manager — cargo run compiles and runs the project in one step. You'll need to install Rust from rust-lang.org.`,

  go: (meta) =>
    `${meta.name} is a Go project. Go is a fast, compiled language from Google. Run go mod download to fetch dependencies, then go run . to compile and start the app. Install Go from go.dev.`,

  java: (meta) =>
    `${meta.name} is a Java project. Java runs on the JVM — you'll need a JDK installed. Use Maven (mvn install) or Gradle to build it, then follow the README to run the compiled artifact.`,

  php: (meta) =>
    `${meta.name} is a PHP project. PHP is a server-side language commonly used for web apps. Run composer install to load dependencies, then use PHP's built-in server (php -S localhost:8000) for local development.`,

  ruby: (meta) =>
    `${meta.name} is a Ruby project. Ruby is known for clean syntax and powers frameworks like Rails. Run bundle install to install gems, then start the app as described in the README.`,

  docker: (meta) =>
    `${meta.name} includes a Dockerfile, which means it runs inside Docker — a container that bundles the app with everything it needs. Build it with docker build -t app . and run with docker run. You need Docker Desktop installed.`,

  unknown: (meta) =>
    `${meta.name} — the tech stack couldn't be detected automatically. Look for a README file in the repository for setup instructions. Common first clues: package.json means Node.js, requirements.txt means Python, Makefile means there's a build system.`,
};

function buildBeginnerExplanation({ meta, stack }) {
  const fn = EXPLANATIONS[stack.detected] || EXPLANATIONS.unknown;
  return fn(meta);
}

module.exports = buildBeginnerExplanation;
