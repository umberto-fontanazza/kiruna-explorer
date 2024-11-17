import { Document, LinkType } from "../utils/interfaces";
import dayjs from "dayjs";
import { User } from "../utils/interfaces";
import { documentAPI } from "./documentAPI";

export const baseURL = "http://localhost:3000";

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
  ...documentAPI,
  getLinks,
  putLink,
  deleteLink,
};

export default API;
