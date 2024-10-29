import app from "./app";
import * as dotenv from "dotenv";
import { documentRouter } from "./router/documentRouter";

dotenv.config();

app.use("/documents", documentRouter);

export const server = app.listen(
  process.env.PORT ? parseInt(process.env.PORT) : 3000,
  () => {},
);
