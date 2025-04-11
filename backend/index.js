import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./db/connectDB.js";
import chalk from "chalk";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import instructorRoutes from "./routes/instructor.routes.js";
import { verifyToken } from "./middleware/verifyToken.js";
import isAdmin from "./middleware/isAdmin.js";
import isInstructor from "./middleware/isInstructor.js";
import http from "http";

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json()); // allows us to parse incoming requests:req.body

app.use("/api", userRoutes);
app.use("/api/admin", verifyToken, isAdmin, adminRoutes);
app.use("/api/instructor", verifyToken, isInstructor, instructorRoutes);

// Start server
server.listen(PORT, () => {
  connectDB();
  console.log(
    chalk.green("✓") +
      chalk.cyan("Server is running on port: ") +
      chalk.yellow(PORT)
  );
});
