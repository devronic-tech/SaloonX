import Booking from "../models/Booking.js";
import Owner from "../models/ownerModel.js";
import { Op } from "sequelize";

// Returns stats for owner dashboard
export const getAdminStats = async (req, res) => {
  try {
    const ownerId = req.user.id;

    // Normalize today's date for comparison (YYYY-MM-DD)
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    // Completed Appointments for THIS owner
    const completedAppointments = await Booking.count({ 
      where: { 
        status: "completed",
        owner_id: ownerId
      } 
    });

    // Accepted Appointments (date >= today) for THIS owner
    const remainingAppointments = await Booking.count({
      where: {
        status: "accepted",
        date: { [Op.gte]: todayStr },
        owner_id: ownerId
      }
    });

    // Missed Appointments (date < today and was accepted but not completed)
    const missedAppointments = await Booking.count({
      where: {
        status: "accepted",
        date: { [Op.lt]: todayStr },
        owner_id: ownerId
      }
    });

    // Barbers info for THIS owner
    const owner = await Owner.findOne({
      where: { id: ownerId }
    });

    const presentBarbers = owner.barber_names ? owner.barber_names.length : 0;
    const totalBarbers = presentBarbers; // For now, same as present

    // Pending Requests specifically
    const pendingRequests = await Booking.count({
      where: { 
        status: "pending",
        owner_id: ownerId
      }
    });

    res.json({
      completedAppointments,
      remainingAppointments,
      pendingRequests,
      missedAppointments,
      presentBarbers,
      totalBarbers
    });
  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};
