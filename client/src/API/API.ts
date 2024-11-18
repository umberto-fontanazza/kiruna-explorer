import { documentAPI } from "./documentAPI";
import { authAPI } from "./authAPI";
import { linkAPI } from "./linkAPI";

export const baseURL = "http://localhost:3000";

const API = {
  ...authAPI,
  ...documentAPI,
  ...linkAPI,
};

export default API;
