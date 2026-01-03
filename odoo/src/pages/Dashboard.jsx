import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Wallet,
  Calendar,
  MapPin,
  Plus,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import Reveal from "../components/Reveal";
import useStore from "../store/useStore";
import { mockTrips } from "../data/trips";
import { cities as mockCities } from "../data/cities";
import { getUserTrips } from "../services/tripService";
import { getUserStatistics } from "../services/userService";
import { getCities } from "../services/locationService";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const { currentUser } = useStore();
  const [trips, setTrips] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [recommendedCities, setRecommendedCities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError("");

      try {
        // Fetch user trips
        const tripsResponse = await getUserTrips();
        if (tripsResponse.success) {
          setTrips(tripsResponse.data.trips || []);
        }

        // Fetch user statistics
        const statsResponse = await getUserStatistics();
        if (statsResponse.success) {
          setStatistics(statsResponse.data);
        }

        // Fetch recommended cities
        const citiesResponse = await getCities({ limit: 6 });
        if (citiesResponse.success) {
          setRecommendedCities(citiesResponse.data.cities || []);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        // Use mock data as fallback
        setTrips(mockTrips.slice(0, 3).map(trip => ({
          ...trip,
          stops: trip.cities,
          totalBudget: trip.budget?.total || 0
        })));
        setRecommendedCities(mockCities.slice(0, 6).map(city => ({
          id: city.id,
          name: city.name,
          country: city.country,
          imageUrl: city.image,
          description: city.description
        })));
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser) {
      fetchDashboardData();
    }
  }, [currentUser]);

  const upcomingTrips = trips
    .filter((trip) => new Date(trip.startDate) >= new Date())
    .slice(0, 3);

  // Use statistics from API if available, otherwise calculate from trips
  const totalBudget =
    statistics?.totalBudget ||
    trips.reduce((sum, trip) => sum + (trip.totalBudget || 0), 0);
  const totalDays =
    statistics?.totalTravelDays ||
    trips.reduce((sum, trip) => {
      const start = new Date(trip.startDate);
      const end = new Date(trip.endDate);
      return sum + Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    }, 0);
  const totalCities =
    statistics?.totalCitiesVisited ||
    trips.reduce((sum, trip) => sum + (trip.stops?.length || 0), 0);

  return (
    <MainLayout>
      <div className={styles.container}>
        {/* Welcome Section */}
        <Reveal animation="fade">
          <div className={styles.header}>
            <h1 className={styles.title}>
              Welcome back,{" "}
              {currentUser?.firstName || currentUser?.name || "Traveler"}!
            </h1>
            <p className={styles.subtitle}>
              Plan your next adventure with GlobeTrotter
            </p>
          </div>
        </Reveal>

        {error && (
          <div
            style={{
              padding: "var(--space-md)",
              backgroundColor: "var(--error)",
              color: "white",
              borderRadius: "var(--radius-md)",
              marginBottom: "var(--space-lg)",
            }}
          >
            {error}
          </div>
        )}

        {isLoading ? (
          <div
            style={{
              textAlign: "center",
              padding: "var(--space-2xl)",
              color: "var(--text-secondary)",
            }}
          >
            Loading dashboard...
          </div>
        ) : (
          <>
            {/* Quick Stats */}
            <Reveal animation="up" delay={0.1}>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                <div className={styles.statContent}>
                  <div className={styles.statInfo}>
                    <p className={styles.statLabel}>Total Budget</p>
                    <p className={styles.statValue}>
                      ${totalBudget.toLocaleString()}
                    </p>
                  </div>
                  <div className={styles.statIcon}>
                    <Wallet size={32} />
                  </div>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statContent}>
                  <div className={styles.statInfo}>
                    <p className={styles.statLabel}>Total Days</p>
                    <p className={styles.statValue}>{totalDays}</p>
                  </div>
                  <div className={styles.statIcon}>
                    <Calendar size={32} />
                  </div>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statContent}>
                  <div className={styles.statInfo}>
                    <p className={styles.statLabel}>Cities Visited</p>
                    <p className={styles.statValue}>{totalCities}</p>
                  </div>
                  <div className={styles.statIcon}>
                    <MapPin size={32} />
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Plan New Trip CTA */}
            <Reveal animation="scale" delay={0.2}>
              <div className={styles.ctaCard}>
              <div className={styles.ctaIcon}>
                <Sparkles size={40} />
              </div>
              <h2 className={styles.ctaTitle}>
                Ready for your next adventure?
              </h2>
              <p className={styles.ctaSubtitle}>
                Create a new trip and start planning today
              </p>
              <Link to="/create-trip" className={styles.ctaButton}>
                <Plus size={20} />
                <span>Plan New Trip</span>
              </Link>
            </div>
            </Reveal>

            {/* Upcoming Trips */}
            <Reveal animation="up" delay={0.3}>
              <div>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Upcoming Trips</h2>
                <Link to="/my-trips" className={styles.viewAllLink}>
                  View All
                  <ArrowRight size={16} />
                </Link>
              </div>

              {upcomingTrips.length > 0 ? (
                <div className={styles.tripsGrid}>
                  {upcomingTrips.map((trip) => (
                    <Link
                      key={trip.id}
                      to={`/trip/${trip.id}/view`}
                      className={styles.tripCard}
                    >
                      <img
                        src={
                          trip.coverImage ||
                          "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400"
                        }
                        alt={trip.name}
                        className={styles.tripImage}
                      />
                      <div className={styles.tripContent}>
                        <h3 className={styles.tripName}>{trip.name}</h3>
                        <p className={styles.tripDate}>
                          {new Date(trip.startDate).toLocaleDateString()} -{" "}
                          {new Date(trip.endDate).toLocaleDateString()}
                        </p>
                        <p className={styles.tripCities}>
                          {trip.stops?.length || 0} stops
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <p className={styles.emptyText}>No upcoming trips yet</p>
                  <Link to="/create-trip" className={styles.emptyLink}>
                    Create your first trip
                  </Link>
                </div>
              )}
            </div>
            </Reveal>

            {/* Recommended Destinations */}
            <Reveal animation="up" delay={0.4}>
              <div>
              <h2
                className={styles.sectionTitle}
                style={{ marginBottom: "1rem" }}
              >
                Recommended Destinations
              </h2>
              <div className={styles.citiesGrid}>
                {recommendedCities.map((city) => (
                  <Link
                    key={city.id}
                    to={`/cities?city=${city.id}`}
                    className={styles.cityCard}
                  >
                    <img
                      src={
                        city.imageUrl ||
                        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400"
                      }
                      alt={city.name}
                      className={styles.cityImage}
                    />
                    <div className={styles.cityContent}>
                      <h3 className={styles.cityName}>{city.name}</h3>
                      <p className={styles.cityCountry}>{city.country}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            </Reveal>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Dashboard;
