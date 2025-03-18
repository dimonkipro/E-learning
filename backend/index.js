import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./db/connectDB.js";

import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import instructorRoutes from "./routes/instructor.routes.js";
import { verifyToken } from "./middleware/verifyToken.js";
import isAdmin from "./middleware/isAdmin.js";
import isInstructor from "./middleware/isInstructor.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// const URL = process.env.CLIENT_URL;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
// app.use(cors({ origin: URL, credentials: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json()); // allows us to parse incoming requests:req.body

app.use("/api", userRoutes);
app.use("/api/admin", verifyToken, isAdmin, adminRoutes);
app.use("/api/instructor", verifyToken, isInstructor, instructorRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log("Server is running on port: ", PORT);
});
