import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./src/db/index.js";

dotenv.config({ path: ".env" });

const app = express();
const PORT = process.env.PORT || 8080;



app.use(
  cors({
    origin: "http://localhost:5173", // Change this to your frontend URL
    credentials: true,
  })
);

 
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(cookieParser());

/// import routes
import serviceRouter from "./src/routes/service.routes.js";
import courseRouter from "./src/routes/course.routes.js";
import teamRouter from "./src/routes/team.routes.js";
import blogRouter from "./src/routes/blog.routes.js";
import authRouter from "./src/routes/auth.routes.js";

import studentRouter from "./src/routes/student.routes.js";
import testimonialRouter from "./src/routes/testimonials.routes.js";
import expenseRouter from "./src/routes/expense.routes.js";
import jobRouter from "./src/routes/job.routes.js";
import galleryRouter from './src/routes/gallery.routes.js'
import aboutRouter from './src/routes/about.routes.js'

// Route Setup  User API
app.use("/api/v1", serviceRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/team", teamRouter);
app.use("/api/v1/blog", blogRouter);
app.use("/api/auth", authRouter);
app.use("/api/students", studentRouter);
app.use("/api/v1/job", jobRouter);

app.use("/api/v1/testimonials", testimonialRouter);
app.use("/api/v1/expense", expenseRouter);
app.use("/api/v1/gallery", galleryRouter);
app.use("/api/v1/about", aboutRouter);

app.get("/", (req, res) => {
  res.send("Welcome to our API");
});

// Database connection  servic manage
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB Connection Failed:", err.message);
    process.exit(1);
  });
