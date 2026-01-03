import { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { activities, searchActivities } from '../data/activities';
import { getCityById } from '../data/cities';
import useStore from '../store/useStore';
import ActivityMeta from '../components/ActivityMeta';
import styles from './ActivitySearch.module.css';

const ActivitySearch = () => {
  const { selectedTrip, addActivityToCity } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    maxCost: '',
    maxDuration: '',
  });

  const activityTypes = [...new Set(activities.map(a => a.type))].sort();

  const filteredActivities = searchActivities(searchQuery, filters);

  const handleAddToTrip = (activity) => {
    if (selectedTrip && selectedTrip.cities && selectedTrip.cities.length > 0) {
      // Add to first city by default, or let user choose
      const firstCity = selectedTrip.cities[0];
      addActivityToCity(selectedTrip.id, firstCity.cityId, activity.id);
      alert(`${activity.name} added to ${firstCity.name}!`);
    } else {
      alert('Please add cities to your trip first');
    }
  };

  return (
    <MainLayout>
      <div className={styles.container}>
        <h1 className={styles.title}>Discover Activities</h1>

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
              <label className={styles.filterLabel}>
                Activity Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
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
              <label className={styles.filterLabel}>
                Max Cost ($)
              </label>
              <input
                type="number"
                value={filters.maxCost}
                onChange={(e) => setFilters({ ...filters, maxCost: e.target.value ? parseInt(e.target.value) : '' })}
                placeholder="Any"
                className={styles.filterInput}
              />
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>
                Max Duration (min)
              </label>
              <input
                type="number"
                value={filters.maxDuration}
                onChange={(e) => setFilters({ ...filters, maxDuration: e.target.value ? parseInt(e.target.value) : '' })}
                placeholder="Any"
                className={styles.filterInput}
              />
            </div>
          </div>
        </div>

        {/* Activities Grid */}
        <div className={styles.activitiesGrid}>
          {filteredActivities.map((activity) => {
            const city = getCityById(activity.cityId);
            return (
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
                  <p className={styles.activityCity}>{city?.name}</p>
                  <p className={styles.activityDescription}>{activity.description}</p>
                  
                  <div className={styles.activityMeta}>
                    <ActivityMeta duration={activity.duration} cost={activity.cost} rating={activity.rating} />
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
            );
          })}
        </div>

        {filteredActivities.length === 0 && (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>No activities found matching your criteria</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ActivitySearch;

