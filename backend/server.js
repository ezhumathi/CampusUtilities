// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Routes
const authRoutes = require('./routes/authRoutes');           // renamed for clarity
const announcementRoutes = require('./routes/announcements');
const lostFoundRoutes = require('./routes/lostfound');
const timetableRoutes = require('./routes/timetable');
const complaintRoutes = require('./routes/complaints');
const secureRoutes = require('./routes/secure');

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGODB_URI , {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4, // IPv4 only
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});

// ✅ Use Route Prefixes
app.use('/api/auth', authRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/lostfound', lostFoundRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/secure', secureRoutes);

// ✅ Root Route
app.get('/', (req, res) => {
  res.json({ message: '📡 CampusLink Backend API is running' });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
