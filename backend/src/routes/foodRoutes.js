const express = require('express');
const router = express.Router();
const { createFood, getFoods, updateFood, deleteFood } = require('../controllers/foodController');
const { protect, restaurantOwner } = require('../middleware/authMiddleware');

router.route('/')
  .post(createFood) // Protect and restrict to restaurant owner in real scenario
  .get(getFoods);

router.route('/:id')
  .put(updateFood)
  .delete(deleteFood);

module.exports = router;
