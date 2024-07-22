import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NODE_ENV === "production" ? false : [`http://${hostname}:${port}`]
    }
  });

  io.on("connection", (socket) => {
    console.log("a user connected with id: ", socket.id);

    socket.on("join_room", (roomId) => {
      console.log("Joined room with id", roomId);
      socket.join(roomId);
    })

    // client sends message, server sends response
    socket.on("message", ({ conversationId, senderId, message }) => {
      io.to(conversationId).emit("response", {message, senderId});
    })

    socket.on("disconnect", () => {
      console.log("user disconnected with id: ", socket.id);
    });
  });


  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});