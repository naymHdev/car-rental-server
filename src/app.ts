import express, { Request, Response } from "express";
import cors from "cors";
import router from "./router";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import notFound from "./middleware/notFound";
import globalErrorHandler from "./middleware/globalErrorHandler";
import { createServer } from "http";
import { socketio } from "./app/config/socketio.config";
import path from "path";

const app = express();
const allowedOrigins = ["http://10.10.10.78:3001", "http://10.10.10.78:3000"];

export const httpServer = createServer(app);
socketio(httpServer);

// const rateLimiter = rateLimit({
//   windowMs: 15 * 60 * 10000,
//   max: 1000,
//   standardHeaders: true,
//   legacyHeaders: false,
//   message: {
//     status: false,
//     message: "Too many requests, please try again later",
//   },
// });

app.use(express.static(path.resolve(__dirname, "../public/test.html")));

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "http://localhost:8000"],
      },
    },
  })
);
app.use("/api", router);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

app.use("/src/uploads", express.static("./src/uploads"));

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, "../public/test.html"));
});
// app.get("/", (req: Request, res: Response) => {
//   res.send({
//     status: true,
//     message: "Welcome to this Car rental website",
//   });
// });

app.use("/api/v1", router);

app.use(notFound);

app.use(globalErrorHandler);

export default app;
