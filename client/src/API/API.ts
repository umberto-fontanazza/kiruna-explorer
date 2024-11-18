import { Document, LinkType } from "../utils/interfaces";
import dayjs from "dayjs";
import { User } from "../utils/interfaces";

const baseURL = "http://localhost:3000";

async function getUser(): Promise<User> {
  const response = await fetch(baseURL + "/sessions/current", {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to retrieve session");
  }
  const user = await response.json();
  return user;
}

async function login(email: string, password: string): Promise<User> {
  const response = await fetch(baseURL + "/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });
  if (!response.ok) {
    throw new Error("Failed to authenticate");
  }
  const user = await response.json();
  const { name, surname, role } = user;
  return { email, name, surname, role };
}

const logout = async (): Promise<void> => {
  const response = await fetch(baseURL + "/sessions/current", {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to logout");
  }
};

/*************************   DOCUMENTS   *****************************/

async function getDocuments() {
  try {
    const response = await fetch(baseURL + "/documents");
    if (response.ok) {
      const documents = await response.json();
      const docsMapped = documents.map((doc: any) => ({
        ...doc,
        issuanceDate: dayjs(doc.issuanceDate),
      }));
      return docsMapped;
    }
  } catch (err) {
    console.error(err);
  }
}

async function addDocument(document: Document): Promise<number> {
  const response = await fetch(baseURL + `/documents`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: document.title,
      description: document.description,
      stakeholders: document.stakeholders,
      scale: document.scale,
      issuanceDate: document.issuanceDate,
      type: document.type,
      coordinates: document.coordinates,
    }),
  });
  if (response.ok) {
    const { id } = await response.json();
    return id;
  } else {
    console.error("Error creating document");
    throw new Error("Error creating document");
  }
}

async function updateDocument(id: number, title: string, coordinates: string) {
  // other fields?
  try {
    const response = await fetch(baseURL + `/documents/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, coordinates }),
    });
    if (response.ok) {
      return true;
    }
  } catch (err) {
    console.error(err);
  }
}

async function deleteDocument(id: number) {
  try {
    const response = await fetch(baseURL + `/documents/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Something went wrong deleting the Document");
    }
  } catch (err) {
    console.error(err);
  }
}

/****************************   LINKS   **********************************/

async function getLinks(id: number) {
  try {
    const response = await fetch(baseURL + `/${id}/links`);
    if (response.ok) {
      const links = await response.json();
      return links;
    }
  } catch (err) {
    console.error(err);
  }
}

async function putLink(
  targetDocumentId: number,
  linkType: LinkType[],
  id: number
) {
  try {
    const response = await fetch(baseURL + `/${id}/links`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ targetDocumentId, linkType }),
    });
    if (response.ok) {
      return true;
    }
  } catch (err) {
    console.error(err);
  }
}

async function deleteLink(
  sourceNodeId: number,
  targetNodeId: number,
  linkType: string
) {
  try {
    const response = await fetch(baseURL + `/links`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sourceNodeId, targetNodeId, linkType }),
    });
    if (response.ok) {
      return true;
    }
  } catch (err) {
    console.error(err);
  }
}

const API = {
  getUser,
  login,
  logout,
  getDocuments,
  addDocument,
  updateDocument,
  deleteDocument,
  getLinks,
  putLink,
  deleteLink,
};

export default API;
