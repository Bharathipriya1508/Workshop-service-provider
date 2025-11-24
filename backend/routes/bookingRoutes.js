import express from "express";
import {
  createBooking,
  getUserBookings,
  getProviderBookings,
  updateBookingStatus,
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", createBooking); // Create a booking
router.get("/user/:userId", getUserBookings); // Get all bookings for a user
router.get("/provider/:providerId", getProviderBookings); // Get all bookings for a provider
router.put("/:bookingId/status", updateBookingStatus); // Update booking status

export default router;
