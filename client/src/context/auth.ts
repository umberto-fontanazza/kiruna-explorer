import { createContext } from "react";
import { User } from "../utils/interfaces";

export const authContext = createContext({
  user: null as User | null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  login: async (_email: string, _password: string) => {
    console.error("App.tsx: provide login to authContext");
  },
  logout: async () => {
    console.error("App.tsx: provide logout function to authContext");
  },
});
