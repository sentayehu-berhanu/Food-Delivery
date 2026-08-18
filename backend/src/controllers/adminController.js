const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, '..', '..', 'users_db.json');

// Helper to read/write JSON DB
const readDB = () => {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(dbPath));
};
const writeDB = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

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
    const users = readDB();
    res.json(users.reverse());
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

// Create User (Admin)
exports.createUser = async (req, res) => {
  try {
    const { name, email, role, status, password } = req.body;
    let users = readDB();
    
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = {
      _id: Date.now().toString(),
      name,
      email,
      role: role || 'CUSTOMER',
      status: status || 'ACTIVE',
      password: password || 'password123',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    writeDB(users);

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update User (Admin)
exports.updateUser = async (req, res) => {
  try {
    let users = readDB();
    const index = users.findIndex(u => u._id === req.params.id);

    if (index !== -1) {
      users[index].name = req.body.name || users[index].name;
      users[index].email = req.body.email || users[index].email;
      users[index].role = req.body.role || users[index].role;
      users[index].status = req.body.status || users[index].status;
      if (req.body.password) {
        users[index].password = req.body.password;
      }

      writeDB(users);
      res.json(users[index]);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete User (Admin)
exports.deleteUser = async (req, res) => {
  try {
    let users = readDB();
    const filtered = users.filter(u => u._id !== req.params.id);
    
    if (users.length !== filtered.length) {
      writeDB(filtered);
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
