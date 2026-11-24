# مدار – MDAR | Current Handoff & Session State

- **Project:** **مدار – MDAR** (Mapping, Datum Adjustment and Reprojection)
- **Status:** **UNIFIED WEB & EXCEL PROFESSIONAL DEVELOPMENT COMPLETED & VERIFIED (v1.1.0-release)**
- **Release Version:** `v1.1.0-release`
- **Master Plan:** `MDAR_MASTER_DEVELOPMENT_PLAN.md`
- **Administrative Policy:** `AGENTS.md`
- **Audit Date:** 2026-11-24
- **Git Branch:** `development` (Validated and ready for merge to `main`)

## Unified Engineering Deliverables

1. **Standardized Brand Nomenclature:**
   - English: **MDAR** (exact uppercase ASCII, no Kasra, no diacritics, no letter 'A' added after 'M').
   - Arabic: **مدار**.
   - Full Name: **Mapping, Datum Adjustment and Reprojection**.

2. **Smart Import Engine (`src/utils/smartImport.ts`):**
   - Supports XLSX, XLS, CSV, TSV, TXT.
   - Auto-detects encoding (UTF-8, Windows-1256 Arabic).
   - Auto-discovers delimiters, header rows, data start rows, and European decimal commas.
   - Multi-sheet workbook reading and client-side data staging.

3. **Smart Column Detection (`src/utils/smartColumnDetection.ts`):**
   - Bilingual synonym dictionary for X, Y, Z, Point ID, Name, CRS, Datum, Zone, Description.
   - Coordinate value range and geodetic bounds validation.
   - Heuristic confidence score (0-100%) and duplicate role check.

4. **Column Mapping Wizard (`src/components/ColumnMappingWizard.tsx`):**
   - Gating review modal before entering batch data grid.
   - Manual dropdown mapping, auto-detect, swap X/Y, reset, and localStorage profile save/load.
   - Validation barriers preventing duplicate X/Y roles.

5. **Batch Data Grid & Two-Way Map Sync (`src/components/BatchTab.tsx`, `src/components/MapModal.tsx`):**
   - Two-way interactive map-table row selection and highlighting.
   - Non-destructive attribute preservation and chunked batch transformation.
   - Multi-format export center with formula injection protection (CWE-1236).

6. **MDAR Excel Reconstruction (`excel/MDAR_Converter.xlsx` — 21 Sheets):**
   - 21 authentic sheets: `00_Home` through `20_Metadata`.
   - Genuine dynamic OpenXML formulas (zero VBA/macros).
   - Real UTM, Egypt ETM, Arab grids, 2D Affine, geodesy tools, and ground-truth validation.
   - Size on disk: 48,095 bytes.

7. **GitHub Pages & Offline Production:**
   - Production bundle in `dist/` with relative base paths (`./`) compatible with `https://ahmadibrahim4geo.github.io/MDAR/`.
   - Isolated user-testing distribution in `dist/user-testing/`.

## Verification Summary (DoneProof Standard)
- **T0 — Static & Lint:** `npm.cmd run lint` (0 errors, `tsc --noEmit`).
- **T0 — Production Build:** `npm.cmd run build` (Clean build in 2.79s).
- **T1 — Mathematical Precision:**
  - `baseline_math.ts`: 8/8 tests passed (< 6mm residual).
  - `test_arab_crs_transformations.ts`: 12/12 Arab & global CRS passed (UTM 0.000mm).
- **T2 — UI & Import Integration:**
  - `test_smart_import_and_detection.ts`: 5/5 test suites passed.
- **T3 — File Format & Security Verification:**
  - `test_true_xlsx_roundtrip.ts`: 5/5 tests passed (lossless float readback, CWE-1236 defense).
  - `test_vector_reprojection.ts`: 5/5 tests passed (Shapefile, GeoJSON, KML, XXE defense).
  - `test_excel_companion_verification.ts`: 21/21 sheets verified, 197 catalog entries, 4 ground-truth benchmarks.
- **T4 — Offline PWA:** PWA manifest and Service Worker pre-caching configured for 100% offline field operation.
- **Audit Reports:**
  - [reports/01_FINAL_DELIVERY_DONEPROOF.md](file:///D:/My%20Software/MDAR/reports/01_FINAL_DELIVERY_DONEPROOF.md)
  - [reports/02_UNIFIED_WEB_EXCEL_DONEPROOF.md](file:///D:/My%20Software/MDAR/reports/02_UNIFIED_WEB_EXCEL_DONEPROOF.md)
- **Development Journal:** 18 append-only records with SHA-256 hash chains in `.agent-development-log/`.
