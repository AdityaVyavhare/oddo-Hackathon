import { Users, Plane, MapPin, Target } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import useStore from '../store/useStore';
import { mockUsers } from '../data/users';
import { cities } from '../data/cities';
import { activities } from '../data/activities';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './Admin.module.css';

const Admin = () => {
  const { trips } = useStore();

  // Calculate statistics
  const totalUsers = mockUsers.length;
  const totalTrips = trips.length;
  const totalCities = cities.length;
  const totalActivities = activities.length;

  // Popular cities
  const cityCounts = {};
  trips.forEach(trip => {
    trip.cities?.forEach(cityStop => {
      cityCounts[cityStop.cityId] = (cityCounts[cityStop.cityId] || 0) + 1;
    });
  });

  const popularCities = Object.entries(cityCounts)
    .map(([cityId, count]) => {
      const city = cities.find(c => c.id === cityId);
      return { name: city?.name || 'Unknown', count };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Trip status
  const activeTrips = trips.filter(trip => {
    const endDate = new Date(trip.endDate);
    return endDate >= new Date();
  }).length;

  const completedTrips = trips.length - activeTrips;

  // Chart data
  const tripStatusData = [
    { name: 'Active', value: activeTrips, color: '#10B981' },
    { name: 'Completed', value: completedTrips, color: '#6B7280' },
  ];

  const popularCitiesData = popularCities.map(city => ({
    name: city.name,
    trips: city.count,
  }));

  return (
    <MainLayout>
      <div className={styles.container}>
        <h1 className={styles.title}>Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statContent}>
              <div className={styles.statInfo}>
                <p className={styles.statLabel}>Total Users</p>
                <p className={styles.statValue}>{totalUsers}</p>
              </div>
              <div className={styles.statIcon}>
                <Users size={40} />
              </div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statContent}>
              <div className={styles.statInfo}>
                <p className={styles.statLabel}>Total Trips</p>
                <p className={styles.statValue}>{totalTrips}</p>
              </div>
              <div className={styles.statIcon}>
                <Plane size={40} />
              </div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statContent}>
              <div className={styles.statInfo}>
                <p className={styles.statLabel}>Cities</p>
                <p className={styles.statValue}>{totalCities}</p>
              </div>
              <div className={styles.statIcon}>
                <MapPin size={40} />
              </div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statContent}>
              <div className={styles.statInfo}>
                <p className={styles.statLabel}>Activities</p>
                <p className={styles.statValue}>{totalActivities}</p>
              </div>
              <div className={styles.statIcon}>
                <Target size={40} />
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className={styles.chartsGrid}>
          {/* Trip Status Chart */}
          <div className={styles.chartCard}>
            <h2 className={styles.chartTitle}>Trip Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={tripStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {tripStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Popular Cities Chart */}
          <div className={styles.chartCard}>
            <h2 className={styles.chartTitle}>Most Popular Cities</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={popularCitiesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="trips" fill="#2563EB" name="Number of Trips" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Users Table */}
        <div className={styles.tableCard}>
          <h2 className={styles.tableTitle}>Users</h2>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead className={styles.tableHead}>
                <tr>
                  <th className={styles.tableHeader}>Name</th>
                  <th className={styles.tableHeader}>Email</th>
                  <th className={styles.tableHeader}>Joined</th>
                  <th className={styles.tableHeader}>Trips</th>
                </tr>
              </thead>
              <tbody className={styles.tableBody}>
                {mockUsers.map((user) => {
                  const userTrips = trips.filter(t => t.userId === user.id);
                  return (
                    <tr key={user.id} className={styles.tableRow}>
                      <td className={`${styles.tableCell} ${styles.tableCellName}`}>{user.name}</td>
                      <td className={styles.tableCell}>{user.email}</td>
                      <td className={styles.tableCell}>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className={styles.tableCell}>{userTrips.length}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Admin;

