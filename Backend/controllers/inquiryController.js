const Inquiry = require('../models/inquiry');

// @desc    Create an inquiry
// @route   POST /api/inquiries
const createInquiry = async (req, res) => {
    const inquiry = await Inquiry.create(req.body);
    res.status(200).json(inquiry);
};

// @desc    Get all inquiries (Admin)
// @route   GET /api/inquiries
const getInquiries = async (req, res) => {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.status(200).json(inquiries);
};

// @desc    Delete inquiry (Admin)
// @route   DELETE /api/inquiries/:id
const deleteInquiry = async (req, res) => {
    await Inquiry.findByIdAndDelete(req.params.id);
    res.status(200).json({ id: req.params.id });
};

module.exports = { createInquiry, getInquiries, deleteInquiry };