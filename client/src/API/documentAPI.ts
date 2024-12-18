import { Document, Filters } from "../utils/interfaces";
import { baseURL } from "./API";

async function getDocuments(filters?: Filters): Promise<Document[]> {
  const params = new URLSearchParams();
  if (filters) {
    if (filters.type) params.append("type", filters.type);
    if (filters.scaleType) params.append("scaleType", filters.scaleType);
    if (filters.maxIssuanceDate)
      params.append(
        "maxIssuanceDate",
        filters.maxIssuanceDate.format("YYYY-MM-DD"),
      );
    if (filters.minIssuanceDate)
      params.append(
        "minIssuanceDate",
        filters.minIssuanceDate.format("YYYY-MM-DD"),
      );
  }

  const response = await fetch(`${baseURL}/documents?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Error in fetching documents");
  }
  const documents = await response.json();
  return documents.map((doc: any) => ({
    ...doc,
    issuanceTime: doc.issuanceTime
      ? doc.issuanceTime.replace(/-/g, "/")
      : undefined,
  }));
}

async function getDocumentById(id: number): Promise<Document> {
  const response = await fetch(baseURL + `/documents/${id}`);
  if (!response.ok) {
    throw new Error("Error in fetching document by id");
  }
  const document = await response.json();
  return {
    ...document,
    issuanceTime: document.issuanceTime
      ? document.issuanceTime.replace(/-/g, "/")
      : undefined,
  };
}

/**
 * @param document
 * @returns id of the document just added
 */
async function addDocument(document: Omit<Document, "id">): Promise<number> {
  if (document.coordinates && document.area) {
    throw new Error(
      "Only one of 'coordinates' or 'area' must be provided, not both.",
    );
  }
  const requestBody = {
    ...document,
    id: undefined,
    issuanceTime: document.issuanceTime?.replace(/\//g, "-"),
    links: undefined,
  };
  const response = await fetch(baseURL + `/documents`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });
  if (!response.ok) {
    throw new Error("Error creating document");
  }
  const { id } = await response.json();
  return id;
}

async function updateDocument(document: Document): Promise<void> {
  if (document.coordinates && document.area) {
    throw new Error(
      "Only one of 'coordinates' or 'area' must be provided, not both.",
    );
  }
  const requestBody = {
    ...document,
    id: undefined,
    issuanceTime: document.issuanceTime?.replace(/\//g, "-"),
    links: undefined,
  };
  console.log(requestBody);
  const response = await fetch(baseURL + `/documents/${document.id}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });
  if (!response.ok) {
    throw new Error(`Error requesting PATCH /documents/${document.id}`);
  }
}

async function deleteDocument(id: number): Promise<void> {
  const response = await fetch(baseURL + `/documents/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Something went wrong deleting the Document");
  }
}

export const documentAPI = {
  getDocuments,
  getDocumentById,
  addDocument,
  updateDocument,
  deleteDocument,
};
