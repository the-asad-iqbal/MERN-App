import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
   cors({
      origin: ["http://localhost:5173"],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
   })
);

app.use("/api/v1/user", userRoutes);

app.listen(process.env.PORT, () => {
   connectDB();
   console.log(`[Server]: Running, http://localhost:${process.env.PORT}`);
});
