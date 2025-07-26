// addSampleData.js - Run this script to add sample data
const mongoose = require('mongoose');
const User = require('./models/User');
const Announcement = require('./models/Announcement');
const Complaint = require('./models/Complaint');
const Timetable = require('./models/Timetable');
require('dotenv').config();

async function addSampleData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      family: 4,
    });
    console.log('✅ Connected to MongoDB');

    // Get users
    const adminUser = await User.findOne({ email: 'admin@test.com' });
    const studentUser = await User.findOne({ email: 'student@test.com' });
    const staffUser = await User.findOne({ email: 'staff@test.com' });

    if (!adminUser || !studentUser || !staffUser) {
      console.log('❌ Please run createTestUsers.js first to create users');
      return;
    }

    // Clear existing data (optional)
    await Announcement.deleteMany({});
    await Complaint.deleteMany({});
    await Timetable.deleteMany({});
    console.log('🗑️ Cleared existing sample data');

    // Add sample announcements
    const announcements = [
      {
        title: 'Mid-term Exams Schedule Released',
        content: 'Mid-term examinations will commence from March 15th, 2024. Please check your individual timetables for specific dates and timings. All students are required to carry their ID cards during exams.',
        category: 'exams',
        author: adminUser._id
      },
      {
        title: 'Holi Festival Holiday',
        content: 'The college will remain closed on March 8th, 2024 in observance of Holi festival. Regular classes will resume on March 9th.',
        category: 'holiday',
        author: adminUser._id
      },
      {
        title: 'Tech Fest 2024 Registration Open',
        content: 'Registration for the annual Tech Fest 2024 is now open! Participate in coding competitions, robotics challenges, and technical presentations. Last date for registration: March 20th.',
        category: 'events',
        author: staffUser._id
      },
      {
        title: 'Library Timing Update',
        content: 'Starting from March 1st, the library will be open from 8:00 AM to 10:00 PM on weekdays and 9:00 AM to 6:00 PM on weekends.',
        category: 'general',
        author: adminUser._id
      }
    ];

    for (const announcementData of announcements) {
      const announcement = new Announcement(announcementData);
      await announcement.save();
      console.log(`✅ Created announcement: ${announcementData.title}`);
    }

    // Add sample complaints
    const complaints = [
      {
        title: 'Water Supply Issue in Block A',
        description: 'There has been no water supply in hostel block A since yesterday morning. Students are facing difficulty in basic daily activities. Please resolve this issue urgently.',
        category: 'water',
        status: 'pending',
        student: studentUser._id,
        priority: 'high'
      },
      {
        title: 'Electricity Problem in Room 205',
        description: 'The power outlet in room 205 is not working. We cannot charge our devices or use the study lamp. This is affecting our studies.',
        category: 'electricity',
        status: 'in-progress',
        student: studentUser._id,
        priority: 'medium'
      },
      {
        title: 'Cleaning Issue in Common Area',
        description: 'The common area on the 2nd floor has not been cleaned for the past 3 days. It is becoming unhygienic and needs immediate attention.',
        category: 'cleaning',
        status: 'pending',
        student: studentUser._id,
        priority: 'medium'
      },
      {
        title: 'Broken Window in Classroom 101',
        description: 'The window in classroom 101 is broken and needs repair. It is causing disturbance during lectures due to noise and weather.',
        category: 'maintenance',
        status: 'resolved',
        student: studentUser._id,
        priority: 'low',
        resolvedAt: new Date()
      }
    ];

    for (const complaintData of complaints) {
      const complaint = new Complaint(complaintData);
      await complaint.save();
      console.log(`✅ Created complaint: ${complaintData.title}`);
    }

    // Add sample timetable for student
    const timetableEntries = [
      {
        user: studentUser._id,
        day: 'Monday',
        time: '9:00',
        subject: 'Mathematics',
        room: 'Room 101',
        teacher: 'Dr. Smith'
      },
      {
        user: studentUser._id,
        day: 'Monday',
        time: '10:00',
        subject: 'Physics',
        room: 'Lab 201',
        teacher: 'Prof. Johnson'
      },
      {
        user: studentUser._id,
        day: 'Tuesday',
        time: '9:00',
        subject: 'Chemistry',
        room: 'Lab 301',
        teacher: 'Dr. Brown'
      },
      {
        user: studentUser._id,
        day: 'Tuesday',
        time: '11:00',
        subject: 'English Literature',
        room: 'Room 205',
        teacher: 'Ms. Davis'
      },
      {
        user: studentUser._id,
        day: 'Wednesday',
        time: '10:00',
        subject: 'Computer Science',
        room: 'Computer Lab',
        teacher: 'Mr. Wilson'
      },
      {
        user: studentUser._id,
        day: 'Thursday',
        time: '9:00',
        subject: 'History',
        room: 'Room 102',
        teacher: 'Dr. Taylor'
      },
      {
        user: studentUser._id,
        day: 'Friday',
        time: '10:00',
        subject: 'Biology',
        room: 'Lab 401',
        teacher: 'Prof. Anderson'
      }
    ];

    for (const timetableData of timetableEntries) {
      const timetableEntry = new Timetable(timetableData);
      await timetableEntry.save();
      console.log(`✅ Created timetable entry: ${timetableData.day} ${timetableData.time} - ${timetableData.subject}`);
    }

    console.log('\n🎉 Sample data added successfully!');
    console.log('\nYou can now:');
    console.log('📢 View announcements in the frontend');
    console.log('📝 See sample complaints and add new ones');
    console.log('📅 Check the student timetable and add more classes');
    console.log('\nLogin with:');
    console.log('👨‍🎓 Student: student@test.com / password123');
    console.log('👨‍💼 Admin: admin@test.com / password123');

  } catch (error) {
    console.error('❌ Error adding sample data:', error.message);
  } finally {
    mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

addSampleData();