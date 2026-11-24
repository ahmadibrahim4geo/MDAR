# مدار – MِDAR | Agent Governance & Engineering Contract

<!-- GIS-Development-Skills:managed-project-governance-v1 -->

> **Project Identity:** **مدار – MِDAR** (Mapping, Datum Adjustment and Reprojection)  
> **Official Scope:** Universal Coordinate & Geospatial Transformation Platform  
> **Brand Nomenclature:**  
> - Arabic Display: **مدار**  
> - English Visual: **MِDAR** (Letter `M` followed by Arabic Kasra `U+0650` then `DAR` — Never replace with "MADAR" or "GeoMizan")  
> - Technical ASCII: `MDAR` (folders, filenames, headers) / `mdar` (packages, URLs)  
> - Acronym Definition: **Mapping, Datum Adjustment and Reprojection**

---

## 1. Dual Reference Authority & Hierarchy

Every agent and developer operating on this project MUST adhere strictly to the dual-authority governance model:

1. **Administrative & Operational Reference:** This file (`AGENTS.md`) is the permanent administrative policy for all current and future agent sessions. It governs workflows, agent roles, security gates, session resumption, journal recording, directory contracts, and DoneProof verification.
2. **Scientific & Geodetic Reference:** `MDAR_MASTER_DEVELOPMENT_PLAN.md` is the authoritative master specification for all geodetic algorithms, EPSG/PROJ parameters, datum shift operations, file format handling, Excel workbook standards, and mathematical tolerances.

---

## 2. Every Session: Mandatory Restoration Protocol

Before executing any commands or making code modifications in a new session:
1. **Read Core State:** Inspect `AGENTS.md`, `context/CURRENT_HANDOFF.md`, the active plan in `plans/active/`, and `PROJECT_STRUCTURE.md`.
2. **Verify History:** Check `.agent-development-log/INDEX.md` and `.agent-development-log/STATE.md` to understand preceding operations, decisions, and handoff notes.
3. **Inspect Current Reality:** Verify current Git state, directory contents, and build status (`npm.cmd run lint`, `npm.cmd run build`). Never replay past actions blindly or assume prior states without verifying against real files on disk.

---

## 3. Engineering Roles & Multi-Pass Workflow

Consequential development must follow a disciplined engineering lifecycle. Even if operated by a single AI agent, work must proceed through distinct reviewable passes:

1. **Geodetic Architect / Systems Engineer:** Formulates the mathematical and architectural design based on `MDAR_MASTER_DEVELOPMENT_PLAN.md`. Specifies datum parameters, EPSG codes, pipeline steps, bounding boxes, and error models.
2. **Implementation Programmer:** Implements clean, modular code. Applies surgical in-flight edits (Caveman discipline), avoids unnecessary refactoring, preserves existing working components, and adds required typings.
3. **Independent Code & Security Reviewer:** Audits code against mathematical rigor, security rules, and performance guidelines. Checks for input sanitization, potential XSS, CSV formula injection, memory leaks, and edge-case validation. Cannot sign off on unreviewed work.
4. **Verification & QA Specialist:** Runs automated and manual tests. Tests forward/inverse roundtrips, control points, boundary conditions, and file format roundtrips. Records observed evidence under `testing results/` according to DoneProof standards.
5. **Release Engineer:** Prepares builds, updates version manifests, ensures zero secrets and zero unnecessary binaries are checked into Git, and writes clear bilingual documentation.

---

## 4. Geodetic & Geomatic Principles

1. **No AI Math Guesswork:** Never use LLM reasoning or prompt guessing for geodetic transformations. All coordinate operations must derive from official EPSG Registry definitions, PROJ-approved pipelines, or rigorously documented national geodetic survey parameters.
2. **Strict Geodetic Separation:**
   - Clearly separate **Datum**, **Ellipsoid**, **Projection**, and **Coordinate Representation** (DD, DMS, DDM, Grid).
   - DD/DMS/DDM are coordinate representations, NOT datums.
   - Web Mercator (EPSG:3857) is NOT UTM.
   - Ellipsoidal height ($h$) is NOT orthometric height ($H$). Never convert 3D coordinates or calculate elevations without an explicit geoid model and vertical datum.
3. **Explicit Transformation Operations & Epochs:**
   - Every transformation must record its exact Operation ID (e.g., EPSG:7697 for Egypt 1907 to WGS 84 via Molodensky-Badekas).
   - Modern dynamic frames (e.g., KSA-GRF17, ITRF) require epoch handling. Never silently treat a national datum as identical to WGS 84.
   - When a direct or rigorous transformation grid is unavailable, fail closed or explicitly disclose approximation with user warnings. Never perform silent identity passthrough.
4. **Rigorous Precision & Tolerances:**
   - Retain full 64-bit IEEE double-precision floating-point numbers throughout all intermediate calculations.
   - Display and export precision rounding must only occur at the final presentation/export layer.
   - Target numerical tolerances: $\le 1\text{ mm}$ for identical analytical projection formulations; operation-specific published residuals for empirical datum shifts.

---

## 5. Security Guardian & Privacy Rules

Always apply **GIS Security Guardian** across all operations:
1. **Zero Data Exfiltration:** MDAR is an offline-capable, privacy-first platform. User coordinate data and uploaded GIS/CAD files must never leave the local client. No remote telemetry or cloud processing of user data.
2. **File Processing Defense:**
   - Defend against ZIP bombs, path traversal attacks, and malformed archives when handling Shapefile ZIPs or KMZ archives.
   - Defend against XML External Entity (XXE) attacks in KML/XML parsing.
   - Prevent CSV/Spreadsheet formula injection (`=`, `+`, `-`, `@`) in exported tables.
   - Disallow execution of untrusted macros in imported Excel files.
3. **Untrusted Skill Quarantine:**
   - Any external skill or tool candidate must be quarantined under `New Skill/candidates/`.
   - Never auto-install, auto-execute, or auto-load untrusted skills into the active toolset without independent license, security, and behavioral review.

---

## 6. Token Optimization Triad

To maintain context efficiency and deep operational focus:
1. **Ponytail (Targeted Reading):** Never read entire multi-thousand-line files blindly. Use targeted line ranges, symbol searches, and specific functions.
2. **Caveman (Surgical Editing & Quiet Execution):** Use surgical `edit_file` calls for minimal localized diffs. Keep terminal outputs concise; avoid dumping massive trace logs into chat.
3. **Token Optimizer (Compact Handoffs):** Regularly summarize intermediate findings into permanent reports under `reports/` and maintain a concise `context/CURRENT_HANDOFF.md`.

---

## 7. Project Governance & Directory Contract

The repository root structure is strictly governed:
- `src/` & `assets/`: Core application source code and assets. Existing functional components must be preserved non-destructively.
- `plans/active/`: Sequential, reviewable implementation plans (e.g., `001_MDAR_PHASED_IMPLEMENTATION_PLAN.md`).
- `plans/archive/`: Completed plans, preserved with linked DoneProof evidence.
- `reports/`: Numbered baseline, audit, architecture, and verification reports (e.g., `00_BASELINE_REPORT.md`).
- `context/CURRENT_HANDOFF.md`: Lightweight current state for seamless session transitions.
- `.agent-development-log/`: Append-only, chronological journal tracking requests, decisions, and implementations.
- `testing data/`: **User-owned** test fixtures. Read-only inputs. Never edit or overwrite in place.
- `testing results/`: **Agent-owned** test outputs, numerical readbacks, and evidence logs.
- `New Skill/`: Quarantine for candidate skills (`candidates/`, `approved/`, `promotion/`).
- `dist/user-testing/`: Isolated builds for user acceptance testing.

---

## 8. DoneProof Verification Standard

No feature, phase, or bug fix is complete without empirical evidence:
- **T0 — Syntax & Static Verification:** Linting, TypeScript type-checking (`tsc --noEmit`), build compilation.
- **T1 — Mathematical Unit Verification:** Algorithmic verification against published test points and known control coordinates.
- **T2 — UI & Component Integration:** Component rendering, state synchronization, bilingual RTL/LTR behavior, keyboard accessibility.
- **T3 — End-to-End & File Readback:** Actual file import, reprojection, export, and readback verification using independent parsers.
- **T4 — Clean Environment & Offline Verification:** Verification in isolated runtime without network access, validating PWA/offline functionality.
- **Status Reporting:** Every verification check must be explicitly labeled: `VERIFIED`, `PARTIAL`, `FAILED`, `BLOCKED`, or `NOT RUN`. Never declare success without observed execution logs.
