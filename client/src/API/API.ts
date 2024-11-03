import { Document } from "../utils/interfaces";

const baseURL = "http://localhost:5173";

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
  // try{
  //   const response = await fetch(baseURL + "/documents");
  //   if(response.ok){
  //     const documents = await response.json();
  //     return documents;
  //   }
  // }catch(err){
  //   console.error(err);
  // }

  return [
    {
      id: 1,
      title:
        "Compilation of responses “So what the people of Kiruna think?” (15)",
      description:
        "This document is a compilation of the responses to the survey 'What is your impression of Kiruna?' ...",
      stakeholder: [""],
      scale: "",
      issuanceDate: null,
      type: "",
      connections: [
        { targetDocumentId: 3, type: ["Direct"] },
        { targetDocumentId: 5, type: ["Indirect"] },
      ],
      language: "",
      pages: null,
      coordinates: { latitude: 67.8557, longitude: 20.2255 },
    },
    {
      id: 2,
      title: "Detail plan for Bolagsomradet Gruvstadspark (18)",
      description:
        "This is the first of 8 detailed plans located in the old center of Kiruna ...",
      stakeholder: ["LKAB", "Kiruna Municipality"],
      scale: "1:23",
      issuanceDate: null,
      type: "qualcosa",
      connections: [
        { targetDocumentId: 3, type: ["Direct"] },
        { targetDocumentId: 5, type: ["Indirect"] },
      ],
      language: "Sweden",
      pages: 3,
      coordinates: { latitude: 67.855, longitude: 20.2223 },
    },
    {
      id: 3,
      title: "Development Plan (41)",
      description: "The development plan shapes the form of the new city ...",
      stakeholder: [""],
      scale: "",
      issuanceDate: null,
      type: "",
      connections: [
        { targetDocumentId: 3, type: ["Direct"] },
        { targetDocumentId: 5, type: ["Indirect"] },
      ],
      language: "",
      pages: null,
      coordinates: { latitude: 67.8545, longitude: 20.2271 },
    },
    {
      id: 4,
      title: "Deformation forecast (45)",
      description: "The development plan shapes the form of the new city ...",
      stakeholder: [""],
      scale: "",
      issuanceDate: null,
      type: "",
      connections: [
        { targetDocumentId: 3, type: ["Direct"] },
        { targetDocumentId: 5, type: ["Indirect"] },
      ],
      language: "",
      pages: null,
      coordinates: { latitude: 67.8558, longitude: 20.2265 },
    },
  ];
}

async function postDocument(id: number, title: string, description: string) {
  try {
    const response = await fetch(baseURL + `/documents/${id}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description }),
    });
    if (response.ok) {
      return true;
    }
  } catch (err) {
    console.error(err);
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

async function putLink(targetDocumentId: number, linkType: string, id: number) {
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
