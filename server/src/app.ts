import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import { StatusCodes } from "http-status-codes";
import morgan from "morgan";
import { documentRouter } from "./router/documentRouter";
import passportInitializer from "./passport-config";
import passport from "passport";
import session from "express-session";
import { userRouter } from "./router/userRouter";
import { sessionRouter } from "./router/sessionRouter";
import { errorHandling } from "./middleware/auth";

dotenv.config();

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

app.use("/document", documentRouter);
app.use("/users", userRouter);
app.use("/sessions", sessionRouter);

// Error handler middleware. Do not move
app.use(errorHandling);

export default app;
