# User Request: MDAR — Unified Web & Excel Professional Development

Develop MDAR into a comprehensive professional platform across both MDAR Web and MDAR Excel:
- Unified Brand Identity: **MDAR** (English) / **مدار** (Arabic) — Mapping, Datum Adjustment and Reprojection. Remove any Kasra or diacritics.
- Smart Import Engine: Automated file parsing (XLSX, XLS, CSV, TSV, TXT), encoding detection, delimiter discovery, header/data row detection, decimal commas/dots, multi-sheet inspection, preview.
- Smart Column Detection: Heuristic and synonym-based column role matching (X, Y, Z, Point ID, Name, CRS, Datum, Zone, Description) with confidence scores, 100% offline without external AI/API keys.
- Column Mapping Wizard: Independent review UI with auto-detect, manual mapping, profile save/load (localStorage), swap X/Y, validation.
- Batch Data Grid & Web Workers: High-capacity coordinate processing, non-destructive original data preservation, transformed columns, map selection synchronization, export center.
- MDAR Excel Reconstruction: 21 organized sheets with genuine dynamic OpenXML formulas (zero VBA/macros), fixed cell references, true UTM & Egypt ETM calculations, ground-truth validations.
- GitHub Pages & Offline PWA Hardening: Configured for `https://ahmadibrahim4geo.github.io/MDAR/`, subpath `/MDAR/` asset compatibility, offline service worker, DoneProof verification.
