const Booking = require('../models/booking');

// @desc    Create a booking
// @route   POST /api/bookings
const createBooking = async (req, res) => {
    const booking = await Booking.create(req.body);
    res.status(200).json(booking);
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
const getBookings = async (req, res) => {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json(bookings);
};

// @desc    Update booking status (Admin)
// @route   PUT /api/bookings/:id
const updateBookingStatus = async (req, res) => {
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.status(200).json(booking);
};

// @desc    Delete booking (Admin)
// @route   DELETE /api/bookings/:id
const deleteBooking = async (req, res) => {
    await Booking.findByIdAndDelete(req.params.id);
    res.status(200).json({ id: req.params.id });
};

module.exports = { createBooking, getBookings, updateBookingStatus, deleteBooking };