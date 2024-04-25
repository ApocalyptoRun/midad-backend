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
    socket.on("add-user", (userId) => {
      onlineUsers.set(userId, socket.id);
    });

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
        socket.emit("full")
      }
      console.log(rooms);
    });

    socket.on("ready", (roomName) => {
      socket.broadcast.to(roomName).emit("ready");
    });

    socket.on("candidate", (candidate, roomName) => {
      socket.broadcast.to(roomName).emit("candidate", candidate);
    });

    
    socket.on("offer", (offer, roomName) => {
      socket.broadcast.to(roomName).emit("offer", offer);
    });
    
    socket.on("answer", (answer, roomName) => {
      socket.broadcast.to(roomName).emit("answer", answer);
    });

  });
};
