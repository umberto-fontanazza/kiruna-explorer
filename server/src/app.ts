import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import session from "express-session";
import { StatusCodes } from "http-status-codes";
import morgan from "morgan";
import passport from "passport";
import { sinkErrorHandler } from "./middleware/error";
import { locals } from "./middleware/locals";
import passportInitializer from "./passport-config";
import { documentRouter } from "./router/documentRouter";
import { sessionRouter } from "./router/sessionRouter";
import { uploadRouter } from "./router/uploadRouter";
import { userRouter } from "./router/userRouter";

dotenv.config();

const app = express();

// Middlewares
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: StatusCodes.ACCEPTED,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(locals);

passportInitializer(passport);

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.authenticate("session"));

// Routes

app.use("/documents", documentRouter);
app.use("/users", userRouter);
app.use("/sessions", sessionRouter);
app.use("/uploads", uploadRouter);

// Error handler middleware. Do not move
app.use(sinkErrorHandler);

export default app;
