# مدار – MِDAR | Phased Implementation & Engineering Roadmap

**Plan ID:** 0001  
**Target:** MِDAR (Mapping, Datum Adjustment and Reprojection)  
**Status:** PROPOSED / DRAFT (Pending User Review & Checkpoint Approval)  
**Scientific Reference:** `MDAR_MASTER_DEVELOPMENT_PLAN.md`  
**Governance Reference:** `AGENTS.md`

---

## 1. Executive Objective

Transform the baseline prototype ("Egypt Global Coordinate Converter") into **MِDAR | مدار**: a world-class, offline-first, privacy-respecting, scientifically verified universal geospatial coordinate transformation and file reprojection platform with native bilingual (Arabic/English) support and dedicated Excel workbook companion.

---

## 2. Engineering Phases & Milestones

### Phase 0: Baseline Inventory, Risk Matrix & Defect Reproduction
- **Scope:** Complete code audit, dependency verification, defect reproduction (zero height in Molodensky-Badekas, identity pass-through in Arab datums, fake XLS export), competitor benchmarking.
- **Deliverables:** `reports/00_BASELINE_REPORT.md`, baseline test suite in `testing results/`.
- **Gate:** Verified T0/T1 baseline evidence.

### Phase 1: Geodetic Engine Architecture & WASM Feasibility
- **Scope:** Evaluate PROJ WASM (`@proj4js` vs full `PROJ` WASM) and GDAL/OGR WASM. Validate pipeline definitions, grid handling, and bounding box checks.
- **Deliverables:** `reports/01_ENGINE_FEASIBILITY.md`, quarantined candidate evaluations.
- **Gate:** Proven transformation accuracy ($\le 1\text{ mm}$ for projections; official published residuals for datum shifts).

### Phase 2: Verified Arab & Global CRS Catalog (22 Arab Countries + Global)
- **Scope:** Replace ad-hoc parameters in `src/lib/crsData.ts` with authoritative, versioned EPSG/PROJ definitions. Ensure rigorous coverage for Egypt (Belts 1–4, Red/Purple/Blue/Extended, MTM), Saudi Arabia (KSA-GRF17, Ain el Abd), UAE, Qatar, Kuwait, Oman, Jordan, Palestine, Iraq, North Africa (Morocco, Algeria, Tunisia, Libya), and UTM 1N–60N / 1S–60S.
- **Deliverables:** Versioned JSON catalog, CRS explorer metadata, control points fixtures in `testing data/`.
- **Gate:** T1 reference point tests against published national benchmarks.

### Phase 3: Core UI Brand Elevation & Single Point Transformation
- **Scope:** Brand upgrade to **MِDAR | مدار** across UI, header, logo, page titles, and accessibility. Implementation of forward/inverse transformation with strict input validation, DMS/DD/DDM parsers, axis order handling, and clear operation warnings.
- **Deliverables:** Updated `App.tsx`, `HomeTab.tsx`, `CRSSelect.tsx`, accessible keyboard navigation, RTL/LTR layout.
- **Gate:** T2 UI component tests and accessibility audit (WCAG 2.2 AA).

### Phase 4: High-Performance Batch Processing & True Tabular I/O
- **Scope:** Virtualized batch table for large datasets ($>10,000$ rows). True numeric `.xlsx` and `.csv` import/export (eliminating HTML table pseudo-XLS). Web Worker background processing with cancellation support. Formula injection sanitization.
- **Deliverables:** Overhauled `BatchTab.tsx`, `ExportModal.tsx`, parser streaming workers.
- **Gate:** T3 batch readback verification of 1,000+ points without main thread freeze.

### Phase 5: Client-Side GIS & CAD Vector File Reprojection
- **Scope:** Drag-and-drop vector file reprojector supporting Shapefile (.zip), GeoJSON (RFC7946), KML/KMZ, GeoPackage (.gpkg), and DXF. Safe archive extraction (ZIP bomb / path traversal defense), attribute preservation, and operation manifests (`operation.json`).
- **Deliverables:** `FileReprojectTab.tsx`, vector drivers integration, download packaging.
- **Gate:** Independent readback verification of reprojected Shapefiles and GeoJSON in QGIS/GDAL.

### Phase 6: MِDAR Excel Standard Workbook Companion
- **Scope:** Generation of `MDAR_Converter.xlsx` featuring native Excel formulas (no macros, no external links) for DD/DMS/DDM, UTM/UPS, Egypt National Grids, and verified Arab coordinate conversions. Protected formula cells, input validation, and bilingual documentation.
- **Deliverables:** `excel/MDAR_Converter.xlsx`, generator scripts, recalculation verification report.
- **Gate:** Independent spreadsheet recalculation test in Excel 2021/365 and LibreOffice Calc.

### Phase 7: Interactive Geodesy Tools & Scientific Encyclopedia
- **Scope:** Geodesic distance/azimuth calculation (GeographicLib algorithms), scale factor/grid convergence, datum transformation parameters explorer, and bilingual educational documentation.
- **Deliverables:** `GeodesyToolsTab.tsx`, `CatalogTab.tsx` enhancement, bilingual glossary.
- **Gate:** Proven accuracy of geodesic algorithms against Karney benchmark sets.

### Phase 8: Offline PWA & GitHub Pages Release Packaging
- **Scope:** Service worker caching for 100% offline functionality. GitHub Actions workflow for deterministic building and GitHub Pages deployment. Checksum manifest generation.
- **Deliverables:** PWA manifest, offline bundle, release notes, user manual.
- **Gate:** T4 clean offline environment test without network connectivity.

---

## 3. Acceptance Criteria & DoneProof Checklist

| Criterion ID | Phase | Description | Target Evidence | Status |
|---|---|---|---|---|
| **AC-001** | Phase 0 | Baseline code audit & dependency check | `reports/00_BASELINE_REPORT.md` | VERIFIED |
| **AC-002** | Phase 0 | Project governance directory structure | `project_governance.py audit` PASS | VERIFIED |
| **AC-003** | Phase 0 | Tailored `AGENTS.md` and initialized journal | `.agent-development-log/` created | VERIFIED |
| **AC-004** | Phase 1 | Geodetic math audit & transformation validation | `testing results/TR_0001_baseline_math.json` | VERIFIED |
| **AC-005** | Phase 2 | Verified Arab 22 + UTM CRS definitions | Synthetic & national control test points | PENDING |
| **AC-006** | Phase 3 | MِDAR visual brand & accessible UI | Clean build & responsive RTL/LTR check | PENDING |
| **AC-007** | Phase 4 | True XLSX / CSV import/export without injection | Exported file OOXML inspection | PENDING |
| **AC-008** | Phase 5 | Vector GIS file reprojection engine | Reprojected shapefile readback | PENDING |
| **AC-009** | Phase 6 | Excel Standard `.xlsx` workbook | Formula recalculation parity check | PENDING |
| **AC-010** | Phase 8 | 100% Offline PWA & GitHub Pages build | Offline browser navigation test | PENDING |
