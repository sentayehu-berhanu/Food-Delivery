const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  basePrice: { type: Number, required: true },
  size: {
    name: String,
    price: Number
  },
  toppings: [{
    name: String,
    price: Number
  }],
  sauce: {
    name: String
  },
  instructions: { type: String },
  totalPrice: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  items: [orderItemSchema],
  
  deliveryAddress: { type: String, required: true },
  deliveryInstructions: { type: String },
  
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, required: true },
  serviceFee: { type: Number, required: true },
  tax: { type: Number, required: true },
  total: { type: Number, required: true },
  
  paymentMethod: { type: String, enum: ['CARD', 'CASH'], required: true },
  paymentStatus: { type: String, enum: ['PENDING', 'PAID', 'FAILED'], default: 'PENDING' },
  
  status: { 
    type: String, 
    enum: [
      'PENDING', 'CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 
      'DRIVER_ASSIGNED', 'PICKED_UP', 'ON_THE_WAY', 'DELIVERED', 
      'CANCELLED', 'REJECTED'
    ], 
    default: 'PENDING' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
