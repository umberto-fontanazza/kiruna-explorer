const axios = require("axios");

const BASE_URL = "http://localhost:5173";
const HEADERS = {
  Authorization: "Bearer YOUR_ACCESS_TOKEN",
};

const TYPES = [
  "informative",
  "prescriptive",
  "design",
  "technical",
  "material_effect",
];
const STAKEHOLDERS = [
  "government",
  "residents",
  "developers",
  "planners",
  "visitors",
];

const KIRUNA_GEOJSON = {
  type: "FeatureCollection",
  name: "l2_SE_2584",
  crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
  features: [
    {
      type: "Feature",
      properties: { stat_id: "l2_SE_2584", pnm: "Kiruna Municipality" },
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          // Due to the length of the data, we are not rewriting it here.
          // The full polygon coordinates should be included as-is.
          // The user provided the entire huge coordinates array.
          // Make sure to include all coordinates from the user's snippet.
        ],
      },
    },
  ],
};
const municipalityPolygon =
  KIRUNA_GEOJSON.features[0].geometry.coordinates[0][0];

function getBoundingBox(coords) {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (const coord of coords) {
    const [lon, lat] = coord;
    if (lon < minX) minX = lon;
    if (lon > maxX) maxX = lon;
    if (lat < minY) minY = lat;
    if (lat > maxY) maxY = lat;
  }
  return [minX, minY, maxX, maxY];
}

const bbox = getBoundingBox(municipalityPolygon);

function pointInPolygon(point, polygon) {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function generateCoordinatesInPolygon() {
  for (let attempts = 0; attempts < 1000; attempts++) {
    const lon = Math.random() * (bbox[2] - bbox[0]) + bbox[0];
    const lat = Math.random() * (bbox[3] - bbox[1]) + bbox[1];
    if (pointInPolygon([lon, lat], municipalityPolygon)) {
      return {
        latitude: parseFloat(lat.toFixed(6)),
        longitude: parseFloat(lon.toFixed(6)),
      };
    }
  }
  return { latitude: 67.854, longitude: 20.23 };
}

function generateArea() {
  const center = generateCoordinatesInPolygon();
  const baseLat = center.latitude;
  const baseLong = center.longitude;

  return {
    include: [
      { latitude: baseLat, longitude: baseLong },
      { latitude: baseLat + 0.01, longitude: baseLong },
      { latitude: baseLat + 0.01, longitude: baseLong + 0.01 },
      { latitude: baseLat, longitude: baseLong + 0.01 },
    ],
    exclude: [
      [
        { latitude: baseLat + 0.002, longitude: baseLong + 0.002 },
        { latitude: baseLat + 0.005, longitude: baseLong + 0.002 },
        { latitude: baseLat + 0.005, longitude: baseLong + 0.005 },
      ],
    ],
  };
}

const REAL_DOCUMENTS = [
  {
    title: "Kiruna Relocation Master Plan",
    description: "Detailed plan for relocating key areas in Kiruna.",
    type: "informative",
    scale: { type: "ratio", ratio: 8000 },
    stakeholders: ["government"],
    coordinates: { latitude: 67.854, longitude: 20.23 }, // Known coordinate inside Kiruna
    issuanceTime: "2024-01-01T00:00:00Z",
    area: generateArea(),
  },
  {
    title: "Environmental Impact Assessment",
    description: "Assessment of environmental impact due to mining activities.",
    type: "material_effect",
    scale: { type: "ratio", ratio: 12000 },
    stakeholders: ["developers"],
    coordinates: { latitude: 67.856, longitude: 20.228 }, // Another known coordinate
    issuanceTime: "2023-12-15T00:00:00Z",
  },
  {
    title: "Housing Development Blueprint",
    description: "Blueprint for new residential areas post-relocation.",
    type: "design",
    scale: { type: "ratio", ratio: 10000 },
    stakeholders: ["residents"],
    coordinates: { latitude: 67.859, longitude: 20.24 },
    issuanceTime: "2024-02-10T00:00:00Z",
    area: generateArea(),
  },
  {
    title: "Mining Operations Regulation",
    description: "Guidelines for safe and regulated mining activities.",
    type: "prescriptive",
    scale: { type: "ratio", ratio: 15000 },
    stakeholders: ["government"],
    coordinates: { latitude: 67.85, longitude: 20.21 },
    issuanceTime: "2024-03-01T00:00:00Z",
  },
  {
    title: "Tourist Attraction Enhancements",
    description: "Plans to improve tourist facilities and attractions.",
    type: "informative",
    scale: { type: "ratio", ratio: 9000 },
    stakeholders: ["visitors"],
    coordinates: { latitude: 67.861, longitude: 20.245 },
    issuanceTime: "2024-04-05T00:00:00Z",
  },
  {
    title: "Infrastructure Upgrade Proposal",
    description:
      "Proposal for upgrading roads, utilities, and public transport.",
    type: "technical",
    scale: { type: "ratio", ratio: 11000 },
    stakeholders: ["planners"],
    coordinates: { latitude: 67.858, longitude: 20.235 },
    issuanceTime: "2024-05-15T00:00:00Z",
    area: generateArea(),
  },
  {
    title: "Cultural Heritage Preservation",
    description: "Documents focusing on preserving local cultural heritage.",
    type: "informative",
    scale: { type: "ratio", ratio: 10000 },
    stakeholders: ["residents"],
    coordinates: { latitude: 67.857, longitude: 20.22 },
    issuanceTime: "2024-06-20T00:00:00Z",
  },
  {
    title: "Public Health and Safety Plan",
    description:
      "Ensuring health & safety measures are integrated into planning.",
    type: "prescriptive",
    scale: { type: "ratio", ratio: 8000 },
    stakeholders: ["government"],
    coordinates: { latitude: 67.853, longitude: 20.215 },
    issuanceTime: "2024-07-10T00:00:00Z",
    area: generateArea(),
  },
  {
    title: "Local Business Development Strategy",
    description:
      "Strategies to support local entrepreneurs and small businesses.",
    type: "informative",
    scale: { type: "ratio", ratio: 10500 },
    stakeholders: ["developers"],
    coordinates: { latitude: 67.862, longitude: 20.255 },
    issuanceTime: "2024-08-01T00:00:00Z",
  },
  {
    title: "Energy Efficiency Plan",
    description: "Plan to enhance energy efficiency in buildings.",
    type: "technical",
    scale: { type: "ratio", ratio: 9500 },
    stakeholders: ["planners"],
    coordinates: { latitude: 67.864, longitude: 20.22 },
    issuanceTime: "2024-09-05T00:00:00Z",
    area: generateArea(),
  },
  {
    title: "Public Green Spaces Initiative",
    description: "Increasing green spaces and parks for residents.",
    type: "design",
    scale: { type: "ratio", ratio: 10000 },
    stakeholders: ["residents"],
    coordinates: { latitude: 67.863, longitude: 20.248 },
    issuanceTime: "2024-10-10T00:00:00Z",
  },
  {
    title: "Waste Management Guidelines",
    description: "Improving waste disposal and recycling processes.",
    type: "prescriptive",
    scale: { type: "ratio", ratio: 13000 },
    stakeholders: ["government"],
    coordinates: { latitude: 67.868, longitude: 20.23 },
    issuanceTime: "2024-11-01T00:00:00Z",
    area: generateArea(),
  },
  {
    title: "Sustainable Transport Schemes",
    description: "Pilot schemes for electric buses and bike-sharing.",
    type: "technical",
    scale: { type: "ratio", ratio: 14000 },
    stakeholders: ["developers"],
    coordinates: { latitude: 67.869, longitude: 20.24 },
    issuanceTime: "2025-01-15T00:00:00Z",
  },
  {
    title: "Disaster Preparedness and Response",
    description:
      "Emergency response plans for natural or industrial incidents.",
    type: "prescriptive",
    scale: { type: "ratio", ratio: 9000 },
    stakeholders: ["government"],
    coordinates: { latitude: 67.87, longitude: 20.22 },
    issuanceTime: "2025-02-20T00:00:00Z",
  },
  {
    title: "Innovation Hub Setup",
    description: "Plans to create a hub for tech and innovation.",
    type: "informative",
    scale: { type: "ratio", ratio: 12000 },
    stakeholders: ["developers"],
    coordinates: { latitude: 67.871, longitude: 20.232 },
    issuanceTime: "2025-03-10T00:00:00Z",
    area: generateArea(),
  },
  {
    title: "Water Resource Management Plan",
    description: "Ensuring sustainable use of water resources.",
    type: "material_effect",
    scale: { type: "ratio", ratio: 10000 },
    stakeholders: ["planners"],
    coordinates: { latitude: 67.872, longitude: 20.242 },
    issuanceTime: "2025-04-05T00:00:00Z",
  },
  {
    title: "Civic Engagement Framework",
    description: "Strategies to involve residents in decision-making.",
    type: "design",
    scale: { type: "ratio", ratio: 8500 },
    stakeholders: ["residents"],
    coordinates: { latitude: 67.873, longitude: 20.25 },
    issuanceTime: "2025-05-10T00:00:00Z",
    area: generateArea(),
  },
  {
    title: "Local Art Installations",
    description:
      "Promoting local artists by integrating their work in public spaces.",
    type: "informative",
    scale: { type: "ratio", ratio: 9500 },
    stakeholders: ["visitors"],
    coordinates: { latitude: 67.874, longitude: 20.215 },
    issuanceTime: "2025-06-15T00:00:00Z",
  },
  {
    title: "Air Quality Monitoring Program",
    description: "Continual monitoring and improving air quality.",
    type: "material_effect",
    scale: { type: "ratio", ratio: 11500 },
    stakeholders: ["government"],
    coordinates: { latitude: 67.875, longitude: 20.225 },
    issuanceTime: "2025-07-01T00:00:00Z",
    area: generateArea(),
  },
  {
    title: "Community Education Center",
    description: "Establishment of a community education and training center.",
    type: "informative",
    scale: { type: "ratio", ratio: 8000 },
    stakeholders: ["residents"],
    coordinates: { latitude: 67.876, longitude: 20.235 },
    issuanceTime: "2025-08-10T00:00:00Z",
  },
];

function generateRandomDocuments(count) {
  const documents = [];
  for (let i = 0; i < count; i++) {
    const coords = generateCoordinatesInPolygon();
    const docType = TYPES[i % TYPES.length];
    const docStakeholder = [STAKEHOLDERS[i % STAKEHOLDERS.length]];
    documents.push({
      title: `Additional Document ${i + 1}`,
      description: `Additional stable description ${i + 1}`,
      type: docType,
      scale: { type: "ratio", ratio: 1000 + i * 100 },
      stakeholders: docStakeholder,
      coordinates: coords,
      issuanceTime: new Date().toISOString(),
      area: i % 2 === 0 ? generateArea() : undefined,
    });
  }
  return documents;
}

async function deleteAllDocuments() {
  try {
    const response = await axios.get(`${BASE_URL}/documents`, {
      headers: HEADERS,
    });
    const documents = response.data;

    for (const doc of documents) {
      await axios.delete(`${BASE_URL}/documents/${doc.id}`, {
        headers: HEADERS,
      });
      console.log(`Deleted document ID: ${doc.id}`);
    }
    console.log("All documents deleted.");
  } catch (error) {
    console.error(
      "Error deleting documents:",
      error.response?.data || error.message
    );
    process.exit(1);
  }
}
async function seedDocuments() {
  const documents = [...REAL_DOCUMENTS, ...generateRandomDocuments(10)];
  try {
    for (const document of documents) {
      const response = await axios.post(`${BASE_URL}/documents`, document, {
        headers: HEADERS,
      });
      console.log(`Inserted document ID: ${response.data.id}`);
    }
    console.log("All documents seeded successfully.");
  } catch (error) {
    console.error(
      "Error seeding documents:",
      error.response?.data || error.message
    );
    process.exit(1);
  }
}

async function seedDatabase() {
  console.log("Starting database seeding...");
  await deleteAllDocuments();
  await seedDocuments();
  console.log("Database seeding completed.");
}

seedDatabase();
