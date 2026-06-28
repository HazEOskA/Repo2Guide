# MVP Scope — v0.1

## What Repo2Guide v0.1 does

Given a public GitHub repository URL, it returns:

1. **Repository summary** — name, description, language, stars, forks, last updated
2. **Stack detection** — identifies the primary technology from known config files
3. **Requirements list** — tools a developer needs to install
4. **Command guide** — install, run, build, and other relevant commands
5. **Beginner explanation** — a plain-English paragraph explaining what the project does and how to run it
6. **Architecture diagram** — a Mermaid graph string visualizing the high-level structure
7. **Visual brief (stub)** — mode + brief description for future image generation; no API called

## Supported stacks

| Stack | Detection trigger |
|---|---|
| Next.js | `package.json` with `next` dep, or `next.config.*` file |
| Vite | `package.json` with `vite` dep, or `vite.config.*` file |
| React | `package.json` with `react` dep (no Vite/Next) |
| Express | `package.json` with `express` dep |
| Node.js (generic) | `package.json` present, no known framework detected |
| Python | `requirements.txt`, `pyproject.toml`, or `Pipfile` |
| Rust | `Cargo.toml` |
| Go | `go.mod` |
| Java | `pom.xml` or `build.gradle` |
| PHP | `composer.json` |
| Ruby | `Gemfile` |
| Docker | `Dockerfile` (when no other indicator found) |
| Unknown | Fallback when no known files are found |

## What v0.1 does NOT do

- Does not clone or execute repository code
- Does not require authentication (GitHub token is optional)
- Does not store any data or guide history
- Does not support private repositories
- Does not support monorepos with multiple stacks (picks the strongest signal)
- Does not generate actual images (visual layer is a stub)
- Does not parse README for commands or project-specific instructions

## Planned for future versions

- Parse README.md for setup instructions
- Confidence score for each detection signal
- Multi-stack support (e.g. Python backend + React frontend)
- Image generation from visual brief
- Shareable guide links (requires storage)
- GitHub Actions / CI detection
