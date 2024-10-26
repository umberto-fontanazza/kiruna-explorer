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
  try{
    const response = await fetch(baseURL + "/documents");
    if(response.ok){
      const documents = await response.json();
      return documents;
    }
  }catch(err){
    console.error(err);
  }
}

async function postDocument(id: number, title: string, description: string) {
  try{
    const response = await fetch(baseURL + `/documents/${id}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({title, description}),
    });
    if(response.ok){
      return true;
    }
  }catch(err){
    console.error(err);
  }
}

async function patchDocument(id: number, title: string, coordinates: string) {  // other fields?
  try{
    const response = await fetch(baseURL + `/documents/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({title, coordinates}),
    });
    if(response.ok){
      return true;
    }
  }catch(err){
    console.error(err);
  }
}

async function deleteDocument(id: number) {
  try{
    const response = await fetch(baseURL + `/documents/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if(response.ok){
      return true;
    }
  }catch(err){
    console.error(err);
  }
}


/****************************   LINKS   **********************************/


async function getLinks(id: number) {
  try{
    const response = await fetch(baseURL + `/links/${id}`);
    if(response.ok){
      const links = await response.json();
      return links;
    }
  }catch(err){
    console.error(err);
  }
}

async function putLink(sourceNodeId: number, targetNodeId: number, linkType: string) {
  try{
    const response = await fetch(baseURL + `/links`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({sourceNodeId, targetNodeId, linkType}),
    });
    if(response.ok){
      return true;
    }
  }catch(err){
    console.error(err);
  }
}

async function deleteLink(sourceNodeId: number, targetNodeId: number, linkType: string) {
  try{
    const response = await fetch(baseURL + `/links`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({sourceNodeId, targetNodeId, linkType}),
    });
    if(response.ok){
      return true;
    }
  }catch(err){
    console.error(err);
  }
}



const API = {
  login,
  logout,
  getDocuments, postDocument, patchDocument, deleteDocument,
  getLinks, putLink, deleteLink,
};

export default API;
