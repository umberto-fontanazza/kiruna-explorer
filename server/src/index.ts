import app from "./app";
import * as dotenv from "dotenv";

dotenv.config();

export const server = app.listen(
  process.env.PORT ? parseInt(process.env.PORT) : 3000,
  () => {},
);
