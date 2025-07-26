# CampusLink Backend API

A comprehensive backend API for the CampusLink student utility hub built with Node.js, Express, and MongoDB.

## 🚀 Features

- **User Authentication** - JWT-based auth with role management
- **Announcements** - Campus-wide announcements system
- **Lost & Found** - Item reporting and tracking
- **Timetable Management** - Personal class scheduling
- **Complaint System** - Hostel complaint registration and tracking

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Environment**: dotenv

## 📦 Installation

1. **Clone and navigate to backend directory**
   ```bash
   cd campusutilities-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file with:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/campuslink
   JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
   NODE_ENV=development
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system

5. **Run the server**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | User login | Public |
| GET | `/me` | Get current user | Private |

### Announcements Routes (`/api/announcements`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get all announcements | Private |
| POST | `/` | Create announcement | Admin |
| PUT | `/:id` | Update announcement | Admin |
| DELETE | `/:id` | Delete announcement | Admin |

### Lost & Found Routes (`/api/lostfound`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get all items | Private |
| POST | `/` | Report new item | Private |
| PUT | `/:id/status` | Update item status | Owner |
| DELETE | `/:id` | Delete item | Owner |

### Timetable Routes (`/api/timetable`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get user's timetable | Private |
| POST | `/` | Add class | Private |
| PUT | `/:id` | Update class | Owner |
| DELETE | `/:id` | Delete class | Owner |
| DELETE | `/slot/:day/:time` | Delete by day/time | Owner |

### Complaints Routes (`/api/complaints`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get complaints | Private |
| POST | `/` | Create complaint | Private |
| PUT | `/:id/status` | Update status | Admin |
| PUT | `/:id/priority` | Update priority | Admin |
| DELETE | `/:id` | Delete complaint | Owner/Admin |
| GET | `/stats` | Get statistics | Admin |

## 🔐 Authentication

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@college.edu",
  "password": "password123",
  "role": "student"
}
```

### Login User
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@college.edu",
  "password": "password123"
}
```

### Using JWT Token
Include the token in the Authorization header:
```bash
Authorization: Bearer your_jwt_token_here
```

## 📊 Data Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (student/admin),
  timestamps: true
}
```

### Announcement Model
```javascript
{
  title: String,
  content: String,
  category: String (general/exams/events/holiday),
  author: ObjectId (User),
  timestamps: true
}
```

### LostFound Model
```javascript
{
  title: String,
  description: String,
  category: String (lost/found),
  itemType: String (book/bottle/wallet/phone/keys/other),
  location: String,
  contact: String,
  user: ObjectId (User),
  status: String (active/resolved),
  timestamps: true
}
```

### Timetable Model
```javascript
{
  user: ObjectId (User),
  day: String (Monday-Saturday),
  time: String,
  subject: String,
  room: String,
  teacher: String,
  timestamps: true
}
```

### Complaint Model
```javascript
{
  title: String,
  description: String,
  category: String (water/electricity/cleaning/maintenance/other),
  status: String (pending/in-progress/resolved),
  student: ObjectId (User),
  assignedTo: ObjectId (User),
  priority: String (low/medium/high),
  resolvedAt: Date,
  timestamps: true
}
```

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Role-based Access**: Student/Admin permissions
- **Input Validation**: Mongoose schema validation
- **CORS Protection**: Cross-origin request handling

## 🚦 Error Handling

The API returns consistent error responses:

```json
{
  "message": "Error description",
  "error": "Detailed error message (in development)"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## 🧪 Testing

You can test the API using tools like:
- **Postman** - GUI-based API testing
- **Thunder Client** - VS Code extension
- **curl** - Command line testing

Example curl request:
```bash
curl -X GET http://localhost:5000/api/announcements \
  -H "Authorization: Bearer your_jwt_token"
```

## 📈 Development Tips

1. **Database Connection**: Ensure MongoDB is running before starting the server
2. **Environment Variables**: Never commit `.env` file to version control
3. **JWT Secret**: Use a strong, random secret key in production
4. **Error Logs**: Check console for detailed error messages
5. **API Testing**: Use Postman collection for comprehensive testing

## 🚀 Deployment

For production deployment:

1. **Environment Setup**
   ```env
   NODE_ENV=production
   MONGODB_URI=your_production_mongodb_uri
   JWT_SECRET=your_strong_production_secret
   ```

2. **Build and Start**
   ```bash
   npm start
   ```

3. **Process Management** (Optional)
   ```bash
   npm install -g pm2
   pm2 start server.js --name campuslink-api
   ```

## 🤝 Contributing

This is a hackathon project built for educational purposes. Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

---

**Built with ❤️ for college students**