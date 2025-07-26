# 🎓 Campus Utilities - MongoDB Integration Guide

## 📋 What We've Done

Your campus utilities app now stores data in **MongoDB Atlas** instead of just keeping it in memory. This means:

- ✅ **Data persists** when you refresh the page
- ✅ **Multiple users** can see the same data
- ✅ **Real database** storage in the cloud

## 🚀 How to Run Your App

### 1. Start the Backend Server
```bash
cd backend
npm start
```
The server will run on `http://localhost:5000`

### 2. Start the Frontend
```bash
cd campusutilities
npm start
```
The frontend will run on `http://localhost:3000`

## 👥 Test Users Available

| Role | Email | Password | What they can do |
|------|-------|----------|------------------|
| **Student** | `student@test.com` | `password123` | View announcements, submit complaints, manage personal timetable |
| **Admin** | `admin@test.com` | `password123` | Everything + post announcements, update complaint status |
| **Staff** | `staff@test.com` | `password123` | View announcements, submit complaints |

## 📊 Features Connected to MongoDB

### 🔔 Announcements
- **View**: All users can see announcements from database
- **Create**: Only admins can post new announcements
- **Filter**: By category (general, exams, events, holiday)
- **Data**: Stored in `announcements` collection

### 📝 Complaints
- **View**: All complaints from database
- **Create**: Any user can submit complaints
- **Update Status**: Only admins can change status (pending → in-progress → resolved)
- **Data**: Stored in `complaints` collection

### 📅 Timetable
- **View**: Personal timetable from database
- **Add Classes**: Add subject, room, teacher info
- **Delete**: Click on any class to remove it
- **Data**: Stored in `timetable` collection

## 🛠️ Sample Data Included

We've added sample data so you can see everything working immediately:

- **4 Announcements** (exams, holidays, events, general info)
- **4 Complaints** (water, electricity, cleaning, maintenance)
- **7 Timetable entries** for the student user

## 🔧 Backend API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Announcements
- `GET /api/announcements` - Get all announcements
- `GET /api/announcements?category=exams` - Filter by category
- `POST /api/announcements` - Create new announcement

### Complaints
- `GET /api/complaints` - Get all complaints
- `POST /api/complaints` - Submit new complaint
- `PUT /api/complaints/:id/status` - Update complaint status

### Timetable
- `GET /api/timetable?userEmail=student@test.com` - Get user's timetable
- `POST /api/timetable` - Add new class
- `DELETE /api/timetable/:id` - Delete class

## 🎯 How to Test

1. **Login** as student (`student@test.com` / `password123`)
2. **View Announcements** - See sample announcements
3. **Check Complaints** - See existing complaints, submit a new one
4. **View Timetable** - See sample schedule, add a new class

5. **Login** as admin (`admin@test.com` / `password123`)
6. **Post Announcement** - Create a new announcement
7. **Manage Complaints** - Change complaint status from pending to resolved

## 🔍 Troubleshooting

### Backend Issues
- Make sure MongoDB Atlas connection string is in `.env` file
- Check if backend server is running on port 5000
- Look for error messages in backend terminal

### Frontend Issues
- Make sure frontend is running on port 3000
- Check browser console for error messages
- Verify backend server is accessible

### Database Issues
- Check MongoDB Atlas dashboard for data
- Run `node createTestUsers.js` if users are missing
- Run `node addSampleData.js` if sample data is missing

## 📁 File Structure

```
backend/
├── models/           # MongoDB schemas
│   ├── User.js
│   ├── Announcement.js
│   ├── Complaint.js
│   └── Timetable.js
├── routes/           # API endpoints
│   ├── authRoutes.js
│   ├── announcements.js
│   ├── complaints.js
│   └── timetable.js
├── createTestUsers.js    # Script to create test users
├── addSampleData.js      # Script to add sample data
└── server.js            # Main server file

campusutilities/src/components/
├── Login.jsx            # Login/Register form
├── Announcements.jsx    # View/Create announcements
├── Complaints.jsx       # Submit/View complaints
└── Timetable.jsx        # Manage personal schedule
```

## 🎉 Success!

Your app now has a real database backend! Data will persist between sessions and multiple users can interact with the same data. You can expand this by adding more features like:

- User profiles
- File uploads
- Real-time notifications
- Email notifications
- Advanced search and filtering

Happy coding! 🚀