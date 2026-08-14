const Food = require('../models/Food');

// Create a new food item
exports.createFood = async (req, res) => {
  try {
    // In real app, restaurant ID would come from req.user
    const food = await Food.create(req.body);
    res.status(201).json(food);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all food items (could be filtered by restaurant)
exports.getFoods = async (req, res) => {
  try {
    const filter = req.query.restaurantId ? { restaurant: req.query.restaurantId } : {};
    const foods = await Food.find(filter);
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update food item
exports.updateFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!food) return res.status(404).json({ message: 'Food not found' });
    res.json(food);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete food item
exports.deleteFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) return res.status(404).json({ message: 'Food not found' });
    res.json({ message: 'Food removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
