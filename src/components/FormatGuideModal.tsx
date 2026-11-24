/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { X, HelpCircle, FileSpreadsheet, Compass, Globe, Layers, ArrowRight } from "lucide-react";

interface FormatGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: "ar" | "en";
}

export default function FormatGuideModal({ isOpen, onClose, lang }: FormatGuideModalProps) {
  if (!isOpen) return null;

  const isAr = lang === "ar";

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn" id="format_guide_modal">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-neutral-200 dark:border-slate-700 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col my-auto">
        {/* Header */}
        <div className="bg-emerald-700 dark:bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-emerald-600 dark:border-slate-700 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600 dark:bg-slate-800 rounded-lg text-emerald-100">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {isAr ? "دليل صيغ الإدخال وهيكلية البيانات" : "Input Formats & Data Guide"}
              </h3>
              <p className="text-xs text-emerald-100 dark:text-slate-400">
                {isAr ? "كيفية إدخال ولصق الإداثيات بالصيغ المختلفة بمرونة عالية" : "How to enter & paste coordinates in all supported formats"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-emerald-800 dark:hover:bg-slate-800 text-emerald-100 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-neutral-700 dark:text-slate-200">
          
          {/* Order Rule Banner */}
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-4 rounded-xl flex items-start gap-3">
            <Compass className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-900 dark:text-amber-300">
                {isAr ? "ترتيب الأعمدة المعتمد (هيكلية الإدخال والإخراج)" : "Standard Column Ordering Policy"}
              </h4>
              <p className="text-xs text-amber-800 dark:text-amber-400 mt-1 leading-relaxed">
                {isAr
                  ? "العمود الأول دائماً يمثل خط الطول (Easting / Longitude X)، والعمود الثاني يمثل خط العرض (Northing / Latitude Y). هذه الهيكلية ثابتة في الإدخال والنسخ والنتائج."
                  : "Column 1 always represents Longitude / Easting (X), and Column 2 represents Latitude / Northing (Y). This structure is preserved across inputs, copy-paste, and outputs."}
              </p>
            </div>
          </div>

          {/* Section 1: Geographic Coordinates */}
          <div className="space-y-3">
            <h4 className="font-bold text-base text-neutral-800 dark:text-slate-100 flex items-center gap-2 border-b border-neutral-100 dark:border-slate-700 pb-2">
              <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{isAr ? "1. الصيغ الجغرافية (WGS 84 & Egypt 1907 Geographic)" : "1. Geographic Formats (WGS 84 & Egypt 1907)"}</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-neutral-50 dark:bg-slate-900/60 rounded-xl border border-neutral-200/80 dark:border-slate-700/80">
                <span className="font-bold text-xs text-emerald-700 dark:text-emerald-400 block mb-1">
                  {isAr ? "الدرجات العشرية (DD)" : "Decimal Degrees (DD)"}
                </span>
                <p className="text-xs font-mono text-neutral-600 dark:text-slate-300">
                  31.235712 (Lon X)<br />
                  30.044420 (Lat Y)
                </p>
                <span className="text-[10px] text-neutral-400 mt-1 block">
                  {isAr ? "رقم عشري عادي بفاصلة نقطية" : "Standard decimal numbers"}
                </span>
              </div>

              <div className="p-3 bg-neutral-50 dark:bg-slate-900/60 rounded-xl border border-neutral-200/80 dark:border-slate-700/80">
                <span className="font-bold text-xs text-emerald-700 dark:text-emerald-400 block mb-1">
                  {isAr ? "درجات ودقائق وثواني (DMS)" : "Degrees Minutes Seconds (DMS)"}
                </span>
                <p className="text-xs font-mono text-neutral-600 dark:text-slate-300">
                  31° 14' 08.56" E<br />
                  E 31 14 08.56<br />
                  30 02 39.9 شرقا
                </p>
                <span className="text-[10px] text-neutral-400 mt-1 block">
                  {isAr ? "مع دعم الرموز والاتجاهات" : "Supports symbols & directions"}
                </span>
              </div>

              <div className="p-3 bg-neutral-50 dark:bg-slate-900/60 rounded-xl border border-neutral-200/80 dark:border-slate-700/80">
                <span className="font-bold text-xs text-emerald-700 dark:text-emerald-400 block mb-1">
                  {isAr ? "درجات ودقائق عشرية (DDM)" : "Degrees Decimal Minutes (DDM)"}
                </span>
                <p className="text-xs font-mono text-neutral-600 dark:text-slate-300">
                  31° 14.142' E<br />
                  30° 02.665' N
                </p>
                <span className="text-[10px] text-neutral-400 mt-1 block">
                  {isAr ? "مستخدم بالدلايل الملاحية" : "Common in marine navigation"}
                </span>
              </div>
            </div>

            <p className="text-xs text-neutral-500 dark:text-slate-400 bg-neutral-50 dark:bg-slate-900/40 p-2.5 rounded-lg border border-neutral-200/60 dark:border-slate-700/60">
              {isAr
                ? "💡 النظام يتعرف تلقائياً على الاتجاهات باللغة الإنجليزية (E, W, N, S) أو الكلمات العربية (شرق، غرب، شمال، جنوب) سواء كتبت في أول النص أو آخره."
                : "💡 Automatically detects direction indicators (E, W, N, S or Arabic equivalents) whether written at the beginning or end of the coordinate string."}
            </p>
          </div>

          {/* Section 2: Metric Projected Systems */}
          <div className="space-y-3">
            <h4 className="font-bold text-base text-neutral-800 dark:text-slate-100 flex items-center gap-2 border-b border-neutral-100 dark:border-slate-700 pb-2">
              <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{isAr ? "2. الأنظمة المترية المسقطة (ETM, MTM, UTM)" : "2. Projected Metric Systems (ETM, MTM, UTM)"}</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-neutral-50 dark:bg-slate-900/60 rounded-xl border border-neutral-200/80 dark:border-slate-700/80 space-y-1">
                <span className="font-bold text-xs text-emerald-700 dark:text-emerald-400 block">
                  {isAr ? "الإحداثي الشرقي Easting (X)" : "Easting (X) - Column 1"}
                </span>
                <p className="text-xs font-mono text-neutral-700 dark:text-slate-200">
                  • {isAr ? "الحزام الأحمر (Red Belt):" : "Red Belt:"} <code className="bg-white dark:bg-slate-800 px-1 py-0.5 rounded border border-neutral-200 dark:border-slate-700">615000.00</code> م<br />
                  • {isAr ? "الحزام البنفسجي (Purple):" : "Purple Belt:"} <code className="bg-white dark:bg-slate-800 px-1 py-0.5 rounded border border-neutral-200 dark:border-slate-700">315000.00</code> م<br />
                  • {isAr ? "الحزام الأزرق (Blue Belt):" : "Blue Belt:"} <code className="bg-white dark:bg-slate-800 px-1 py-0.5 rounded border border-neutral-200 dark:border-slate-700">715000.00</code> م
                </p>
              </div>

              <div className="p-3 bg-neutral-50 dark:bg-slate-900/60 rounded-xl border border-neutral-200/80 dark:border-slate-700/80 space-y-1">
                <span className="font-bold text-xs text-emerald-700 dark:text-emerald-400 block">
                  {isAr ? "الإحداثي الشمالي Northing (Y)" : "Northing (Y) - Column 2"}
                </span>
                <p className="text-xs font-mono text-neutral-700 dark:text-slate-200">
                  • {isAr ? "القاهرة والدلتا (وسط مصر):" : "Cairo & Delta:"} <code className="bg-white dark:bg-slate-800 px-1 py-0.5 rounded border border-neutral-200 dark:border-slate-700">810000.00</code> م<br />
                  • {isAr ? "الساحل الشمالي (شمال مصر):" : "North Coast:"} <code className="bg-white dark:bg-slate-800 px-1 py-0.5 rounded border border-neutral-200 dark:border-slate-700">1015000.00</code> م<br />
                  • {isAr ? "أسوان والصعيد (جنوب مصر):" : "Upper Egypt:"} <code className="bg-white dark:bg-slate-800 px-1 py-0.5 rounded border border-neutral-200 dark:border-slate-700">450000.00</code> م
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Excel Paste Workflow & Column Structures */}
          <div className="space-y-3">
            <h4 className="font-bold text-base text-neutral-800 dark:text-slate-100 flex items-center gap-2 border-b border-neutral-100 dark:border-slate-700 pb-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{isAr ? "3. اللصق المباشر من إكسيل (Excel Copy-Paste Workflow)" : "3. Direct Copy-Paste from Excel (Column Mapping)"}</span>
            </h4>

            <p className="text-xs text-neutral-600 dark:text-slate-300 leading-relaxed">
              {isAr
                ? "يمكنك نسخ الصفوف مباشرة من برنامج إكسيل (Excel) أو أي شيت بيانات واختيار أي من الترتيبات التالية، وسيقوم النظام بتحديد الأعمدة وإكمال باقي الخلايا تلقائياً:"
                : "You can copy rows directly from Microsoft Excel or any spreadsheet. The app automatically detects your column layout:"}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Layout 1: 3 Columns */}
              <div className="p-3 bg-neutral-50 dark:bg-slate-900/60 rounded-xl border border-neutral-200/80 dark:border-slate-700/80 space-y-2">
                <span className="font-bold text-xs text-emerald-700 dark:text-emerald-400 block">
                  {isAr ? "1. 3 أعمدة (مع رمز النقطة)" : "1. 3 Columns (With Point ID)"}
                </span>
                <div className="bg-white dark:bg-slate-800 rounded border border-neutral-200 dark:border-slate-700 p-2 font-mono text-[11px] text-neutral-700 dark:text-slate-200">
                  <div className="grid grid-cols-3 border-b border-neutral-200 dark:border-slate-700 pb-1 font-sans font-bold text-neutral-400 text-[10px]">
                    <span>Col A</span>
                    <span>Col B (X)</span>
                    <span>Col C (Y)</span>
                  </div>
                  <div className="grid grid-cols-3 pt-1">
                    <span className="text-emerald-600">PT-01</span>
                    <span>31.2357</span>
                    <span>30.0444</span>
                  </div>
                  <div className="grid grid-cols-3 text-neutral-400 text-[10px]">
                    <span>PT-02</span>
                    <span>29.9182</span>
                    <span>31.2001</span>
                  </div>
                </div>
                <p className="text-[10px] text-neutral-500 dark:text-slate-400">
                  {isAr ? "يتم توزيع الخلية الأولى كرمز للنقطة، والثانية كـ X، والثالثة كـ Y." : "Col A becomes Point ID, Col B becomes X, Col C becomes Y."}
                </p>
              </div>

              {/* Layout 2: 2 Columns */}
              <div className="p-3 bg-neutral-50 dark:bg-slate-900/60 rounded-xl border border-neutral-200/80 dark:border-slate-700/80 space-y-2">
                <span className="font-bold text-xs text-emerald-700 dark:text-emerald-400 block">
                  {isAr ? "2. عمودان (إحداثيات فقط)" : "2. 2 Columns (Coords Only)"}
                </span>
                <div className="bg-white dark:bg-slate-800 rounded border border-neutral-200 dark:border-slate-700 p-2 font-mono text-[11px] text-neutral-700 dark:text-slate-200">
                  <div className="grid grid-cols-2 border-b border-neutral-200 dark:border-slate-700 pb-1 font-sans font-bold text-neutral-400 text-[10px]">
                    <span>Col A (X)</span>
                    <span>Col B (Y)</span>
                  </div>
                  <div className="grid grid-cols-2 pt-1">
                    <span>615000.00</span>
                    <span>810000.00</span>
                  </div>
                  <div className="grid grid-cols-2 text-neutral-400 text-[10px]">
                    <span>615150.50</span>
                    <span>810200.10</span>
                  </div>
                </div>
                <p className="text-[10px] text-neutral-500 dark:text-slate-400">
                  {isAr ? "يتم توليد رموز النقاط تلقائياً (PT-01, PT-02) وتعبئة X و Y." : "Col A maps to X, Col B maps to Y. Point IDs generate automatically."}
                </p>
              </div>

              {/* Layout 3: 1 Column Combined */}
              <div className="p-3 bg-neutral-50 dark:bg-slate-900/60 rounded-xl border border-neutral-200/80 dark:border-slate-700/80 space-y-2">
                <span className="font-bold text-xs text-emerald-700 dark:text-emerald-400 block">
                  {isAr ? "3. عمود واحد (زوج إحداثيات)" : "3. 1 Column (Combined Pair)"}
                </span>
                <div className="bg-white dark:bg-slate-800 rounded border border-neutral-200 dark:border-slate-700 p-2 font-mono text-[11px] text-neutral-700 dark:text-slate-200">
                  <div className="border-b border-neutral-200 dark:border-slate-700 pb-1 font-sans font-bold text-neutral-400 text-[10px]">
                    Col A (Combined String)
                  </div>
                  <div className="pt-1">31.235712 , 30.044420</div>
                  <div className="text-neutral-400 text-[10px]">31°14'08"E 30°02'39"N</div>
                </div>
                <p className="text-[10px] text-neutral-500 dark:text-slate-400">
                  {isAr ? "يقوم النظام بفصل القيم المدمجة بفاصلة أو مسافة تلقائياً." : "System parses and splits the pair string automatically into X and Y."}
                </p>
              </div>
            </div>

            <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-200/80 dark:border-emerald-800/80 space-y-2">
              <span className="font-bold text-xs text-emerald-800 dark:text-emerald-300 block">
                {isAr ? "خطوات اللصق السريع:" : "Quick Paste Steps:"}
              </span>
              <ol className="list-decimal list-inside space-y-1.5 text-xs text-neutral-700 dark:text-slate-300">
                <li>{isAr ? "حدد الخلايا في ملف الإكسيل واضغط Ctrl+C لنسخ البيانات." : "Select your rows/columns in Excel and press Ctrl+C to copy."}</li>
                <li>{isAr ? "اضغط داخل أي خلية في الجدول واضغط Ctrl+V بشكل مباشر." : "Click inside any cell in the table and press Ctrl+V directly."}</li>
                <li>{isAr ? "أو افتح لوحة (إدخال / لصق نصي) وانسخ كافة السطور معاً لمعالجتها دفعة واحدة." : "Or expand the 'Raw Text Input' panel and paste all lines at once."}</li>
              </ol>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-neutral-50 dark:bg-slate-900 px-6 py-4 border-t border-neutral-200 dark:border-slate-700 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm"
          >
            {isAr ? "فهمت ذلك، إغلاق الدليل" : "Got it, Close Guide"}
          </button>
        </div>
      </div>
    </div>
  );
}
