import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import PageTransition from "./components/PageTransition";
import ProtectedRoute from "./components/ProtectedRoute";
import useStore from "./store/useStore";
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";

// Auth Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Main Pages
import Dashboard from "./pages/Dashboard";
import CreateTrip from "./pages/CreateTrip";
import MyTrips from "./pages/MyTrips";
import ItineraryBuilder from "./pages/ItineraryBuilder";
import ItineraryView from "./pages/ItineraryView";
import CitySearch from "./pages/CitySearch";
import ActivitySearch from "./pages/ActivitySearch";
import Budget from "./pages/Budget";
import Calendar from "./pages/Calendar";
import Profile from "./pages/Profile";
import SharedItinerary from "./pages/SharedItinerary";
import Admin from "./pages/Admin";

function App() {
  const { theme } = useStore();

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  // Update theme when it changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <Router>
      <PageTransition>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/shared/:tripId" element={<SharedItinerary />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-trip"
            element={
              <ProtectedRoute>
                <CreateTrip />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-trips"
            element={
              <ProtectedRoute>
                <MyTrips />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trip/:tripId/itinerary"
            element={
              <ProtectedRoute>
                <ItineraryBuilder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trip/:tripId/view"
            element={
              <ProtectedRoute>
                <ItineraryView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trip/:tripId/budget"
            element={
              <ProtectedRoute>
                <Budget />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trip/:tripId/calendar"
            element={
              <ProtectedRoute>
                <Calendar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cities"
            element={
              <ProtectedRoute>
                <CitySearch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/activities"
            element={
              <ProtectedRoute>
                <ActivitySearch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </PageTransition>
    </Router>
  );
}

export default App;
