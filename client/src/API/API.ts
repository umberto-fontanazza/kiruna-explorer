import { Document, DocumentType, LinkType } from "../utils/interfaces";
//import { strict as assert } from "assert";

const baseURL = "http://localhost:3000";

async function login(credentials: unknown) {
  const response = await fetch(baseURL + "/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    const err = await response.text();
    throw err;
  }
}

const logout = async () => {
  const response = await fetch(baseURL + "/sessions/current", {
    method: "DELETE",
    credentials: "include",
  });
  if (response.ok) {
    return null;
  }
};

/*************************   DOCUMENTS   *****************************/

async function getDocuments() {
  try {
    const response = await fetch(baseURL + "/documents");
    if (response.ok) {
      const documents = await response.json();
      return documents;
    }
  } catch (err) {
    console.error(err);
  }
  /*
  return [
    {
      id: 1,
      title:
        "Compilation of responses “So what the people of Kiruna think?” (15)",
      description:
        "This document is a compilation of the responses to the survey 'What is your impression of Kiruna?' From the citizens' responses to this last part of the survey, it is evident that certain buildings, such as the Kiruna Church, the Hjalmar Lundbohmsgården, and the Town Hall, are considered of significant value to the population. The municipality views the experience of this survey positively, to the extent that over the years it will propose various consultation opportunities.",
      stakeholder: ["Kiruna kommun", "Residents"],
      scale: "Text",
      issuanceDate: new Date(2007),
      type: DocumentType.Informative,
      connections: [
        { targetDocumentId: 3, type: [LinkType.Direct] },
        { targetDocumentId: 5, type: [LinkType.Direct] },
        { targetDocumentId: 7, type: [LinkType.Direct] },
      ],
      language: "Swedish",
      pages: null,
      coordinates: { latitude: 67.8557, longitude: 20.2235 },
    },
    {
      id: 2,
      title: "Detail plan for Bolagsomradet Gruvstadspark (18)",
      description:
        "This is the first of 8 detailed plans located in the old center of Kiruna, aimed at transforming the residential areas into mining industry zones to allow the demolition of buildings. The area includes the town hall, the Ullspiran district, and the A10 highway, and it will be the first to be dismantled. The plan consists, like all detailed plans, of two documents: the area map that regulates it, and a text explaining the reasons that led to the drafting of the plan with these characteristics. The plan gained legal validity in 2012",
      stakeholder: ["Kiruna Municipality"],
      scale: "1:8.000",
      issuanceDate: new Date("2010-10-20"),
      type: DocumentType.Prescriptive,
      connections: [
        { targetDocumentId: 3, type: [LinkType.Direct] },
        { targetDocumentId: 4, type: [LinkType.Direct] },
        { targetDocumentId: 5, type: [LinkType.Direct] },
        { targetDocumentId: 5, type: [LinkType.Direct] },
        { targetDocumentId: 6, type: [LinkType.Direct] },
        { targetDocumentId: 7, type: [LinkType.Direct] },
        { targetDocumentId: 8, type: [LinkType.Direct] },
        { targetDocumentId: 9, type: [LinkType.Direct] },
      ],
      language: "Sweden",
      pages: 32,
      coordinates: { latitude: 67.87, longitude: 20.2223 },
    },
    {
      id: 3,
      title: "Development Plan (41)",
      description:
        "The development plan shapes the form of the new city The development plan shapes the form of the new city. The document, unlike previous competition documents, is written entirely in Swedish, which reflects the target audience: the citizens of Kiruna. The plan obviously contains many elements of the winning masterplan from the competition, some recommended by the jury, and others that were deemed appropriate to integrate later. The document is divided into four parts, with the third part, spanning 80 pages, describing the shape the new city will take and the strategies to be implemented for its relocation through plans, sections, images, diagrams, and texts. The document also includes numerous studies aimed at demonstrating the future success of the project",
      stakeholder: [" Kiruna kommun", "White Arkitekter"],
      scale: "1:7,500",
      issuanceDate: new Date("2014-03-17"),
      type: DocumentType.Design,
      connections: [
        { targetDocumentId: 3, type: [LinkType.Direct] },
        { targetDocumentId: 4, type: [LinkType.Collateral] },
        { targetDocumentId: 5, type: [LinkType.Collateral] },
        { targetDocumentId: 6, type: [LinkType.Collateral] },
        { targetDocumentId: 7, type: [LinkType.Collateral] },
        { targetDocumentId: 8, type: [LinkType.Collateral] },
        { targetDocumentId: 9, type: [LinkType.Collateral] },
      ],
      language: "Swedish",
      pages: 111,
      coordinates: { latitude: 67.8545, longitude: 20.279 },
    },
    {
      id: 4,
      title: "Deformation forecast (45)",
      description:
        "The development plan shapes the form of the new city. The document, unlike previous competition documents, is written entirely in Swedish, which reflects the target audience: the citizens of Kiruna. The plan obviously contains many elements of the winning masterplan from the competition, some recommended by the jury, and others that were deemed appropriate to integrate later. The document is divided into four parts, with the third part, spanning 80 pages, describing the shape the new city will take and the strategies to be implemented for its relocation through plans, sections, images, diagrams, and texts. The document also includes numerous studies aimed at demonstrating the future success of the project",
      stakeholder: ["LKAB"],
      scale: "1:12,000",
      issuanceDate: new Date("2014-12-01"),
      type: DocumentType.Technical,
      connections: [
        { targetDocumentId: 3, type: [LinkType.Direct] },
        { targetDocumentId: 5, type: [LinkType.Direct] },
      ],
      language: "Swedish",
      pages: 1,
      coordinates: { latitude: 67.8598, longitude: 20.214 },
    },
    {
      id: 5,
      title: "Adjusted development plan (47)",
      description:
        "This document is the update of the Development Plan, one year after its creation, modifications are made to the general master plan, which is published under the name 'Adjusted Development Plan91,' and still represents the version used today after 10 years. Certainly, there are no drastic differences compared to the previous plan, but upon careful comparison, several modified elements stand out. For example, the central square now takes its final shape, as well as the large school complex just north of it, which appears for the first time",
      stakeholder: ["LKAB", "Kiruna kommun"],
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
      stakeholder: ["LKAB", "Kiruna kommun"],
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

async function postDocument(document: Document): Promise<number> {
  const response = await fetch(baseURL + `/documents`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: document.title,
      description: document.description,
      // stakeholder: document.stakeholder,
      // scale: document.scale,
      // issuanceDate: document.issuanceDate,
      // type: document.type,
      // connections: document.connections,
      // language: document.language,
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

async function patchDocument(id: number, title: string, coordinates: string) {
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
  login,
  logout,
  getDocuments,
  postDocument,
  patchDocument,
  deleteDocument,
  getLinks,
  putLink,
  deleteLink,
};

export default API;
