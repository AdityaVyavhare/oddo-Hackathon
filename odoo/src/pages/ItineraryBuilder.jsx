import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import useStore from '../store/useStore';
import { cities, getCityById } from '../data/cities';
import { getActivitiesByCity } from '../data/activities';
import styles from './ItineraryBuilder.module.css';

const ItineraryBuilder = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { trips, updateTrip, addCityToTrip, addActivityToCity } = useStore();
  
  const trip = trips.find(t => t.id === tripId);
  const [showCitySearch, setShowCitySearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);
  const [showActivities, setShowActivities] = useState(null);

  if (!trip) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Trip not found</p>
        </div>
      </MainLayout>
    );
  }

  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCity = (city) => {
    const cityStop = {
      cityId: city.id,
      name: city.name,
      startDate: trip.startDate,
      endDate: trip.endDate,
      activities: [],
    };
    addCityToTrip(tripId, cityStop);
    setSelectedCity(city.id);
    setShowCitySearch(false);
    setSearchQuery('');
  };

  const handleAddActivity = (cityId, activityId) => {
    addActivityToCity(tripId, cityId, activityId);
  };

  const handleRemoveCity = (index) => {
    const updatedCities = trip.cities.filter((_, i) => i !== index);
    updateTrip(tripId, { cities: updatedCities });
  };

  const handleSave = () => {
    navigate(`/trip/${tripId}/view`);
  };

  return (
    <MainLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Build Itinerary: {trip.name}</h1>
          <button onClick={handleSave} className={styles.saveButton}>
            Save Itinerary
          </button>
        </div>

        <div className={styles.citiesCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Cities</h2>
            <button
              onClick={() => setShowCitySearch(!showCitySearch)}
              className={styles.addCityButton}
            >
              + Add City
            </button>
          </div>

          {showCitySearch && (
            <div className={styles.searchSection}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cities..."
                className={styles.searchInput}
              />
              <div className={styles.citiesGrid}>
                {filteredCities.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => handleAddCity(city)}
                    className={styles.cityOption}
                  >
                    <p className={styles.cityOptionName}>{city.name}</p>
                    <p className={styles.cityOptionCountry}>{city.country}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {trip.cities && trip.cities.length > 0 ? (
            <div>
              {trip.cities.map((cityStop, index) => {
                const city = getCityById(cityStop.cityId);
                const cityActivities = getActivitiesByCity(cityStop.cityId);
                const selectedActivities = cityStop.activities || [];

                return (
                  <div key={index} className={styles.cityStop}>
                    <div className={styles.cityStopHeader}>
                      <div className={styles.cityStopInfo}>
                        <h3 className={styles.cityStopName}>{cityStop.name}</h3>
                        <p className={styles.cityStopDate}>
                          {new Date(cityStop.startDate).toLocaleDateString()} - {new Date(cityStop.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveCity(index)}
                        className={styles.removeButton}
                      >
                        Remove
                      </button>
                    </div>

                    <button
                      onClick={() => setShowActivities(showActivities === cityStop.cityId ? null : cityStop.cityId)}
                      className={styles.toggleActivities}
                    >
                      {showActivities === cityStop.cityId ? 'Hide' : 'Show'} Activities
                    </button>

                    {showActivities === cityStop.cityId && (
                      <div className={styles.activitiesList}>
                        <h4 className={styles.activitiesTitle}>Available Activities:</h4>
                        {cityActivities.map((activity) => (
                          <div key={activity.id} className={styles.activityItem}>
                            <div className={styles.activityInfo}>
                              <p className={styles.activityName}>{activity.name}</p>
                              <p className={styles.activityDetails}>
                                {activity.duration} min • ${activity.cost}
                              </p>
                            </div>
                            <button
                              onClick={() => handleAddActivity(cityStop.cityId, activity.id)}
                              disabled={selectedActivities.includes(activity.id)}
                              className={`${styles.addActivityButton} ${
                                selectedActivities.includes(activity.id)
                                  ? styles.addActivityButtonInactive
                                  : styles.addActivityButtonActive
                              }`}
                            >
                              {selectedActivities.includes(activity.id) ? 'Added' : 'Add'}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {selectedActivities.length > 0 && (
                      <div className={styles.selectedActivities}>
                        <h4 className={styles.selectedActivitiesTitle}>Selected Activities:</h4>
                        <div className={styles.selectedActivitiesList}>
                          {selectedActivities.map((activityId) => {
                            const activity = cityActivities.find(a => a.id === activityId);
                            return activity ? (
                              <span key={activityId} className={styles.activityTag}>
                                {activity.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>No cities added yet. Click "Add City" to start building your itinerary.</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ItineraryBuilder;

