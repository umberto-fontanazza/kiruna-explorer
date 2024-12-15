const axios = require("axios");

const BASE_URL = "http://localhost:3000";
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
const LATITUDE_RANGE = [67.8, 68.0];
const LONGITUDE_RANGE = [20.0, 20.5];

/**
 * Generate random coordinates within specific geographic constraints
 */
function generateCoordinates() {
  const latitude = parseFloat(
    (
      Math.random() * (LATITUDE_RANGE[1] - LATITUDE_RANGE[0]) +
      LATITUDE_RANGE[0]
    ).toFixed(6)
  );
  const longitude = parseFloat(
    (
      Math.random() * (LONGITUDE_RANGE[1] - LONGITUDE_RANGE[0]) +
      LONGITUDE_RANGE[0]
    ).toFixed(6)
  );
  return { latitude, longitude };
}

/**
 * Generate an `area` attribute for some documents
 */
function generateArea() {
  const baseLat = parseFloat(
    (
      Math.random() * (LATITUDE_RANGE[1] - LATITUDE_RANGE[0]) +
      LATITUDE_RANGE[0]
    ).toFixed(6)
  );
  const baseLong = parseFloat(
    (
      Math.random() * (LONGITUDE_RANGE[1] - LONGITUDE_RANGE[0]) +
      LONGITUDE_RANGE[0]
    ).toFixed(6)
  );

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

/**
 * Predefined real data for at least 20 documents
 */
const REAL_DOCUMENTS = [
  {
    title: "Kiruna Relocation Master Plan",
    description: "Detailed plan for relocating key areas in Kiruna.",
    type: "informative",
    scale: { type: "ratio", ratio: 8000 },
    stakeholders: ["government"],
    coordinates: { latitude: 67.854, longitude: 20.23 },
    issuanceTime: "2024-01-01T00:00:00Z",
    area: generateArea(),
  },
  {
    title: "Environmental Impact Assessment",
    description: "Assessment of environmental impact due to mining activities.",
    type: "material_effect",
    scale: { type: "ratio", ratio: 12000 },
    stakeholders: ["developers"],
    coordinates: { latitude: 67.856, longitude: 20.228 },
    issuanceTime: "2023-12-15T00:00:00Z",
  },
];

/**
 * Generate random documents with valid data
 */
function generateRandomDocuments(count) {
  const documents = [];

  for (let i = 0; i < count; i++) {
    const coordinates = generateCoordinates();
    documents.push({
      title: `Generated Document ${i + 1}`,
      description: `Randomly generated description for document ${i + 1}.`,
      type: TYPES[Math.floor(Math.random() * TYPES.length)],
      scale: { type: "ratio", ratio: Math.floor(Math.random() * 9000) + 1000 },
      stakeholders: [
        STAKEHOLDERS[Math.floor(Math.random() * STAKEHOLDERS.length)],
      ],
      coordinates,
      issuanceTime: new Date().toISOString(),
      area: Math.random() > 0.5 ? generateArea() : undefined,
    });
  }

  return documents;
}

/**
 * Delete all documents via the server API
 */
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

/**
 * Seed the database with documents via the server API
 */
async function seedDocuments() {
  const documents = [...REAL_DOCUMENTS, ...generateRandomDocuments(30)]; //
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

/**
 * Main function to orchestrate the database seeding
 */
async function seedDatabase() {
  console.log("Starting database seeding...");
  await deleteAllDocuments();
  await seedDocuments();
  console.log("Database seeding completed.");
}

seedDatabase();
