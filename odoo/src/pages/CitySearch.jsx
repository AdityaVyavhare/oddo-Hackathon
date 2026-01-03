import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DollarSign, Star } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import Reveal from "../components/Reveal";
import { cities as mockCities } from "../data/cities";
import {
  getCities,
  searchCities as searchCitiesAPI,
} from "../services/locationService";
import useStore from "../store/useStore";
import styles from "./CitySearch.module.css";

const CitySearch = () => {
  const { selectedTrip, addCityToTrip } = useStore();
  const [cities, setCities] = useState(mockCities);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    country: "",
    continent: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const countries = [...new Set(cities.map((c) => c.country))]
    .filter(Boolean)
    .sort();

  useEffect(() => {
    const fetchCities = async () => {
      setIsLoading(true);
      setError("");

      try {
        if (searchQuery || filters.country || filters.continent) {
          // Search with filters
          const response = await searchCitiesAPI({
            query: searchQuery,
            country: filters.country,
            continent: filters.continent,
          });
          if (response.success) {
            setCities(response.data.cities || []);
          }
        } else {
          // Get all cities
          const response = await getCities({ limit: 100 });
          if (response.success) {
            setCities(response.data.cities || []);
          }
        }
      } catch (err) {
        console.error("Error fetching cities:", err);
        // Use mock data as fallback
        setCities(mockCities);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCities();
  }, [searchQuery, filters]);

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
      alert("Please select a trip first from My Trips");
    }
  };

  return (
    <MainLayout>
      <div className={styles.container}>
        <Reveal animation="fade">
          <h1 className={styles.title}>Discover Cities</h1>
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

        {/* Search and Filters */}
        <Reveal animation="up" delay={0.1}>
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
                <label className={styles.filterLabel}>Filter by Country</label>
                <select
                  value={filters.country}
                  onChange={(e) =>
                    setFilters({ ...filters, country: e.target.value })
                  }
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
                  Filter by Continent
                </label>
                <select
                  value={filters.continent}
                  onChange={(e) =>
                    setFilters({ ...filters, continent: e.target.value })
                  }
                  className={styles.filterSelect}
                >
                  <option value="">All Continents</option>
                  <option value="Europe">Europe</option>
                  <option value="Asia">Asia</option>
                  <option value="North America">North America</option>
                  <option value="South America">South America</option>
                  <option value="Africa">Africa</option>
                  <option value="Oceania">Oceania</option>
                </select>
              </div>
            </div>
          </div>
        </Reveal>

        {isLoading ? (
          <div
            style={{
              textAlign: "center",
              padding: "var(--space-2xl)",
              color: "var(--text-secondary)",
            }}
          >
            Loading cities...
          </div>
        ) : (
          <>
            {/* Cities Grid */}
            <div className={styles.citiesGrid}>
              {cities.map((city, index) => (
                <Reveal key={city.id} animation="up" delay={index * 0.05}>
                  <div className={styles.cityCard}>
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
                      <p className={styles.cityDescription}>
                        {city.description}
                      </p>

                      <div className={styles.cityMeta}>
                        <span className={styles.costInfo}>
                          <DollarSign size={14} />
                          <span>Cost: {city.averageCost || "N/A"}</span>
                        </span>
                        <span className={styles.costInfo}>
                          <Star size={14} />
                          <span>{city.popularityRating || "N/A"}</span>
                        </span>
                      </div>

                      <div className={styles.cityActions}>
                        <Link
                          to={`/cities?city=${city.id}`}
                          className={styles.viewButton}
                        >
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
                </Reveal>
              ))}
            </div>

            {cities.length === 0 && (
              <div className={styles.emptyState}>
                <p className={styles.emptyText}>
                  No cities found matching your criteria
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default CitySearch;
