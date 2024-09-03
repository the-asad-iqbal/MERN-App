import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { connectDB } from "./config/db.js";

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

connectDB();

app.listen(process.env.PORT, () => {
   console.log(`Server running on port ${process.env.PORT}`);
});
