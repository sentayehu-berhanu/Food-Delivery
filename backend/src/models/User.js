const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['CUSTOMER', 'RESTAURANT', 'DRIVER', 'ADMIN'], default: 'CUSTOMER' },
  status: { type: String, enum: ['ACTIVE', 'BANNED'], default: 'ACTIVE' },
  phone: { type: String },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
