const mongoose = require('mongoose');

const DestinationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    image: { type: String, required: true },
    tag: { type: String, required: true },
    desc: { type: String, required: true }
});

module.exports = mongoose.model('Destination', DestinationSchema);