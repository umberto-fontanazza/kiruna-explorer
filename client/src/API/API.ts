import { Document, LinkType } from "../utils/interfaces";
import dayjs from "dayjs";
import { User } from "../utils/interfaces";

const baseURL = "http://localhost:3000";
const postmanURL = "https://6b963377-644f-4e74-a4b3-4c8a83295bbb.mock.pstmn.io";

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
    const response = await fetch(postmanURL + "/documents");
    if (response.ok) {
      const documents = await response.json();
      const docsMapped = documents.map((doc: any) => {
        return {
          id: doc.id,
          title: doc.title,
          description: doc.description,
          stakeholders: doc.stakeholders,
          scale: doc.scale,
          issuanceDate: dayjs(doc.issuanceDate),
          type: doc.type,
          connections: doc.connections,
          coordinates: doc.coordinates,
        };
      });
      return docsMapped;
    }
  } catch (err) {
    console.error(err);
  }
  /*
  return [    
    {
      id: 5,
      title: "Adjusted development plan (47)",
      description:
        "This document is the update of the Development Plan, one year after its creation, modifications are made to the general master plan, which is published under the name 'Adjusted Development Plan91,' and still represents the version used today after 10 years. Certainly, there are no drastic differences compared to the previous plan, but upon careful comparison, several modified elements stand out. For example, the central square now takes its final shape, as well as the large school complex just north of it, which appears for the first time",
      stakeholders: ["lkab", "kiruna_kommun"],
      scale: "1:7.500",
      issuanceDate: new Date("2015"),
      type: DocumentType.Design,
      connections: [
        { targetDocumentId: 3, type: [LinkType.Direct] },
        { targetDocumentId: 5, type: [LinkType.Collateral] },
        { targetDocumentId: 6, type: [LinkType.Collateral] },
        { targetDocumentId: 7, type: [LinkType.Collateral] },
        { targetDocumentId: 8, type: [LinkType.Collateral] },
        { targetDocumentId: 9, type: [LinkType.Collateral] },
      ],
      language: "Swedish",
      pages: 1,
      coordinates: { latitude: 67.839, longitude: 20.245 },
    },
    {
      id: 6,
      title: "Detail plan for square and commercial street (50)",
      description:
        "This plan, approved in July 2016, is the first detailed plan to be implemented from the new masterplan (Adjusted development plan). The document defines the entire area near the town hall, comprising a total of 9 blocks known for their density. Among these are the 6 buildings that will face the main square. The functions are mixed, both public and private, with residential being prominent, as well as the possibility of incorporating accommodation facilities such as hotels. For all buildings in this plan, the only height limit is imposed by air traffic.",
      stakeholders: ["lkab", "kiruna_kommun"],
      scale: "1:1,000",
      issuanceDate: new Date("2016/06/22"),
      type: DocumentType.Prescriptive,
      connections: [
        { targetDocumentId: 3, type: [LinkType.Direct] },
        { targetDocumentId: 5, type: [LinkType.Collateral] },
        { targetDocumentId: 6, type: [LinkType.Collateral] },
        { targetDocumentId: 7, type: [LinkType.Collateral] },
        { targetDocumentId: 8, type: [LinkType.Collateral] },
        { targetDocumentId: 9, type: [LinkType.Collateral] },
      ],
      language: "Swedish",
      pages: 43,
      coordinates: { latitude: 67.84, longitude: 20.28 },
    },
  ];*/
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
      // stakeholders: document.stakeholder,
      scale: document.scale,
      // issuanceDate: document.issuanceDate,
      type: document.type,
      // connections: document.connections,
      language: document.language,
      // pages: document.pages,
      coordinates: document.coordinates,
    }),
  });
  if (response.ok) {
    const { id } = await response.json();
    //assert(typeof id === "number");
    console.log("Document created with id: ", id);
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
