# مدار – MDAR | Universal Coordinate Transformation Platform
### Mapping, Datum Adjustment and Reprojection

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-0284C7?style=for-the-badge&logo=github)](https://ahmadibrahim4geo.github.io/MDAR/)
[![Repository](https://img.shields.io/badge/GitHub-Repository-0F172A?style=for-the-badge&logo=github)](https://github.com/ahmadibrahim4geo/MDAR.git)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React 18](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite_6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-100%25_Offline-10B981?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![Excel App](https://img.shields.io/badge/Excel-OOXML_Standalone_App-16A34A?style=for-the-badge&logo=microsoftexcel&logoColor=white)](excel/MDAR_Converter.xlsx)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg?style=for-the-badge)](LICENSE)

<br />

```
  __  __ _____             _____  
 |  \/  |  __ \   /\      |  __ \ 
 | \  / | |  | | /  \     | |__) |
 | |\/| | |  | |/ /\ \    |  _  / 
 | |  | | |__| / ____ \   | | \ \ 
 |_|  |_|_____/_/    \_\  |_|  \_\
  مدار – Mapping, Datum Adjustment and Reprojection
```

**منصة هندسية ومساحية متكاملة ومفتوحة المصدر لتحويل أنظمة الإحداثيات، وتعديل المساند الجيوديسية، وتحويل ملفات GIS/CAD، مع تطبيق هندسي مستقل فائق الدقة داخل Microsoft Excel.**

</div>

---

## 📌 نبذة عن المنصة / Overview

**مدار – MDAR** هي منصة جيوديسية احترافية مجانية ومفتوحة المصدر، مصممة للمهندسين المساحيين وأخصائيي نظم المعلومات الجغرافية (GIS) والمخططين العمرانيين. تعمل المنصة محلياً بالكامل داخل المتصفح (100% Client-Side) دون أي خوادم خارجية أو نقل لبيانات المستخدم، مما يضمن أقصى معايير الخصوصية والأمان وسرية البيانات المساحية.

توفر المنصة حلاً هندسياً شاملاً يجمع بين:
1. **تطبيق ويب تفاعلي تقدمي (PWA)** يعمل دون اتصال بالإنترنت لتحويل النقاط الفردية والجماعية وإعادة إسقاط ملفات GIS/CAD.
2. **تطبيق هندسي مستقل داخل Excel (`MDAR_Converter.xlsx`)** خالي تماماً من الماكرو ومبني بصيغ OpenXML الأصلية لمعالجة المشروعات المساحية مباشرة.
3. **مرجع علمي شامل للأنظمة الإحداثية** يغطي الشبكات الوطنية المصرية، وأنظمة الدول العربية، والأنظمة العالمية UTM وUPS.

---

## 🏛️ الهوية والمعايير الجيوديسية / Geodetic Governance

- **اسم المشروع المعتمد:** **مدار – MDAR**
  - **العرض العربي:** **مدار**
  - **العرض الإنجليزي:** **MDAR** (ASCII uppercase: M-D-A-R)
  - **الاسم الكامل:** **Mapping, Datum Adjustment and Reprojection**
- **المرجع الإداري والتنفيذي:** `AGENTS.md`
- **المرجع العلمي والجيوديسي:** `MDAR_MASTER_DEVELOPMENT_PLAN.md`
- **مبدأ اللا-تخمين (Zero Math Guesswork):** جميع المعادلات والبارامترات مشتقة حصرياً من سجل EPSG الرسمي، ومواصفات هيئة المساحة المصرية (ESA)، ومحرك PROJ المرجعي.

---

## ⚙️ المحرك الجيوديسي والرياضي / Mathematical Engine

تعتمد المنصة على صياغة رياضية صارمة تم اختبارها ومطابقتها مقابل محرك **PROJ 9.5+**:

1. **مسقط ميركاتور المستعرض (Transverse Mercator - Redfearn Series):**
   - معادلات التحويل المباشر والعكسي بدقة تقل عن **0.05 مليمتر** مقارنة بـ PROJ.
   - حساب زاوية التقارب الشبكي (Grid Convergence $\gamma$) ومعامل المقياس النقطي (Point Scale Factor $k$).
2. **نقل المساند الجيوديسية (Datum Shift):**
   - **Egypt 1907 ↔ WGS 84:** تطبيق تحويل **Molodensky-Badekas (EPSG:7697)** ذو العشر معاملات المعتمد رسمياً للمساحة المصرية:
     $$\Delta X = -127.535\text{ m}, \Delta Y = 113.495\text{ m}, \Delta Z = -12.700\text{ m}$$
     $$R_x = +1.603747'', R_y = -0.153612'', R_z = -5.364408'', s = +5.33745\text{ ppm}$$
     $$\text{Evaluation Point: } (4854969.728, 2945552.013, 2868447.610)\text{ m}$$
3. **المجسمات الإهليلجية المعتمدة (Ellipsoids):**
   - **Helmert 1906 (مصر 1907):** $a = 6378200.0\text{ m}, 1/f = 298.3$
   - **WGS 84 (العالمي):** $a = 6378137.0\text{ m}, 1/f = 298.257223563$
   - **Hayford 1924 / International 1924:** $a = 6378388.0\text{ m}, 1/f = 297.0$

---

## 📊 تطبيق مدار الهندسي داخل Excel (`MDAR_Converter.xlsx`)

تمت إعادة بناء مصنف Excel بالكامل ليصبح تطبيقاً برمجياً مستقلاً داخل Microsoft Excel:
- **سلامة البنية بنسبة 100% (Clean OpenXML):** القضاء التام على أخطاء `styles.xml` واستخدام معرفات تنسيق أرقام متوافقة مع معيار ISO/IEC 29500 تبدأ من `164` فما فوق.
- **فتح نظيف خالي من رسائل الإصلاح:** تم اختباره عبر أتمتة COM على Microsoft Excel دون أي رسائل Repair.
- **واجهات تشغيل هندسية مخصصة (6 أوراق تطبيقية):**
  1. `00_Home`: لوحة التحكم وبطاقات الانتقال السريع ودليل الألوان.
  2. `01_Single_Point`: محطة عمل للتحويل الفردي الفوري المربوط بالمحرك الجيوديسي.
  3. `02_Batch_Converter`: جدول بيانات حقيقي (`ListObject: MDAR_BatchTable`) مع **توسع تلقائي للمعادلات والتنسيق عند لصق أو إضافة أي صفوف جديدة دون حد أقصى**.
  4. `03_Geodesy_Tools`: أدوات حساب المسافات والانحرافات وتنسيق الدرجات الستينية DMS.
  5. `04_Accuracy_QA`: لوحة ضبط الجودة ومقارنة النتائج الحسابية بالمرجعيات الرسمية.
  6. `05_Documentation`: التوثيق الرياضي الكامل والمعادلات المرجعية.
- **محركات حسابية مخفية (`_Engine_Math`, `_CRS_Catalog`):** محجوبة عن المستخدم العادي لحماية الصيغ الرياضية من التعديل العرضي.

---

## 🌐 الأنظمة الإحداثية المدعومة / Supported Systems

### 1. الشبكة الوطنية المصرية (Egyptian Transverse Mercator - ETM)
- **الحزام الأحمر (Red Belt - EPSG:22992):** خط الطول المركزي $31^\circ\text{ E}$، نقطة الأصل الافتراضية ($615000\text{ m E}, 810000\text{ m N}$).
- **الحزام البنفسجي (Purple Belt - EPSG:22993):** خط الطول المركزي $27^\circ\text{ E}$، نقطة الأصل الافتراضية ($365000\text{ m E}, 810000\text{ m N}$).
- **الحزام الأزرق (Blue Belt - EPSG:22994):** خط الطول المركزي $35^\circ\text{ E}$، نقطة الأصل الافتراضية ($300000\text{ m E}, 1100000\text{ m N}$).
- **الحزام البنفسجي الممتد (Extended Purple Belt - EPSG:22995):** خط الطول المركزي $27^\circ\text{ E}$ لتغطية المشروعات القومية الغربية.

### 2. أنظمة الدول العربية والخليج (Arab National Systems)
- **المملكة العربية السعودية:** KSA-GRF17 / UTM Zones 36N, 37N, 38N, 39N (EPSG:9256..9259) مع إدارة العصر المرجعي Epoch 2017.0.
- **الإمارات العربية المتحدة:** Dubai Local Transverse Mercator (DLTM), UTM Zones 39N, 40N.
- **دولة قطر:** Qatar National Grid (QNG95 / EPSG:2932).
- **دولة الكويت:** Kuwait Utility Grid (KTM / KGD93).
- **سلطنة عمان:** Oman National Grid (ON-TM / PSD93).
- **المملكة الأردنية الهاشمية:** Jordan Transverse Mercator (JTM / EPSG:23700).
- **فلسطين:** Palestine 1923 / Palestine Grid (Cassini-Soldner).

### 3. الأنظمة العالمية (Global Coordinate Systems)
- **WGS 84 Geographic 2D (EPSG:4326):** تمثيل عشري DD وستيني DMS ودرجات ودقائق عشرية DDM.
- **Universal Transverse Mercator (UTM):** النطاقات الشمالية والجنوبية (Zones 1–60).
- **Web Mercator (EPSG:3857):** للعرض المتوافق مع خدمات الخرائط الرقمية.

---

## 📂 استيراد وإعادة إسقاط الملفات / Smart File Processing

- **محرك الاستيراد الذكي (Smart Import Engine):** يدعم ملفات XLSX, XLS, CSV, TSV, TXT مع كشف تلقائي للترميز (UTF-8, Windows-1256)، والفواصل، والسطور التمهيدية، والفواصل العشرية الأوروبية.
- **معالج تعيين الأعمدة (Column Mapping Wizard):** نافذة تفاعلية للتحقق من مطابقة الحقول ومقايضة X/Y وحفظ ملفات التعريف محلياً.
- **إعادة إسقاط ملفات GIS المتجهة (Vector Reprojection):**
  - Shapefile (ZIP), GeoJSON, KML, CSV, XLSX.
  - حماية كاملة ضد هجمات قنابل الملفات المضغوطة (ZIP Bombs)، وهجمات الكيانات الخارجية (XXE)، وحقن معادلات الجداول (CWE-1236 Formula Injection Defense).

---

## 🚀 التشغيل والتثبيت المحلي / Installation & Development

```bash
# 1. استنساخ المستودع
git clone https://github.com/ahmadibrahim4geo/MDAR.git
cd MDAR

# 2. تثبيت الحزم البرمجية
npm install

# 3. تشغيل خادم التطوير
npm run dev

# 4. بناء حزمة الإنتاج
npm run build

# 5. تشغيل حزمة اختبارات التحقق الشاملة (DoneProof)
npm run lint
npx tsx tests/baseline_math.ts
npx tsx tests/test_arab_crs_transformations.ts
npx tsx tests/test_true_xlsx_roundtrip.ts
npx tsx tests/test_vector_reprojection.ts
npx tsx tests/test_smart_import_and_detection.ts
npx tsx tests/test_excel_companion_verification.ts
```

---

## 🛡️ الأمان والخصوصية / Security & Privacy

1. **معالجة محلية 100%:** لا يتم إرسال أي إحداثيات أو ملفات مساحية إلى أي خادم خارجي.
2. **Spreadsheet Formula Disarming (CWE-1236):** تحييد الرموز الخطرة (`=`, `+`, `-`, `@`) في النصوص المصدرة لمنع استغلال أوامر النظام.
3. **XXE Protection:** نزع تعريفات `<!DOCTYPE>` و `<!ENTITY>` تلقائياً عند قراءة ملفات KML و XML.
4. **Macro-Free Guarantee:** تطبيق Excel خالٍ تماماً من الماكرو ورموز VBA لضمان التوافق مع سياسات الأمان المؤسسية.

---

## 📑 الوثائق وسجلات التطوير / Documentation Index

- [PROJECT_STRUCTURE.md](file:///D:/My%20Software/MDAR/PROJECT_STRUCTURE.md) — البنية الشاملة للمستودع ومسارات الإنتاج.
- [INDEX.md](file:///D:/My%20Software/MDAR/INDEX.md) — الفهرس المرجعي العام ومكتبة الوثائق.
- [AGENTS.md](file:///D:/My%20Software/MDAR/AGENTS.md) — ميثاق الحوكمة البرمجية وضوابط النشر.
- [MDAR_MASTER_DEVELOPMENT_PLAN.md](file:///D:/My%20Software/MDAR/MDAR_MASTER_DEVELOPMENT_PLAN.md) — الخطة الجيوديسية الرئيسية.
- [reports/03_MDAR_EXCEL_CRITICAL_RECONSTRUCTION_DONEPROOF.md](file:///D:/My%20Software/MDAR/reports/03_MDAR_EXCEL_CRITICAL_RECONSTRUCTION_DONEPROOF.md) — تقرير إثبات الإنجاز ومطابقة Excel مع PROJ.
- [.agent-development-log/INDEX.md](file:///D:/My%20Software/MDAR/.agent-development-log/INDEX.md) — سجل التطوير المتسلسل المرتبط بسلاسل التجزئة SHA-256.

---

## 📜 الترخيص والملكية الفكرية / License & Copyright

- **الترخيص:** مرخص بموجب **Apache License 2.0** - يمكنك الاستخدام والتطوير الحر مع الحفاظ على حقوق النسبة وإشعارات الملكية.
- **المطور الرئيسي:** **أحمد إبراهيم (Ahmad Ibrahim)** — `ahmadibrahim.geo@gmail.com`
- **حقوق الملكية الفكرية:** © 2026 أحمد إبراهيم – جميع الحقوق محفوظة لعلامة مدار (MDAR).
