import { Link } from 'react-router-dom';
import { Wallet, Calendar, MapPin, Plus, ArrowRight, Sparkles } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import useStore from '../store/useStore';
import { cities } from '../data/cities';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { currentUser, trips } = useStore();

  const userTrips = trips.filter(t => t.userId === currentUser?.id);
  const upcomingTrips = userTrips
    .filter(trip => new Date(trip.startDate) >= new Date())
    .slice(0, 3);

  const totalBudget = userTrips.reduce((sum, trip) => sum + (trip.budget?.total || 0), 0);
  const totalDays = userTrips.reduce((sum, trip) => {
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    return sum + Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  }, 0);
  const totalCities = userTrips.reduce((sum, trip) => sum + (trip.cities?.length || 0), 0);

  const recommendedCities = cities.slice(0, 6);

  return (
    <MainLayout>
      <div className={styles.container}>
        {/* Welcome Section */}
        <div className={styles.header}>
          <h1 className={styles.title}>
            Welcome back, {currentUser?.name || 'Traveler'}!
          </h1>
          <p className={styles.subtitle}>Plan your next adventure with GlobeTrotter</p>
        </div>

        {/* Quick Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statContent}>
              <div className={styles.statInfo}>
                <p className={styles.statLabel}>Total Budget</p>
                <p className={styles.statValue}>${totalBudget.toLocaleString()}</p>
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
        </div>

        {/* Plan New Trip CTA */}
        <div className={styles.ctaCard}>
          <div className={styles.ctaIcon}>
            <Sparkles size={40} />
          </div>
          <h2 className={styles.ctaTitle}>Ready for your next adventure?</h2>
          <p className={styles.ctaSubtitle}>Create a new trip and start planning today</p>
          <Link to="/create-trip" className={styles.ctaButton}>
            <Plus size={20} />
            <span>Plan New Trip</span>
          </Link>
        </div>

        {/* Upcoming Trips */}
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
                    src={trip.coverImage}
                    alt={trip.name}
                    className={styles.tripImage}
                  />
                  <div className={styles.tripContent}>
                    <h3 className={styles.tripName}>{trip.name}</h3>
                    <p className={styles.tripDate}>
                      {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                    </p>
                    <p className={styles.tripCities}>{trip.cities?.length || 0} cities</p>
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

        {/* Recommended Destinations */}
        <div>
          <h2 className={styles.sectionTitle} style={{ marginBottom: '1rem' }}>Recommended Destinations</h2>
          <div className={styles.citiesGrid}>
            {recommendedCities.map((city) => (
              <Link
                key={city.id}
                to={`/cities?city=${city.id}`}
                className={styles.cityCard}
              >
                <img
                  src={city.image}
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
      </div>
    </MainLayout>
  );
};

export default Dashboard;

