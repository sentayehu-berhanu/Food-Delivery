const Order = require('../models/Order');
const Notification = require('../models/Notification');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const {
      restaurant,
      items,
      deliveryAddress,
      deliveryInstructions,
      subtotal,
      deliveryFee,
      serviceFee,
      tax,
      total,
      paymentMethod,
      paymentStatus
    } = req.body;

    const order = await Order.create({
      user: req.user ? req.user._id : '64f1a2b3c4d5e6f7a8b9c0d1', // Mock user for now if not logged in
      restaurant,
      items,
      deliveryAddress,
      deliveryInstructions,
      subtotal,
      deliveryFee,
      serviceFee,
      tax,
      total,
      paymentMethod,
      paymentStatus,
      status: 'PENDING'
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all orders for a restaurant (for the Dashboard)
exports.getRestaurantOrders = async (req, res) => {
  try {
    // In a real scenario, restaurant ID comes from req.user
    // For now, we mock the fetch or get all
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status (Accept, Preparing, Ready)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    // Status validation based on enum in Order model
    const validStatuses = [
      'PENDING', 'CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 
      'DRIVER_ASSIGNED', 'PICKED_UP', 'ON_THE_WAY', 'DELIVERED', 
      'CANCELLED', 'REJECTED'
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Trigger Notification to Customer
    await Notification.create({
      user: order.user,
      type: 'ORDER_STATUS',
      message: `Your order status has been updated to: ${status.replace(/_/g, ' ')}`,
      orderId: order._id
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Driver: Get available orders (READY orders with no driver)
exports.getAvailableOrders = async (req, res) => {
  try {
    const orders = await Order.find({ 
      status: 'READY', 
      driver: { $exists: false } 
    }).populate('restaurant', 'name address latitude longitude')
      .populate('user', 'name address latitude longitude')
      .sort({ createdAt: 1 });
      
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Driver: Accept/Assign an order
exports.assignDriver = async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, status: 'READY', driver: { $exists: false } },
      { 
        driver: req.user._id, // In real scenario, from protect middleware
        status: 'DRIVER_ASSIGNED' 
      },
      { new: true }
    );

    if (!order) {
      return res.status(400).json({ message: 'Order is no longer available' });
    }

    // Notify Customer that driver is assigned
    await Notification.create({
      user: order.user,
      type: 'DRIVER_ASSIGNED',
      message: `A driver has been assigned and is heading to the restaurant.`,
      orderId: order._id
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
