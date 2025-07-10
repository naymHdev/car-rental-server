import express from "express";
import NotificationController from "./notification.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.get(
  "/get_notification",
  //   validationRequest(AuthValidationSchema.playerSignUpValidation),
  NotificationController.getNotification
);
router.get(
  "/get_all_notification",
  //   validationRequest(AuthValidationSchema.playerSignUpValidation),
  NotificationController.getAllNotification
);

router.delete(
  "/delete_notification",
  //   validationRequest(AuthValidationSchema.playerSignUpValidation),
  NotificationController.deleteNotification
);

router.get(
  "/all-notifications",
  auth("Admin", "Shelter", "User"),
  NotificationController.getAllNotifications
);

router.get(
  "/notification-details/:id",
  auth("Admin", "Shelter", "User"),
  NotificationController.notificationDetails
);

router.get(
  "/my-notifications",
  auth("Admin", "Shelter", "User"),
  NotificationController.myNotifications
);

router.get(
  "/admin-notifications",
  // auth("Admin"),
  NotificationController.adminNotifications
);  

const NotificationRouter = router;
export default NotificationRouter;
