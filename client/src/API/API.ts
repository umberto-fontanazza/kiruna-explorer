import { authAPI } from "./authAPI";
import { documentAPI } from "./documentAPI";
import { linkAPI } from "./linkAPI";

export const baseURL = "http://localhost:3000";

const API = {
  ...authAPI,
  ...documentAPI,
  ...linkAPI,
};

export default API;
