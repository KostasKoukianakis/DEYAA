import { apokoronasMunicipalityGeoJson } from "./apokoronasMunicipalityGeoJson";

type MunicipalityBoundaryFeature = {
  type: "Feature";
  properties: Record<string, unknown>;
  geometry: {
    type: "MultiPolygon" | "Polygon";
    coordinates: number[][][] | number[][][][];
  };
};

export const apokoronasMunicipalityFeature =
  apokoronasMunicipalityGeoJson as MunicipalityBoundaryFeature;

/** OSM administrative boundary — Δήμος Αποκορώνου */
export const apokoronasMunicipality = {
  name: "Δήμος Αποκορώνου",
  shortName: "Αποκόρωνας",
  center: { lat: 35.3624971, lng: 24.1594799 },
  defaultZoom: 11,
  boundingBox: {
    south: 35.2491972,
    north: 35.4755731,
    west: 24.0435415,
    east: 24.3319876,
  },
  serviceNote: "Η ΔΕΥΑΑ εξυπηρετεί ολόκληρο τον Δήμο Αποκορώνου.",
  geoJson: apokoronasMunicipalityFeature,
} as const;
