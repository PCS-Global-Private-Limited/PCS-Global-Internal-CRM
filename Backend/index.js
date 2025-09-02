import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./src/routes/user.route.js";
import profileRouter from "./src/routes/profile.route.js";
import cookieParser from "cookie-parser";
import taskRouter from "./src/routes/task.route.js";
import attendenceRouter from "./src/routes/attendence.route.js";
import requestTeamMemberRouter from "./src/routes/requestTeamMember.route.js";

dotenv.config({ path: ".env" });

// Verify environment variables are loaded
console.log("Environment Variables Status:", {
  port: !!process.env.PORT,
  mongoUrl: !!process.env.MONGO_URL,
  cloudinaryName: !!process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryKey: !!process.env.CLOUDINARY_API_KEY,
  cloudinarySecret: !!process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 5080;
const MONGO = process.env.MONGO_URL;
const frontEndUrl = process.env.frontend_url;

// Middleware
// Configure body parser first with increased limits
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cookieParser());

// CORS configuration
app.use(
  cors({
    origin: true, // Allow any origin temporarily for testing
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["set-cookie"],
  })
);

// Routes
app.use("/api", userRouter);
app.use("/api/user", profileRouter);
// app.use('/api/user', taskRouter);
app.use("/api/task", taskRouter);
app.use("/api/attendance", attendenceRouter);
app.use("/api", requestTeamMemberRouter);
app.use(cookieParser());

// Database connection
mongoose
  .connect(MONGO)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("PCS Global Internal CRM API is running");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
