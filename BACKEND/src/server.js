import express from "express";
import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import rateLimiter from "../middleware/rateLimiter.js";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();
const distPath = path.join(__dirname, "../frontend/vite-project/dist");

// ✅ Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);



app.use(express.json());
app.use(rateLimiter);

// ✅ Routes
app.use("/api/notes", notesRoutes);

// ✅ Production setup
if (process.env.NODE_ENV === "production") {
  app.use(express.static(distPath));

  // app.get("/*", (req, res) => {
  //   res.sendFile(path.join(distPath, "index.html"));
  // });

   app.use((req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});
}

// ✅ Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on port:", PORT);
  });
});