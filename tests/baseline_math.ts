/**
 * Baseline Mathematical Verification Test for MِDAR
 * Evaluates geodetic projection algorithms, roundtrip consistency, and residuals against PROJ benchmarks.
 */

import fs from "fs";
import path from "path";
import {
  tmForward,
  tmInverse,
  webMercatorForward,
  webMercatorInverse,
  transformEgypt1907ToWGS84,
  transformWGS84ToEgypt1907,
  convertCoordinates
} from "../src/lib/coordinateMath";
import { ELLIPSOID_WGS84, getCRSById } from "../src/lib/crsData";

interface TestReport {
  timestamp: string;
  testSuite: string;
  totalTests: number;
  passed: number;
  failed: number;
  tolerance: {
    projectionRoundtripMeters: number;
    datumRoundtripDegrees: number;
    utmExpectedMeters: number;
  };
  results: Array<{
    name: string;
    passed: boolean;
    residual: number;
    details: string;
  }>;
}

const report: TestReport = {
  timestamp: new Date().toISOString(),
  testSuite: "MِDAR Baseline Mathematical Verification (T1 Evidence)",
  totalTests: 0,
  passed: 0,
  failed: 0,
  tolerance: {
    projectionRoundtripMeters: 0.005, // 5 mm (baseline TM 6th-order Taylor series truncation limit)
    datumRoundtripDegrees: 1e-8,      // ~1 mm at equator
    utmExpectedMeters: 0.05           // 5 cm against native PROJ benchmarks
  },
  results: []
};

function assertTest(name: string, passed: boolean, residual: number, details: string) {
  report.totalTests++;
  if (passed) {
    report.passed++;
    console.log(`[PASS] ${name} (Residual: ${residual.toExponential(4)})`);
  } else {
    report.failed++;
    console.error(`[FAIL] ${name} (Residual: ${residual.toExponential(4)}) -> ${details}`);
  }
  report.results.push({ name, passed, residual, details });
}

// 1. Transverse Mercator Roundtrip Test (UTM Zone 36N parameters on WGS84)
const latTest = 30.029871;
const lonTest = 31.261142;
const cmUTM36 = 33.0;
const k0UTM = 0.9996;
const feUTM = 500000.0;
const fnUTM = 0.0;

const forwardTM = tmForward(
  latTest,
  lonTest,
  ELLIPSOID_WGS84.a,
  ELLIPSOID_WGS84.rf,
  cmUTM36,
  k0UTM,
  feUTM,
  fnUTM,
  0.0
);

const inverseTM = tmInverse(
  forwardTM.easting,
  forwardTM.northing,
  ELLIPSOID_WGS84.a,
  ELLIPSOID_WGS84.rf,
  cmUTM36,
  k0UTM,
  feUTM,
  fnUTM,
  0.0
);

const latDiffTM = Math.abs(latTest - inverseTM.lat);
const lonDiffTM = Math.abs(lonTest - inverseTM.lon);
const residualTMDeg = Math.sqrt(latDiffTM * latDiffTM + lonDiffTM * lonDiffTM);
const residualTMMeters = residualTMDeg * 111319.5;

assertTest(
  "TM Projection Forward-Inverse Roundtrip (WGS84 UTM 36N)",
  residualTMMeters <= report.tolerance.projectionRoundtripMeters,
  residualTMMeters,
  `Forward: E=${forwardTM.easting.toFixed(3)}, N=${forwardTM.northing.toFixed(3)} | Inverse: Lat=${inverseTM.lat.toFixed(8)}, Lon=${inverseTM.lon.toFixed(8)} | Observed residual: ${residualTMMeters.toFixed(4)}m (due to 6th-order series truncation)`
);

// 2. Web Mercator Roundtrip Test
const wmFwd = webMercatorForward(latTest, lonTest);
const wmInv = webMercatorInverse(wmFwd.easting, wmFwd.northing);
const residualWMDeg = Math.sqrt(Math.pow(latTest - wmInv.lat, 2) + Math.pow(lonTest - wmInv.lon, 2));
const residualWMMeters = residualWMDeg * 111319.5;

assertTest(
  "Web Mercator Forward-Inverse Roundtrip",
  residualWMMeters <= report.tolerance.projectionRoundtripMeters,
  residualWMMeters,
  `Forward: E=${wmFwd.easting.toFixed(2)}, N=${wmFwd.northing.toFixed(2)} | Inverse: Lat=${wmInv.lat.toFixed(8)}, Lon=${wmInv.lon.toFixed(8)}`
);

// 3. Egypt 1907 Datum Molodensky-Badekas Roundtrip Test
const wgsFromEgy = transformEgypt1907ToWGS84(latTest, lonTest);
const egyRoundtrip = transformWGS84ToEgypt1907(wgsFromEgy.lat, wgsFromEgy.lon);
const residualEgyDeg = Math.sqrt(Math.pow(latTest - egyRoundtrip.lat, 2) + Math.pow(lonTest - egyRoundtrip.lon, 2));

assertTest(
  "Egypt 1907 Molodensky-Badekas Forward-Inverse Roundtrip",
  residualEgyDeg <= report.tolerance.datumRoundtripDegrees,
  residualEgyDeg,
  `WGS84: Lat=${wgsFromEgy.lat.toFixed(8)}, Lon=${wgsFromEgy.lon.toFixed(8)} | Roundtrip Egy: Lat=${egyRoundtrip.lat.toFixed(8)}, Lon=${egyRoundtrip.lon.toFixed(8)}`
);

// 4. Verification against Synthetic PROJ Benchmark Dataset
const fixturePath = path.resolve(process.cwd(), "testing data/baseline_control_points.json");
if (fs.existsSync(fixturePath)) {
  const fixtureData = JSON.parse(fs.readFileSync(fixturePath, "utf-8"));
  for (const pt of fixtureData.points) {
    if (pt.utm) {
      const crsSrc = getCRSById("EPSG:4326")!;
      const crsTgt = getCRSById(pt.utm.epsg)!;
      const conv = convertCoordinates(pt.wgs84.lon, pt.wgs84.lat, crsSrc, crsTgt, false, true);
      const diffE = Math.abs(conv.out1 - pt.utm.easting);
      const diffN = Math.abs(conv.out2 - pt.utm.northing);
      const diffDist = Math.sqrt(diffE * diffE + diffN * diffN);

      assertTest(
        `Control Point ${pt.id} -> ${pt.utm.epsg} vs PROJ Benchmark`,
        diffDist <= report.tolerance.utmExpectedMeters,
        diffDist,
        `Calculated: E=${conv.out1.toFixed(2)}, N=${conv.out2.toFixed(2)} | PROJ Benchmark: E=${pt.utm.easting.toFixed(2)}, N=${pt.utm.northing.toFixed(2)}`
      );
    }
  }
}

// Write test results to testing results
const resultsDir = path.resolve(process.cwd(), "testing results");
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true });
}
const outputPath = path.join(resultsDir, "TR_0001_baseline_math.json");
fs.writeFileSync(outputPath, JSON.stringify(report, null, 2), "utf-8");
console.log(`\nTest results written to: ${outputPath}`);
console.log(`Summary: ${report.passed}/${report.totalTests} tests passed.`);

if (report.failed > 0) {
  process.exit(1);
}
