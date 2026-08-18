const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// In-memory store for mock-DB mode
let mockUsers = [];

// Register User
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Handle mock-DB mode
    if (mongoose.connection.readyState !== 1) {
      if (mockUsers.find(u => u.email === email)) {
        return res.status(400).json({ message: 'User already exists' });
      }
      const userName = email.split('@')[0];
      const newUser = {
        _id: 'mock-' + Date.now(),
        name: name || (userName.charAt(0).toUpperCase() + userName.slice(1)),
        email,
        password, // stored in plain text for mock purposes
        role: role || 'CUSTOMER'
      };
      mockUsers.push(newUser);
      return res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        token: generateToken(newUser._id)
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'CUSTOMER'
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Handle mock-DB mode
    if (mongoose.connection.readyState !== 1) {
      const user = mockUsers.find(u => u.email === email);
      if (user && user.password === password) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id)
        });
      } else {
        // Fallback for pre-existing test emails if not registered in this session
        if (!user && password === 'password123') {
           const userName = email.split('@')[0];
           return res.json({
             _id: 'mock-user-id',
             name: userName.charAt(0).toUpperCase() + userName.slice(1),
             email: email,
             role: email.includes('admin') ? 'ADMIN' : (email.includes('driver') ? 'DRIVER' : (email.includes('restaurant') ? 'RESTAURANT' : 'CUSTOMER')),
             token: generateToken('mock-user-id')
           });
        }
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    }

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset Password (Local direct reset)
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Handle mock-DB mode
    if (mongoose.connection.readyState !== 1) {
      const userIndex = mockUsers.findIndex(u => u.email === email);
      if (userIndex !== -1) {
        mockUsers[userIndex].password = newPassword;
        // Fix role if it was accidentally set to CUSTOMER previously
        mockUsers[userIndex].role = email.includes('admin') ? 'ADMIN' : (email.includes('driver') ? 'DRIVER' : (email.includes('restaurant') ? 'RESTAURANT' : 'CUSTOMER'));
        return res.json({ message: 'Password reset successful (mock mode)' });
      } else {
        // If not in our mock array, add them so they can login later
        const userName = email.split('@')[0];
        const role = email.includes('admin') ? 'ADMIN' : (email.includes('driver') ? 'DRIVER' : (email.includes('restaurant') ? 'RESTAURANT' : 'CUSTOMER'));
        mockUsers.push({
          _id: 'mock-' + Date.now(),
          name: userName.charAt(0).toUpperCase() + userName.slice(1),
          email: email,
          password: newPassword,
          role: role
        });
        return res.json({ message: 'Password reset successful (mock mode)' });
      }
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};
