'use strict';

const STEPS = {
  nextjs: [
    'Open http://localhost:3000 in your browser',
    'Confirm the home page loads without errors',
    'Check the browser console (F12) for any red errors',
    'Try navigating to a second page if the app has routing',
  ],
  vite: [
    'Open the URL shown in your terminal (usually http://localhost:5173)',
    'Confirm the page loads without a blank white screen',
    'Check the terminal for HMR (Hot Module Replacement) confirmation',
    'Open browser DevTools (F12) and check the console for errors',
  ],
  react: [
    'Open http://localhost:3000 in your browser',
    'Confirm the React app renders without a blank screen',
    'Check the browser console for any errors',
    'Try interacting with the UI — click buttons, fill forms',
  ],
  express: [
    'Open http://localhost:3000 in your browser or run: curl http://localhost:3000',
    'Check that the server responds with expected output',
    'Look at the terminal for any error messages',
    'Test an API endpoint if the project is an API server',
  ],
  node: [
    'Check the terminal output for confirmation the process started',
    'If it is a server, open http://localhost:3000 in your browser',
    'If it is a script, confirm it ran without "Error:" in the output',
    'Look for any uncaught exceptions in the terminal',
  ],
  python: [
    'Check the terminal for "Running on" or similar startup message',
    'Open http://localhost:5000 (Flask) or http://localhost:8000 (Django/FastAPI)',
    'If it is a script, confirm it exited cleanly (no Traceback)',
    'Check for import errors in the output if the app fails to start',
  ],
  rust: [
    'Confirm the binary ran without "panicked at" in the output',
    'If it is a server, open http://localhost:8080 or the configured port',
    'Check for "error[E...]:" messages which indicate compile failures',
    'Run cargo test to verify the test suite passes',
  ],
  go: [
    'Check terminal output for any "goroutine" panic messages',
    'If it is a server, open http://localhost:8080 or the configured port',
    'Confirm the process did not exit immediately with a non-zero code',
    'Run go test ./... to verify the test suite passes',
  ],
  java: [
    'Wait for "Started" or "Tomcat started" in the terminal output',
    'Open http://localhost:8080 in your browser',
    'Check for "BUILD SUCCESS" or "BUILD FAILURE" in the output',
    'Look for NullPointerException or ClassNotFoundException in the logs',
  ],
  php: [
    'Open http://localhost:8000 in your browser',
    'Confirm the page renders without a PHP error banner',
    'Check the terminal for any syntax errors',
    'Look for HTTP 500 errors in the browser that indicate PHP exceptions',
  ],
  ruby: [
    'Check terminal for "Listening on" or "WEBrick" startup message',
    'Open http://localhost:3000 in your browser',
    'Confirm the page loads without a Rails error page',
    'Check for "LoadError" or "NameError" in the terminal',
  ],
  docker: [
    'Run docker ps to confirm the container is running',
    'Check docker logs <container-name> for startup messages',
    'Open the mapped port in your browser (check docker-compose.yml for port mapping)',
    'Run docker compose ps to see the status of all services',
  ],
  unknown: [
    'Check the terminal for any error messages after running the start command',
    'If a port is mentioned in the README, open http://localhost:<port> in your browser',
    'Confirm the process is still running — it should not exit immediately',
    'Search the README for a "Running" or "Usage" section for expected output',
  ],
};

function buildValidationSteps(stack) {
  return STEPS[stack.detected] || STEPS.unknown;
}

module.exports = buildValidationSteps;
