import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import { searchActivities as searchActivitiesAPI } from "../services/activityService";
import { getCityById } from "../services/locationService";
import useStore from "../store/useStore";
import ActivityMeta from "../components/ActivityMeta";
import styles from "./ActivitySearch.module.css";

const ActivitySearch = () => {
  const { selectedTrip, addActivityToCity } = useStore();
  const [activities, setActivities] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    type: "",
    maxCost: "",
    cityId: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const activityTypes = [
    "Sightseeing",
    "Food & Drink",
    "Adventure",
    "Cultural",
    "Entertainment",
    "Shopping",
    "Nature",
  ];

  useEffect(() => {
    const fetchActivities = async () => {
      if (!searchQuery && !filters.type && !filters.cityId) {
        setActivities([]);
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const response = await searchActivitiesAPI({
          query: searchQuery,
          type: filters.type,
          maxCost: filters.maxCost,
          cityId: filters.cityId,
        });
        if (response.success) {
          setActivities(response.data.activities || []);
        }
      } catch (err) {
        console.error("Error fetching activities:", err);
        setError("Failed to load activities");
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchActivities, 300); // Debounce search
    return () => clearTimeout(timeoutId);
  }, [searchQuery, filters]);

  const handleAddToTrip = (activity) => {
    if (selectedTrip && selectedTrip.stops && selectedTrip.stops.length > 0) {
      // Add to first stop by default
      const firstStop = selectedTrip.stops[0];
      addActivityToCity(selectedTrip.id, firstStop.cityId, activity.id);
      alert(`${activity.name} added to ${firstStop.name}!`);
    } else {
      alert("Please add cities to your trip first");
    }
  };

  return (
    <MainLayout>
      <div className={styles.container}>
        <h1 className={styles.title}>Discover Activities</h1>

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

        {/* Search and Filters */}
        <div className={styles.searchCard}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search activities..."
            className={styles.searchInput}
          />

          <div className={styles.filtersGrid}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Activity Type</label>
              <select
                value={filters.type}
                onChange={(e) =>
                  setFilters({ ...filters, type: e.target.value })
                }
                className={styles.filterSelect}
              >
                <option value="">All Types</option>
                {activityTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Max Cost ($)</label>
              <input
                type="number"
                value={filters.maxCost}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    maxCost: e.target.value ? parseInt(e.target.value) : "",
                  })
                }
                placeholder="Any"
                className={styles.filterInput}
              />
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>City ID (optional)</label>
              <input
                type="text"
                value={filters.cityId}
                onChange={(e) =>
                  setFilters({ ...filters, cityId: e.target.value })
                }
                placeholder="Filter by city"
                className={styles.filterInput}
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div
            style={{
              textAlign: "center",
              padding: "var(--space-2xl)",
              color: "var(--text-secondary)",
            }}
          >
            Loading activities...
          </div>
        ) : (
          <>
            {/* Activities Grid */}
            <div className={styles.activitiesGrid}>
              {activities.map((activity) => (
                <div key={activity.id} className={styles.activityCard}>
                  {activity.image && (
                    <img
                      src={activity.image}
                      alt={activity.name}
                      className={styles.activityImage}
                    />
                  )}
                  <div className={styles.activityContent}>
                    <h3 className={styles.activityName}>{activity.name}</h3>
                    <p className={styles.activityCity}>
                      {activity.city || activity.location}
                    </p>
                    <p className={styles.activityDescription}>
                      {activity.description}
                    </p>

                    <div className={styles.activityMeta}>
                      <ActivityMeta
                        duration={activity.duration}
                        cost={activity.cost}
                        rating={activity.rating}
                      />
                      <span className={styles.activityType}>
                        {activity.type}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddToTrip(activity)}
                      className={styles.addButton}
                    >
                      Add to Trip
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {activities.length === 0 &&
              !isLoading &&
              (searchQuery || filters.type || filters.cityId) && (
                <div className={styles.emptyState}>
                  <p className={styles.emptyText}>
                    No activities found matching your criteria
                  </p>
                </div>
              )}

            {activities.length === 0 &&
              !isLoading &&
              !searchQuery &&
              !filters.type &&
              !filters.cityId && (
                <div className={styles.emptyState}>
                  <p className={styles.emptyText}>
                    Start searching to discover activities
                  </p>
                </div>
              )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default ActivitySearch;
