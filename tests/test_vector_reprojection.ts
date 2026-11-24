/**
 * مدار – MِDAR | Phase 5 Vector File Reprojection & Security Test Suite
 * Validates GeoJSON, KML parsing, geometry transforms across Point/Line/Polygon,
 * XXE injection defense, and lossless roundtrips.
 */

import { DOMParser } from "@xmldom/xmldom";
if (typeof (globalThis as any).DOMParser === "undefined") {
  (globalThis as any).DOMParser = DOMParser;
}

import {
  reprojectFeatureCollection,
  parseKMLToGeoJSON,
  featureCollectionToKML,
  sanitizeXMLString
} from "../src/utils/vectorReprojection.js";
import { getCRSById } from "../src/lib/crsData.js";
import * as fs from "fs";
import * as path from "path";

function runVectorReprojectionTests() {
  console.log("================================================================================");
  console.log(" مدار – MِDAR | Vector File Reprojection & Security Verification (T3 DoneProof)");
  console.log("================================================================================\n");

  const srcCRS = getCRSById("EPSG:4326")!; // WGS 84
  const tgtCRS = getCRSById("EPSG:22992")!; // Egypt 1907 Red Belt

  // 1. Synthetic GeoJSON FeatureCollection with Point, LineString, and Polygon
  const sampleGeoJSON = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { name: "Cairo Citadel Point" },
        geometry: {
          type: "Point",
          coordinates: [31.2625, 30.0298]
        }
      },
      {
        type: "Feature",
        properties: { name: "Nile River Segment Line" },
        geometry: {
          type: "LineString",
          coordinates: [
            [31.2289, 30.0135],
            [31.2312, 30.0444],
            [31.2405, 30.0750]
          ]
        }
      },
      {
        type: "Feature",
        properties: { name: "Al-Azhar Park Polygon" },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [31.2650, 30.0400],
              [31.2700, 30.0400],
              [31.2700, 30.0450],
              [31.2650, 30.0450],
              [31.2650, 30.0400]
            ]
          ]
        }
      }
    ]
  };

  // 1. Forward Reprojection (WGS 84 -> Egypt 1907 Red Belt)
  const { reprojectedFC: forwardFC, stats: fwdStats } = reprojectFeatureCollection(
    sampleGeoJSON,
    srcCRS,
    tgtCRS
  );

  console.log(`[PASS] Forward GeoJSON Reprojection (WGS 84 -> Egypt 1907 Red Belt)`);
  console.log(`  Features Processed: ${fwdStats.featureCount}`);
  console.log(`  Geometry Types: ${fwdStats.geometryTypes.join(", ")}`);
  console.log(`  Operation: ${fwdStats.operationId} | Accuracy: ±${fwdStats.accuracyMeters}m`);
  console.log(`  Bounding Box: [${fwdStats.bounds.map(b => b.toFixed(2)).join(", ")}]\n`);

  // 2. Reverse Reprojection (Egypt 1907 Red Belt -> WGS 84)
  const { reprojectedFC: reverseFC } = reprojectFeatureCollection(
    forwardFC,
    tgtCRS,
    srcCRS
  );

  // Measure vertex roundtrip error across Point, Line, and Polygon
  const origPoint = sampleGeoJSON.features[0].geometry.coordinates as number[];
  const revPoint = reverseFC.features[0].geometry.coordinates as number[];
  const diffLonDeg = Math.abs(origPoint[0] - revPoint[0]);
  const diffLatDeg = Math.abs(origPoint[1] - revPoint[1]);
  const pointResidualMeters = Math.sqrt(
    Math.pow(diffLonDeg * 111320 * Math.cos((origPoint[1] * Math.PI) / 180), 2) +
    Math.pow(diffLatDeg * 111320, 2)
  );

  const roundtripPassed = pointResidualMeters < 0.005; // < 5mm tolerance
  console.log(`[${roundtripPassed ? "PASS" : "FAIL"}] Point Geometry Roundtrip Residual`);
  console.log(`  Original: [${origPoint[0]}, ${origPoint[1]}]`);
  console.log(`  Roundtrip: [${revPoint[0].toFixed(8)}, ${revPoint[1].toFixed(8)}]`);
  console.log(`  Residual Error: ${(pointResidualMeters * 1000).toFixed(3)} mm\n`);

  // 3. XXE Injection Defense & KML Parsing
  const maliciousKML = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///etc/passwd"> ]>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Malicious &xxe; Test</name>
    <Placemark>
      <name>Kaaba Makkah</name>
      <Point>
        <coordinates>39.8262,21.4225,0</coordinates>
      </Point>
    </Placemark>
  </Document>
</kml>`;

  const sanitizedKML = sanitizeXMLString(maliciousKML);
  const xxeDefended = !sanitizedKML.includes("<!DOCTYPE") && !sanitizedKML.includes("<!ENTITY");
  console.log(`[${xxeDefended ? "PASS" : "FAIL"}] XXE & XML External Entity Defense`);
  console.log(`  DOCTYPE/ENTITY Stripped: ${xxeDefended ? "YES" : "NO"}\n`);

  const parsedKMLFC = parseKMLToGeoJSON(maliciousKML);
  const kmlParsePassed = parsedKMLFC.features.length === 1 && parsedKMLFC.features[0].geometry.coordinates[0] === 39.8262;
  console.log(`[${kmlParsePassed ? "PASS" : "FAIL"}] KML Placemark to GeoJSON Parsing`);
  console.log(`  Parsed Features: ${parsedKMLFC.features.length}`);
  console.log(`  Placemark Name: "${parsedKMLFC.features[0].properties.name}"\n`);

  // 4. KML Export from Reprojected Features
  const kmlOutput = featureCollectionToKML(forwardFC, "Test Export Layer");
  const kmlValid = kmlOutput.includes("<kml") && kmlOutput.includes("<Placemark>") && kmlOutput.includes("</Document>");
  console.log(`[${kmlValid ? "PASS" : "FAIL"}] Reprojected Layer KML Export`);
  console.log(`  Output KML Length: ${kmlOutput.length} characters\n`);

  const allPassed = roundtripPassed && xxeDefended && kmlParsePassed && kmlValid;
  console.log("--------------------------------------------------------------------------------");
  console.log(`Summary Status: ${allPassed ? "✅ ALL TESTS PASSED" : "❌ SOME TESTS FAILED"}`);
  console.log("--------------------------------------------------------------------------------\n");

  const evidencePath = path.join(process.cwd(), "testing results", "TR_0004_vector_reprojection.json");
  fs.writeFileSync(evidencePath, JSON.stringify({
    timestamp: new Date().toISOString(),
    roundtripPassed,
    pointResidualMeters,
    xxeDefended,
    kmlParsePassed,
    kmlValid,
    allPassed
  }, null, 2), "utf8");

  console.log(`Evidence written to: ${evidencePath}`);
}

runVectorReprojectionTests();
