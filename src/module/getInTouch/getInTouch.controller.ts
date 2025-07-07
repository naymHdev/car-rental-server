import catchAsync from "../../utility/catchAsync";
import sendResponse from "../../utility/sendResponse";
import { GetInTouchServices } from "./getInTouch.service";
import httpStatus from "http-status";

const createGetInTouch = catchAsync(async (req, res) => {
  const result = await GetInTouchServices.createGetInTouch(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "successfully created get in touch",
    data: result,
  });
});

const findAllMessages = catchAsync(async (req, res) => {
  const result = await GetInTouchServices.findAllMessages(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "successfully retrieve get in touch data",
    data: result,
  });
});

const deleteMessage = catchAsync(async (req, res) => {
  const result = await GetInTouchServices.deleteMessage(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "successfully deleted message",
    data: result,
  });
});

export const GetInTouchController = {
  createGetInTouch,
  findAllMessages,
  deleteMessage,
};
