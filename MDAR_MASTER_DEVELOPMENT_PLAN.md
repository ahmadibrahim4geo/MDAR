# MِDAR | مدار — Master Development & Acceptance Plan

**Mapping, Datum Adjustment and Reprojection**  
**Universal Coordinate & Geospatial Transformation Platform**

**الحالة:** مقترح تطوير قابل للتنفيذ، وليس إصدارًا جاهزًا. الاسم معتمد من المالك: MِDAR | مدار. توفر الاسم وتعارضات العلامات التجارية لم تُفحص بعد.  
**المصدر:** `egypt-global-coordinate-converter.zip`، مراجعة ساكنة بتاريخ 2026-11-24؛ لم يتم تشغيل التطبيق أو اعتماد دقته.  
**المالك:** صاحب المشروع الأصلي؛ حافظ على نسب العمل وحقوق المساهمين.  
**الهدف:** منصة مجانية مفتوحة المصدر، عربية/إنجليزية، تعمل محليًا في المتصفح، ومصنف Excel مستقل للنطاق المدعوم، ومرجع عالمي لأنظمة الإسناد الإحداثي، وتحويل ملفات GIS/CAD.

## 00 — Master agent instructions
ابدأ من المستودع الحالي، لا تستبدله بقالب جديد ولا تفقد الوظائف. أنشئ فرعًا للتطوير، baseline tag ونسخة احتياطية غير متضمنة node_modules. لا تنشر أو تغير اسم المستودع أو تمسح ملفات المالك دون إذن. اعتمد الهوية المعتمدة MِDAR | مدار في جميع المخرجات الجديدة، واتبع قواعد التسمية في القسم 02. لا تستخدم GeoMizan أو MADAR كاسم المنتج. ابدأ بتقرير جرد الوظائف الفعلية مقابل README. شغّل npm ci ثم lint وbuild واختبارات أساسية في بيئة معزولة بعد فحص التبعيات. لا تعتبر وجود زر أو كود أو وصف دليلًا على نجاح الوظيفة. لا تعتمد إحداثيات غير موثقة، ولا تستنتج EPSG من اسم محلي، ولا تدعي دقة غير مختبرة. عند عدم توفر التحويل الدقيق أو grid أو حق استخدامه: توقف واعرض السبب وخيارات بديلة مصرح بها. لا تستخدم AI في الحسابات أو تخمين المراجع. لا تطلب API key لتشغيل التحويلات. افصل التحويل عن العرض والتصدير. لا تنشر release قبل اجتياز القبول المستقل. اتبع المراحل بالتتابع، وسجل الانحرافات والأسباب والاختبارات الفاشلة دون إخفائها.

## 01 — Existing project: evidence and risks
| الملف | الملاحظة الفعلية | الإجراء |
|---|---|---|
| package.json | React 19، TypeScript، Vite، Tailwind، Leaflet؛ README يذكر React 18؛ لا توجد مكتبة XLSX أو PROJ أو GDAL ضمن dependencies | توحيد التوثيق؛ تدقيق الاعتماديات وإزالة غير المستخدم فقط بعد اختبارات |
| src/lib/crsData.ts | قائمة الدول العربية الـ22 وتصنيفات UTM N/S؛ تعريفات EPSG وCUSTOM وAUTO يدوية | توليد catalog من قاعدة PROJ/EPSG مثبتة الإصدار؛ تدقيق كل تعريف |
| README.md | Blue Belt موصوف 22994 وExtended Purple 22995 بخلاف الكود والسجل | تصحيح إلى 22991 و22994؛ Red 22992؛ Purple 22993؛ Egypt geographic 4229 |
| src/lib/coordinateMath.ts:120–176 | تحويل Egypt 1907 باستعمال Molodensky–Badekas مُسمى EPSG:7697 وارتفاع صفري | مقارنة معاملات ومخرجات العملية الرسمية واتفاقية الدوران ونطاق الاستخدام؛ عدم اعتبار height=0 ارتفاعًا حقيقيًا |
| coordinateMath.ts:201–314 | KSA_GRF17 وQND95 وKGD93 تعامل كإحداثيات WGS84 دون تغيير؛ fallback يعيد نفس النقطة؛ معاملات 3-param عامة | منع identity الصامت لمرجع مختلف؛ اختيار operation وفق AOI/epoch/grids؛ توثيق أي تقريب |
| coordinateMath.ts | TM وWeb Mercator ومحرك مخصص | إبقاؤه legacy للاختبار، استبدال مسار الإنتاج تدريجيًا بمحرك موثوق |
| src/lib/parser.ts | parsing وDMS وتطبيع الأرقام | اختبارات نطاق ووحدات وإشارات وفواصل عربية/إنجليزية |
| src/components/ExportModal.tsx:36,134–200 | صيغ excel/csv/kml؛ Excel هو HTML باسم .xls وليس OOXML؛ خلايا HTML غير مهربة في مسار التصدير | XLSX حقيقي بقيم عددية، منع حقن HTML/CSV، تطابق الامتداد والمحتوى |
| src/components/BatchTab.tsx | جدول تفاعلي ونسخ/لصق؛ لا دليل من مجرد README على قراءة XLSX الحقيقية | اختبر الاستيراد الفعلي، column mapper وworker وحفظ الحقول |
| src/utils/kmlExport.ts | مصدر تصدير KML | تحقق من lon/lat WGS84، XML escaping، ارتفاع وmetadata |
| vite.config.ts / .github/workflows/deploy.yml | base ./، نشر dist بواسطة Actions | حافظ على GitHub Pages وrelative assets وWASM، اختبارات نشر وموقع فرعي |
| ZIP | node_modules ضمن الملف؛ لا LICENSE مستقل في قائمة الملفات غير التابعة رغم وصف Apache-2.0 | .gitignore وrelease نظيف؛ تحقق من حقوق الكود قبل إضافة LICENSE وNOTICE |

الملاحظات أعلاه مراجعة كود فقط؛ اختبارات التشغيل والانحراف العددي أول بوابة تنفيذ. لا يثبت فشل كل حالة من الحالات بمجرد ملاحظة المخاطر.

## 02 — Product scope & nomenclature
- Web App: single/batch conversion, file reprojection, map, tools, CRS encyclopedia, validation, downloads, help, settings.
- Excel Standard `.xlsx`: معادلات مكشوفة ومحمية من التعديل العرضي، بلا ماكرو أو روابط حساب خارجية؛ دعم مؤهل فقط.
- Excel Professional `.xlsm` optional: VBA مراجع، ويعمل على إصدارات سطح المكتب المختبرة؛ لا تعطيل لأمان الماكرو.
- Excel Bridge optional: تطبيق محلي أو Web import/export أو CLI محمول للمحرك الكامل؛ لا يزعم أن XLSX بذاته يحول جميع البيانات المتجهة.
- Core SDK / CLI: نفس العقود والإصدارات والتقارير؛ واجهة TypeScript، CLI محلي اختياري مبني على GDAL/PROJ.
- Offline PWA: بعد تنزيل الحزم اللازمة؛ لا خادم مدفوع ولا حساب ولا إعلانات ولا telemetry افتراضية.
### Approved brand and naming rules
- الاسم العربي: **مدار**. الاسم الإنجليزي المرئي: **MِDAR** (حرف M يتبعه رمز الكسرة العربية U+0650 ثم DAR، دون A بعد M). لا تُسقط الكسرة في الهوية المرئية ولا تستبدل الاسم بـ MADAR.
- التوسعة الإنجليزية: **Mapping, Datum Adjustment and Reprojection**؛ حروف الاختصار M–D–A–R، وأداة العطف and لا تدخل في الاختصار.
- الوصف الرسمي: **Universal Coordinate & Geospatial Transformation Platform** — المنصة العالمية لتحويل الإحداثيات وإعادة الإسقاط الجغرافي.
- الصيغة التقنية ASCII: `MDAR` لأسماء الملفات والمجلدات والعناوين التقنية، و`mdar` لمعرفات الحزم والروابط وأسماء المستودعات المقترحة حيث يلزم lowercase. لا تدخل علامة الكسرة في مسارات الملفات أو package IDs أو URLs.
- أسماء المنتجات: MِDAR Web، MِDAR Excel، MِDAR CRS Encyclopedia، MِDAR File Converter، MِDAR Core، MِDAR CLI. أمثلة المخرجات: `MDAR_Converter.xlsx`، `MDAR_Professional.xlsm`، `MDAR_Offline.zip`، `MDAR_MASTER_DEVELOPMENT_PLAN.md`.
- طبّق الهوية على واجهة الويب، عنوان الصفحة وmetadata، README العربي والإنجليزي، صفحة التنزيل، واجهات Excel، التقارير، ملفات المساعدة وأسماء الإصدارات. اختبر عرض الكسرة وعدم انقلاب ترتيب الحروف في RTL/LTR، واستعمل عزل الاتجاه LTR للاسم الإنجليزي في واجهة عربية. أضف اسمًا قابلًا للقراءة لقارئات الشاشة.
- استخدم الاسم المعتمد في التطوير المحلي دون تغيير المستودع البعيد أو الروابط المنشورة تلقائيًا. تحقق من GitHub/npm/domain/trademark قبل النشر؛ في حال وجود تعارض أبلغ المالك ولا تختر اسمًا بديلًا من تلقاء نفسك. لا تدّعِ أن الاسم متاح قانونيًا أو تقنيًا قبل التحقق.

## 03 — Geodetic architecture
```
Input -> parse + validate + normalize axes/units -> CRS resolver -> candidate operations
      -> AOI/epoch/grid selection -> transform -> precision-independent QA
      -> result + operation provenance -> presentation/export
```
- Geographic CRS, projected CRS, geocentric CRS, vertical CRS, compound CRS, engineering CRS؛ افصل datum وellipsoid وprojection وcoordinate representation. DD/DMS/DDM تمثيلات وليست datums. EPSG:3857 مختلف عن UTM. MGRS/USNG/Geohash/Plus Codes تمثيلات شبكية/ترميزات لا CRS عامة؛ اذكر دقة الخلية وعدم قابلية استرجاع النقطة الأصلية من الرمز المكمم.
- محرك مرجعي PROJ native في CI عبر pyproj وprojinfo، GDAL/ogr2ogr للملفات. في الويب: اثبت أولًا جدوى PROJ/GDAL WASM (مثل gdal3.js) ووجود proj.db، وقراءة grids واسترجاع تفاصيل operation، والقدرة على تحديد pipeline صراحة؛ إن قصرت الواجهة ابنِ adapter/binding محدودًا أو عطّل الوظيفة. Proj4js سريع للعمليات المؤهلة فقط؛ ليس بديلًا تلقائيًا عن كل PROJ. لا fallback غير معلن بين المحركات.
- استخدم versioned PROJ database، EPSG Registry terms، بيانات grids مع checksum وترخيص لكل ملف. لا تجلب بيانات نقاط المستخدم لخادم خارجي. grids كبيرة تُنزّل اختياريًا بأسماء عامة وبموافقة؛ اذكر متطلبات offline. لا توزع أي grid غير مرخص.
- Operation selection: مصدر/هدف، نطاق AOI (bbox)، تاريخ/epoch وrealization عند اللزوم، direction، authority، operation ID، method، accuracy metadata، grids المتاحة، deprecated/superseded، ballpark. اختر تلقائيًا فقط من مؤهلة؛ اعرض البدائل والدقة والنطاق. استبعد ballpark افتراضيًا؛ اختيار تقريب صريح مع warning في كل ناتج. لا تفترض أن المرور عبر WGS84 دائمًا أفضل من direct pipeline. لا تحسب دقة مطلقة من دقة العرض.
- محور الإدخال واضح: longitude/latitude أو latitude/longitude، Easting/Northing، X/Y/Z. اعرض ترتيب authority بجانب UI order. أدر الوحدات m/km/ft/US survey ft/deg/radian. لا تحول Z تلقائيًا بين ellipsoidal/orthometric؛ يتطلب نموذج geoid وvertical CRS. GNSS dynamic references تتطلب epoch معلومًا؛ لا تفترض السنة الحالية.
- `TransformRequest`: sourceCrs,targetCrs,coordinates,axisPolicy,aoi,coordinateEpoch,operationId,allowBallpark=false,verticalPolicy,precisionDisplay,precisionExport.
- `TransformResult`: rawCoordinates,displayCoordinates,source/target IDs,operationId/pipeline,estimatedAccuracyOrUnknown,areaStatus,gridStatus,epoch,engineVersion,catalogVersion,warnings,status,pointId. أخطاء مستقرة: CRS_UNKNOWN, GRID_MISSING, EPOCH_REQUIRED, OUTSIDE_AREA, INVALID_COORD, UNSUPPORTED_OPERATION, APPROXIMATION_REQUIRED, FORMAT_LIMIT.
- اختبر وطبق forward/inverse وidentity لنفس CRS فقط. تحويل x/y لكل vertex وليس centroids. لا تستخدم صيغة التصدير أو الدقة العشرية في intermediate calculation.

## 04 — CRS Encyclopedia / Global catalog
مصدر canonical من proj.db ومراجع EPSG الرسمية وفق الترخيص. بنية DB/JSON chunks: authority, code, name_ar/name_en, aliases, kind, datum, ellipsoid, projection, units, axes, extent, area_name, bbox, scope, source, version, deprecated, operation refs, WKT2, PROJJSON, permitted PROJ strings, export compatibility. استخدم ESRI authority كذلك حيث متاح ومسموح. ابحث بأي اسم أو code أو اختصار عربي/إنجليزي؛ فلاتر قارة/دولة/نوع/وحدة/مرجع/نطاق وdeprecated. قائمة مقارنة CRSs وعرض الخريطة للنطاق وحدود تقريبية مع توضيح أنها ليست حدودًا مساحية رسمية. صفحة لكل CRS وروابط مشاركة مع source/target فقط، دون نقاط حساسة. تنزيل تعريف WKT2/PRJ/PROJJSON أو نسخ. تعريفات خاصة `CUSTOM:<uuid>` مع provenance وvalidation وexport/import local؛ لا تمنح رقم EPSG مزيفًا. أي MTM/ETM مخصص يظل غير مؤهل حتى مصدر موثق.

### Arab priority coverage
Egypt, Saudi Arabia, UAE, Qatar, Kuwait, Oman, Bahrain, Jordan, Palestine, Iraq, Syria, Lebanon, Yemen, Sudan, Libya, Tunisia, Algeria, Morocco, Mauritania, Somalia, Djibouti, Comoros. جميعها 22. لكل دولة صفحة مرجع وجدول الأنظمة الوطنية الحديثة والقديمة، geographic/projected/vertical، WGS84 UTM zones، operations وتوثيق الجهة الوطنية، عينات نقاط اختبار علنية، حالة verified/approximate/unsupported. لا نخترع national grid للدولة التي لا نجد لها مصدرًا. أولوية Egypt: EPSG:4229,22991,22992,22993,22994؛ عمليات 1148/8537/7697 تُدرس بحسب نطاقها ودقتها، لا توصف بأنها متبادلة؛ MTM وSouth Red custom يحتاجان توثيقًا. Saudi: KSA-GRF17 وAin el Abd وUTM المناسبة، epochs وofficial GEOSA transformation/grid requirements. Morocco Merchich، Algeria Nord/Sud Sahara وغيرها، Tunisia Carthage، Palestine 1923، Jordan JTM، Oman Fahud، Iraq Karbala، Sudan Adindan، الخليج national grids: أمثلة للبحث لا تعريفات مثبتة. أضف بقية دول العالم من registry تدريجيًا دون ادعاء أن كل CRS له عملية متاحة.

### Global conversion coverage
WGS84 DD/DMS/DDM، UTM 60 N +60 S، Norway/Svalbard zone exceptions، UPS للأقطاب، Web Mercator limits، ECEF، ENU مع origin وheight، MGRS/USNG، State Plane، national grids، custom TM/LCC/Albers/LAEA/stereographic/other PROJ-supported methods، dynamic/vertical لاحقًا بعد qualification. Auto UTM للعرض والنقاط؛ في layer كامل لا تغير CRS لكل vertex؛ اختر نظامًا واحدًا أو split by zone بإذن.

## 05 — Web UI and UX
React/TS/Vite/Tailwind الحالية، تصميم responsive RTL/LTR مع لوحة ألوان هادئة (مؤقتًا teal/charcoal) وdark/light/system. Tabs: Home, Single, Batch, Files, CRS Explorer, Geodesy Tools, Excel Downloads, Help, Settings. لا clutter ولا registration ولا ads. Header مختصر وشريط حالة يوضح engine/catalog/online-grid status. اختيار From/To searchable with favorites/recent/local/global/custom. Swap source-target يعكس القيم المحولة الصحيحة فقط. زر reset/copy/paste/download، auto-convert مع debounce عند المدخل المكتمل، source/target examples، map click optional، control keyboard/accessibility WCAG 2.2 AA كهدف، contrast، error focus، no map required. Format controls metricDecimals (default 3)، DD (default 7)، seconds (default 3)، display/export rounding منفصل؛ لا تتجاوز قدرات double، تحكم من 0–12 أو وفق الوحدة. حافظ على raw numeric values. حدد decimal separator وthousands separator وحروف الاتجاه والأرقام العربية والفارسية. DMS bounds + 60-second carry + negative zero + conflicting sign/hemisphere validation. لا تدع input غير صالح يظهر كـ0.

### Batch/table
Paste Excel multi-cell وCSV quoted/semicolon/tab؛ actual XLSX/XLS import (library selected after security review)، sheet/header/column mapping، اختيار X/Y/Z/ID/epoch/CRS optional لكل row، preserve all columns with collision-safe output names، data preview، row count/errors، undo، filter، selection/export selected/all، streaming/chunks + worker + cancel. Output fields: Point_ID, Source_CRS, Target_CRS, Input_X/Y/Z, Output_X/Y/Z, Longitude, Latitude, Operation_ID, Accuracy_m, Status, Warning, Epoch. لا تحذف مدخل أو صف فاشل؛ لا تدرج هندسة خاطئة؛ failed rows report. Import Excel formulas read cached values فقط مع warning عند missing; لا تنفذ ماكرو. منع spreadsheet formula injection في user text، لا تعطل numeric negatives. Large tables virtualized، limit based on memory and benchmark.

### Map and geodesy utilities
Leaflet existing؛ optional MapLibre/OpenLayers after measured need. OSM attribution/tile policies، providers optional no API key requirement، لا bulk cache دون إذن. Coordinate click, points/lines/polygons preview, source-target overlay in common display CRS, AOI overlays and discrepancy map. Geodesic distance/azimuth/area/perimeter using GeographicLib or qualified PROJ; planar separately with CRS/unit warning. Forward/inverse geodesic, convergence/scale factor where supported, distance between control points, transformation residual RMSE; later local calibration (similarity/affine, enough noncollinear control points, holdout, report) without representing as national datum.

## 06 — File engine
Workflow: drag/drop -> safe archive scan -> list layers/types/CRS/feature count/fields/Z/M -> select target/operation -> preview options -> execute worker -> validate -> download + manifest. `.prj` missing: require explicit CRS assignment (assign ≠ reproject); never infer CRS from bounds alone. Use GDAL/OGR WASM prototype; probe compiled drivers at runtime and gate actual supported read/write. Native CLI fallback optional for unsupported large formats. Preserve attributes/order where driver allows, ID mapping, geometry type multipart/holes, Z/M, null geometry, Unicode, units, layer names; report any unavoidable loss before conversion. Geometry validity and repair opt-in; nonlinear projection may require densification with user-set tolerance; antimeridian handling; preserve valid orientation per format; reject silently truncated coordinates.

| Format | Read | Write | Constraints |
|---|---|---|---|
| XLSX/XLS/CSV/TXT | target | XLSX/CSV/TXT | true numeric XLSX, source CRS sidecar metadata |
| SHP ZIP | target | target | .shp .shx .dbf .prj .cpg; 10-char field names, encoding/field mapping and size restrictions; split geometry type/layer |
| KML/KMZ | target | target | WGS84 lon,lat,alt; KMZ zipped doc.kml; report unsupported styles |
| GeoJSON | target | target | RFC7946 WGS84 lon/lat; no fake projected CRS in standard file |
| GPKG | target | target | multiple layers, CRS metadata; prove SQLite WASM support |
| DXF | target | target | modelspace coordinates/units, user assigns CRS; sidecar WKT/manifest, report unsupported blocks/arcs/text/styles |
| GPX/GML/WKT | target | target | GPX geographic, WKT geometry vs CRS WKT distinct; schema limits |
| FlatGeobuf | later | later | driver runtime qualification |
| GeoParquet/FileGDB | later | later | actual read/write driver capability, never promise absent capability |
| GeoTIFF/COG | later | later | GDAL warp with resampling nearest/bilinear/cubic, nodata/pixel size/extent/CRS, memory guards |

No automatic DWG support claim. Deliver format capability matrix, exact reprojection vs format conversion vs assign only, feature count/extent/attribute/geometry validation and manifest `operation.json`. Batch multi-file queue; one ZIP per output layer set or multi-layer GPKG. Native file support not assumed for WASM. ZIP bomb/path traversal and XML external entities protection, size/feature/time limits, file extension/content consistency, sanitize markup and paths; no external KML URL fetch by default.

## 07 — Excel workbook design and parity
**Standard.xlsx**: native OOXML, no macros, no external links, input tables and real formulas, protected formula cells but documented and inspectable, unlocked inputs, data validation, dropdowns, frozen header, filter, bilingual guides, clean printed page. Compatibility baseline propose Microsoft Excel 2021/365, confirm with real spreadsheet calculation; if older Excel unsupported list exact reason. Use only supported functions. Export data native .xlsx not HTML. Input/output numeric cells retain precision, custom number formats display selected precision or helper display column if dynamic formatting unavailable. Formulas protect invalid input, not blanket IFERROR that hides failure. DMS as structured components and formatted text; label signs and hemisphere. Conditional formatting status, not status by color alone. Standard supports only verified equation groups (DD/DMS/DDM, WGS84 UTM/TM and other qualified CRS pairs), and unsupported rows say USE_WEB_ENGINE; no fabricated equivalence to national datums. Geodetic formula modules generated from qualified data and documented coefficients. Height treatment explicit. Provide explicit max rows/version and tested resizing, examples, regression fixtures and error sheet. Excel file includes a local/manual import-export flow, not a claim to process shapefile directly. Optional XLSM + source .bas modules and instructions for desktop; do not ask users to disable macro security. Optional bridge with core native engine for complex grids/epochs/vertical and GIS exports; export template with results/metadata; user can upload directly in web app.

| Sheet | Purpose |
|---|---|
| 00_Home | index, how to use, version and compatibility |
| 01_Single_Point | source/target, inputs, formatted outputs and status |
| 02_Batch_Converter | Excel Table, IDs, inputs, results, errors |
| 03_DD_DMS_DDM | bidirectional format conversion |
| 04_UTM_UPS | UTM and qualified UPS |
| 05_Egypt | approved Egypt systems and operations only |
| 06_Arab_Grids | approved national grids |
| 07_Global_Grids | approved international systems |
| 08_Custom_CRS | parameters for verified methods; validation |
| 09_Datum_Transform | operation parameters, authority, method, convention, area |
| 10_Geodesy_Tools | approved calculations, units |
| 11_CRS_Database | generated curated definitions; read-only reference |
| 12_Accuracy_Check | reference inputs expected outputs residuals, pass/fail |
| 13_Export_Data | tabular data ready for web/CLI |
| 14_Settings | decimal digits, order, units, language guidance |
| 15_Documentation | equations, limitations, links |
| 16_Metadata | catalog/engine versions, operation, release checksum |

Workbook QA: open/save/recalculate in target Excel; compare cached and recalculated results to reference; use independent control points, test copy/paste, adding rows, numeric precision, mixed Arabic, no formula errors, source-target swap, missing operations. Check compatibility separately for Excel Web and LibreOffice if claimed. Test actual `.xlsx` ZIP/OOXML package. Do not deliver workbook with blank formula caches or invented output. `Standard`/`Professional`/`Web` parity matrix for each operation, not blanket promise.

## 08 — Libraries and research resources
Candidates; verify pinned versions/license/security/browser compatibility and runtime features before selecting. Prefer existing stack and avoid redundant dependencies. Links are source entrypoints, not a claim that every library has been tested.

| Component | Candidate/source | Use |
|---|---|---|
| CRS authoritative | https://epsg.org/ ; https://proj.org/ ; https://github.com/OSGeo/PROJ | definitions and operations |
| Grids | https://cdn.proj.org/ ; https://github.com/OSGeo/PROJ-data | authorized grid files and licenses |
| Native QA | https://github.com/pyproj4/pyproj ; https://gdal.org/ | reference computations and formats |
| Browser GIS | https://github.com/bugra9/gdal3.js | GDAL/OGR WASM feasibility |
| Lightweight JS | https://github.com/proj4js/proj4js | qualified supported operations only |
| Geodesics | https://geographiclib.sourceforge.io/ | geodesic and grid reference methods |
| MGRS | https://github.com/proj4js/mgrs | precision-aware MGRS |
| Basemap/map | https://leafletjs.com/ ; https://maplibre.org/ ; https://openlayers.org/ | preview only |
| Spreadsheet | https://docs.sheetjs.com/ ; https://github.com/exceljs/exceljs ; https://openpyxl.readthedocs.io/ | import/export/workbook generation, choose appropriate licenses |
| CSV | https://www.papaparse.com/ | robust parsing |
| ZIP | https://github.com/101arrowz/fflate | compressed files with safety limits |
| Grid | https://tanstack.com/virtual/latest | virtualized batch table |
| Testing | https://vitest.dev/ ; https://playwright.dev/ ; https://docs.pytest.org/ | unit/E2E/reference tests |
| Offline | https://vite-pwa-org.netlify.app/ | PWA build, optional cache |
| Accessibility | https://www.w3.org/WAI/standards-guidelines/wcag/ | RTL, keyboard, accessible forms |
| Data standards | https://www.rfc-editor.org/rfc/rfc7946.html ; https://www.ogc.org/standards/ ; https://gdal.org/en/stable/drivers/vector/ | GeoJSON, KML, GPKG, vector constraints |
| Official Saudi | https://geosa.gov.sa/en/mediacenter/Pages/faq.aspx ; https://gds.geoportal.sa/About | KSA-GRF17, operation/epoch |
| Operation selection | https://proj.org/en/stable/apps/projinfo.html ; https://proj.org/en/stable/operations/operations_computation.html | area, grid, accuracy, operation |
| Excel limitations | https://learn.microsoft.com/en-gb/office365/servicedescriptions/office-online-service-description/office-online-service-description | Web vs VBA support |

### Competitor benchmark
EPSG.io https://epsg.io/ (catalog), Reproj https://reproj.io/about (local GDAL WASM), Mapshaper https://mapshaper.org/ (file processing), NOAA NCAT https://www.ngs.noaa.gov/NCAT/ (official regional conversion and metadata), GEOSA https://gds.geoportal.sa/About (national service), GeographicLib https://geographiclib.sourceforge.io/ (grid/geodesic algorithms). Build feature matrix with manual checks and versions; no copied UI/assets, no unproven claims of superiority. Differentiation: multilingual Arab-first reference + full global registry + offline workbook + provenance + file workflow. Verify competitor links/features before publication.

## 09 — Repository layout
```
MDAR/                          # approved brand MِDAR; ASCII folder name
  apps/web/                    # migrated React app, retain history
  packages/core/               # engine adapters, types, CRS resolver
  packages/crs-catalog/        # generated versioned catalog
  packages/file-engine/        # drivers and safe import/export
  packages/shared-ui/          # reusable components and i18n
  excel/                       # source generators and templates, not fake XLS
  tools/cli/                   # optional local GDAL/PROJ bridge
  data/                        # manifest, permitted definitions, optional grid refs
  docs/                        # user and scientific guides ar/en
  plans/                       # phased tasks + master plan
  reports/                     # numbered audit/review/QA/release reports
  testing_data/                # redistributable synthetic/reference fixtures
  tests/                       # unit/reference/integration/E2E/security
  new_skills/                  # verified skills, license and index
  dev_builds/                  # ignored except manifest/readme
  portable_builds/             # offline/CLI release outputs, avoid tracking binaries
  .github/workflows/            # checks and Pages deployment
  README.md / LICENSE / NOTICE / SECURITY.md / CHANGELOG.md
```
Migration may keep original src temporarily to reduce breakage. Root README bilingual (MِDAR | مدار), docs examples, release downloads, installation, web link, support matrix, citation/limitations. GitHub Pages static build `dist/index.html` with assets relative to base path; no requirement that raw file:// index works with modules/WASM. Provide PWA hosted and local offline distribution with local static server if needed. GitHub Releases host Excel and portable bundles; checksum manifest; no node_modules, private keys, user data or bulky unlicensed grids. Use npm lockfile consistently (existing bun.lock review), supported Node LTS; Actions PR tests, Pages only on accepted main/tag, security audit and supply-chain inventory/SBOM. Single-thread WASM default on Pages unless cross-origin isolation is demonstrated; test HTTPS paths and worker/WASM asset loading. No server-only API. No repository rename or remote write without owner approval.

## 10 — Skills, agent roles, and governance
Use existing GIS Development Skills repository https://github.com/ahmadibrahim4geo/GIS-Development-Skills as candidate source only; inspect actual available skill names/content, do not invent installed skills. Create missing modular skills in `new_skills/` with SKILL.md, references, examples and tests. Required capability groups: geodesy/CRS/PROJ, GDAL vector/raster, file format standards, web GIS and WASM/worker, React/TS UI, Arabic i18n/accessibility, Excel formula engineering and OOXML, security/privacy/ZIP/CSV, reference numerical testing, GitHub Pages/release/OSS license. Additional skills for UI design, documentation and performance. Record exact source URL/commit/license and avoid auto-running third-party instructions; review prompt-injection risks. No mandatory paid service.

Roles per phase: Product owner defines acceptance; GIS/geodesy architect specifies operation/model; programmer implements; independent reviewer audits code/math/security, cannot sign off own unreviewed work; QA tester runs matrix and independent reference; release engineer packages only passed deliverables; technical writer documents. If one agent performs roles, use separate passes with separate reports and no claim of human independence. Each phase: baseline -> design -> implement -> review -> remediate -> re-test -> owner gate. Reports include git diff, dependencies, exact commands, versions, fixtures, expected/actual/tolerance, failure status, limitations and next decisions. Record snapshot after every phase. No fake tests.

## 11 — Execution roadmap with gates
| Phase | Work | Deliverables / gate |
|---|---|---|
| 0 | inventory, preserve source, run baseline, reproduce defects, compare competitors | 00_BASELINE_REPORT.md; matrix of existing claims vs tests; screenshots; no feature regressions unexplained |
| 1 | PROJ/GDAL WASM spike, native reference, license review, operation API | 01_ENGINE_FEASIBILITY.md; tested supported drivers and engine constraints; fail closed when missing grids |
| 2 | CRS catalog, Egypt/Saudi verified operations, Arabic 22 coverage | versioned manifest, generator, national source register; independent fixture checks |
| 3 | single conversion and format parsing, all UTM zones, UI settings | unit/E2E; forward/inverse and invalid input checks |
| 4 | batch, true XLSX/CSV import/export, large-table worker | data preservation, cancelled jobs, no fake XLS |
| 5 | SHP/GeoJSON/KML/KMZ/GPKG/DXF/GPX file processing | per-format qualification and format-specific loss report; unsupported disabled |
| 6 | Excel Standard + optional advanced editions | verified real workbook with parity matrix; independent Excel recalc test |
| 7 | encyclopedia, geodesy tools, global filters, docs | source provenance, clear accuracy labels, bilingual navigation |
| 8 | dynamic/vertical, local custom calibration, raster/advanced formats | only validated grids/operations/driver capabilities; separate releases if unavailable |
| 9 | accessibility, security, performance, offline/PWA, GitHub Pages | final audit, reproducible builds and download tests, owner approval |

Implementation order is suggested, not a time estimate. Prioritize correct transformations before expanding catalog. Excel can be prototyped after Phase 2 and delivered incrementally; QA gate required for each sheet. Never block free core release solely on optional advanced raster/Excel bridge if scope clearly stated.

## 12 — Test and acceptance matrix
| Test | Cases | Acceptance |
|---|---|---|
| Baseline | npm ci, tsc, vite build, existing tabs | recorded results and exact failures |
| Reference point | EPSG:4326 ↔ UTM, all zones/hemispheres, EPSG:3857, TM | independent expected results; propose 1 mm projected numerical difference for qualified same-method double calculations, subject to justified tolerance; not surveying accuracy |
| National datum | Egypt all 4 belts, KSA-GRF17 UTM, Arab country test points | compare same operation and epoch to PROJ/official known control points, operation-specific tolerance; published accuracy distinct from residual |
| No valid operation | outside area, missing grid, missing epoch, wrong CRS | blocked or explicit approximation with provenance; never silent pass-through |
| Edge inputs | antimeridian, polar boundaries, Norway/Svalbard, invalid DMS, signs, comma, zeros, units, axis swap | correct result or deterministic warning/error |
| Roundtrip | x→y→x, same CRS identity | operation-aware tolerance; roundtrip alone not sufficient |
| Excel parity | multiple operations and 100/1k/10k rows as feasible | numeric cells, formula recalc vs native expected, no silent unsupported rows; report performance |
| Data fidelity | point/line/polygon/multipart, holes, Z/M, Unicode, nulls, all fields, CRS missing | preserve what format permits; report losses; correct PRJ/manifest and counts |
| Formats | ZIP Shapefile valid sets, KML/KMZ, RFC7946, GPKG, DXF, malformed files | independent GDAL/QGIS reopen; CRS/units/geometry valid; no fake file extension |
| Security | ZIP traversal/bomb, XXE, CSV injection, XSS, malformed WKT/PROJ definitions, giant input | safe reject/sanitize; no script execution/external uploads |
| Performance | 1/1k/10k/100k points, small/large layer, first/second load | measure device/browser/peak memory/time; responsive UI and cancellation; choose published limits from measured results |
| UI | RTL/LTR, keyboard, mobile/desktop, dark/light, copy/paste/download | Playwright + manual tests, meaningful errors and accessible controls |
| Offline | disconnect after packages cached, no maps/grids, browser storage quota | core works where dependencies cached; clear missing resource error |
| Release | Pages root/subpath, asset/worker/WASM URLs, workbook/download checksums | production smoke and verification on release artifacts |

Reference dataset format: fixture_id,source_crs,target_crs,operation_id,source_coords,epoch,expected_coords,units,tolerance,reference_url,reference_version,license. Use published official points where available; synthetic PROJ test points are engine parity, not validation of survey ground truth. Real-world survey accuracy depends on frame/operation/grid/control quality. Document numerical vs real accuracy separately. Do not market submillimetre accuracy on all data. Stop release when a mandatory test fails; mark unsupported instead of quietly relaxing tolerances.

## 13 — Final release deliverables and acceptance
- Live GitHub Pages web app with downloadable workbook(s), browser privacy notice, offline limitations and capability list.
- Source repository with reproducible build instructions, `LICENSE` following confirmed original rights, third-party notices and versioned catalogs; no secrets.
- Real `.xlsx` Standard, optional `.xlsm` only after macro review, bridge if qualified, sample data ZIP and tests. Use the approved MDAR filenames and MِDAR display branding specified in section 02.
- Bilingual help and scientific CRS encyclopedia, operation metadata, limitations, format support matrix, public changelog, explicit bug reporting process.
- Numbered reports: 00 baseline, 01 architecture, 02 implementation, 03 independent review, 04 QA matrix, 05 acceptance; per-phase appendices. Include exact test counts and failed tests; if not run label NOT RUN.
- No changes to original ZIP, repository name, public remote or license without explicit owner authorization. Name availability, actual run-time compatibility, quantitative precision, licensed grids, and exact format driver support remain unverified in this planning review. These are mandatory phase-0/1 investigation tasks, not completed results.
