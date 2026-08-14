const express = require('express');
const router = express.Router();
const { getPlatformStats, getAllUsers, getAllRestaurants } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// Protect all admin routes with auth and admin role check
router.use(protect);
router.use(admin);

router.get('/stats', getPlatformStats);
router.get('/users', getAllUsers);
router.get('/restaurants', getAllRestaurants);

module.exports = router;
