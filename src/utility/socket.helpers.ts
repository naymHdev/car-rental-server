import { socket } from "../app/config/socketio.config";

export const emitMessage = (key: string, data: object) => {
  socket().emit(key, data);
};
