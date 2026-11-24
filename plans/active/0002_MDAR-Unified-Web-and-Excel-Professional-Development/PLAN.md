# Implementation Plan: MDAR Unified Web & Excel Professional Development

- **Plan ID:** `0002`
- **Revision:** `1`
- **Date:** 2026-11-24
- **Branch:** `development`
- **Reference Standards:** `AGENTS.md`, `MDAR_MASTER_DEVELOPMENT_PLAN.md`

## 1. Phased Architecture & Work Breakdown

### Phase 1: Brand Nomenclature Normalization (`MِDAR` -> `MDAR`)
- Replace `MِDAR` with `MDAR` across all source code, tests, documentation, headers, UI components, metadata, and scripts.
- Ensure the official nomenclature:
  - English: **MDAR**
  - Arabic: **مدار**
  - Full Name: Mapping, Datum Adjustment and Reprojection
- Verify zero residual diacritics in Latin text.

### Phase 2: Smart Import Engine (`src/utils/smartImport.ts`)
- Implement comprehensive client-side tabular file reader:
  - Supports `.xlsx`, `.xls` (via `read-excel-file`), `.csv`, `.tsv`, `.txt`.
  - Encoding discovery: handles UTF-8, UTF-16, and ANSI / Windows-1256 Arabic encoding via `TextDecoder`.
  - Automatic delimiter detection: checks frequency of `,`, `;`, `\t`, `|`, and whitespace.
  - Header row & data start row detection using heuristics (first non-empty row with string headers followed by data rows).
  - Empty rows and columns pruning while preserving row offsets.
  - Number format normalization: detects European decimal commas (`31,234`) vs US decimal dots (`31.234`).
  - Multi-sheet workbook reading with sheet listing and sheet switching.
  - Interactive file preview showing detected parameters with manual overrides.

### Phase 3: Smart Column Detection & Extensible Dictionary (`src/utils/smartColumnDetection.ts`)
- Implement multi-layered heuristic detector:
  - Bilingual synonym dictionary (Arabic & English) for:
    - X: Easting, East, E, Longitude, Lon, Long, Coord_X, الشرقيات, الإحداثي السيني, خط الطول
    - Y: Northing, North, N, Latitude, Lat, Coord_Y, الشماليات, الإحداثي الصادي, دائرة العرض
    - Z: Elevation, Height, Altitude, Level, RL, الارتفاع, المنسوب
    - Point ID: ID, Point_ID, Point_No, PtNo, PNT, Station_ID, رقم النقطة, كود النقطة, المعرف
    - Point Name: Name, Point_Name, Station_Name, Label, اسم النقطة, اسم المحطة, الموقع
    - CRS / EPSG / Projection / النظام الإحداثي
    - Datum / Reference Frame / المرجع الجيوديسي
    - UTM Zone / Hemisphere / الشريحة
    - Description / Notes / Category / الوصف / الملاحظات
  - Numerical value range validation:
    - Latitude [-90, 90] vs Longitude [-180, 180]
    - Metric Easting [100,000 to 900,000] vs Northing [0 to 10,000,000]
  - Heuristic confidence score scoring (0% to 100%).
  - Warnings generation (e.g. potential swapped X/Y, missing values, non-numeric values in coordinate column).

### Phase 4: Column Mapping Wizard Component (`src/components/ColumnMappingWizard.tsx`)
- Build a dedicated, accessible UI wizard:
  - Step-by-step review before data enters the grid.
  - Table of detected columns: Original Name, Suggested Role, Detected Type, Preview Values, Confidence Badge, Warnings.
  - Role selector dropdown: `X (Longitude / Easting)`, `Y (Latitude / Northing)`, `Z (Elevation)`, `Point ID`, `Point Name`, `Description / Attributes`, `Ignore`.
  - Quick action toolbar: Auto Detect, Manual Mapping, Reset, Swap X/Y.
  - Profile Management: Save Mapping Profile to `localStorage`, Load Saved Profile.
  - Validation barriers:
    - Requires both X and Y.
    - Rejects mapping the same column to both X and Y.
    - Shows blocking warnings before enabling "Confirm & Transform".

### Phase 5: High-Performance Data Grid & Map Synchronization (`src/components/BatchTab.tsx`)
- Enhance interactive spreadsheet grid:
  - Preserve all original columns and metadata without data loss.
  - Append transformation results:
    - `X_Transformed`, `Y_Transformed`, `Z_Transformed`, `Source_CRS`, `Target_CRS`, `Transformation_Method`, `Transformation_Status`, `Error_Message`.
  - Process records in fault-tolerant chunks: errors on single rows do not break batch.
  - Two-way interactive Map Synchronization:
    - Clicking a table row focuses and highlights marker on the map.
    - Clicking a map marker highlights and scrolls to table row.
  - Filter by status (All, Success, Failed/Warning), search, sort.
  - Export Center: True OOXML `.xlsx` (with formula injection defense), CSV, GeoJSON, KML.

### Phase 6: Reconstruction of MDAR Excel (`excel/MDAR_Converter.xlsx` — 21 Sheets)
- Expand companion workbook into an authentic 21-sheet engineering system:
  1. `00_Home`: Platform metadata, index, navigation, compatibility
  2. `01_Single_Point`: Single point dynamic coordinate calculator
  3. `02_Multi_Point`: Multi-point quick calculator
  4. `03_Smart_Import`: Formatted clipboard area for pasted table inspection
  5. `04_Column_Mapping`: Mapping configuration and column role helper
  6. `05_Batch_Input`: Excel Table for input points with unlocked cells
  7. `06_Batch_Results`: Automated formula-driven transformation results table
  8. `07_Angular_Converter`: Bidirectional DD <-> DMS <-> DDM conversions
  9. `08_UTM_UPS`: Universal Transverse Mercator (Zones 1-60 N & S) formulas
  10. `09_Egyptian_Grids`: Complete Egypt ETM Belts (Red, South Red, Blue, Purple) and MTM 1-5
  11. `10_Arab_Grids`: Arab national grids (SANSER, DLTM, QND95, KTM, JTM, ON-TM, Bahrain, Palestine)
  12. `11_Global_Grids`: Web Mercator, global projections
  13. `12_Custom_CRS`: Custom parameters and affine transformation equations
  14. `13_Datum_Transform`: Molodensky-Badekas 10-parameter formulas, Helmert 7-parameter formulas
  15. `14_Geodetic_Tools`: Geodetic distance, forward/inverse azimuth, grid convergence, scale factor
  16. `15_CRS_Catalog`: Full 197+ CRS reference catalog with EPSG codes and PROJ4 definitions
  17. `16_Export_Center`: Formatted export preparation tables
  18. `17_Accuracy_Validation`: Ground truth control points and residual comparisons
  19. `18_Settings`: Precision, units, axis order options
  20. `19_User_Guide`: Comprehensive bilingual user manual
  21. `20_Metadata`: Catalog versions, operation IDs, release checksums
- Fix past scientific errors:
  - NO hardcoded static results passed as calculated results!
  - Real dynamic formulas in Excel
  - Fixed cell references
  - Accurate Egypt ETM and EPSG:22994 South Red Belt parameters
  - 100% macro-free for standard XLSX.

### Phase 7: GitHub Pages & Offline Production Verification
- Ensure relative base paths work smoothly under `https://ahmadibrahim4geo.github.io/MDAR/`.
- Verify production build `dist/` contains all assets, PWA manifest, service worker, and companion workbook downloads.
- Run complete test suite and log empirical evidence in `testing results/`.
- Prepare final DoneProof audit report in `reports/02_UNIFIED_WEB_EXCEL_DONEPROOF.md`.

---
## 2. DoneProof Acceptance Gates
- **Gate T0:** `npm.cmd run lint` (0 errors), `npm.cmd run build` (success).
- **Gate T1:** Mathematical unit tests covering all transformation models.
- **Gate T2:** Interactive UI verification (Smart Import, Column Mapping Wizard, Data Grid).
- **Gate T3:** File format roundtrip verification (XLSX, CSV, KML, GeoJSON).
- **Gate T4:** Offline PWA verification and GitHub Pages subpath compatibility test.
