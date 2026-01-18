const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { 
    createBooking, 
    getBookings, 
    updateBookingStatus, 
    deleteBooking 
} = require('../controllers/bookingController');

// Public route - Create a Booking
router.post('/', createBooking);

// Protected routes - Users can view and manage their bookings
router.get('/', protect, getBookings);
router.delete('/:id', protect, deleteBooking);

// Admin-only route - Update booking status
router.put('/:id', protect, adminOnly, updateBookingStatus);

module.exports = router;