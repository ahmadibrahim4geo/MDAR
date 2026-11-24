/**
 * مدار – MِDAR | Phase 4 True XLSX Roundtrip & Spreadsheet Security Test
 * Validates genuine OOXML generation, formula injection sanitization,
 * and lossless numerical readback via read-excel-file.
 */

import writeXlsxFile, { Row } from "write-excel-file/node";
import readXlsxFile from "read-excel-file/node";
import { sanitizeCellValue } from "../src/utils/excelExport.js";
import { BatchRow } from "../src/types.js";
import * as fs from "fs";
import * as path from "path";

async function runXlsxVerification() {
  console.log("================================================================================");
  console.log(" مدار – MِDAR | True XLSX & Spreadsheet Security Verification (T3 DoneProof)");
  console.log("================================================================================\n");

  const testRows: BatchRow[] = [
    {
      id: 1,
      pointId: "PT_CAIRO_CITADEL",
      input1: "31.2625",
      input2: "30.0298",
      outputX: 617654.123,
      outputY: 813456.789,
      outputZone: "Egypt 1907 / Red Belt",
      outputLon: 31.2625,
      outputLat: 30.0298,
      status: "success",
      warnings: [],
      operationId: "EPSG:7697",
      accuracyMeters: 1.2
    },
    // Malicious Formula Injection Test Point
    {
      id: 2,
      pointId: "=cmd|' /C calc'!A0",
      input1: "+123456",
      input2: "@SUM(A1:A10)",
      outputX: 669459.622,
      outputY: 2734271.672,
      outputZone: "KSA-GRF17 / UTM Zone 38N",
      outputLon: 46.6753,
      outputLat: 24.7136,
      status: "success",
      warnings: [],
      operationId: "ITRF2014 / Epoch 2017.0",
      accuracyMeters: 0.05
    }
  ];

  // 1. Check Formula Injection Defense
  const sanitizedP2 = sanitizeCellValue(testRows[1].pointId);
  const sanitizedIn1 = sanitizeCellValue(testRows[1].input1);
  const sanitizedIn2 = sanitizeCellValue(testRows[1].input2);

  const formulaDefensePassed =
    sanitizedP2.startsWith("'=") &&
    sanitizedIn1.startsWith("'+") &&
    sanitizedIn2.startsWith("'@");

  console.log(`[${formulaDefensePassed ? "PASS" : "FAIL"}] Formula Injection Defense (CWE-1236)`);
  console.log(`  Raw: "${testRows[1].pointId}" -> Sanitized: "${sanitizedP2}"`);
  console.log(`  Raw: "${testRows[1].input1}" -> Sanitized: "${sanitizedIn1}"`);
  console.log(`  Raw: "${testRows[1].input2}" -> Sanitized: "${sanitizedIn2}"\n`);

  // 2. Build XLSX file using writeXlsxFile/node
  const headers = [
    "اسم النقطة (Point ID)",
    "X الإدخال (Input X)",
    "Y الإدخال (Input Y)",
    "الشرقي X (Easting)",
    "الشمالي Y (Northing)",
    "المنطقة / الحزام (Zone)",
    "خط الطول (Lon DD)",
    "خط العرض (Lat DD)",
    "الحالة (Status)"
  ];

  const headerRow: Row = headers.map((h) => ({
    value: sanitizeCellValue(h),
    fontWeight: "bold",
    backgroundColor: "#047857",
    color: "#FFFFFF"
  }));

  const dataRows: Row[] = testRows.map((r) => [
    { value: sanitizeCellValue(r.pointId) },
    { value: sanitizeCellValue(r.input1) },
    { value: sanitizeCellValue(r.input2) },
    { value: r.outputX, type: Number },
    { value: r.outputY, type: Number },
    { value: sanitizeCellValue(r.outputZone || "") },
    { value: r.outputLon, type: Number },
    { value: r.outputLat, type: Number },
    { value: r.status === "success" ? "Success" : "Error" }
  ]);

  const testFilePath = path.join(process.cwd(), "testing results", "test_output_batch.xlsx");
  
  // writeXlsxFile in node returns { toBuffer, toStream, toFile }
  await writeXlsxFile([headerRow, ...dataRows], {
    columns: [
      { width: 22 },
      { width: 16 },
      { width: 16 },
      { width: 18 },
      { width: 18 },
      { width: 26 },
      { width: 18 },
      { width: 18 },
      { width: 14 }
    ]
  }).toFile(testFilePath);

  const fileExists = fs.existsSync(testFilePath);
  const fileSize = fileExists ? fs.statSync(testFilePath).size : 0;
  console.log(`[${fileExists && fileSize > 1000 ? "PASS" : "FAIL"}] Genuine OOXML File Written`);
  console.log(`  File path: ${testFilePath}`);
  console.log(`  File size: ${fileSize} bytes\n`);

  // 3. Readback Verification using independent parser (read-excel-file)
  const readResult = await readXlsxFile(testFilePath);
  const readbackRows: any[] = (readResult[0] && (readResult[0] as any).data) ? (readResult[0] as any).data : readResult;
  console.log(`[${readbackRows.length === 3 ? "PASS" : "FAIL"}] Readback Row Count`);
  console.log(`  Expected rows: 3 (1 header + 2 data) | Readback rows: ${readbackRows.length}\n`);

  const readRow1 = readbackRows[1];
  const readbackEasting = readRow1[3] as number;
  const readbackNorthing = readRow1[4] as number;
  const numDiffEasting = Math.abs(readbackEasting - (testRows[0].outputX || 0));
  const numDiffNorthing = Math.abs(readbackNorthing - (testRows[0].outputY || 0));

  const numericalLossless = numDiffEasting < 1e-6 && numDiffNorthing < 1e-6;
  console.log(`[${numericalLossless ? "PASS" : "FAIL"}] Lossless Float Number Readback`);
  console.log(`  Written Easting: ${testRows[0].outputX} | Readback Easting: ${readbackEasting} (diff: ${numDiffEasting})`);
  console.log(`  Written Northing: ${testRows[0].outputY} | Readback Northing: ${readbackNorthing} (diff: ${numDiffNorthing})\n`);

  // Check readback sanitized formula
  const readRow2 = readbackRows[2];
  const readbackMaliciousPId = String(readRow2[0]);
  const maliciousSafelyNeutralized = readbackMaliciousPId.startsWith("'=");
  console.log(`[${maliciousSafelyNeutralized ? "PASS" : "FAIL"}] Formula Disarmed in Stored Cells`);
  console.log(`  Stored Cell Content: "${readbackMaliciousPId}"\n`);

  const allPassed = formulaDefensePassed && fileExists && numericalLossless && maliciousSafelyNeutralized;
  console.log("--------------------------------------------------------------------------------");
  console.log(`Summary Status: ${allPassed ? "✅ ALL TESTS PASSED" : "❌ SOME TESTS FAILED"}`);
  console.log("--------------------------------------------------------------------------------\n");

  const evidencePath = path.join(process.cwd(), "testing results", "TR_0003_true_xlsx_roundtrip.json");
  fs.writeFileSync(evidencePath, JSON.stringify({
    timestamp: new Date().toISOString(),
    testFilePath,
    fileSizeBytes: fileSize,
    formulaDefensePassed,
    numericalLossless,
    maliciousSafelyNeutralized,
    allPassed
  }, null, 2), "utf8");

  console.log(`Evidence written to: ${evidencePath}`);
}

runXlsxVerification();
