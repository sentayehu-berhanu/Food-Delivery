const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  address: { type: String, required: true },
  latitude: { type: Number },
  longitude: { type: Number },
  status: { type: String, enum: ['OPEN', 'CLOSED'], default: 'OPEN' },
  rating: { type: Number, default: 0 },
  tags: [String],
  image: { type: String },
  categories: [String],
  openingHours: {
    open: String, // e.g., '09:00'
    close: String // e.g., '22:00'
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // To be linked to User model later
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
