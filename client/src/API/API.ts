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
        "This document is a compilation of the responses to the survey 'What is your impression of Kiruna?' From the citizens' responses to this last part of the survey, it is evident that certain buildings, such as the Kiruna Church, the Hjalmar Lundbohmsgården, and the Town Hall, are considered of significant value to the population. The municipality views the experience of this survey positively, to the extent that over the years it will propose various consultation opportunities.",
      stakeholder: "",
      scale: "",
      issuanceDate: null,
      type: "",
      connections: "",
      language: "",
      pages: null,
      coordinates: [{ latitude: 67.8557, longitude: 20.2255 }],
    },
    {
      id: 2,
      title: "Detail plan for Bolagsomradet Gruvstadspark (18)",
      description:
        "This is the first of 8 detailed plans located in the old center of Kiruna, aimed at transforming the residential areas into mining industry zones to allow the demolition of buildings. The area includes the town hall, the Ullspiran district, and the A10 highway, and it will be the first to be dismantled. The plan consists, like all detailed plans, of two documents: the area map that regulates it, and a text explaining the reasons that led to the drafting of the plan with these characteristics. The plan gained legal validity in 2012.",
      stakeholder: "LKAB",
      scale: "1:23",
      issuanceDate: null,
      type: "qualcosa",
      connections: "",
      language: "Sweden",
      pages: 3,
      coordinates: [{ latitude: 67.855, longitude: 20.2223 }],
    },
    {
      id: 3,
      title: "Development Plan (41)",
      description:
        "The development plan shapes the form of the new city. The document, unlike previous competition documents, is written entirely in Swedish, which reflects the target audience: the citizens of Kiruna. The plan obviously contains many elements of the winning masterplan from the competition, some recommended by the jury, and others that were deemed appropriate to integrate later. The document is divided into four parts, with the third part, spanning 80 pages, describing the shape the new city will take and the strategies to be implemented for its relocation through plans, sections, images, diagrams, and texts. The document also includes numerous studies aimed at demonstrating the future success of the project.",
      stakeholder: "",
      scale: "",
      issuanceDate: null,
      type: "",
      connections: "",
      language: "",
      pages: null,
      coordinates: [{ latitude: 67.8545, longitude: 20.2271 }],
    },
    {
      id: 4,
      title: "Deformation forecast (45)",
      description:
        "The development plan shapes the form of the new city. The document, unlike previous competition documents, is written entirely in Swedish, which reflects the target audience: the citizens of Kiruna. The plan obviously contains many elements of the winning masterplan from the competition, some recommended by the jury, and others that were deemed appropriate to integrate later. The document is divided into four parts, with the third part, spanning 80 pages, describing the shape the new city will take and the strategies to be implemented for its relocation through plans, sections, images, diagrams, and texts. The document also includes numerous studies aimed at demonstrating the future success of the project.",
      stakeholder: "",
      scale: "",
      issuanceDate: null,
      type: "",
      connections: "",
      language: "",
      pages: null,
      coordinates: [{ latitude: 67.8558, longitude: 20.2265 }],
    },
    {
      id: 5,
      title: "Adjusted development plan (47)",
      description:
        "This document is the update of the Development Plan, one year after its creation, modifications are made to the general master plan, which is published under the name 'Adjusted Development Plan91,' and still represents the version used today after 10 years. Certainly, there are no drastic differences compared to the previous plan, but upon careful comparison, several modified elements stand out. For example, the central square now takes its final shape, as well as the large school complex just north of it, which appears for the first time.",
      stakeholder: "",
      scale: "",
      issuanceDate: null,
      type: "",
      connections: "",
      language: "",
      pages: null,
      coordinates: [{ latitude: 67.856, longitude: 20.225 }],
    },
    {
      id: 6,
      title: "Document 6",
      description: null,
      stakeholder: "",
      scale: "",
      issuanceDate: null,
      type: "",
      connections: "",
      language: "",
      pages: null,
      coordinates: [{ latitude: 67.857, longitude: 20.228 }],
    },
    {
      id: 7,
      title: "Document 7",
      description: "Description 7",
      stakeholder: "",
      scale: "",
      issuanceDate: null,
      type: "",
      connections: "",
      language: "",
      pages: null,
      coordinates: [{ latitude: 67.858, longitude: 20.229 }],
    },
    {
      id: 8,
      title: "Document 8",
      description: "Description 8",
      stakeholder: "",
      scale: "",
      issuanceDate: null,
      type: "",
      connections: "",
      language: "",
      pages: null,
      coordinates: [{ latitude: 67.859, longitude: 20.23 }],
    },
    {
      id: 9,
      title: "Document 9",
      description: "Description 9",
      stakeholder: "",
      scale: "",
      issuanceDate: null,
      type: "",
      connections: "",
      language: "",
      pages: null,
      coordinates: [{ latitude: 67.86, longitude: 20.231 }],
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
    if (response.ok) {
      return true;
    }
  } catch (err) {
    console.error(err);
  }
}

/****************************   LINKS   **********************************/

async function getLinks(id: number) {
  try {
    const response = await fetch(baseURL + `/links/${id}`);
    if (response.ok) {
      const links = await response.json();
      return links;
    }
  } catch (err) {
    console.error(err);
  }
}

async function putLink(
  sourceNodeId: number,
  targetNodeId: number,
  linkType: string
) {
  try {
    const response = await fetch(baseURL + `/links`, {
      method: "PUT",
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
