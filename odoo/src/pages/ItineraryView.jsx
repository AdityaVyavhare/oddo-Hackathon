import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, List, Edit, DollarSign } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import useStore from '../store/useStore';
import { getCityById } from '../data/cities';
import { getActivityById } from '../data/activities';
import ActivityMeta from '../components/ActivityMeta';
import styles from './ItineraryView.module.css';

const ItineraryView = () => {
  const { tripId } = useParams();
  const { trips } = useStore();
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'

  const trip = trips.find(t => t.id === tripId);

  if (!trip) {
    return (
      <MainLayout>
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>Trip not found</p>
        </div>
      </MainLayout>
    );
  }

  const renderListView = () => {
    return (
      <div className={styles.citiesList}>
        {trip.cities && trip.cities.map((cityStop, index) => {
          const city = getCityById(cityStop.cityId);
          const activities = (cityStop.activities || []).map(id => getActivityById(id)).filter(Boolean);

          return (
            <div key={index} className={styles.cityCard}>
              <div className={styles.cityHeader}>
                {city?.image && (
                  <img
                    src={city.image}
                    alt={city.name}
                    className={styles.cityImage}
                  />
                )}
                <div className={styles.cityInfo}>
                  <h3 className={styles.cityName}>{cityStop.name}</h3>
                  <p className={styles.cityDate}>
                    {new Date(cityStop.startDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })} - {new Date(cityStop.endDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  {city && <p className={styles.cityDescription}>{city.description}</p>}
                </div>
              </div>

              {activities.length > 0 && (
                <div className={styles.activitiesSection}>
                  <h4 className={styles.activitiesTitle}>Activities</h4>
                  <div className={styles.activitiesGrid}>
                    {activities.map((activity) => (
                      <div key={activity.id} className={styles.activityCard}>
                        <div className={styles.activityHeader}>
                          <div className={styles.activityInfo}>
                            <h5 className={styles.activityName}>{activity.name}</h5>
                            <p className={styles.activityDescription}>{activity.description}</p>
                            <ActivityMeta duration={activity.duration} cost={activity.cost} rating={activity.rating} />
                          </div>
                          {activity.image && (
                            <img
                              src={activity.image}
                              alt={activity.name}
                              className={styles.activityImage}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderCalendarView = () => {
    // Group activities by date
    const daysMap = new Map();
    
    trip.cities?.forEach((cityStop) => {
      const start = new Date(cityStop.startDate);
      const end = new Date(cityStop.endDate);
      
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateKey = d.toISOString().split('T')[0];
        if (!daysMap.has(dateKey)) {
          daysMap.set(dateKey, []);
        }
        const activities = (cityStop.activities || []).map(id => getActivityById(id)).filter(Boolean);
        daysMap.get(dateKey).push({
          city: cityStop.name,
          activities,
        });
      }
    });

    const sortedDays = Array.from(daysMap.entries()).sort((a, b) => 
      new Date(a[0]) - new Date(b[0])
    );

    return (
      <div className={styles.calendarView}>
        {sortedDays.map(([date, data]) => (
          <div key={date} className={styles.dayCard}>
            <h3 className={styles.dayTitle}>
              {new Date(date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </h3>
            <div className={styles.dayContent}>
              {data.map((item, idx) => (
                <div key={idx} className={styles.cityGroup}>
                  <h4 className={styles.cityGroupName}>{item.city}</h4>
                  {item.activities.length > 0 ? (
                    <div className={styles.activitiesList}>
                      {item.activities.map((activity) => (
                        <div key={activity.id} className={styles.activityItem}>
                          <span className={styles.activityItemName}>{activity.name}</span>
                          <span className={styles.activityItemDuration}>({activity.duration} min)</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={styles.emptyActivities}>No activities scheduled</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <MainLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <h1 className={styles.title}>{trip.name}</h1>
            <p className={styles.subtitle}>{trip.description}</p>
          </div>
          <div className={styles.headerActions}>
            <Link
              to={`/trip/${tripId}/itinerary`}
              className={`${styles.actionButton} ${styles.actionButtonGray}`}
            >
              <Edit size={18} />
              <span>Edit</span>
            </Link>
            <Link
              to={`/trip/${tripId}/budget`}
              className={`${styles.actionButton} ${styles.actionButtonPrimary}`}
            >
              <DollarSign size={18} />
              <span>Budget</span>
            </Link>
          </div>
        </div>

        <div className={styles.viewToggle}>
          <button
            onClick={() => setViewMode('list')}
            className={`${styles.viewButton} ${viewMode === 'list' ? styles.viewButtonActive : ''}`}
          >
            <List size={18} />
            <span>List View</span>
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`${styles.viewButton} ${viewMode === 'calendar' ? styles.viewButtonActive : ''}`}
          >
            <Calendar size={18} />
            <span>Calendar View</span>
          </button>
        </div>

        {viewMode === 'list' ? renderListView() : renderCalendarView()}
      </div>
    </MainLayout>
  );
};

export default ItineraryView;

