import httpStatus from "http-status";
import { Server } from "http";
import { Server as SocketIoServer } from "socket.io";
import AppError from "../error/AppError";

let io: SocketIoServer;
export const socketio = (server: Server) => {
  io = new SocketIoServer(server, {
    cors: {
      origin: ["*"],
      methods: ["GET", "POST"],
    },
  });
  io.on("connection", (socket) => {
    console.log("Admin connected via Socket.IO:", socket.id);
    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};

export const socket = (): SocketIoServer => {
  if (!io) {
    throw new AppError(httpStatus.NOT_FOUND, "Socket id not found");
  }
  return io;
};
