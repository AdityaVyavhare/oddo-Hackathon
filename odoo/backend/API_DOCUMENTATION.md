# GlobeTrotter Backend API

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- MySQL >= 8.0
- npm >= 9.0.0

### Installation

1. **Install dependencies:**

```bash
npm install
```

2. **Configure environment variables:**

```bash
cp .env.example .env
```

Edit `.env` and set your MySQL credentials and other configurations.

3. **Set up the database:**

```bash
# Login to MySQL
mysql -u root -p

# Run the database schema
source database_schema.sql
```

4. **Start the development server:**

```bash
npm run dev
```

The API will be running at `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files (database, etc.)
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   │   └── validators/  # Input validation rules
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   ├── app.js          # Express app configuration
│   └── server.js       # Server entry point
├── uploads/            # Uploaded files storage
├── database_schema.sql # MySQL database schema
├── .env.example        # Environment variables template
└── package.json        # Project dependencies
```

## 🔐 Authentication API

### Register User

**POST** `/api/auth/register`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "username": "johndoe",
  "phoneNumber": "+1234567890",
  "dateOfBirth": "1990-01-15",
  "city": "New York",
  "country": "USA",
  "bio": "Travel enthusiast",
  "nationality": "United States",
  "preferredCurrency": "USD",
  "preferredLanguage": "en",
  "acceptedTerms": true,
  "acceptedPrivacy": true
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Registration successful. Please verify your email.",
  "data": {
    "user": {
      "userId": 1,
      "email": "user@example.com",
      "username": "johndoe",
      "firstName": "John",
      "lastName": "Doe",
      "profilePictureUrl": null,
      "emailVerified": false,
      "isActive": true,
      "createdAt": "2026-01-03T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  },
  "meta": {
    "verificationEmailSent": false,
    "verificationExpiresIn": 86400
  }
}
```

### Login User

**POST** `/api/auth/login`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "userId": 1,
      "email": "user@example.com",
      "username": "johndoe",
      "firstName": "John",
      "lastName": "Doe",
      "profilePictureUrl": null,
      "emailVerified": true,
      "isActive": true,
      "isPremium": false
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

## 📝 Field Validations

### Required Fields

- `email` - Valid email format, unique
- `password` - Min 8 chars, must contain uppercase, lowercase, number, special char
- `confirmPassword` - Must match password
- `firstName` - 2-100 chars, letters only
- `lastName` - 2-100 chars, letters only
- `acceptedTerms` - Must be true
- `acceptedPrivacy` - Must be true

### Optional Fields

- `username` - 3-50 chars, alphanumeric + underscore (auto-generated if not provided)
- `phoneNumber` - E.164 format
- `dateOfBirth` - User must be 13+ years old
- `profilePicture` - Image file (JPEG/PNG/WebP, max 5MB)
- `city`, `country`, `bio`, `nationality`
- `preferredCurrency` - 3-letter currency code
- `preferredLanguage` - Language code

## 🔒 Security Features

- Password hashing with bcrypt (12 rounds)
- JWT authentication
- Input validation with express-validator
- File upload validation (type, size)
- CORS configuration
- Helmet security headers
- Rate limiting
- SQL injection prevention (parameterized queries)

## 🛠️ Available Scripts

```bash
npm start       # Start production server
npm run dev     # Start development server with nodemon
npm test        # Run tests
npm run lint    # Run ESLint
```

## 📊 Database

The database schema includes:

- 25+ tables with proper relationships
- Triggers for auto-updating counts
- Views for complex queries
- Stored procedures for common operations

See `database_schema.sql` and `database_diagram.md` for details.

## 🌐 Environment Variables

See `.env.example` for all available configuration options.

## 📫 API Response Format

**Success Response:**

```json
{
  "success": true,
  "message": "Success message",
  "data": { ... },
  "meta": { ... }
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Email already exists"
    }
  ]
}
```

## 🚧 Coming Soon

- Email verification
- Password reset
- Social authentication (Google, Facebook)
- Trip management APIs
- Activity search APIs
- Budget tracking APIs

---

**Made with ❤️ by GlobeTrotter Team**
