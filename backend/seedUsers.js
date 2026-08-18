require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding.');

    const users = [
      { name: 'System Admin', email: 'admin@foodgo.com', password: 'password123', role: 'ADMIN' },
      { name: 'John Customer', email: 'customer@example.com', password: 'password123', role: 'CUSTOMER' },
      { name: 'Bob Restaurant', email: 'restaurant@foodgo.com', password: 'password123', role: 'RESTAURANT' },
      { name: 'Dave Driver', email: 'driver@foodgo.com', password: 'password123', role: 'DRIVER' }
    ];

    for (let u of users) {
      const existingUser = await User.findOne({ email: u.email });
      if (!existingUser) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(u.password, salt);
        await User.create({ ...u, password: hashedPassword });
        console.log(`Created ${u.role}: ${u.email}`);
      } else {
        console.log(`${u.role} already exists: ${u.email}`);
      }
    }

    console.log('Seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed (MongoDB might not be running). You can still use the mock credentials!');
    process.exit(1);
  }
};

seedUsers();
