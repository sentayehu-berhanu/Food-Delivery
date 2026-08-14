const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');

// Get Platform Stats
exports.getPlatformStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeRestaurants = await Restaurant.countDocuments({ status: 'APPROVED' }); // Assuming status field exists
    const ordersToday = await Order.countDocuments({ 
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } 
    });
    
    // Calculate total revenue (completed orders)
    const completedOrders = await Order.find({ status: 'DELIVERED' });
    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);

    // Aggregate last 7 days revenue for chart
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const revenueData = await Order.aggregate([
      { 
        $match: { 
          status: 'DELIVERED',
          createdAt: { $gte: sevenDaysAgo }
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$total" },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Format for Recharts: [{ date: '2023-10-01', revenue: 150 }, ...]
    const chartData = revenueData.map(item => ({
      date: item._id,
      revenue: item.revenue,
      orders: item.orders
    }));

    res.json({
      totalUsers,
      activeRestaurants,
      ordersToday,
      totalRevenue,
      chartData // Added chart data
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Restaurants
exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().populate('owner', 'name email').sort({ createdAt: -1 });
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
