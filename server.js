import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { setupSockets } from "./sockets.js";
import swaggerDocs from "./utils/swagger.js";

import { router as authRouter } from "./routes/authRoute.js";
import { router as userRouter } from "./routes/userRoute.js";
import { router as messageRouter } from "./routes/messageRoute.js";
import { error } from "console";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/message", messageRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

var db = await mongoose.connect(process.env.MONGODB_URL);

db.connection.on("error", () => {
  console.log("MongoDB connection error:", error)
});

if (mongoose.connection.readyState === 1) {
  console.log('Database is connected.');
} else {
  console.log('Database is not connected.');
}

const server = app.listen(process.env.PORT, () => {
  console.log(`The app is running on port : ${process.env.PORT}`);

  //swaggerDocs(app, process.env.PORT);
});
