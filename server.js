import express from "express";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { router as authRouter } from "./routes/authRoute.js";
import { router as userRouter } from "./routes/userRoute.js";
import { router as messageRouter } from "./routes/messageRoute.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/message", messageRouter);
app.use("/files", express.static(path.join(__dirname, "files")));

await mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("The database is connected !");
  })
  .catch((error) => console.log(error));

const server = app.listen(process.env.PORT, () => {
  console.log(`The app is running on port : ${process.env.PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:8887",
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.recepientId);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-receive", data);
    }
  });
});
