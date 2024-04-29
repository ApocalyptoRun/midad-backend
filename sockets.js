import { Server } from "socket.io";

export const setupSockets = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:8887",
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

    socket.on("join", (roomName) => {
      var rooms = io.sockets.adapter.rooms;
      var room = rooms.get(roomName);

      if (room == undefined) {
        socket.join(roomName);
        socket.emit("created");
      } else if (room.size === 1) {
        socket.join(roomName);
        socket.emit("joined");
      } else {
        socket.emit("full");
      }
      console.log(rooms);
    });

    socket.on("ready", (roomName) => {
      console.log("ready");
      socket.broadcast.to(roomName).emit("ready");
    });

    socket.on("candidate", (candidate, roomName) => {
      console.log("candidate");
      socket.broadcast.to(roomName).emit("candidate", candidate);
    });

    socket.on("offer", (offer, roomName) => {
      console.log("offer");
      socket.broadcast.to(roomName).emit("offer", offer);
    });

    socket.on("answer", (answer, roomName) => {
      console.log("answer");
      socket.broadcast.to(roomName).emit("answer", answer);
    });
  });
};
