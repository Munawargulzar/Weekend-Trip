const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    destination: { type: String, required: true },
    date: { type: String, required: true },
    people: { type: Number, required: true },
    notes: { type: String },
    status: { type: String, default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);