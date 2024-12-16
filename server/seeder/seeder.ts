import request from "supertest";
import app from "../src/app"; // Ensure your app path is correct
import { DocumentType } from "../src/model/document"; // Make sure paths are correct
import { ScaleType } from "../src/model/scale"; // Make sure paths are correct
import { Stakeholder } from "../src/model/stakeholder"; // Make sure paths are correct
import { loginAsPlanner } from "../test/utils";

// Funzione per svuotare il database
async function clearDatabase() {
  try {
    const plannerCookie = await loginAsPlanner();

    // Step 1: Get all documents
    const response = await request(app)
      .get("/documents/") // Adjust the endpoint to fetch all documents
      .set("Cookie", plannerCookie); // Add necessary authentication cookies

    if (response.status !== 200) {
      console.error("Failed to retrieve documents.");
      return;
    }

    const documents: any[] = response.body; // Assuming the response contains an array of documents
    console.log(`Retrieved ${documents.length} documents.`);

    // Step 2: Delete each document by ID
    for (const doc of documents) {
      const deleteResponse = await request(app)
        .delete(`/documents/${doc.id}`) // Delete document by ID
        .set("Cookie", plannerCookie); // Ensure you set the cookie for authentication

      if (deleteResponse.status !== 200) {
        console.error(`Failed to delete document with ID: ${doc.id}`);
      } else {
        console.log(`Deleted document with ID: ${doc.id}`);
      }
    }

    console.log("Database cleared successfully.");
  } catch (error) {
    console.error("Error clearing the database:", error);
  }
}

// Funzione per popolare il database con nuovi documenti
async function populateDatabase() {
  try {
    const plannerCookie = await loginAsPlanner();

    const newDocuments = [
      {
        title: "Urban Development Plan",
        description: "A detailed design for the expansion of central Kiruna.",
        issuanceTime: "2024-11",
        type: DocumentType.Design,
        stakeholders: [Stakeholder.WhiteArkitekter],
        scale: { type: ScaleType.BlueprintsOrEffect },
        coordinates: { latitude: 67.8558, longitude: 20.2253 },
      },
      {
        title: "Mining Impact Study",
        description:
          "Technical analysis of mining effects on surrounding areas.",
        issuanceTime: "2023",
        type: DocumentType.MaterialEffect,
        stakeholders: [Stakeholder.Lkab],
        scale: { type: ScaleType.BlueprintsOrEffect },
        area: {
          include: [
            { latitude: 67.856, longitude: 20.225 },
            { latitude: 67.8565, longitude: 20.226 },
            { latitude: 67.8555, longitude: 20.2265 },
            { latitude: 67.855, longitude: 20.2255 },
          ],
          exclude: [],
        },
      },
      {
        title: "Public Transportation Proposal",
        description: "Suggestions for sustainable transport options in Kiruna.",
        issuanceTime: "2022-05",
        type: DocumentType.Informative,
        stakeholders: [Stakeholder.KirunaKommun],
        scale: { type: ScaleType.BlueprintsOrEffect },
        coordinates: { latitude: 67.8551, longitude: 20.2233 },
      },
      {
        title: "Cultural Heritage Preservation",
        description:
          "Prescriptive measures for preserving Kiruna's cultural sites.",
        issuanceTime: "2023-08",
        type: DocumentType.Prescriptive,
        stakeholders: [Stakeholder.Residents],
        scale: { type: ScaleType.BlueprintsOrEffect },
        area: {
          include: [
            { latitude: 67.857, longitude: 20.2225 },
            { latitude: 67.859, longitude: 20.2255 },
            { latitude: 67.856, longitude: 20.2255 },
          ],
          exclude: [],
        },
      },
      {
        title: "New School Construction",
        description: "Plans for the construction of a new school building.",
        issuanceTime: "2024-01",
        type: DocumentType.Technical,
        stakeholders: [Stakeholder.KirunaKommun],
        scale: { type: ScaleType.BlueprintsOrEffect },
        coordinates: { latitude: 67.8567, longitude: 20.2244 },
      },
      {
        title: "Energy Efficiency Standards",
        description:
          "Technical guidelines for improving energy usage in buildings.",
        issuanceTime: "2021",
        type: DocumentType.Technical,
        stakeholders: [Stakeholder.Others],
        scale: { type: ScaleType.BlueprintsOrEffect },
        area: {
          include: [
            { latitude: 67.857, longitude: 20.2225 },
            { latitude: 67.859, longitude: 20.2255 },
            { latitude: 67.856, longitude: 20.2255 },
          ],
          exclude: [],
        },
      },
      {
        title: "Tourism Strategy Report",
        description: "Informative study to boost tourism in Kiruna.",
        issuanceTime: "2022",
        type: DocumentType.Informative,
        stakeholders: [Stakeholder.KirunaKommun],
        scale: { type: ScaleType.BlueprintsOrEffect },
        coordinates: { latitude: 67.8539, longitude: 20.227 },
      },
      {
        title: "Safety Regulations Update",
        description: "New safety rules for underground mining operations.",
        issuanceTime: "2023-12",
        type: DocumentType.Prescriptive,
        stakeholders: [Stakeholder.Lkab],
        scale: { type: ScaleType.BlueprintsOrEffect },
        coordinates: { latitude: 67.8545, longitude: 20.2285 },
      },
      {
        title: "Urban Relocation Plan",
        description: "Guidelines for moving parts of the city due to mining.",
        issuanceTime: "2024-06",
        type: DocumentType.Design,
        stakeholders: [Stakeholder.WhiteArkitekter],
        scale: { type: ScaleType.BlueprintsOrEffect },
        area: {
          include: [
            { latitude: 67.757, longitude: 20.1225 },
            { latitude: 67.8599, longitude: 20.1285 },
            { latitude: 67.8597, longitude: 20.1287 },
          ],
          exclude: [],
        },
      },
      {
        title: "Environmental Impact Analysis",
        description: "Analysis of environmental changes in the region.",
        issuanceTime: "2020-09",
        type: DocumentType.MaterialEffect,
        stakeholders: [Stakeholder.Others],
        scale: { type: ScaleType.Concept },
        coordinates: { latitude: 67.8525, longitude: 20.2295 },
      },
    ];

    // Loop over the documents and send a POST request for each one
    for (const document of newDocuments) {
      const response = await request(app)
        .post("/documents/") // Adjust the endpoint as needed
        .set("Cookie", plannerCookie) // Ensure to add the cookie for authentication
        .send(document); // Send the document object to the API

      if (response.status !== 201) {
        console.error(`Failed to add document: ${document.title}`);
      } else {
        console.log(`Document added: ${document.title}`);
      }
    }

    console.log("Database populated with new documents successfully.");
  } catch (error) {
    console.error("Error populating the database:", error);
  }
}

(async function main() {
  await clearDatabase(); // Clear the database before populating it
  await populateDatabase(); // Populate the database with new documents
})();
