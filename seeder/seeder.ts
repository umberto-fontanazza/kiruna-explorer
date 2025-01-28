import { newDocuments } from "./data";
import { Database } from "./database";

async function clearAutoincrementIds() {
  await Database.query("ALTER SEQUENCE document_id_seq RESTART WITH 1");
  await Database.query("ALTER SEQUENCE area_id_seq RESTART WITH 1");
  await Database.query("ALTER SEQUENCE polygon_id_seq RESTART WITH 1");
}

async function loginAsPlanner() {
  try {
    const response = await fetch("http://localhost:3000/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "se2.group15@gmail.com",
        password: "password",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to log in");
    }

    const cookies = response.headers.get("set-cookie");
    const sessionCookie = cookies?.split(";")[0] || "";

    if (!sessionCookie) {
      throw new Error("Session cookie not found");
    }

    return sessionCookie;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
}

async function clearDatabase() {
  try {
    const plannerCookie = await loginAsPlanner();

    // Step 1: Get all documents
    const response = await fetch("http://localhost:3000/documents/", {
      method: "GET",
      headers: {
        Cookie: plannerCookie,
      },
    });

    if (!response.ok) {
      console.error("Failed to retrieve documents.");
      return;
    }

    const documents: any[] = await response.json(); // Assuming the response contains an array of documents
    console.log(`Retrieved ${documents.length} documents.`);

    // Step 2: Delete each document by ID
    for (const doc of documents) {
      const deleteResponse = await fetch(
        `http://localhost:3000/documents/${doc.id}`,
        {
          method: "DELETE",
          headers: {
            Cookie: plannerCookie,
          },
        }
      );

      if (!deleteResponse.ok) {
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

async function populateDatabase() {
  try {
    const plannerCookie = await loginAsPlanner();

    // Loop over the documents and send a POST request for each one
    for (const document of newDocuments) {
      const response = await fetch("http://localhost:3000/documents/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: plannerCookie,
        },
        body: JSON.stringify(document), // Send the document object to the API
      });

      if (!response.ok) {
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
  await clearAutoincrementIds();
  await clearDatabase();
  await populateDatabase();
})();
