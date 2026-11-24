<!-- GIS-Development-Skills:managed-structure-v1 -->
# Project Structure

Generated inventory of significant directories and root files.
Descriptions marked NEEDS_DESCRIPTION require review, not guessing.
Testing data belongs to the user; never modify its inputs by default.

## Directories

| Path | Purpose |
| --- | --- |
| `.agent-development-log` | Append-only chronological project development history and agent session memory |
| `.github` | GitHub configuration, templates, and CI/CD workflows |
| `.github/workflows` | GitHub Actions CI/CD workflows for testing and GitHub Pages deployment |
| `agent` | Project-specific policies and engineering organization |
| `assets` | Static application assets, brand identity files, and design resources |
| `assets/.aistudio` | AI Studio runtime integration and environment configuration |
| `context` | Short project map and current handoff state |
| `dist` | Build/distribution artifacts, not source |
| `dist/user-testing` | User-test builds only after appropriate build verification |
| `New Skill` | External skill candidates and promotion records, not an active skill path |
| `New Skill/approved` | Only separately reviewed and authorized skill copies |
| `New Skill/candidates` | Untrusted skill metadata pending license/security review |
| `New Skill/candidates/0001_proj-wasm-engine` | Quarantined metadata and evaluation for candidate PROJ WASM geodetic engine |
| `New Skill/candidates/0002_excel-ooxml-engineering` | Quarantined metadata and evaluation for candidate native OOXML Excel workbook generator |
| `New Skill/candidates/0003_gdal3-vector-wasm` | Quarantined metadata and evaluation for candidate GDAL3 vector file reprojection engine |
| `New Skill/promotion` | Evidence and requests to promote a skill into the main suite |
| `plans` | Numbered development plans and revision history |
| `plans/active` | Open, proposed, and in-progress development plans |
| `plans/active/0001_MDAR-Baseline-and-Phased-Execution-Plan` | Active implementation plan for Phase 0 baseline and roadmap |
| `plans/archive` | Completed plans with linked evidence (not deleted) |
| `reports` | Engineering, inspection, and verification reports |
| `src` | Application source code including React components, geodetic libraries, and utilities |
| `src/components` | React UI components for tabs, conversion forms, modals, and settings |
| `src/lib` | Core geodetic calculation engines, CRS catalog data, parsers, and translations |
| `src/utils` | Export helpers, formatting utilities, and file serialization functions |
| `testing data` | USER-OWNED test fixtures; read-only by default; never use for outputs |
| `testing results` | GENERATED test runs, logs, screenshots, and output readback |
| `tests` | Automated unit, geodetic, and integration tests |

## Root files

| Path | Purpose |
| --- | --- |
| `.env.example` | NEEDS_DESCRIPTION — inspect this root file |
| `.gis-project-governance.json` | Project-local folder descriptions and governance version |
| `.gitignore` | Git exclusions for generated outputs and private test data |
| `AGENTS.md` | Agent instructions and project execution/permission boundaries |
| `MDAR_MASTER_DEVELOPMENT_PLAN.md` | NEEDS_DESCRIPTION — inspect this root file |
| `PROJECT_STRUCTURE.md` | Living catalog of project directories and root files |
| `README.md` | Project introduction, setup, and usage |
| `bun.lock` | NEEDS_DESCRIPTION — inspect this root file |
| `index.html` | NEEDS_DESCRIPTION — inspect this root file |
| `metadata.json` | NEEDS_DESCRIPTION — inspect this root file |
| `package-lock.json` | NEEDS_DESCRIPTION — inspect this root file |
| `package.json` | JavaScript package scripts and dependencies |
| `tsconfig.json` | NEEDS_DESCRIPTION — inspect this root file |
| `vite.config.ts` | NEEDS_DESCRIPTION — inspect this root file |

## Maintenance

Register new persistent directories with register-folder and run sync.
Review existing project build files before moving anything. Generated
test outputs belong in testing results/, never in testing data/.
