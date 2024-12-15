import { Link, LinkType } from "../utils/interfaces";
import { baseURL } from "./API";

/**
 * Retrieves all links related to the document
 * specified with the documentId parameter
 * @param documentId
 * @returns
 */
async function getLinks(documentId: number): Promise<Link[]> {
  const response = await fetch(baseURL + `/documents/${documentId}/links`);
  if (!response.ok) {
    throw new Error(`Failed to GET /documents/${documentId}/links`);
  }
  const links = await response.json();
  return links as Link[];
}

/**
 * The list of types REPLACES the old ones!
 * @param linkTypes all the types of links between the two documents
 * @returns
 */
async function putLink(
  sourceDocumentId: number,
  targetDocumentId: number,
  linkTypes: LinkType[],
): Promise<void> {
  const response = await fetch(
    baseURL + `/documents/${sourceDocumentId}/links`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ targetDocumentId, linkTypes }),
    },
  );
  if (!response.ok) {
    throw new Error(
      `Failed to PUT /documents/${sourceDocumentId}/links with target ${targetDocumentId}`,
    );
  }
}

/**
 * Deletes all the types of link between
 * the two documents
 */
async function deleteLink(
  sourceDocumentId: number,
  targetDocumentId: number,
): Promise<void> {
  const relativeURL = `/documents/${sourceDocumentId}/links/?targetDocumentId=${targetDocumentId}`;
  const response = await fetch(baseURL + relativeURL, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to DELETE ${relativeURL}`);
  }
}

export const linkAPI = {
  getLinks,
  putLink,
  deleteLink,
};
