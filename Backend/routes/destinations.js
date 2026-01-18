const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { 
    getDestinations, 
    addDestination, 
    updateDestination, 
    deleteDestination 
} = require('../controllers/destinationController');

// Public route - Get all destinations
router.get('/', getDestinations);

// Protected Admin routes
router.post('/', protect, adminOnly, addDestination);
router.put('/:id', protect, adminOnly, updateDestination);
router.delete('/:id', protect, adminOnly, deleteDestination);

module.exports = router;