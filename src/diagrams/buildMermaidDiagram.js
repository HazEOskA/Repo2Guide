const DIAGRAMS = {
  nextjs: `graph TD
    Browser["Browser"] --> NextServer["Next.js Server"]
    NextServer --> AppRouter["App Router / Pages"]
    NextServer --> APIRoutes["API Routes /api/*"]
    AppRouter --> Components["React Components"]
    APIRoutes --> DataLayer["Data / External APIs"]`,

  vite: `graph TD
    Browser["Browser"] --> ViteServer["Vite Dev Server"]
    ViteServer --> Entry["Entry Point main.js"]
    Entry --> Components["Components"]
    Components --> Styles["CSS / Styles"]
    Components --> Assets["Assets"]`,

  react: `graph TD
    Browser["Browser"] --> ReactApp["React App"]
    ReactApp --> Router["React Router"]
    Router --> Pages["Page Components"]
    Pages --> UI["UI Components"]
    UI --> State["State / Context"]`,

  express: `graph TD
    Client["HTTP Client"] --> Express["Express Server"]
    Express --> Middleware["Middleware Stack"]
    Middleware --> Routes["Route Handlers"]
    Routes --> Logic["Business Logic"]
    Logic --> Response["JSON / HTML Response"]`,

  node: `graph TD
    Client["Client"] --> NodeApp["Node.js App"]
    NodeApp --> Modules["Node Modules"]
    Modules --> Logic["Business Logic"]
    Logic --> Output["Output / Response"]`,

  python: `graph TD
    User["User"] --> PythonApp["Python Application"]
    PythonApp --> Packages["Packages / pip"]
    Packages --> Logic["Business Logic"]
    Logic --> Output["Output / API Response"]`,

  rust: `graph TD
    Input["Input"] --> Main["main.rs"]
    Main --> Modules["Rust Modules"]
    Modules --> Logic["Core Logic"]
    Logic --> Output["Output / Binary"]`,

  go: `graph TD
    Client["Client"] --> Main["main.go"]
    Main --> Handlers["HTTP Handlers"]
    Handlers --> Services["Service Layer"]
    Services --> Output["Response"]`,

  java: `graph TD
    Client["Client"] --> App["Java Application"]
    App --> Controller["Controllers"]
    Controller --> Service["Services"]
    Service --> Repository["Repositories"]
    Repository --> DataStore["Data Store"]`,

  php: `graph TD
    Browser["Browser"] --> PHP["PHP Application"]
    PHP --> Router["Router"]
    Router --> Controllers["Controllers"]
    Controllers --> Views["Views / Templates"]`,

  ruby: `graph TD
    Browser["Browser"] --> RubyApp["Ruby App"]
    RubyApp --> Routes["Routes"]
    Routes --> Controllers["Controllers"]
    Controllers --> Views["Views"]`,

  docker: `graph TD
    User["User"] --> Container["Docker Container"]
    Container --> App["Application Process"]
    App --> Ports["Exposed Ports"]
    Container --> Volumes["Mounted Volumes"]`,

  unknown: `graph TD
    User["User"] --> Repo["Repository"]
    Repo --> Structure["Unknown Structure"]
    Structure --> Output["Output"]`,
};

function buildMermaidDiagram(stack) {
  return DIAGRAMS[stack.detected] || DIAGRAMS.unknown;
}

module.exports = buildMermaidDiagram;
