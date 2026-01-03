# GlobeTrotter Backend API

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.18-blue.svg)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A comprehensive RESTful API backend for the GlobeTrotter travel planning platform. Built with Node.js, Express, and MySQL to provide robust trip planning, collaboration, and social features for travelers worldwide.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Configuration](#-environment-configuration)
- [Database Setup](#-database-setup)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Authentication](#-authentication)
- [Middleware](#-middleware)
- [Models](#-models)
- [Error Handling](#-error-handling)
- [Security Features](#-security-features)
- [File Upload](#-file-upload)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### Core Functionality

- **User Authentication & Authorization**: Secure JWT-based authentication with email verification
- **Trip Management**: Create, plan, and manage multi-destination trips with detailed itineraries
- **Collaborative Planning**: Real-time collaboration on trip planning with friends and family
- **Social Features**: Follow travelers, share trips, comment, and like travel experiences
- **Expense Tracking**: Track and categorize trip expenses with multi-currency support
- **Wishlist**: Save dream destinations and activities for future trips
- **Document Management**: Upload and manage travel documents (tickets, visas, insurance)
- **Notifications**: Real-time notifications for trip updates and social interactions
- **Advanced Search**: Search trips, users, destinations, and activities
- **Admin Panel**: Comprehensive admin tools for platform management

### Technical Features

- RESTful API architecture
- MySQL database with optimized queries
- JWT authentication with refresh tokens
- Role-based access control (RBAC)
- File upload handling with validation
- Rate limiting and security middleware
- Input validation and sanitization
- Comprehensive error handling
- Database connection pooling
- CORS support for cross-origin requests

---

## 🛠 Tech Stack

### Backend Framework & Runtime

- **Node.js** (v18+) - JavaScript runtime environment
- **Express.js** (v4.18) - Web application framework

### Database & ORM

- **MySQL** (v8.0+) - Relational database
- **mysql2** - MySQL client with promise support

### Authentication & Security

- **jsonwebtoken** - JWT token generation and verification
- **bcryptjs** - Password hashing
- **helmet** - Security headers middleware
- **cors** - Cross-Origin Resource Sharing
- **express-rate-limit** - Rate limiting middleware

### Validation & Utilities

- **express-validator** - Input validation and sanitization
- **multer** - Multipart/form-data file upload handling
- **uuid** - Unique identifier generation
- **dotenv** - Environment variable management

### Email & Communication

- **nodemailer** - Email sending functionality

### Logging & Compression

- **morgan** - HTTP request logger
- **compression** - Response compression middleware

### Development Tools

- **nodemon** - Auto-restart server on file changes
- **jest** - Testing framework
- **eslint** - Code linting and quality

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **npm** >= 9.0.0 (comes with Node.js)
- **MySQL** >= 8.0 ([Download](https://dev.mysql.com/downloads/mysql/))
- **Git** (for version control)

Verify installations:

```bash
node --version
npm --version
mysql --version
```

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd oddo-Hackathon/odoo/backend
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages listed in `package.json`:

- Express.js and middleware
- MySQL driver
- Authentication libraries
- Validation tools
- Security packages
- Development utilities

---

## ⚙️ Environment Configuration

### 1. Create Environment File

Create a `.env` file in the backend root directory:

```bash
cp .env.example .env
```

### 2. Configure Environment Variables

Edit `.env` with your configuration:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
HOST=0.0.0.0

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=globetrotter

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_REFRESH_SECRET=your_refresh_token_secret_key
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@globetrotter.com

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Security Notes:

- **Never commit `.env` file to version control**
- Change default JWT secrets in production
- Use strong, unique passwords
- Enable email service for production environments

---

## 💾 Database Setup

### 1. Create MySQL Database

Login to MySQL:

```bash
mysql -u root -p
```

Create the database:

```sql
CREATE DATABASE globetrotter CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 2. Import Database Schema

Run the provided SQL schema:

```bash
mysql -u root -p globetrotter < database_schema.sql
```

### 3. Verify Database Setup

Login to MySQL and verify:

```sql
USE globetrotter;
SHOW TABLES;
```

You should see tables including:

- users
- trips
- activities
- countries
- cities
- trip_stops
- expenses
- wishlists
- documents
- notifications
- collaborations
- And more...

---

## ▶️ Running the Application

### Development Mode

Start with auto-reload on file changes:

```bash
npm run dev
```

### Production Mode

Start the server:

```bash
npm start
```

### Expected Output

```
==================================================
🚀 GlobeTrotter API Server
==================================================
✅ Database connected successfully
📍 Server running on: http://0.0.0.0:5000
🌍 Environment: development
💾 Database: globetrotter
==================================================
📚 Available endpoints:
   - Health Check: http://localhost:5000/health
   - Auth API: http://localhost:5000/api/auth
==================================================
```

### Verify Server is Running

Open browser or use curl:

```bash
curl http://localhost:5000/health
```

Expected response:

```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-01-03T...",
  "uptime": 1.234
}
```

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/                    # Configuration files
│   │   ├── database.js           # MySQL connection pool & helpers
│   │   └── jwt.js                # JWT configuration
│   │
│   ├── controllers/               # Business logic layer
│   │   ├── activityController.js # Activity CRUD operations
│   │   ├── adminController.js    # Admin panel operations
│   │   ├── authController.js     # Authentication & registration
│   │   ├── cityController.js     # City data management
│   │   ├── collaborationController.js # Trip collaboration
│   │   ├── countryController.js  # Country data management
│   │   ├── documentController.js # Document upload/management
│   │   ├── expenseController.js  # Expense tracking
│   │   ├── itineraryController.js # Itinerary planning
│   │   ├── notificationController.js # Notification system
│   │   ├── searchController.js   # Advanced search
│   │   ├── socialController.js   # Social features
│   │   ├── tripController.js     # Trip management
│   │   ├── tripStopController.js # Trip stop management
│   │   ├── userController.js     # User profile operations
│   │   └── wishlistController.js # Wishlist management
│   │
│   ├── middleware/                # Custom middleware
│   │   ├── validators/           # Input validation
│   │   │   ├── authValidator.js  # Auth validation rules
│   │   │   └── userValidator.js  # User validation rules
│   │   ├── adminMiddleware.js    # Admin access control
│   │   ├── auth.js               # JWT verification
│   │   ├── authMiddleware.js     # Authentication middleware
│   │   ├── documentUploadMiddleware.js # Document upload handling
│   │   ├── errorHandler.js       # Global error handler
│   │   ├── rateLimiter.js        # Rate limiting
│   │   ├── upload.js             # File upload configuration
│   │   └── uploadMiddleware.js   # Upload middleware
│   │
│   ├── models/                    # Data access layer
│   │   ├── Activity.js           # Activity model
│   │   ├── Admin.js              # Admin model
│   │   ├── City.js               # City model
│   │   ├── Collaboration.js      # Collaboration model
│   │   ├── Country.js            # Country model
│   │   ├── Document.js           # Document model
│   │   ├── Expense.js            # Expense model
│   │   ├── Itinerary.js          # Itinerary model
│   │   ├── Notification.js       # Notification model
│   │   ├── Search.js             # Search model
│   │   ├── Social.js             # Social model
│   │   ├── Trip.js               # Trip model
│   │   ├── TripStop.js           # Trip stop model
│   │   ├── User.js               # User model
│   │   └── Wishlist.js           # Wishlist model
│   │
│   ├── routes/                    # API route definitions
│   │   ├── activities.js         # Activity routes
│   │   ├── admin.js              # Admin routes
│   │   ├── auth.js               # Authentication routes
│   │   ├── authRoutes.js         # Additional auth routes
│   │   ├── cities.js             # City routes
│   │   ├── collaboration.js      # Collaboration routes
│   │   ├── countries.js          # Country routes
│   │   ├── documents.js          # Document routes
│   │   ├── expenseCategories.js  # Expense category routes
│   │   ├── notifications.js      # Notification routes
│   │   ├── search.js             # Search routes
│   │   ├── social.js             # Social routes
│   │   ├── trips.js              # Trip routes
│   │   ├── users.js              # User routes
│   │   └── wishlist.js           # Wishlist routes
│   │
│   ├── utils/                     # Utility functions
│   │   ├── ApiResponse.js        # Standardized API responses
│   │   ├── authUtils.js          # Authentication utilities
│   │   ├── email.js              # Email sending utilities
│   │   ├── helpers.js            # General helper functions
│   │   └── validation.js         # Validation helpers
│   │
│   ├── app.js                     # Express app configuration
│   └── server.js                  # Server entry point
│
├── uploads/                       # File upload storage
│   └── profiles/                  # Profile image uploads
│
├── database_schema.sql            # MySQL database schema
├── database_diagram.md            # Database ER diagram
├── API_DOCUMENTATION.md           # Detailed API documentation
├── LOGIN_API_GUIDE.txt            # Login API guide
├── REGISTRATION_API_GUIDE.txt     # Registration API guide
├── GlobeTrotter_problem_statement.txt # Project requirements
├── .env.example                   # Environment template
├── package.json                   # Node.js dependencies
└── README.md                      # This file
```

---

## 🌐 API Endpoints

### Base URL

```
http://localhost:5000/api
```

### Endpoint Overview

| Category   | Endpoint      | Description                             |
| ---------- | ------------- | --------------------------------------- |
| **Health** | `GET /health` | Health check endpoint                   |
| **Root**   | `GET /`       | API information and available endpoints |

### Authentication & Authorization

| Method | Endpoint                    | Description            | Auth Required |
| ------ | --------------------------- | ---------------------- | ------------- |
| POST   | `/api/auth/register`        | Register new user      | No            |
| POST   | `/api/auth/login`           | User login             | No            |
| POST   | `/api/auth/logout`          | User logout            | Yes           |
| POST   | `/api/auth/refresh`         | Refresh access token   | Yes           |
| POST   | `/api/auth/forgot-password` | Request password reset | No            |
| POST   | `/api/auth/reset-password`  | Reset password         | No            |
| POST   | `/api/auth/verify-email`    | Verify email address   | No            |

### User Management

| Method | Endpoint                     | Description             | Auth Required |
| ------ | ---------------------------- | ----------------------- | ------------- |
| GET    | `/api/users/profile`         | Get user profile        | Yes           |
| PUT    | `/api/users/profile`         | Update user profile     | Yes           |
| POST   | `/api/users/profile/picture` | Upload profile picture  | Yes           |
| DELETE | `/api/users/profile/picture` | Delete profile picture  | Yes           |
| GET    | `/api/users/:userId`         | Get user by ID          | Yes           |
| PUT    | `/api/users/preferences`     | Update user preferences | Yes           |

### Trip Management

| Method | Endpoint                           | Description      | Auth Required |
| ------ | ---------------------------------- | ---------------- | ------------- |
| POST   | `/api/trips`                       | Create new trip  | Yes           |
| GET    | `/api/trips`                       | Get user's trips | Yes           |
| GET    | `/api/trips/:tripId`               | Get trip details | Yes           |
| PUT    | `/api/trips/:tripId`               | Update trip      | Yes           |
| DELETE | `/api/trips/:tripId`               | Delete trip      | Yes           |
| POST   | `/api/trips/:tripId/stops`         | Add trip stop    | Yes           |
| PUT    | `/api/trips/:tripId/stops/:stopId` | Update trip stop | Yes           |
| DELETE | `/api/trips/:tripId/stops/:stopId` | Delete trip stop | Yes           |

### Activities

| Method | Endpoint                      | Description          | Auth Required |
| ------ | ----------------------------- | -------------------- | ------------- |
| GET    | `/api/activities`             | Get all activities   | Yes           |
| GET    | `/api/activities/:activityId` | Get activity details | Yes           |
| POST   | `/api/activities`             | Create activity      | Yes           |
| PUT    | `/api/activities/:activityId` | Update activity      | Yes           |
| DELETE | `/api/activities/:activityId` | Delete activity      | Yes           |

### Countries & Cities

| Method | Endpoint                           | Description           | Auth Required |
| ------ | ---------------------------------- | --------------------- | ------------- |
| GET    | `/api/countries`                   | Get all countries     | No            |
| GET    | `/api/countries/:countryId`        | Get country details   | No            |
| GET    | `/api/cities`                      | Get all cities        | No            |
| GET    | `/api/cities/:cityId`              | Get city details      | No            |
| GET    | `/api/countries/:countryId/cities` | Get cities by country | No            |

### Expense Tracking

| Method | Endpoint                                 | Description            | Auth Required |
| ------ | ---------------------------------------- | ---------------------- | ------------- |
| GET    | `/api/expense-categories`                | Get expense categories | Yes           |
| POST   | `/api/trips/:tripId/expenses`            | Add expense to trip    | Yes           |
| GET    | `/api/trips/:tripId/expenses`            | Get trip expenses      | Yes           |
| PUT    | `/api/trips/:tripId/expenses/:expenseId` | Update expense         | Yes           |
| DELETE | `/api/trips/:tripId/expenses/:expenseId` | Delete expense         | Yes           |

### Wishlist

| Method | Endpoint                | Description          | Auth Required |
| ------ | ----------------------- | -------------------- | ------------- |
| GET    | `/api/wishlist`         | Get user's wishlist  | Yes           |
| POST   | `/api/wishlist`         | Add item to wishlist | Yes           |
| DELETE | `/api/wishlist/:itemId` | Remove from wishlist | Yes           |

### Social Features

| Method | Endpoint                             | Description        | Auth Required |
| ------ | ------------------------------------ | ------------------ | ------------- |
| POST   | `/api/social/follow/:userId`         | Follow a user      | Yes           |
| DELETE | `/api/social/unfollow/:userId`       | Unfollow a user    | Yes           |
| GET    | `/api/social/followers`              | Get followers      | Yes           |
| GET    | `/api/social/following`              | Get following list | Yes           |
| POST   | `/api/social/trips/:tripId/like`     | Like a trip        | Yes           |
| DELETE | `/api/social/trips/:tripId/unlike`   | Unlike a trip      | Yes           |
| POST   | `/api/social/trips/:tripId/comments` | Comment on trip    | Yes           |

### Collaboration

| Method | Endpoint                                           | Description             | Auth Required |
| ------ | -------------------------------------------------- | ----------------------- | ------------- |
| POST   | `/api/collaboration/trips/:tripId/invite`          | Invite collaborator     | Yes           |
| GET    | `/api/collaboration/invitations`                   | Get pending invitations | Yes           |
| PUT    | `/api/collaboration/invitations/:inviteId/accept`  | Accept invitation       | Yes           |
| PUT    | `/api/collaboration/invitations/:inviteId/decline` | Decline invitation      | Yes           |

### Documents

| Method | Endpoint                     | Description          | Auth Required |
| ------ | ---------------------------- | -------------------- | ------------- |
| POST   | `/api/documents/upload`      | Upload document      | Yes           |
| GET    | `/api/documents`             | Get user documents   | Yes           |
| GET    | `/api/documents/:documentId` | Get document details | Yes           |
| DELETE | `/api/documents/:documentId` | Delete document      | Yes           |

### Notifications

| Method | Endpoint                                  | Description            | Auth Required |
| ------ | ----------------------------------------- | ---------------------- | ------------- |
| GET    | `/api/notifications`                      | Get user notifications | Yes           |
| PUT    | `/api/notifications/:notificationId/read` | Mark as read           | Yes           |
| PUT    | `/api/notifications/read-all`             | Mark all as read       | Yes           |
| DELETE | `/api/notifications/:notificationId`      | Delete notification    | Yes           |

### Search

| Method | Endpoint                   | Description         | Auth Required |
| ------ | -------------------------- | ------------------- | ------------- |
| GET    | `/api/search`              | Global search       | Yes           |
| GET    | `/api/search/trips`        | Search trips        | Yes           |
| GET    | `/api/search/users`        | Search users        | Yes           |
| GET    | `/api/search/destinations` | Search destinations | Yes           |

### Admin Panel

| Method | Endpoint                          | Description             | Auth Required |
| ------ | --------------------------------- | ----------------------- | ------------- |
| GET    | `/api/admin/users`                | Get all users           | Admin         |
| PUT    | `/api/admin/users/:userId/status` | Update user status      | Admin         |
| DELETE | `/api/admin/users/:userId`        | Delete user             | Admin         |
| GET    | `/api/admin/stats`                | Get platform statistics | Admin         |

For detailed request/response examples, see [API_DOCUMENTATION.md](API_DOCUMENTATION.md).

---

## 🔐 Authentication

### JWT-Based Authentication

The API uses JSON Web Tokens (JWT) for authentication:

1. **Register/Login**: User receives access token and refresh token
2. **Access Token**: Short-lived token (24h) for API requests
3. **Refresh Token**: Long-lived token (7d) for obtaining new access tokens

### Authentication Flow

```
1. User registers or logs in
   ↓
2. Server validates credentials
   ↓
3. Server generates JWT tokens
   ↓
4. Client stores tokens (localStorage/cookies)
   ↓
5. Client includes token in Authorization header
   ↓
6. Server validates token on each request
```

### Using Authentication

Include the JWT token in request headers:

```javascript
headers: {
  'Authorization': 'Bearer YOUR_JWT_TOKEN',
  'Content-Type': 'application/json'
}
```

### Token Refresh

When access token expires:

```javascript
POST /api/auth/refresh
{
  "refreshToken": "YOUR_REFRESH_TOKEN"
}
```

---

## 🛡️ Middleware

### Security Middleware

- **helmet**: Sets secure HTTP headers
- **cors**: Enables Cross-Origin Resource Sharing
- **rate-limiter**: Prevents brute-force attacks
- **express-validator**: Input validation and sanitization

### Authentication Middleware

- **authMiddleware.js**: Verifies JWT tokens
- **adminMiddleware.js**: Checks admin privileges

### Upload Middleware

- **upload.js**: Configures multer for file uploads
- **documentUploadMiddleware.js**: Handles document uploads

### Error Handling

- **errorHandler.js**: Global error handler with proper HTTP status codes

---

## 📊 Models

All models use MySQL with connection pooling for optimal performance:

- **User**: User accounts and profiles
- **Trip**: Trip planning and itineraries
- **TripStop**: Individual stops within trips
- **Activity**: Activities and attractions
- **Country**: Country data
- **City**: City data
- **Expense**: Expense tracking
- **Wishlist**: User wishlists
- **Document**: Travel documents
- **Notification**: User notifications
- **Collaboration**: Trip collaboration
- **Social**: Social interactions (follows, likes, comments)
- **Admin**: Admin users and privileges

See [database_diagram.md](database_diagram.md) for ER diagram.

---

## ⚠️ Error Handling

### Standardized Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message",
  "stack": "Stack trace (development only)"
}
```

### HTTP Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **409**: Conflict
- **422**: Unprocessable Entity
- **429**: Too Many Requests
- **500**: Internal Server Error

---

## 🔒 Security Features

### Implemented Security Measures

1. **Password Hashing**: bcrypt with salt rounds
2. **JWT Tokens**: Secure token-based authentication
3. **Input Validation**: express-validator for all inputs
4. **SQL Injection Prevention**: Parameterized queries
5. **XSS Protection**: Helmet security headers
6. **CORS Configuration**: Restricted origins
7. **Rate Limiting**: Prevent brute-force attacks
8. **File Upload Validation**: Type and size restrictions
9. **Environment Variables**: Sensitive data protection
10. **Error Handling**: No sensitive data in error messages

### Security Best Practices

- Always use HTTPS in production
- Regularly update dependencies
- Use strong JWT secrets
- Implement request logging
- Monitor for suspicious activities
- Regular security audits

---

## 📤 File Upload

### Supported File Types

**Profile Pictures**:

- JPEG, PNG, GIF
- Max size: 5MB

**Documents**:

- PDF, JPEG, PNG
- Max size: 10MB

### Upload Configuration

Files are stored in the `uploads/` directory with organized subdirectories:

- `uploads/profiles/` - Profile pictures
- `uploads/documents/` - Travel documents

### Upload Endpoint Example

```javascript
POST /api/users/profile/picture
Content-Type: multipart/form-data

FormData:
  profilePicture: [file]
```

---

## 🧪 Testing

### Run Tests

```bash
npm test
```

### Run Tests with Coverage

```bash
npm test -- --coverage
```

### Testing Framework

- **Jest**: Testing framework
- Unit tests for models
- Integration tests for API endpoints
- Mocking database connections

---

## 🚀 Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Update JWT secrets
- [ ] Configure production database
- [ ] Set up SSL/TLS certificates
- [ ] Configure reverse proxy (Nginx)
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Update CORS origins
- [ ] Set up CI/CD pipeline
- [ ] Configure email service

### Environment Variables for Production

Update `.env` with production values:

```env
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://yourdomain.com
DB_HOST=your-production-db-host
JWT_SECRET=your-strong-production-secret
# ... other production configs
```

### Recommended Hosting Platforms

- **VPS**: DigitalOcean, Linode, AWS EC2
- **Platform as a Service**: Heroku, Railway, Render
- **Database**: AWS RDS, Google Cloud SQL, DigitalOcean Managed Databases

---

## 🔄 Scripts

Available npm scripts:

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run tests
npm run lint       # Run ESLint code linting
```

---

## 📚 Additional Documentation

- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Complete API endpoint documentation
- **[database_diagram.md](database_diagram.md)** - Database entity-relationship diagram
- **[database_schema.sql](database_schema.sql)** - MySQL database schema
- **[LOGIN_API_GUIDE.txt](LOGIN_API_GUIDE.txt)** - Login API usage guide
- **[REGISTRATION_API_GUIDE.txt](REGISTRATION_API_GUIDE.txt)** - Registration API guide
- **[GlobeTrotter_problem_statement.txt](GlobeTrotter_problem_statement.txt)** - Project requirements

---

## 🐛 Troubleshooting

### Common Issues

**Database Connection Failed**

```bash
# Check MySQL is running
sudo systemctl status mysql

# Verify credentials in .env
DB_USER=root
DB_PASSWORD=your_password
```

**Port Already in Use**

```bash
# Find process using port 5000
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process or change PORT in .env
```

**JWT Token Errors**

- Ensure JWT_SECRET is set in `.env`
- Check token expiration settings
- Verify Authorization header format

**File Upload Issues**

- Check `uploads/` directory permissions
- Verify MAX_FILE_SIZE in `.env`
- Ensure correct Content-Type header

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- Follow existing code conventions
- Use meaningful variable names
- Add comments for complex logic
- Run `npm run lint` before committing

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 Team

**GlobeTrotter Development Team**

- Backend Developer: Akshay Vinod Jha
- Additional contributors welcome!

---

## 📞 Support

For questions and support:

- Create an issue in the repository
- Contact the development team
- Check existing documentation

---

## 🗺️ Roadmap

### Upcoming Features

- [ ] Real-time notifications with WebSockets
- [ ] Trip recommendation engine
- [ ] Integration with flight/hotel booking APIs
- [ ] Mobile app support
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Currency conversion API integration
- [ ] Weather integration
- [ ] AI-powered itinerary suggestions

---

## 📈 Version History

- **v1.0.0** (2026-01-03)
  - Initial release
  - Core API endpoints
  - Authentication system
  - Trip management
  - Social features
  - Document management

---

**Built with ❤️ by the GlobeTrotter Team**
