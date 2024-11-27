import * as dotenv from "dotenv";
import app from "./app";

dotenv.config();

export const server = app.listen(
  process.env.PORT ? parseInt(process.env.PORT) : 3000,
  () => {},
);
