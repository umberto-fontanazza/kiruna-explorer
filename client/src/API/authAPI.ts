import { User } from "../utils/interfaces";
import { baseURL } from "./API";

async function getUser(): Promise<User> {
  const response = await fetch(baseURL + "/sessions/current", {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to retrieve session");
  }
  return await response.json();
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

export const authAPI = {
  getUser,
  login,
  logout,
};
