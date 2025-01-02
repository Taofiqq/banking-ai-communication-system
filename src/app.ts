import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { supabase } from "./config/database";
import pino from "pino";

dotenv.config();

const app = express();

const loggingMiddleware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  logger.info(`${req.method} ${req.url}`);
  next();
};

const logger = pino();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(loggingMiddleware);

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    mesage: "Server is Running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/test-db", async (req, res) => {
  try {
    const { data, error } = await supabase.auth.getSession();
    res.json({
      status: "ok",
      message: "Server is running",
      dbConnection: error ? "failed" : "success",
    });
  } catch (error: unknown) {
    let responseData;
    if (error instanceof Error) {
      responseData = {
        status: "error",
        message: error.message,
      };
    } else {
      responseData = {
        status: "error",
        message: "An unexpected error occurred",
        error: error,
      };
    }
    res.status(500).json(responseData);
  }
});

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export default app;

//    // "start": "node build/app.ts",
