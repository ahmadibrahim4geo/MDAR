# 🌍 محول الإحداثيات المصري والعالمي
### Egypt & Global Geodetic Coordinate Converter

<div align="center">

![Built with Google AI Studio](https://img.shields.io/badge/Built%20with-Google%20AI%20Studio-4285F4?style=for-the-badge&logo=google&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

<br />

> **"Build that wild idea." — Powered by Google AI Studio**

<br />

<svg viewBox="0 0 100 100" width="120" height="120" xmlns="http://www.w3.org/2000/svg" style="background: #022C22; border-radius: 20px; padding: 12px; box-shadow: 0 10px 25px -5px rgba(5, 150, 105, 0.4);">
  <defs>
    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F59E0B" />
      <stop offset="50%" stop-color="#FBBF24" />
      <stop offset="100%" stop-color="#D97706" />
    </linearGradient>
    <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34D399" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>
    <linearGradient id="coreGold" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FEF08A" />
      <stop offset="100%" stop-color="#F59E0B" />
    </linearGradient>
  </defs>
  <circle cx="50" cy="50" r="45" stroke="#334155" stroke-width="2.5" />
  <circle cx="50" cy="50" r="41" stroke="#059669" stroke-width="1.5" stroke-dasharray="3 3" stroke-opacity="0.7" />
  <ellipse cx="50" cy="50" rx="41" ry="18" stroke="#10B981" stroke-width="1.2" stroke-opacity="0.35" />
  <ellipse cx="50" cy="50" rx="18" ry="41" stroke="#10B981" stroke-width="1.2" stroke-opacity="0.35" />
  <polygon points="50,20 22,74 50,66" fill="url(#emeraldGradient)" fill-opacity="0.9" />
  <polygon points="50,20 50,66 78,74" fill="url(#emeraldGradient)" fill-opacity="0.65" />
  <line x1="50" y1="20" x2="50" y2="66" stroke="#A7F3D0" stroke-width="1.5" stroke-opacity="0.8" />
  <circle cx="50" cy="50" r="16" stroke="url(#goldGradient)" stroke-width="2.5" fill="#022C22" fill-opacity="0.85" />
  <circle cx="50" cy="50" r="6" stroke="#FEF08A" stroke-width="1.5" />
  <circle cx="50" cy="50" r="2.5" fill="url(#coreGold)" />
  <path d="M50 8 V22 M50 78 V92 M8 50 H22 M78 50 H92" stroke="url(#goldGradient)" stroke-width="2.5" stroke-linecap="round" />
  <polygon points="50,4 45,12 55,12" fill="#FBBF24" />
</svg>

### منصة مساحية هندسية احترافية لتحويل الإحداثيات والخرائط العبر-محلية والإقليمية والعالمية
**Professional Geodetic Engineering Web Platform for Multi-Datum & Coordinate Transformations**

</div>

---

## 📌 نبذة عن المشروع / Overview

تطبيق **محول الإحداثيات المصري والعالمي (Egypt & Global Coordinate Converter)** هو أداة هندسية ومساحية متكاملة مصممة للمهندسين المساحيين، أخصائيي نظم المعلومات الجغرافية (GIS)، والمخططين العمرانيين. يتيح البرنامج تحويل الإحداثيات بين الأنظمة الجغرافية العالمية (مثل WGS84) والأنظمة المسقطة المصرية (ETM Red, Purple, Blue, Extended Purple Belts) بالإضافة إلى أنظمة الدول العربية والأنظمة العالمية (UTM).

---

## ⚙️ كيف يعمل البرنامج؟ / How it Works

يعتمد البرنامج على محرك رياضيات مساحية دقيق يعمل محلياً بالكامل داخل المتصفح (Client-side Geodetic Engine) وفق المراحل التالية:

```
[إدخال الإحداثيات / ملف اكسل] ──► [تحويل Datum 7-Parameters] ──► [إسقاط Krüger-TM / UTM] ──► [توقيع الخريطة والإنتاج]
```

1. **التحويل بين المجسمات المرجعية (Datum Transformation):**
   - استخدام معادلات التحويل ثلاثية الأبعاد بـ 7 معاملات (7-Parameter Helmert Transformation) للتحويل بين مرجع مصر 1907 (Helmert 1906 Ellipsoid) والمرجع العالمي WGS84.
2. **محرك الإسقاط الهندسي (Projection Calculations):**
   - تطبيق معادلات إسقاط ميركاتور المستعرض المستحدث (Transverse Mercator / Krüger Equations) لحساب الإحداثيات المترية (Easting / Northing) بدقة تصل إلى أجزاء من المليمتر.
3. **الفحص والتوقيع التفاعلي (Interactive Verification):**
   - مطابقة النقاط المحولة على خرائط تفاعلية عالية الدقة وشوراع وأقمار صناعية مع تنبيهات عند خروج النقاط عن النطاق المساحي الرسمي للشرائح (Belt Boundary Warnings).
4. **المعالجة الجماعية وتصدير البيانات (Batch Processing & Export):**
   - قراءة وتحليل ملفات Excel (`.xlsx`, `.xls`) و CSV و TXT مباشرة وتصدير النتائج إلى صيغ مهنية متعددة.

---

## ✨ المميزات الرئيسية / Key Features

### 1. 📐 دعم كامل للشبكة الوطنية المصرية (Egyptian National Grid ETM)
- **الحزام الأحمر (Red Belt - EPSG:22992):** خط الطول المركزي $31^\circ\text{ E}$.
- **الحزام البنفسجي (Purple Belt - EPSG:22993):** خط الطول المركزي $27^\circ\text{ E}$.
- **الحزام الأزرق (Blue Belt - EPSG:22991):** خط الطول المركزي $35^\circ\text{ E}$.
- **الحزام البنفسجي الممتد (Extended Purple Belt - EPSG:22994):** التغطية الغربية للمشروعات القومية.

### 2. 🌐 الأنظمة العربية والإقليمية والعالمية (Arab & Global Systems)
- **WGS84 Geographic:** خطوط الطول والعرض بالأشكال المختلفة (DD.dddd, DMS, DMM).
- **UTM Zones 35N, 36N, 37N:** تغطية مصر والشرق الأوسط والخليج العربي.
- **شبكات الدول العربية:** السعودية (KSA GRF17 / UTM), فلسطين (Palestine 1923 Belt), الأردن (JTM), الإمارات, قطر, الكويت, عمان, العراق, وغيرها.

### 3. 📂 معالجة الملفات الضخمة (Batch File Processing)
- رفع ملفات Excel و CSV وسحب وإسقاط النقاط المساحية.
- التعرف التلقائي على أعمدة الإحداثيات وتحديد أرقام وأسماء النقاط والارتفاعات.
- حساب الفروق والخطأ المتبقي والمسافات المساحية.

### 4. 🛰️ معاينة النقاط على خرائط الأقمار الصناعية (Interactive Satellite Map)
- خريطة تفاعلية مدعومة بالطبقات (أقمار صناعية Satellite، شوارع Street Map، فاتح Light Map).
- معاينة حية لمواقع النقاط على سطح الأرض وحساب أبعاد الظل والحدود الإقليمية.

### 5. 💾 تصدير مهني متعدد الصيغ (Multi-Format Exporting)
- **AutoCAD DXF (R12):** تصدير النقاط والأنشطة كطبقات مساحية (Layers) جاهزة للفتح مباشرة على برنامج أوتوكاد.
- **Google Earth KML:** ملفات KML مع بطاقات معلومات تفاعلية لكل نقطة مساحية.
- **GeoJSON:** صيغة معيارية لتطبيقات نظم المعلومات الجغرافية (QGIS, ArcGIS, Web GIS).
- **Excel & CSV:** جداول منسقة تحتوي على البيانات الأصلية والمحولة بدقة عشرية مخصصة.

### 6. 🌐 واجهة مزدوجة ودعم الليالي (Bilingual & Dark Mode)
- دعم كامل للغة العربية والإنجليزية (RTL / LTR).
- مظهر ليلي داكن مريح للعين مع تخصيص لعدد الأرقام العشرية.

---

## 🚀 تشغيل المشروع محلياً / Local Installation & Setup

للتشغيل على جهازك الشخصي، يمكنك اتباع الخطوات التالية:

### المتطلبات الأساسية / Prerequisites
- **Node.js**: الإصدار 18 أو أحدث.
- **npm** أو **yarn** أو **bun**.

### خطوات التشغيل / Commands

1. **استคลون المستودع (Clone Repository):**
   ```bash
   git clone https://github.com/ahmadibrahim4geo/Egypt-Global-Coordinate-Converter.git
   cd Egypt-Global-Coordinate-Converter
   ```

2. **تثبيت الحزم والتبعيات (Install Dependencies):**
   ```bash
   npm install
   ```

3. **تشغيل خادم التطوير (Start Development Server):**
   ```bash
   npm run dev
   ```
   افتح المتصفح على العنوان: `http://localhost:3000`

4. **بناء النسخة الإنتاجية (Build Production):**
   ```bash
   npm run build
   ```

---

## 🛠️ التقنيات المستخدمة / Built With

- **Google AI Studio**: صُمم وطُوّر باستخدام منصة الذكاء الاصطناعي من جوجل.
- **React 18 & TypeScript**: بنية برمجية قوية وآمنة من الأخطاء.
- **Vite**: محرك بناء سريع للويب.
- **Tailwind CSS**: تصميم عصري وسريع التجاوب.
- **Lucide React**: أيقونات مساحية وهندسية واضحة.
- **Leaflet**: خريطة تفاعلية خفيفة وسريعة.

---

## 📜 الترخيص / License

هذا المشروع مرخص تحت رخصة **Apache 2.0** - يمكنك الاستخدام والتعديل الحر للمشروع مع الحفاظ على إشعار الملكية الفكرية.

<div align="center">
  <br />
  <sub>تم تطوير هذا التطبيق بواسطة <b>أحمد إبراهيم (Ahmad Ibrahim)</b> بمساعدة <b>Google AI Studio</b></sub>
</div>
