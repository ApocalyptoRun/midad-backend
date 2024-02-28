import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";

import { router as authRouter } from "./routes/authRoute.js";
import { router as testRouter } from "./routes/testingRoute.js";
import { router as userRouter } from "./routes/userRoute.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/test", testRouter);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("The database is connected !");
    app.listen(process.env.PORT, () => {
      console.log(`The app is running on port : ${process.env.PORT}`);
    });
  })
  .catch((error) => console.log(error));
