import { pathToFileURL } from "node:url";

import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import etlRoutes from "./routes/etlRoutes.js";
import hrRoutes from "./routes/hrRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import trainingRoutes from "./routes/trainingRoutes.js";
import practiceLabRoutes from "./routes/practiceLabRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import notFound from "./middleware/notFound.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Northpoint API is running" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/etl", etlRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/hr", hrRoutes);
app.use("/api/training", trainingRoutes);
app.use("/api/training/practice", practiceLabRoutes);

app.use(notFound);
app.use(errorHandler);

export const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  startServer().catch((error) => {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  });
}

export default app;
