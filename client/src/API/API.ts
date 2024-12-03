import { authAPI } from "./authAPI";
import { documentAPI } from "./documentAPI";
import { linkAPI } from "./linkAPI";
import { uploadAPI } from "./uploadsAPI";

export const baseURL = "http://localhost:3000";

const API = {
  ...authAPI,
  ...documentAPI,
  ...linkAPI,
  ...uploadAPI,
};

export default API;
