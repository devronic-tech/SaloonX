import express from "express";
import authMiddleware from "../middleware/authMid.js";

import {
createBooking,
updateBookingStatus,
getOwnerBookings,
getAcceptedBookings,
getUserBookings,
getAllBookingsDebug
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/book/:serviceId", authMiddleware, createBooking);

router.put(
"/update-status/:bookingId",
authMiddleware,
updateBookingStatus
);

router.get(
"/owner-bookings",
authMiddleware,
getOwnerBookings
);

// ✅ Get accepted bookings for Today's Appointments
router.get(
"/accepted-bookings",
authMiddleware,
getAcceptedBookings
);

router.get(
"/my-bookings",
authMiddleware,
getUserBookings
);

// Debug endpoint - remove in production
router.get(
"/debug-all",
authMiddleware,
getAllBookingsDebug
);

export default router;