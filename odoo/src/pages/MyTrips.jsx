import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import useStore from "../store/useStore";
import {
  getUserTrips,
  deleteTrip as deleteTripAPI,
} from "../services/tripService";
import styles from "./MyTrips.module.css";

const MyTrips = () => {
  const { currentUser } = useStore();
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrips = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await getUserTrips();
        if (response.success) {
          setTrips(response.data.trips || []);
        }
      } catch (err) {
        console.error("Error fetching trips:", err);
        setError("Failed to load trips");
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser) {
      fetchTrips();
    }
  }, [currentUser]);

  const handleDelete = async (tripId, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this trip?")) {
      try {
        const response = await deleteTripAPI(tripId);
        if (response.success) {
          // Remove trip from local state
          setTrips(trips.filter((trip) => trip.id !== tripId));
        }
      } catch (err) {
        console.error("Error deleting trip:", err);
        alert("Failed to delete trip. Please try again.");
      }
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
            Loading trips...
          </div>
        ) : trips.length > 0 ? (
          <div className={styles.tripsGrid}>
            {trips.map((trip) => (
              <div key={trip.id} className={styles.tripCard}>
                <Link to={`/trip/${trip.id}/view`}>
                  <img
                    src={
                      trip.coverImage ||
                      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400"
                    }
                    alt={trip.name}
                    className={styles.tripImage}
                  />
                </Link>
                <div className={styles.tripContent}>
                  <Link to={`/trip/${trip.id}/view`}>
                    <h3 className={styles.tripName}>{trip.name}</h3>
                  </Link>
                  <p className={styles.tripDescription}>{trip.description}</p>
                  <p className={styles.tripDate}>
                    {new Date(trip.startDate).toLocaleDateString()} -{" "}
                    {new Date(trip.endDate).toLocaleDateString()}
                  </p>
                  <div className={styles.tripMeta}>
                    <span>{trip.stops?.length || 0} stops</span>
                    <span>${trip.totalBudget || 0}</span>
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
            <p className={styles.emptyText}>
              You haven't created any trips yet
            </p>
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
