import dayjs from "dayjs";
import { Document } from "../utils/interfaces";
import { baseURL } from "./API";

async function getDocuments(): Promise<Document[]> {
  const response = await fetch(baseURL + "/documents");
  if (!response.ok) {
    throw new Error("Error in fetching documents");
  }
  const documents = await response.json();
  return documents.map((doc: any) => ({
    ...doc,
    issuanceDate: dayjs(doc.issuanceDate),
  }));
}

async function getDocumentById(id: number): Promise<Document> {
  const response = await fetch(baseURL + `/documents/${id}`);
  if (!response.ok) {
    throw new Error("Error in fetching document by id");
  }
  const documents = await response.json();
  return documents.map((doc: any) => ({
    ...doc,
    issuanceDate: dayjs(doc.issuanceDate),
  }));
}

//TODO: the param document is not actually of type document
//because it musn't have an id or a links field
/**
 * @param document
 * @returns id of the document just added
 */
async function addDocument(document: Document): Promise<number> {
  const responseBody = {
    ...document,
    id: undefined,
    links: undefined,
    issuanceDate: document.issuanceDate?.format("YYYY-MM-DD") || undefined,
  };
  const response = await fetch(baseURL + `/documents`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(responseBody),
  });
  if (!response.ok) {
    throw new Error("Error creating document");
  }
  const { id } = await response.json();
  return id;
}

async function updateDocument(document: Document): Promise<void> {
  const responseBody = {
    ...document,
    id: undefined,
    links: undefined,
    issuanceDate: document.issuanceDate?.format("YYYY-MM-DD") || undefined,
  };
  const response = await fetch(baseURL + `/documents/${document.id}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(responseBody),
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
