import Booking from "../models/bookingModel.js";
import Provider from "../models/providerModel.js";
import User from "../models/userModel.js";

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const { userId, providerId, date, vehicleType, issueDescription, note, contactPhone } = req.body;

    const user = await User.findById(userId);
    const provider = await Provider.findById(providerId);

    if (!user || !provider) {
      return res.status(404).json({ message: "User or Provider not found" });
    }

    const booking = new Booking({
      user: userId,
      provider: providerId,
      date,
      vehicleType,           
      issueDescription,
      contactPhone,      
      note,
      status: "pending",     
    });

    const savedBooking = await booking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get bookings by user
export const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({ user: userId }).populate("provider");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get bookings by provider
export const getProviderBookings = async (req, res) => {
  try {
    const { providerId } = req.params;
    const bookings = await Booking.find({ provider: providerId }).populate("user");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update booking status (accepted/declined/completed)
export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = status;
    const updatedBooking = await booking.save();

    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
