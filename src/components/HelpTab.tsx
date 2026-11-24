/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { BookOpen, HelpCircle, MapPin, Layers, RefreshCw, FileText, ChevronDown, ChevronUp } from "lucide-react";

export default function HelpTab() {
  const [activeSec, setActiveSec] = useState<string | null>("concepts");

  const toggleSection = (sec: string) => {
    setActiveSec(activeSec === sec ? null : sec);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto" id="help_tab_container" dir="rtl">
      {/* Intro Header */}
      <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white rounded-xl p-8 shadow-md">
        <div className="flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-emerald-400 shrink-0" />
          <h2 className="text-2xl font-bold font-sans">دليل المساعدة والمصطلحات المساحية</h2>
        </div>
        <p className="text-sm text-emerald-200 mt-2 max-w-2xl leading-relaxed">
          دليل عربي مبسط ومتكامل لتوضيح المفاهيم الجيوديسية ونظم الإحداثيات والخرائط المستخدمة في جمهورية مصر العربية والعالم لمساعدة المهندسين والمساحين الميدانيين.
        </p>
      </div>

      {/* Concepts Sections */}
      <div className="space-y-4">
        {/* SECTION 1: Basic Geodetic Concepts */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <button
            onClick={() => toggleSection("concepts")}
            className="w-full px-6 py-4 flex items-center justify-between bg-neutral-50/50 dark:bg-slate-800/80 hover:bg-neutral-50 dark:hover:bg-slate-700/50 transition-colors text-right"
          >
            <div className="flex items-center gap-3">
              <Layers className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-base font-bold text-neutral-800 dark:text-slate-100">1. المفاهيم الجيوديسية الأساسية (Basic Concepts)</h3>
            </div>
            {activeSec === "concepts" ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
          </button>

          {activeSec === "concepts" && (
            <div className="px-6 py-5 border-t border-neutral-100 dark:border-slate-700 space-y-6 text-sm text-neutral-600 dark:text-slate-300 leading-relaxed">
              {/* Concept Item */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-neutral-800 dark:text-slate-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  المرجع الجيوديسي (Datum):
                </h4>
                <p className="pr-4">
                  هو النموذج الرياضي والفيزيائي الذي يصف شكل الأرض لربط القياسات الميدانية بمجسم بيضاوي (Ellipsoid).
                  <br />
                  • **WGS 84**: المرجع العالمي الحديث والقياسي المستخدَم في نظام تحديد المواقع (GPS)، خرائط جوجل، والبرمجيات العالمية.
                  <br />
                  • **Egypt 1907**: المرجع التاريخي القديم لمصر المبني على بيضاوي هلمرت 1906 (Helmert 1906) والمستخدم في الخرائط المساحية التاريخية واللوحات الهيكلية المطبوعة.
                </p>
              </div>

              {/* Concept Item */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-neutral-800 dark:text-slate-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  تحويل المرجع (Datum Transformation):
                </h4>
                <p className="pr-4">
                  عملية معقدة رياضياً للانتقال بين نظامين مرجعيين مختلفين (مثلاً من Egypt 1907 إلى WGS 84). تعتمد هذه الأداة على الصيغة المعيارية المعتمدة رسمياً **EPSG:7697 (Molodensky-Badekas)** والتي تبلغ دقتها الميدانية نحو **1.2 متر**.
                  <br />
                  <span className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-2 py-1 rounded inline-block mt-1 border border-amber-200 dark:border-amber-800">
                    تنبيه هندسي: ظهور دقة عالية (مثلاً 3 أو 8 منازل عشرية) في النتائج هو دقة حسابية برمجية بحتة وليست دقة قياس أرضية.
                  </span>
                </p>
              </div>

              {/* Concept Item */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-neutral-800 dark:text-slate-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  الإحداثيات الجغرافية مقابل الإحداثيات المترية (Geographic vs. Projected):
                </h4>
                <p className="pr-4">
                  • **الإحداثيات الجغرافية (Geographic)**: تمثل مواقع النقاط على سطح بيضاوي ثلاثي الأبعاد وتقاس بالزوايا (درجات، دقائق، ثوانٍ) مثل خط الطول (Longitude) وخط العرض (Latitude).
                  <br />
                  • **الإحداثيات المترية (Projected)**: ناتجة عن إسقاط السطح البيضاوي للأرض على مستوى مسطح ثنائي الأبعاد وتُقاس بالمتر لتمثيل الإحداثي الشرقي (Easting / X) والإحداثي الشمالي (Northing / Y).
                </p>
              </div>

              {/* Concept Item */}
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
              <h3 className="text-base font-bold text-neutral-800 dark:text-slate-100">2. دليل الأنظمة المساحية المصرية (Egyptian Systems)</h3>
            </div>
            {activeSec === "egy_systems" ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
          </button>

          {activeSec === "egy_systems" && (
            <div className="px-6 py-5 border-t border-neutral-100 dark:border-slate-700 space-y-6 text-sm text-neutral-600 dark:text-slate-300 leading-relaxed">
              {/* ETM System */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-neutral-800 dark:text-slate-100 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-600 dark:bg-emerald-400"></span>
                  نظام الإسقاط المصري القديم (ETM - Egyptian Transverse Mercator):
                </h4>
                <p className="pr-4">
                  أنشئ عام 1907 كأول نظام مترى وطني لمصر ويعتمد على مرجع **Egypt 1907**، ومقسم إلى أحزمة طولية ملونة بعرض 4 درجات لكل منها لمنع التشوه:
                  <br />
                  • **الحزام الأحمر (Red Belt)**: يغطي القاهرة والدلتا والوادي (خط طول مركزي 31° شرقاً).
                  <br />
                  • **الحزام الأزرق (Blue Belt)**: يغطي شبه جزيرة سيناء والصحراء الشرقية (خط طول مركزي 35° شرقاً).
                  <br />
                  • **الحزام البنفسجي (Purple Belt)**: يغطي الصحراء الغربية (خط طول مركزي 27° شرقاً).
                  <br />
                  • **الحزام الأحمر الجنوبي والحزام البنفسجي الممتد**: نطاقات مخصصة للمناطق الجنوبية لضمان دقة المساحة وعدم تضخم قيم الشمالي.
                </p>
              </div>

              {/* MTM System */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-neutral-800 dark:text-slate-100 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-600 dark:bg-emerald-400"></span>
                  نظام الإسقاط المصري المطور (MTM - Modified Transverse Mercator):
                </h4>
                <p className="pr-4">
                  هو النظام المطور المعتمد رسمياً في اللوحات والمشاريع المساحية والمدنية الحديثة في مصر.
                  <br />
                  • يعتمد مباشرة على مرجع **WGS 84** (لا يحتاج لتحويل مراجع مع أجهزة GPS).
                  <br />
                  • ينقسم إلى 5 شرائح طولية دقيقة بعرض 3 درجات لكل منها (MTM Zone 1 إلى MTM Zone 5)، مما يقلل من تشوه قياس المسافات والمساحات على الخريطة مقارنة بالنظام القديم.
                </p>
              </div>

              {/* UTM System */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-neutral-800 dark:text-slate-100 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-600 dark:bg-emerald-400"></span>
                  نظام الإسقاط العالمي (UTM - Universal Transverse Mercator):
                </h4>
                <p className="pr-4">
                  نظام شبكي متري عالمي يقسم الكرة الأرضية إلى 60 حزاماً بعرض 6 درجات لكل حزام. تقع مصر جغرافياً ضمن 3 نطاقات رئيسية هي:
                  <br />
                  • **UTM Zone 35N**: يغطي الساحل الشمالي الغربي وسيوة وجزء من الصحراء الغربية.
                  <br />
                  • **UTM Zone 36N**: يغطي الدلتا، القاهرة، الإسكندرية، ومعظم صعيد مصر.
                  <br />
                  • **UTM Zone 37N**: يغطي البحر الأحمر وحلايب وشلاتين وأقصى شرق مصر وسيناء الشرقية.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 3: Operations Guide */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <button
            onClick={() => toggleSection("operations")}
            className="w-full px-6 py-4 flex items-center justify-between bg-neutral-50/50 dark:bg-slate-800/80 hover:bg-neutral-50 dark:hover:bg-slate-700/50 transition-colors text-right"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-base font-bold text-neutral-800 dark:text-slate-100">3. دليل تشغيل ميزة النسخ واللصق من Excel وإليه</h3>
            </div>
            {activeSec === "operations" ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
          </button>

          {activeSec === "operations" && (
            <div className="px-6 py-5 border-t border-neutral-100 dark:border-slate-700 space-y-4 text-sm text-neutral-600 dark:text-slate-300 leading-relaxed">
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-neutral-800 dark:text-slate-100">كيف تنقل بياناتك من جدول Excel وتحسبها خلال ثوانٍ؟</h4>
                <ol className="list-decimal list-inside space-y-2 pr-2">
                  <li>قم بتحديد الإحداثيات في Excel (عمودين يحتويان على الإحداثيات، أو 3 أعمدة أولها اسم النقطة) ثم اضغط **Ctrl+C**.</li>
                  <li>انتقل إلى صفحة **"تحويل جماعي"** في هذه الأداة.</li>
                  <li>المس أو انقر على أي خلية في الجدول واضغط **Ctrl+V** للصق أعمدة الإحداثيات مباشرة.</li>
                  <li>اختر أنظمة الإحداثيات المصدر والهدف من القوائم العلوية.</li>
                  <li>اضغط على زر الأخضر **"تحويل البيانات المنسوخة"** لتتم معالجة النقاط فوراً.</li>
                  <li>حدد النقاط التي تريد نسخها بوضع علامة الصح أو اختر الكل، ثم اضغط على زر **"نسخ المحددة"** لصقها مجدداً في Excel بكل سهولة!</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
