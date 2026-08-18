const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, '..', '..', 'users_db.json');

// Helper to read JSON DB
const readDB = () => {
  if (!fs.existsSync(dbPath)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(dbPath));
};

// In-memory store for mock-DB mode
let mockUsers = [];

// Register User
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Handle mock-DB mode
    if (mongoose.connection.readyState !== 1) {
      const dbUsers = readDB();
      if (dbUsers.find(u => u.email === email)) {
        return res.status(400).json({ message: 'User already exists' });
      }
      const userName = email.split('@')[0];
      const newUser = {
        _id: Date.now().toString(),
        name: name || (userName.charAt(0).toUpperCase() + userName.slice(1)),
        email,
        password, // stored in plain text for mock purposes
        role: role || (email.includes('driver') ? 'DRIVER' : (email.includes('admin') ? 'ADMIN' : 'CUSTOMER')),
        status: 'ACTIVE',
        createdAt: new Date().toISOString()
      };
      dbUsers.push(newUser);
      fs.writeFileSync(dbPath, JSON.stringify(dbUsers, null, 2));
      
      // Also push to mockUsers to avoid breaking anything else that relies on it
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
      let user = mockUsers.find(u => u.email === email);
      
      if (!user) {
        const dbUsers = readDB();
        user = dbUsers.find(u => u.email === email);
      }

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
      const dbUsers = readDB();
      let userIndex = dbUsers.findIndex(u => u.email === email);
      
      if (userIndex !== -1) {
        dbUsers[userIndex].password = newPassword;
        dbUsers[userIndex].role = email.includes('admin') ? 'ADMIN' : (email.includes('driver') ? 'DRIVER' : (email.includes('restaurant') ? 'RESTAURANT' : 'CUSTOMER'));
      } else {
        const userName = email.split('@')[0];
        const role = email.includes('admin') ? 'ADMIN' : (email.includes('driver') ? 'DRIVER' : (email.includes('restaurant') ? 'RESTAURANT' : 'CUSTOMER'));
        dbUsers.push({
          _id: Date.now().toString(),
          name: userName.charAt(0).toUpperCase() + userName.slice(1),
          email: email,
          password: newPassword,
          role: role,
          status: 'ACTIVE',
          createdAt: new Date().toISOString()
        });
      }
      
      fs.writeFileSync(dbPath, JSON.stringify(dbUsers, null, 2));

      // Update in-memory array too
      const mockIndex = mockUsers.findIndex(u => u.email === email);
      if (mockIndex !== -1) {
        mockUsers[mockIndex].password = newPassword;
        mockUsers[mockIndex].role = email.includes('admin') ? 'ADMIN' : (email.includes('driver') ? 'DRIVER' : (email.includes('restaurant') ? 'RESTAURANT' : 'CUSTOMER'));
      } else {
        mockUsers.push({
          _id: 'mock-' + Date.now(),
          name: email.split('@')[0],
          email: email,
          password: newPassword,
          role: email.includes('admin') ? 'ADMIN' : (email.includes('driver') ? 'DRIVER' : (email.includes('restaurant') ? 'RESTAURANT' : 'CUSTOMER'))
        });
      }
      
      return res.json({ message: 'Password reset successful (mock mode)' });
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
