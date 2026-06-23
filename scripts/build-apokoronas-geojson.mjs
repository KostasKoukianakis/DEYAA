import fs from "fs";

const sourcePath = process.argv[2] ?? "src/data/apokoronas-mapit.geojson";
const raw = JSON.parse(fs.readFileSync(sourcePath, "utf8"));

const feature =
  raw.type === "Feature"
    ? raw
    : raw.type === "FeatureCollection"
      ? raw.features[0]
      : {
          type: "Feature",
          properties: { name: "Δήμος Αποκορώνου", source: "OpenStreetMap contributors (ODbL)" },
          geometry: raw,
        };

const ts = `export const apokoronasMunicipalityGeoJson = ${JSON.stringify(feature)} as const;\n`;
fs.writeFileSync("src/data/apokoronasMunicipalityGeoJson.ts", ts);
console.log("Wrote apokoronasMunicipalityGeoJson.ts", fs.statSync("src/data/apokoronasMunicipalityGeoJson.ts").size, "bytes");
