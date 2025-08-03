import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoutes.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: process.env.CORS_URL,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

connectDB();

app.use("/v1", authRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server Running on port ${PORT}`));
