import Car from "../car/car.model";
import Order from "../order/order.model";
import User from "../user/user.model";

const getDashboardStats = async () => {
  const happyClients = await User.countDocuments();
  const completeOrders = await Order.countDocuments();
  const vehicles = await Car.countDocuments();

  return {
    happyClients,
    completeOrders,
    vehiclesFleet: vehicles,
  };
};

export const DashboardService = {
  getDashboardStats,
};
