import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Star } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { cities, searchCities } from '../data/cities';
import useStore from '../store/useStore';
import styles from './CitySearch.module.css';

const CitySearch = () => {
  const { selectedTrip, addCityToTrip } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    country: '',
    region: '',
  });

  const countries = [...new Set(cities.map(c => c.country))].sort();
  const regions = [...new Set(cities.map(c => c.region))].sort();

  const filteredCities = searchCities(searchQuery, filters);

  const handleAddToTrip = (city) => {
    if (selectedTrip) {
      const cityStop = {
        cityId: city.id,
        name: city.name,
        startDate: selectedTrip.startDate,
        endDate: selectedTrip.endDate,
        activities: [],
      };
      addCityToTrip(selectedTrip.id, cityStop);
      alert(`${city.name} added to trip!`);
    } else {
      alert('Please select a trip first from My Trips');
    }
  };

  return (
    <MainLayout>
      <div className={styles.container}>
        <h1 className={styles.title}>Discover Cities</h1>

        {/* Search and Filters */}
        <div className={styles.searchCard}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cities..."
            className={styles.searchInput}
          />

          <div className={styles.filtersGrid}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>
                Filter by Country
              </label>
              <select
                value={filters.country}
                onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                className={styles.filterSelect}
              >
                <option value="">All Countries</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>
                Filter by Region
              </label>
              <select
                value={filters.region}
                onChange={(e) => setFilters({ ...filters, region: e.target.value })}
                className={styles.filterSelect}
              >
                <option value="">All Regions</option>
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Cities Grid */}
        <div className={styles.citiesGrid}>
          {filteredCities.map((city) => (
            <div key={city.id} className={styles.cityCard}>
              <img
                src={city.image}
                alt={city.name}
                className={styles.cityImage}
              />
              <div className={styles.cityContent}>
                <h3 className={styles.cityName}>{city.name}</h3>
                <p className={styles.cityCountry}>{city.country}</p>
                <p className={styles.cityDescription}>{city.description}</p>
                
                <div className={styles.cityMeta}>
                  <span className={styles.costInfo}>
                    <DollarSign size={14} />
                    <span>Cost: {city.costIndex}/100</span>
                  </span>
                  <span className={styles.costInfo}>
                    <Star size={14} />
                    <span>{city.popularity}/100</span>
                  </span>
                </div>

                <div className={styles.cityActions}>
                  <Link to={`/cities?city=${city.id}`} className={styles.viewButton}>
                    View Details
                  </Link>
                  <button
                    onClick={() => handleAddToTrip(city)}
                    className={styles.addButton}
                  >
                    Add to Trip
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCities.length === 0 && (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>No cities found matching your criteria</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default CitySearch;

