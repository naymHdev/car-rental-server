import catchAsync from "../../utility/catchAsync";
import { DashboardService } from "./dashboard.service";

const dashboardStatus = catchAsync(async (req, res) => {
  const result = await DashboardService.getDashboardStats();

  res.status(200).json({
    success: true,
    message: "Dashboard status fetched successfully",
    statusCode: 200,
    data: result,
  });
});

export const DashboardController = {
  dashboardStatus,
};
