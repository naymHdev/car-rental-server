import httpStatus from "http-status";
import AppError from "../../app/error/AppError";
import { emitMessage, emitMessageToAdmin } from "../../utility/socket.helpers";
import { INotification } from "./notification.interface";
import Notification from "./notification.model";

const sendNoification = async (payload: INotification) => {
  const { data, receiverId, key, notifyAdmin } = payload;
  const newNotification = await Notification.create(payload);
  if (!newNotification) {
    throw new AppError(
      httpStatus.NOT_IMPLEMENTED,
      "Notification is not stored on database"
    );
  }
  receiverId.forEach((id) => {
    emitMessage(id.toString(), key, data);
  });
  if (notifyAdmin) {
    emitMessageToAdmin(key, data);
  }
  return { notification: newNotification };
};

const getAllNotifications = async () => {
  const notifications = await Notification.find().populate("ownerId");
  return notifications;
};

const getNotificationDetails = async (id: string) => {
  const notification = await Notification.findById(id).populate("ownerId");
  return notification;
};

const myNotifications = async (id: string) => {
  console.log("id: ", id);

  const notifications = await Notification.find({ ownerId: id });
  return notifications;
};

const findAdminNotifications = async () => {
  const notifications = await Notification.find({ notifyAdmin: true });
  return notifications;
};

const NotificationServices = {
  sendNoification,
  getAllNotifications,
  getNotificationDetails,
  myNotifications,
  findAdminNotifications,
};

export default NotificationServices;
