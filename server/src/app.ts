import cors from "cors";
import express from "express";
import { StatusCodes } from "http-status-codes";
import morgan from "morgan";
import { documentRouter } from "./router/documentRouter";
import passportInizializer from "./passport-config";
import passport from "passport";
import session from "express-session";
import { userRouter } from "./router/userRouter";

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

passportInizializer(passport);

app.use(
  session({
    secret: "group15",
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.authenticate("session"));

// Routes

app.use("document", documentRouter);
app.use("/users", userRouter);

export default app;
