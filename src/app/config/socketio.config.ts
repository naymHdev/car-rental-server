import httpStatus from "http-status";
import { Server } from "http";
import { Server as scServer } from "socket.io";
import AppError from "../error/AppError";

let io: scServer;
export const socketio = (server: Server) => {
  io = new scServer(server, {
    cors: {
      origin: ["*"],
      methods: ["GET", "POST"],
    },
  });
  io.on("connection", (socket) => {
    console.log("Admin connected via Socket.IO:", socket.id);
  });
};

export const socket = (): scServer => {
  if (!io) {
    throw new AppError(httpStatus.NOT_FOUND, "Socket id not found");
  }
  return io;
};
