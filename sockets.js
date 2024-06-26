import { Server } from "socket.io";

export const setupSockets = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3030",
      credentials: true,
    },
  });

  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    /**
     * @swagger
     * 'add-user':
     *   post:
     *     tags:
     *       - Socket
     *     summary: When ever the app is open in a new phone or window add his socket and id in map called online Users.
     *     responses:
     *       200:
     *         description: Success !
     *     security:
     *       - bearerAuth: []
     */
    socket.on("add-user", (userId) => {
      onlineUsers.set(userId, socket.id);
    });

    /**
     * @swagger
     * 'typing':
     *   post:
     *     tags:
     *       - Socket
     *     summary: send boolean isTyping swicth a user is typing or not.
     *     responses:
     *       200:
     *         description: Success !
     *     security:
     *       - bearerAuth: []
     */
    socket.on("typing", (data) => {
      if (onlineUsers.has(data.recipientId)) {
        const recipientSocketId = onlineUsers.get(data.recipientId);
        socket.to(recipientSocketId).emit("typing", {
          senderId: data.senderId,
          isTyping: data.isTyping,
        });
      } else {
        console.log("Recipient not found in onlineUsers map");
      }
    });

    /**
     * @swagger
     * 'send-msg':
     *   post:
     *     tags:
     *       - Socket
     *     summary: send a message to a given user .
     *     responses:
     *       200:
     *         description: Success !
     *     security:
     *       - bearerAuth: []
     */
    socket.on("send-msg", (data) => {
      const sendUserSocket = onlineUsers.get(data.recepientId);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-receive", data);
      }
    });
  });
};
