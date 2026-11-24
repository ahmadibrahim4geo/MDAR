/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { BookOpen, HelpCircle, MapPin, Layers, RefreshCw, FileText, ChevronDown, ChevronUp, Download, ShieldCheck, CheckCircle2, Compass } from "lucide-react";

export default function HelpTab() {
  const [activeSec, setActiveSec] = useState<string | null>("excel_companion");

  const toggleSection = (sec: string) => {
    setActiveSec(activeSec === sec ? null : sec);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto" id="help_tab_container" dir="rtl">
      {/* Intro Header */}
      <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white rounded-xl p-8 shadow-md">
        <div className="flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-emerald-400 shrink-0" />
          <div>
            <h2 className="text-2xl font-bold font-sans">مدار – MDAR | الموسوعة الجيوديسية ودليل المساعدة</h2>
            <p className="text-xs text-emerald-300 font-mono mt-0.5">Mapping, Datum Adjustment and Reprojection Platform</p>
          </div>
        </div>
        <p className="text-sm text-emerald-200 mt-3 max-w-2xl leading-relaxed">
          دليل هندسي متكامل وموثق علمياً لتوضيح المفاهيم الجيوديسية، ونظم الإحداثيات المترية والفلكية، ومعايير التحويل بين المراجع المساحية في جمهورية مصر العربية والدول العربية والعالم.
        </p>
      </div>

      {/* DOWNLOAD BANNER: MDAR Companion Excel Workbook */}
      <div className="bg-gradient-to-r from-sky-900 to-indigo-950 text-white rounded-xl p-6 shadow-md border border-sky-700/50 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-right">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-500 text-white">إصدار رسمي معتمد</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/30 text-emerald-300 border border-emerald-500/40">خالٍ من الماكرو (Zero Macros)</span>
          </div>
          <h3 className="text-lg font-bold text-white">
            مصنف إكسل المعتمد لحسابات الإحداثيات (MDAR_Converter.xlsx)
          </h3>
          <p className="text-xs text-sky-200 leading-relaxed max-w-xl">
            مصنف احترافي مفتوح المصدر يتضمن 9 أوراق عمل متخصصة لمعادلات التحويل التبادلي (DD / DMS)، وحسابات أحزمة مصر ETM ونطاقات UTM، وموسوعة كاملة لأكواد EPSG ونقاط التحكم الأرضية، يعمل بالمعادلات المباشرة دون أي أكواد VBA.
          </p>
        </div>
        <a
          href="./downloads/MDAR_Converter.xlsx"
          download="MDAR_Converter.xlsx"
          className="shrink-0 flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm shadow-lg transition-transform hover:scale-105"
        >
          <Download className="w-5 h-5" />
          <span>تحميل مصنف الإكسل (.xlsx)</span>
        </a>
      </div>

      {/* Concepts Sections */}
      <div className="space-y-4">
        {/* SECTION 0: Excel Companion Contents */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <button
            onClick={() => toggleSection("excel_companion")}
            className="w-full px-6 py-4 flex items-center justify-between bg-neutral-50/50 dark:bg-slate-800/80 hover:bg-neutral-50 dark:hover:bg-slate-700/50 transition-colors text-right"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              <h3 className="text-base font-bold text-neutral-800 dark:text-slate-100">1. محتويات مصنف الإكسل المعتمد (Excel Standard Workbook)</h3>
            </div>
            {activeSec === "excel_companion" ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
          </button>

          {activeSec === "excel_companion" && (
            <div className="px-6 py-5 border-t border-neutral-100 dark:border-slate-700 space-y-4 text-sm text-neutral-600 dark:text-slate-300 leading-relaxed">
              <p>
                تم بناء مصنف <strong>MDAR_Converter.xlsx</strong> وفق مواصفات الفصل 07 من خطة التطوير الرئيسية للمنصة، ويتكون من 9 صفحات عمل كاملة:
              </p>
              <ul className="list-disc list-inside space-y-2 pr-2">
                <li><strong>00_Home:</strong> دليل البدء، السياسات الجيوديسية، ومعايير الأمان والتوافق مع Excel 2016+ وLibreOffice.</li>
                <li><strong>01_DD_DMS_DDM:</strong> معادلات إكسل للتحويل ثنائي الاتجاه بين الدرجات العشرية والدرجات والدقائق والثواني بدقة كسرية.</li>
                <li><strong>02_Single_Point:</strong> حاسبة تفاعلية متكاملة لتحويل النقطة الواحدة بين WGS 84 وUTM ونظام مصر 1907.</li>
                <li><strong>03_Batch_Converter:</strong> جدول بيانات مفتوح لمعالجة مصفوفات النقاط الميدانية المتعددة دفعة واحدة.</li>
                <li><strong>04_Egypt_ETM:</strong> معايير مجسم هلمرت 1906 ومعادلات مولودينسكي-باديكاس 10-معاملات وثوابت الأحزمة المصرية الأربعة.</li>
                <li><strong>05_UTM_WGS84:</strong> حاسبة خط الطول الأوسط λ0 والمعايير الهندسية لجميع نطاقات UTM من Zone 1 إلى Zone 60.</li>
                <li><strong>06_CRS_Catalog:</strong> موسوعة مرجعية تضم ما يقارب 200 نظام إحداثي مع نصوص PROJ4 الرسمية وأكواد العمليات.</li>
                <li><strong>07_Accuracy_Validation:</strong> نقاط تحكم أرضية حقيقية (القاهرة، الإسكندرية، مكة، دبي) لمقارنة دقة الحسابات بالمراجع الرسمية.</li>
                <li><strong>08_Documentation:</strong> الاشتقاقات الرياضية، مراجع IOGP وEPSG، ومحددات الأمان والخصوصية.</li>
              </ul>
            </div>
          )}
        </div>

        {/* SECTION 1: Basic Geodetic Concepts */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <button
            onClick={() => toggleSection("concepts")}
            className="w-full px-6 py-4 flex items-center justify-between bg-neutral-50/50 dark:bg-slate-800/80 hover:bg-neutral-50 dark:hover:bg-slate-700/50 transition-colors text-right"
          >
            <div className="flex items-center gap-3">
              <Layers className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-base font-bold text-neutral-800 dark:text-slate-100">2. المفاهيم الجيوديسية الأساسية (Basic Concepts)</h3>
            </div>
            {activeSec === "concepts" ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
          </button>

          {activeSec === "concepts" && (
            <div className="px-6 py-5 border-t border-neutral-100 dark:border-slate-700 space-y-6 text-sm text-neutral-600 dark:text-slate-300 leading-relaxed">
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-neutral-800 dark:text-slate-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  المرجع الجيوديسي (Datum):
                </h4>
                <p className="pr-4">
                  هو النموذج الرياضي والفيزيائي الذي يصف شكل الأرض لربط القياسات الميدانية بمجسم بيضاوي (Ellipsoid).
                  <br />
                  • <strong>WGS 84:</strong> المرجع العالمي الحديث والقياسي المستخدَم في نظام تحديد المواقع (GPS)، خرائط جوجل، والبرمجيات العالمية.
                  <br />
                  • <strong>Egypt 1907:</strong> المرجع التاريخي القديم لمصر المبني على بيضاوي هلمرت 1906 (Helmert 1906) والمستخدم في الخرائط المساحية التاريخية واللوحات الهيكلية المطبوعة.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-neutral-800 dark:text-slate-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  تحويل المرجع (Datum Transformation):
                </h4>
                <p className="pr-4">
                  عملية معقدة رياضياً للانتقال بين نظامين مرجعيين مختلفين (مثلاً من Egypt 1907 إلى WGS 84). تعتمد منصة مدار على الصيغة المعيارية المعتمدة رسمياً <strong>EPSG:7697 (Molodensky-Badekas)</strong> والتي تبلغ دقتها الميدانية نحو <strong>1.2 متر</strong>.
                  <br />
                  <span className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-2 py-1 rounded inline-block mt-1 border border-amber-200 dark:border-amber-800">
                    تنبيه هندسي: ظهور دقة عالية (مثلاً 3 أو 8 منازل عشرية) في النتائج هو دقة حسابية برمجية بحتة وليست دقة قياس أرضية مطلقة.
                  </span>
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-neutral-800 dark:text-slate-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  الإحداثيات الجغرافية مقابل الإحداثيات المترية (Geographic vs. Projected):
                </h4>
                <p className="pr-4">
                  • <strong>الإحداثيات الجغرافية (Geographic):</strong> تمثل مواقع النقاط على سطح بيضاوي ثلاثي الأبعاد وتقاس بالزوايا (درجات، دقائق، ثوانٍ) مثل خط الطول (Longitude) وخط العرض (Latitude).
                  <br />
                  • <strong>الإحداثيات المترية (Projected):</strong> ناتجة عن إسقاط السطح البيضاوي للأرض على مستوى مسطح ثنائي الأبعاد وتُقاس بالمتر لتمثيل الإحداثي الشرقي (Easting / X) والإحداثي الشمالي (Northing / Y).
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-neutral-800 dark:text-slate-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  الإزاحة الشرقية والشمالية (False Easting / Northing):
                </h4>
                <p className="pr-4">
                  هي قيم ثابتة بالمتر يضيفها مصمم نظام الإسقاط إلى الإحداثيات لمنع ظهور قيم سالبة، مما يسهل قراءتها ورسمها في المخططات الهندسية.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: Egyptian Systems */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <button
            onClick={() => toggleSection("egy_systems")}
            className="w-full px-6 py-4 flex items-center justify-between bg-neutral-50/50 dark:bg-slate-800/80 hover:bg-neutral-50 dark:hover:bg-slate-700/50 transition-colors text-right"
          >
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-base font-bold text-neutral-800 dark:text-slate-100">3. دليل الأنظمة المساحية المصرية (Egyptian Systems)</h3>
            </div>
            {activeSec === "egy_systems" ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
          </button>

          {activeSec === "egy_systems" && (
            <div className="px-6 py-5 border-t border-neutral-100 dark:border-slate-700 space-y-6 text-sm text-neutral-600 dark:text-slate-300 leading-relaxed">
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-neutral-800 dark:text-slate-100 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-600 dark:bg-emerald-400"></span>
                  نظام الإسقاط المصري القديم (ETM - Egyptian Transverse Mercator):
                </h4>
                <p className="pr-4">
                  أنشئ عام 1907 كأول نظام مترى وطني لمصر ويعتمد على مرجع <strong>Egypt 1907</strong>، ومقسم إلى أحزمة طولية ملونة بعرض 4 درجات لكل منها لمنع التشوه:
                  <br />
                  • <strong>الحزام الأحمر (Red Belt):</strong> يغطي القاهرة والدلتا والوادي (خط طول مركزي 31° شرقاً، EPSG:22992).
                  <br />
                  • <strong>الحزام الأزرق (Blue Belt):</strong> يغطي شبه جزيرة سيناء والصحراء الشرقية (خط طول مركزي 35° شرقاً، EPSG:22991).
                  <br />
                  • <strong>الحزام البنفسجي (Purple Belt):</strong> يغطي الصحراء الغربية (خط طول مركزي 27° شرقاً، EPSG:22993).
                  <br />
                  • <strong>الحزام الأحمر الجنوبي والحزام البنفسجي الممتد:</strong> نطاقات مخصصة للمناطق الجنوبية لضمان دقة المساحة وعدم تضخم قيم الشمالي.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-neutral-800 dark:text-slate-100 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-600 dark:bg-emerald-400"></span>
                  نظام الإسقاط المصري المطور (MTM - Modified Transverse Mercator):
                </h4>
                <p className="pr-4">
                  هو النظام المطور المعتمد رسمياً في اللوحات والمشاريع المساحية والمدنية الحديثة في مصر.
                  <br />
                  • يعتمد مباشرة على مرجع <strong>WGS 84</strong> (لا يحتاج لتحويل مراجع مع أجهزة GPS).
                  <br />
                  • ينقسم إلى 5 شرائح طولية دقيقة بعرض 3 درجات لكل منها (MTM Zone 1 إلى MTM Zone 5)، مما يقلل من تشوه قياس المسافات والمساحات على الخريطة مقارنة بالنظام القديم.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 3: Arab & Regional Geodetic Systems */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <button
            onClick={() => toggleSection("arab_systems")}
            className="w-full px-6 py-4 flex items-center justify-between bg-neutral-50/50 dark:bg-slate-800/80 hover:bg-neutral-50 dark:hover:bg-slate-700/50 transition-colors text-right"
          >
            <div className="flex items-center gap-3">
              <Compass className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-base font-bold text-neutral-800 dark:text-slate-100">4. دليل الشبكات الجيوديسية للدول العربية (Arab National Grids)</h3>
            </div>
            {activeSec === "arab_systems" ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
          </button>

          {activeSec === "arab_systems" && (
            <div className="px-6 py-5 border-t border-neutral-100 dark:border-slate-700 space-y-4 text-sm text-neutral-600 dark:text-slate-300 leading-relaxed">
              <p>
                تدعم منصة مدار أكثر من 190 نظاماً مساحياً رسمياً معتمداً في الدول العربية وفق سجلات EPSG الرسمية:
              </p>
              <ul className="list-disc list-inside space-y-2 pr-2">
                <li><strong>المملكة العربية السعودية:</strong> المرجع الديناميكي الحديث KSA-GRF17 وشبكة SANSER المقسمة إلى 5 نطاقات متكاملة (EPSG:9356–9360)، وشبكة عين العبد التاريخية 1970 (EPSG:20437–20439).</li>
                <li><strong>الإمارات العربية المتحدة:</strong> نظام دبي المترية المحلي DLTM (EPSG:3997) وشبكة نهر الوان 1967 (EPSG:27039, 27040).</li>
                <li><strong>دولة قطر:</strong> نظام قطر الوطني QND95 القائم على مسقط كاسيني-سولدز (EPSG:2932) ونظام قطر 1948 (EPSG:28600).</li>
                <li><strong>دولة الكويت:</strong> نظام مسقط الكويت الكارتيزي KTM (EPSG:3889) وشبكة الأشغال العامة KWD (EPSG:28800).</li>
                <li><strong>المملكة الأردنية الهاشمية:</strong> مسقط الأردن المستعرض JTM (EPSG:28193) القائم على خط طول مركزي 37°E.</li>
                <li><strong>سلطنة عُمان:</strong> المرجع العُماني PSD93 ومسقط ON-TM (EPSG:3440).</li>
                <li><strong>مملكة البحرين:</strong> شبكة البحرين الوطنية المتكاملة (EPSG:25882).</li>
                <li><strong>فلسطين:</strong> شبكة فلسطين التاريخية القائمة على مسقط كاسيني-سولدنر (EPSG:28191).</li>
                <li><strong>دول المغرب العربي:</strong> شبكة مرشيش المغربية (Merchich LCC)، وقرطاج التونسية (Carthage LCC)، وفوارول وشمال الصحراء الجزائرية (Voirol / Nord Sahara).</li>
              </ul>
            </div>
          )}
        </div>

        {/* SECTION 4: Operations & Excel Clipboard Guide */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <button
            onClick={() => toggleSection("operations")}
            className="w-full px-6 py-4 flex items-center justify-between bg-neutral-50/50 dark:bg-slate-800/80 hover:bg-neutral-50 dark:hover:bg-slate-700/50 transition-colors text-right"
          >
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-base font-bold text-neutral-800 dark:text-slate-100">5. دليل تشغيل ميزة النسخ واللصق من Excel وإليه</h3>
            </div>
            {activeSec === "operations" ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
          </button>

          {activeSec === "operations" && (
            <div className="px-6 py-5 border-t border-neutral-100 dark:border-slate-700 space-y-4 text-sm text-neutral-600 dark:text-slate-300 leading-relaxed">
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-neutral-800 dark:text-slate-100">كيف تنقل بياناتك من جدول Excel وتحسبها خلال ثوانٍ؟</h4>
                <ol className="list-decimal list-inside space-y-2 pr-2">
                  <li>قم بتحديد الإحداثيات في Excel (عمودين يحتويان على الإحداثيات، أو 3 أعمدة أولها اسم النقطة) ثم اضغط <strong>Ctrl+C</strong>.</li>
                  <li>انتقل إلى صفحة <strong>"تحويل جماعي"</strong> في هذه الأداة.</li>
                  <li>المس أو انقر على أي خلية في الجدول واضغط <strong>Ctrl+V</strong> للصق أعمدة الإحداثيات مباشرة.</li>
                  <li>اختر أنظمة الإحداثيات المصدر والهدف من القوائم العلوية.</li>
                  <li>اضغط على زر الأخضر <strong>"تحويل البيانات المنسوخة"</strong> لتتم معالجة النقاط فوراً.</li>
                  <li>حدد النقاط التي تريد نسخها بوضع علامة الصح أو اختر الكل، ثم اضغط على زر <strong>"تصدير"</strong> لاختيار صيغة XLSX الحقيقية أو CSV المحمية من حقن الصيغ!</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
