const express = require('express');
const router = express.Router();
const { getRestaurantOrders, updateOrderStatus, getAvailableOrders, assignDriver, createOrder } = require('../controllers/orderController');
const { protect, restaurantOwner, driver } = require('../middleware/authMiddleware');

// Create a new order
router.post('/', createOrder);

// Get available orders for drivers
router.get('/available', getAvailableOrders);

// Assign driver to order
router.put('/:id/assign', assignDriver);

// Get orders for the logged-in restaurant (protect and restaurantOwner middleware would be used here)
router.get('/restaurant', getRestaurantOrders);

// Update order status
router.put('/:id/status', updateOrderStatus);

module.exports = router;
