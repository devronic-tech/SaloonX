import Booking from "../models/Booking.js";
import Salon from "../models/salonModel.js";
import { Op } from "sequelize";

// Returns stats for admin dashboard
export const getAdminStats = async (req, res) => {
  try {
    // Completed Appointments
    const completedAppointments = await Booking.count({ where: { status: "completed" } });
    // Remaining Appointments (pending or accepted, and date >= today)
    const today = new Date();
    const remainingAppointments = await Booking.count({
      where: {
        status: { [Op.in]: ["pending", "accepted"] },
        date: { [Op.gte]: today }
      }
    });
    // Missed Appointments (date < today and not completed)
    const missedAppointments = await Booking.count({
      where: {
        status: { [Op.not]: "completed" },
        date: { [Op.lt]: today }
      }
    });
    // Present Barbers (barbers array in salons, count unique names)
    const salons = await Salon.findAll();
    const allBarbers = salons.flatMap(salon => salon.barbers || []);
    const presentBarbers = new Set(allBarbers).size;
    // Total Barbers (all barbers in all salons, not unique)
    const totalBarbers = allBarbers.length;

    res.json({
      completedAppointments,
      remainingAppointments,
      missedAppointments,
      presentBarbers,
      totalBarbers
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch admin stats" });
  }
};
