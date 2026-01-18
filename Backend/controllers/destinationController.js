const Destination = require('../models/destination');

// @desc    Get all destinations
// @route   GET /api/destinations
const getDestinations = async (req, res) => {
    const destinations = await Destination.find();
    res.status(200).json(destinations);
};

// @desc    Add destination (Admin)
// @route   POST /api/destinations
const addDestination = async (req, res) => {
    const { title, image, tag, desc } = req.body;
    const destination = await Destination.create({ title, image, tag, desc });
    res.status(200).json(destination);
};

// @desc    Update destination (Admin)
// @route   PUT /api/destinations/:id
const updateDestination = async (req, res) => {
    const destination = await Destination.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(destination);
};

// @desc    Delete destination (Admin)
// @route   DELETE /api/destinations/:id
const deleteDestination = async (req, res) => {
    await Destination.findByIdAndDelete(req.params.id);
    res.status(200).json({ id: req.params.id });
};

module.exports = { getDestinations, addDestination, updateDestination, deleteDestination };