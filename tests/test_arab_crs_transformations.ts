/**
 * مدار – MDAR | Phase 2 Geodetic Transformation & Verification Test Suite
 * Validates forward and reverse conversions across verified Arab and Global CRS definitions.
 */

import { convertCoordinates } from "../src/lib/coordinateMath.js";
import { getCRSById } from "../src/lib/crsData.js";
import * as fs from "fs";
import * as path from "path";

interface TestCase {
  name: string;
  sourceCRSId: string;
  targetCRSId: string;
  sourceCoords: [number, number]; // [lon / Easting, lat / Northing]
  toleranceMeters: number;
}

const testCases: TestCase[] = [
  // 1. KSA-GRF17 UTM 38N Forward (Riyadh King Fahd Road ~ 24.7136°N, 46.6753°E)
  {
    name: "KSA-GRF17 UTM 38N Forward (Riyadh)",
    sourceCRSId: "EPSG:4326",
    targetCRSId: "EPSG:9358",
    sourceCoords: [46.6753, 24.7136],
    toleranceMeters: 0.05
  },
  // 2. KSA-GRF17 UTM 37N Forward (Makkah Kaaba ~ 21.4225°N, 39.8262°E)
  {
    name: "KSA-GRF17 UTM 37N Forward (Makkah)",
    sourceCRSId: "EPSG:4326",
    targetCRSId: "EPSG:9357",
    sourceCoords: [39.8262, 21.4225],
    toleranceMeters: 0.05
  },
  // 3. UAE Dubai Local Transverse Mercator (DLTM) Forward (Burj Khalifa ~ 25.1972°N, 55.2744°E)
  {
    name: "UAE DLTM Forward (Dubai Burj Khalifa)",
    sourceCRSId: "EPSG:4326",
    targetCRSId: "EPSG:3997",
    sourceCoords: [55.2744, 25.1972],
    toleranceMeters: 0.05
  },
  // 4. Qatar QND95 QNG Cassini (Doha Corniche ~ 25.2861°N, 51.5348°E)
  {
    name: "Qatar QND95 Cassini Forward (Doha)",
    sourceCRSId: "EPSG:4326",
    targetCRSId: "EPSG:2932",
    sourceCoords: [51.5348, 25.2861],
    toleranceMeters: 0.05
  },
  // 5. Kuwait Utility Grid (KTM) Forward (Kuwait Towers ~ 29.3897°N, 47.9989°E)
  {
    name: "Kuwait KTM Forward (Kuwait Towers)",
    sourceCRSId: "EPSG:4326",
    targetCRSId: "EPSG:3889",
    sourceCoords: [47.9989, 29.3897],
    toleranceMeters: 0.05
  },
  // 6. Oman PSD93 ON-TM Forward (Muscat ~ 23.5880°N, 58.3829°E)
  {
    name: "Oman ON-TM Forward (Muscat)",
    sourceCRSId: "EPSG:4326",
    targetCRSId: "EPSG:3440",
    sourceCoords: [58.3829, 23.5880],
    toleranceMeters: 0.05
  },
  // 7. Palestine Grid Cassini (Jerusalem / Al-Quds ~ 31.7767°N, 35.2345°E)
  {
    name: "Palestine Grid Cassini Forward (Jerusalem)",
    sourceCRSId: "EPSG:4326",
    targetCRSId: "EPSG:28191",
    sourceCoords: [35.2345, 31.7767],
    toleranceMeters: 0.05
  },
  // 8. Jordan Transverse Mercator (Amman ~ 31.9454°N, 35.9284°E)
  {
    name: "Jordan JTM Forward (Amman)",
    sourceCRSId: "EPSG:4326",
    targetCRSId: "EPSG:28193",
    sourceCoords: [35.9284, 31.9454],
    toleranceMeters: 0.05
  },
  // 9. Morocco Merchich Lambert Zone 1 (Rabat ~ 34.0209°N, -6.8416°E)
  {
    name: "Morocco Merchich LCC Forward (Rabat)",
    sourceCRSId: "EPSG:4326",
    targetCRSId: "EPSG:26191",
    sourceCoords: [-6.8416, 34.0209],
    toleranceMeters: 0.05
  },
  // 10. Tunisia Carthage Lambert Zone 1 (Tunis ~ 36.8065°N, 10.1815°E)
  {
    name: "Tunisia Carthage LCC Forward (Tunis)",
    sourceCRSId: "EPSG:4326",
    targetCRSId: "EPSG:22391",
    sourceCoords: [10.1815, 36.8065],
    toleranceMeters: 0.05
  },
  // 11. Syria Deir ez Zor Lambert (Damascus ~ 33.5138°N, 36.2765°E)
  {
    name: "Syria Deir ez Zor LCC Forward (Damascus)",
    sourceCRSId: "EPSG:4326",
    targetCRSId: "EPSG:22770",
    sourceCoords: [36.2765, 33.5138],
    toleranceMeters: 0.05
  },
  // 12. Web Mercator (EPSG:3857) Forward (Cairo ~ 30.0444°N, 31.2357°E)
  {
    name: "Web Mercator Forward (Cairo)",
    sourceCRSId: "EPSG:4326",
    targetCRSId: "EPSG:3857",
    sourceCoords: [31.2357, 30.0444],
    toleranceMeters: 0.05
  }
];

function runArabCatalogTests() {
  console.log("================================================================================");
  console.log(" مدار – MDAR | Verified Arab & Global CRS Catalog Roundtrip & Verification");
  console.log("================================================================================\n");

  const results: any[] = [];
  let passedCount = 0;

  for (const tc of testCases) {
    const srcCRS = getCRSById(tc.sourceCRSId);
    const tgtCRS = getCRSById(tc.targetCRSId);

    if (!srcCRS || !tgtCRS) {
      console.error(`❌ [FAILED] Missing CRS definition: ${tc.sourceCRSId} or ${tc.targetCRSId}`);
      results.push({ name: tc.name, status: "FAILED", error: "Missing CRS definition" });
      continue;
    }

    // 1. Forward Transformation: convertCoordinates takes (val1: X/Lon, val2: Y/Lat)
    const fwd = convertCoordinates(tc.sourceCoords[0], tc.sourceCoords[1], srcCRS, tgtCRS);
    if (!fwd) {
      console.error(`❌ [FAILED] Forward conversion returned null: ${tc.name}`);
      results.push({ name: tc.name, status: "FAILED", error: "Forward conversion failed" });
      continue;
    }

    // 2. Reverse Transformation (Roundtrip check): fwd.out1 is X/Easting, fwd.out2 is Y/Northing
    const rev = convertCoordinates(fwd.out1, fwd.out2, tgtCRS, srcCRS);
    if (!rev) {
      console.error(`❌ [FAILED] Reverse conversion returned null: ${tc.name}`);
      results.push({ name: tc.name, status: "FAILED", error: "Reverse conversion failed" });
      continue;
    }

    // Measure roundtrip error in meters (1 deg lat ~ 111,320m)
    const lonResidualDeg = Math.abs(rev.out1 - tc.sourceCoords[0]);
    const latResidualDeg = Math.abs(rev.out2 - tc.sourceCoords[1]);
    const latResidualMeters = latResidualDeg * 111320;
    const lonResidualMeters = lonResidualDeg * (111320 * Math.cos((tc.sourceCoords[1] * Math.PI) / 180));
    const roundtripErrorMeters = Math.sqrt(latResidualMeters * latResidualMeters + lonResidualMeters * lonResidualMeters);

    const isPassed = roundtripErrorMeters <= tc.toleranceMeters;
    if (isPassed) passedCount++;

    console.log(`[${isPassed ? "PASS" : "FAIL"}] ${tc.name}`);
    console.log(`  Source: (${tc.sourceCoords[1].toFixed(6)}°N, ${tc.sourceCoords[0].toFixed(6)}°E) [${srcCRS.nameEn}]`);
    console.log(`  Forward Result: E = ${fwd.out1.toFixed(3)}m, N = ${fwd.out2.toFixed(3)}m [${tgtCRS.nameEn}]`);
    console.log(`  Operation ID: ${fwd.operationId || "Analytical/Proj4"} | Accuracy: ±${fwd.accuracyMeters}m`);
    console.log(`  Roundtrip Residual: ${roundtripErrorMeters < 0.001 ? (roundtripErrorMeters * 1000).toFixed(3) + " mm" : roundtripErrorMeters.toFixed(4) + " m"}`);
    if (fwd.warnings && fwd.warnings.length > 0) {
      console.log(`  Warnings: ${fwd.warnings.join(" | ")}`);
    }
    console.log();

    results.push({
      name: tc.name,
      sourceCRS: tc.sourceCRSId,
      targetCRS: tc.targetCRSId,
      forwardCoords: [fwd.out1, fwd.out2],
      reverseCoords: [rev.out1, rev.out2],
      operationId: fwd.operationId,
      accuracyMeters: fwd.accuracyMeters,
      roundtripErrorMeters,
      status: isPassed ? "PASSED" : "FAILED"
    });
  }

  const allPassed = passedCount === testCases.length;
  console.log("--------------------------------------------------------------------------------");
  console.log(`Total: ${testCases.length} | Passed: ${passedCount} | Failed: ${testCases.length - passedCount}`);
  console.log(`Summary Status: ${allPassed ? "✅ ALL TESTS PASSED" : "❌ SOME TESTS FAILED"}`);
  console.log("--------------------------------------------------------------------------------\n");

  const reportPath = path.join(process.cwd(), "testing results", "TR_0002_arab_crs_transformations.json");
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    totalTests: testCases.length,
    passedCount,
    failedCount: testCases.length - passedCount,
    allPassed,
    results
  }, null, 2), "utf8");

  console.log(`Evidence written to: ${reportPath}`);
}

runArabCatalogTests();
