# Plan 0003: MDAR Excel — Critical Reconstruction Order

## Objectives & Scope
Completely reconstruct `MDAR_Converter.xlsx` from the ground up as a standalone, professional engineering application inside Microsoft Excel, replacing the flawed 21-sheet design and resolving the `xl/styles.xml` corruption caused by `write-excel-file`.

## Architecture & Work Breakdown

### Phase 1: Generator Engine Selection & Tooling
- Switch generator from `write-excel-file` (which corrupted OOXML with `numFmtId="100..117"`) to a Python-based generator utilizing `xlsxwriter` (or `openpyxl`), which fully respects ECMA-376 standard (`numFmtId >= 164` for custom formats, valid OOXML schema).
- Verify OOXML zip structure and confirm 0 repairs when opened in Microsoft Excel.

### Phase 2: Geodetic Engine Re-engineering & Parity Verification
- Implement rigorous Redfearn / Krueger Transverse Mercator formulation:
  - Forward (Geodetic $\to$ Projected) for UTM and Egyptian National Grids (Red, Purple, Blue, Extended Purple).
  - Inverse (Projected $\to$ Geodetic) for all supported systems.
  - Correct ellipsoid parameters: Helmert 1906 for Egypt 1907 ($a=6378200.0, 1/f=298.3$), WGS 84 for UTM ($a=6378137.0, 1/f=298.257223563$).
  - Official Molodensky-Badekas (EPSG:7697) datum transformation parameters between Egypt 1907 and WGS 84.
- Verify formulas against `pyproj` to $< 1\text{ mm}$ analytical tolerance.

### Phase 3: Application UI/UX Layout & Visual Identity
- Design 6 clean visible application sheets with unified MDAR visual identity:
  1. `00_Home` / `00_الرئيسية`: Executive Dashboard, quick navigation cards, instructions, version metadata.
  2. `01_Single_Point` / `01_تحويل_فردي`: Unified Single Point workstation with distinct INPUT, TRANSFORMATION, and OUTPUT areas, color-coded cells, validation messages, and live results.
  3. `02_Batch_Converter` / `02_تحويل_جماعي`: Expandable Excel Table (`ListObject`) supporting paste, custom columns, automatic formula expansion, error notes, and batch statistics.
  4. `03_Geodesy_Tools` / `03_أدوات_جيوديسية`: Geodetic distance/azimuth, scale factor, grid convergence, and DMS/DD/DDM converter.
  5. `04_Accuracy_QA` / `04_ضبط_الجودة`: Ground-truth benchmark audit cards comparing workbook formulas with published EPSG/PROJ control points.
  6. `05_Documentation` / `05_التوثيق_العلمي`: Mathematical equations, datum parameters, usage guides, and citations.
- Hide internal mathematical engine sheets (`_Engine_Math`, `_CRS_Catalog`) using `state="hidden"` so regular users see only the pristine application.
- Format all sheets: hide gridlines (`showGridLines=False`), set custom column widths/row heights, protect formula cells, unlock editable cells.

### Phase 4: Implementation of Generator Script
- Write `scripts/generate_mdar_excel_app.py`.
- Run the generator to output `excel/MDAR_Converter.xlsx`, `public/downloads/MDAR_Converter.xlsx`, and `dist/downloads/MDAR_Converter.xlsx`.
- Ensure old version is backed up under `excel/archive/MDAR_Converter_v1.0_rejected_backup.xlsx`.

### Phase 5: Verification & Acceptance Gates (DoneProof)
- **T0**: OOXML structure validation (`unzip` / XML linting) and Python script execution.
- **T1**: Mathematical unit tests comparing Excel formulas against Pyproj ground truth ($< 1\text{ mm}$).
- **T2**: Real Microsoft Excel COM automation (`scripts/test_excel_open.ps1`):
  - Verify 0 repair/recovery dialogs.
  - Verify all dropdown data validations.
  - Verify input modification and dynamic recalculation.
  - Verify expanding rows in `MDAR_BatchTable` and formula auto-propagation.
  - Verify save, close, and re-open.
- **T3**: Automated visual screenshots captured from real Microsoft Excel.
- **T4**: Independent Review Report and DoneProof delivery documentation.
