const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true }, // Added price field
  type: { type: String, enum: ['boys', 'girls'], required: true }, 
  amenities: { type: [String], required: true },
  images: { type: [String], required: true }, // To store image URLs
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: true }, // To link the hostel to an owner
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
});

const Hostel = mongoose.model('Hostel', hostelSchema);

module.exports = Hostel;
