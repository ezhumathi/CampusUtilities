// createTestUsers.js - Run this script to create test users
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function createTestUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      family: 4,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing users (optional - remove this if you want to keep existing users)
    await User.deleteMany({});
    console.log('🗑️ Cleared existing users');

    // Create test users
    const testUsers = [
      {
        name: 'John Student',
        email: 'student@test.com',
        password: 'password123',
        role: 'student'
      },
      {
        name: 'Jane Staff',
        email: 'staff@test.com',
        password: 'password123',
        role: 'staff'
      },
      {
        name: 'Admin User',
        email: 'admin@test.com',
        password: 'password123',
        role: 'admin'
      }
    ];

    // Save users to database
    for (const userData of testUsers) {
      const user = new User(userData);
      await user.save();
      console.log(`✅ Created ${userData.role}: ${userData.email}`);
    }

    console.log('\n🎉 Test users created successfully!');
    console.log('\nYou can now login with:');
    console.log('📧 Email: student@test.com | Password: password123 | Role: student');
    console.log('📧 Email: staff@test.com   | Password: password123 | Role: staff');
    console.log('📧 Email: admin@test.com   | Password: password123 | Role: admin');

  } catch (error) {
    console.error('❌ Error creating test users:', error.message);
  } finally {
    mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

createTestUsers();