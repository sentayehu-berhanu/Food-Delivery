const mongoose = require('mongoose');

const sizeSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., 'Regular', 'Large'
  price: { type: Number, required: true }
});

const toppingSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., 'Extra Cheese'
  price: { type: Number, required: true }
});

const sauceSchema = new mongoose.Schema({
  name: { type: String, required: true } // e.g., 'Tomato Sauce'
});

const foodSchema = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  category: { type: String, required: true }, // Links to categories in Restaurant
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true }, // Base price if sizes aren't used
  image: { type: String },
  stock: { type: Number, default: -1 }, // -1 means unlimited
  isAvailable: { type: Boolean, default: true },
  
  // Customization options
  sizes: [sizeSchema],
  toppings: [toppingSchema],
  sauces: [sauceSchema]
}, { timestamps: true });

module.exports = mongoose.model('Food', foodSchema);
