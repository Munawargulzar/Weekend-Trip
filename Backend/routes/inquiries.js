
const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { 
    createInquiry, 
    getInquiries, 
    deleteInquiry 
} = require('../controllers/inquiryController');

// Public route - Create Inquiry
router.post('/', createInquiry);

// Protected Admin routes
router.get('/', protect, adminOnly, getInquiries);
router.delete('/:id', protect, adminOnly, deleteInquiry);

module.exports = router;