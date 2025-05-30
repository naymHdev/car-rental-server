import express, { Request, Response } from "express";
import cors from "cors";
import router from "./router";
import helmet from "helmet";
import config from "./app/config";
import cookieParser from "cookie-parser";
import notFound from "./middleware/notFound";
import globalErrorHandler from "./middleware/globalErrorHandler";
import rateLimit from "express-rate-limit";

const app = express();

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: false,
    message: "Too many requests, please try again later",
  },
});

app.use(helmet());

app.use("/api", rateLimiter);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.NODE_ENV === "production" ? config.domain! : "*",
  })
);

app.use("/src/uploads", express.static("src/uploads"));

app.get("/", (req: Request, res: Response) => {
  res.send({
    status: true,
    message: "Welcome To Setup Template",
  });
});

app.use("/api/v1", router);

app.use(notFound);

app.use(globalErrorHandler);

export default app;
