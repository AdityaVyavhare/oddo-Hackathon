# 🌍 GlobeTrotter - Your Ultimate Travel Planning Companion

![GlobeTrotter](https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=300&fit=crop)

A modern, full-stack travel planning application that helps you discover destinations, plan itineraries, manage budgets, and create unforgettable travel experiences.

## ✨ Features

### 🎯 Core Features

- **Smart Trip Planning** - Create and manage multiple trips with detailed itineraries
- **City Discovery** - Explore thousands of destinations worldwide with rich information
- **Activity Search** - Find and add activities to your trip with ratings and costs
- **Budget Management** - Track expenses with visual charts and real-time calculations
- **Interactive Calendar** - View trip schedule with day-by-day breakdown
- **Itinerary Builder** - Drag-and-drop interface for organizing your travel plans
- **User Profiles** - Manage personal information and travel preferences
- **Social Sharing** - Share trip itineraries with friends and family

### 🎨 UI/UX Features

- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Dark Mode Support** - Toggle between light and dark themes
- **Reveal Animations** - Smooth scroll-triggered animations using Intersection Observer
- **Modern Aesthetics** - Clean blue-teal color palette with premium design
- **Interactive Components** - Hover effects, transitions, and micro-interactions

### 🔐 Authentication & Security

- **JWT Authentication** - Secure user authentication with access and refresh tokens
- **Password Encryption** - bcrypt hashing for user passwords
- **Protected Routes** - Client-side route protection
- **CORS Configuration** - Secure cross-origin resource sharing

## 🛠️ Tech Stack

### Frontend

- **React 18** - Modern React with hooks and functional components
- **Vite** - Lightning-fast build tool and dev server
- **React Router 6** - Client-side routing and navigation
- **Zustand** - Lightweight state management
- **Recharts** - Beautiful charts for budget visualization
- **Lucide React** - Modern icon library
- **CSS Modules** - Scoped styling with CSS variables

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MySQL** - Relational database
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **Multer** - File upload handling
- **dotenv** - Environment configuration

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20.15.0 or higher)
- **npm** (v10.7.0 or higher)
- **MySQL** (v8.0 or higher)
- **Git**

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/globetrotter.git
cd globetrotter
```

### 2. Backend Setup

#### Install Dependencies

```bash
cd odoo/backend
npm install
```

#### Database Configuration

1. Create a MySQL database:

```sql
CREATE DATABASE globetrotter;
```

2. Import the database schema:

```bash
mysql -u root -p globetrotter < database_schema.sql
```

#### Environment Configuration

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
HOST=0.0.0.0

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=globetrotter

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

#### Start Backend Server

```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

#### Install Dependencies

```bash
cd ../odoo
npm install
```

#### Environment Configuration

Create a `.env` file in the `odoo` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

#### Start Frontend Development Server

```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## 📁 Project Structure

```
globetrotter/
├── odoo/                           # Frontend Application
│   ├── public/                     # Static assets
│   │   └── logo-icon.svg          # App logo/favicon
│   ├── src/
│   │   ├── assets/                # Images, fonts, etc.
│   │   ├── components/            # Reusable components
│   │   │   ├── ActivityMeta.jsx
│   │   │   ├── Logo.jsx
│   │   │   ├── PageTransition.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── Reveal.jsx         # Scroll reveal component
│   │   ├── data/                  # Static mock data
│   │   │   ├── activities.js
│   │   │   ├── cities.js
│   │   │   ├── trips.js
│   │   │   └── users.js
│   │   ├── hooks/                 # Custom React hooks
│   │   │   └── useIntersectionObserver.js
│   │   ├── layouts/               # Layout components
│   │   │   ├── AuthLayout.jsx
│   │   │   └── MainLayout.jsx
│   │   ├── pages/                 # Page components
│   │   │   ├── ActivitySearch.jsx
│   │   │   ├── Admin.jsx
│   │   │   ├── Budget.jsx
│   │   │   ├── Calendar.jsx
│   │   │   ├── CitySearch.jsx
│   │   │   ├── CreateTrip.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ItineraryBuilder.jsx
│   │   │   ├── ItineraryView.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MyTrips.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── SharedItinerary.jsx
│   │   │   └── Signup.jsx
│   │   ├── services/              # API service layer
│   │   │   ├── api.js
│   │   │   ├── activityService.js
│   │   │   ├── authService.js
│   │   │   ├── locationService.js
│   │   │   ├── notificationService.js
│   │   │   ├── searchService.js
│   │   │   ├── socialService.js
│   │   │   ├── tripService.js
│   │   │   ├── userService.js
│   │   │   └── wishlistService.js
│   │   ├── store/                 # Zustand state management
│   │   │   └── useStore.js
│   │   ├── styles/                # Global styles
│   │   │   ├── animations.css
│   │   │   ├── common.module.css
│   │   │   ├── layoutPatterns.css
│   │   │   └── pageTransitions.css
│   │   ├── utils/                 # Utility functions
│   │   │   └── helpers.js
│   │   ├── App.jsx                # Root component
│   │   ├── main.jsx               # Entry point
│   │   └── index.css              # Global CSS
│   ├── .env                       # Environment variables
│   ├── .env.example               # Example env file
│   ├── index.html                 # HTML template
│   ├── package.json
│   └── vite.config.js
│
└── backend/                       # Backend API
    ├── src/
    │   ├── config/                # Configuration files
    │   │   ├── database.js
    │   │   └── jwt.js
    │   ├── controllers/           # Route controllers
    │   │   ├── activityController.js
    │   │   ├── authController.js
    │   │   ├── cityController.js
    │   │   ├── tripController.js
    │   │   └── userController.js
    │   ├── middleware/            # Express middleware
    │   │   ├── adminMiddleware.js
    │   │   └── auth.js
    │   ├── models/                # Database models
    │   ├── routes/                # API routes
    │   ├── utils/                 # Utility functions
    │   ├── app.js                 # Express app setup
    │   └── server.js              # Server entry point
    ├── uploads/                   # User uploaded files
    │   ├── documents/
    │   └── profiles/
    ├── .env                       # Environment variables
    ├── database_schema.sql        # Database schema
    ├── API_DOCUMENTATION.md       # API documentation
    └── package.json
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

### Users

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/password` - Change password
- `GET /api/users/statistics` - Get user statistics

### Trips

- `GET /api/trips` - Get all user trips
- `GET /api/trips/:id` - Get trip by ID
- `POST /api/trips` - Create new trip
- `PUT /api/trips/:id` - Update trip
- `DELETE /api/trips/:id` - Delete trip

### Cities

- `GET /api/cities` - Get all cities
- `GET /api/cities/:id` - Get city by ID
- `GET /api/cities/search` - Search cities

### Activities

- `GET /api/activities` - Get all activities
- `GET /api/activities/:id` - Get activity by ID
- `GET /api/activities/search` - Search activities

For detailed API documentation, see [API_DOCUMENTATION.md](odoo/backend/API_DOCUMENTATION.md)

## 🎮 Usage Guide

### 1. Register an Account

- Navigate to `/signup`
- Fill in your details (name, email, password)
- Click "Sign Up"

### 2. Create a Trip

- Go to Dashboard
- Click "Plan New Trip"
- Enter trip details (name, dates, description)
- Upload a cover image (optional)
- Click "Create Trip"

### 3. Build Your Itinerary

- From My Trips, click "Edit" on a trip
- Add cities to your trip
- Add activities to each city
- Organize your schedule

### 4. Manage Budget

- Click on "Budget" for any trip
- View budget breakdown by category
- Track expenses with visual charts
- Monitor budget vs actual spending

### 5. View Calendar

- Access the Calendar view for any trip
- See day-by-day schedule
- View activities for each day
- Switch between calendar and timeline views

## 🎨 Design System

### Color Palette

- **Primary Blue**: `#4A7DB0`
- **Secondary Teal**: `#2A9D8F`
- **Accent Orange**: `#F4A261`
- **Success Green**: `#10B981`
- **Error Red**: `#EF4444`

### Typography

- **Headings**: Poppins (Bold, 600-700 weight)
- **Body**: Inter (Regular, 400-500 weight)

### Spacing Scale

- Based on 8px grid system
- Variables: `--space-xs` to `--space-3xl`

## 🧪 Testing

### Frontend

```bash
cd odoo
npm run lint
```

### Backend

```bash
cd backend
npm run lint
```

## 📦 Building for Production

### Frontend

```bash
cd odoo
npm run build
```

Output will be in `dist/` directory

### Backend

```bash
cd backend
npm start
```

## 🌐 Environment Variables

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

### Backend (.env)

```env
NODE_ENV=production
PORT=5000
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=globetrotter
JWT_SECRET=your_production_secret
CORS_ORIGIN=https://yourdomain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Code Style

- Use ESLint configuration provided
- Follow React best practices
- Use functional components with hooks
- Write meaningful commit messages
- Comment complex logic

## 🐛 Known Issues

- File upload size limited to 10MB
- Some animations may not work on older browsers
- Mobile responsiveness needs testing on all devices

## 🔮 Future Enhancements

- [ ] Real-time collaboration on trips
- [ ] Integration with booking APIs
- [ ] Weather forecast integration
- [ ] Currency conversion
- [ ] Offline mode with PWA
- [ ] Social features (follow users, like trips)
- [ ] AI-powered trip recommendations
- [ ] Mobile app (React Native)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## 👥 Authors

- **Your Name** - _Initial work_ - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Images from [Unsplash](https://unsplash.com)
- Icons from [Lucide](https://lucide.dev)
- Design inspiration from modern travel apps
- Community support from React and Node.js communities

## 📞 Support

For support, email support@globetrotter.com or join our Slack channel.

## 🔗 Links

- **Live Demo**: [https://globetrotter-demo.com](https://globetrotter-demo.com)
- **Documentation**: [https://docs.globetrotter.com](https://docs.globetrotter.com)
- **Bug Reports**: [GitHub Issues](https://github.com/yourusername/globetrotter/issues)

---

Made with ❤️ by the GlobeTrotter Team
