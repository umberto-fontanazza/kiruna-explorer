import cors from "cors";
import express from "express";
import { StatusCodes } from "http-status-codes";
import morgan from "morgan";
import { documentRouter } from "./router/documentRouter";

const app = express();

// Middlewares
app.use(express.json());
app.use(morgan("dev"));

const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: StatusCodes.ACCEPTED,
  credentials: true,
};
app.use(cors(corsOptions));

// Routes

app.use("/documents", documentRouter);

export default app;
