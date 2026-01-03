import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import useStore from '../store/useStore';
import styles from './MyTrips.module.css';

const MyTrips = () => {
  const { currentUser, trips, deleteTrip } = useStore();

  const userTrips = trips.filter(t => t.userId === currentUser?.id);

  const handleDelete = (tripId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this trip?')) {
      deleteTrip(tripId);
    }
  };

  return (
    <MainLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>My Trips</h1>
          <Link to="/create-trip" className={styles.newTripButton}>
            + New Trip
          </Link>
        </div>

        {userTrips.length > 0 ? (
          <div className={styles.tripsGrid}>
            {userTrips.map((trip) => (
              <div key={trip.id} className={styles.tripCard}>
                <Link to={`/trip/${trip.id}/view`}>
                  <img
                    src={trip.coverImage}
                    alt={trip.name}
                    className={styles.tripImage}
                  />
                </Link>
                <div className={styles.tripContent}>
                  <Link to={`/trip/${trip.id}/view`}>
                    <h3 className={styles.tripName}>
                      {trip.name}
                    </h3>
                  </Link>
                  <p className={styles.tripDescription}>{trip.description}</p>
                  <p className={styles.tripDate}>
                    {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                  </p>
                  <div className={styles.tripMeta}>
                    <span>{trip.cities?.length || 0} cities</span>
                    <span>${trip.budget?.total || 0}</span>
                  </div>
                  <div className={styles.tripActions}>
                    <Link
                      to={`/trip/${trip.id}/itinerary`}
                      className={`${styles.actionButton} ${styles.actionButtonGray}`}
                    >
                      Edit
                    </Link>
                    <Link
                      to={`/trip/${trip.id}/view`}
                      className={`${styles.actionButton} ${styles.actionButtonPrimary}`}
                    >
                      View
                    </Link>
                    <button
                      onClick={(e) => handleDelete(trip.id, e)}
                      className={`${styles.actionButton} ${styles.actionButtonDanger}`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>You haven't created any trips yet</p>
            <Link to="/create-trip" className={styles.emptyLink}>
              Create Your First Trip
            </Link>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default MyTrips;

