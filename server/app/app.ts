import express from "express";
import cors from "cors";
import userRoutes from "./modules/Auth/router/auth.router.js";
import jobRoutes from "./modules/JobApplication/router/job-application.router.js";

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  "https://job-application-tracker-sigma-three-39.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.some((o) => origin.startsWith(o))) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-user-id"],
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Job Application Tracker API Server Running" });
});

app.get("/api", (req, res) => {
  res.json({ message: "Job Application Tracker API v2" });
});

app.use("/api/auth", userRoutes);
app.use("/api/applications", jobRoutes);

export default app;
