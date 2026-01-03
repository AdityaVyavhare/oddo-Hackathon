import { useParams, Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import useStore from '../store/useStore';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getActivityById } from '../data/activities';
import styles from './Budget.module.css';

const Budget = () => {
  const { tripId } = useParams();
  const { trips } = useStore();

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

  const budget = trip.budget || {
    total: 0,
    transport: 0,
    stay: 0,
    food: 0,
    activities: 0,
  };

  // Calculate activity costs
  const activityCosts = trip.cities?.reduce((total, cityStop) => {
    const cityActivityCosts = (cityStop.activities || []).reduce((sum, activityId) => {
      const activity = getActivityById(activityId);
      return sum + (activity?.cost || 0);
    }, 0);
    return total + cityActivityCosts;
  }, 0) || 0;

  const totalCalculated = budget.transport + budget.stay + budget.food + activityCosts;
  const days = Math.ceil(
    (new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)
  ) + 1;
  const perDayCost = days > 0 ? totalCalculated / days : 0;

  const pieData = [
    { name: 'Transport', value: budget.transport, color: '#2563EB' },
    { name: 'Stay', value: budget.stay, color: '#10B981' },
    { name: 'Food', value: budget.food, color: '#F59E0B' },
    { name: 'Activities', value: activityCosts, color: '#EF4444' },
  ].filter(item => item.value > 0);

  const barData = [
    { category: 'Transport', budgeted: budget.transport, actual: budget.transport },
    { category: 'Stay', budgeted: budget.stay, actual: budget.stay },
    { category: 'Food', budgeted: budget.food, actual: budget.food },
    { category: 'Activities', budgeted: budget.activities, actual: activityCosts },
  ];

  const isOverBudget = totalCalculated > budget.total;

  return (
    <MainLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <h1 className={styles.title}>Budget: {trip.name}</h1>
            <p className={styles.subtitle}>Track your trip expenses</p>
          </div>
          <Link
            to={`/trip/${tripId}/view`}
            className={styles.backButton}
          >
            <ArrowLeft size={18} />
            <span>Back to Trip</span>
          </Link>
        </div>

        {/* Budget Overview Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Total Budget</p>
            <p className={styles.statValue}>${budget.total.toLocaleString()}</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Estimated Cost</p>
            <p className={`${styles.statValue} ${isOverBudget ? styles.overBudget : ''}`}>
              ${totalCalculated.toLocaleString()}
            </p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Remaining</p>
            <p className={`${styles.statValue} ${budget.total - totalCalculated < 0 ? styles.overBudget : styles.underBudget}`}>
              ${(budget.total - totalCalculated).toLocaleString()}
            </p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Per Day</p>
            <p className={styles.statValue}>${perDayCost.toFixed(2)}</p>
          </div>
        </div>

        {isOverBudget && (
          <div className={styles.warning}>
            <AlertTriangle size={20} />
            <div>
              <p className={styles.warningTitle}>Warning: You're over budget!</p>
              <p className={styles.warningText}>
                Your estimated costs exceed your budget by ${(totalCalculated - budget.total).toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {/* Charts */}
        <div className={styles.chartsGrid}>
          {/* Pie Chart */}
          <div className={styles.chartCard}>
            <h2 className={styles.chartTitle}>Cost Breakdown</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className={styles.chartCard}>
            <h2 className={styles.chartTitle}>Budget vs Actual</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="budgeted" fill="#2563EB" name="Budgeted" />
                <Bar dataKey="actual" fill="#10B981" name="Actual" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className={styles.categoryCard}>
          <h2 className={styles.sectionTitle}>Category Details</h2>
          <div className={styles.categoryList}>
            <div className={`${styles.categoryItem} ${styles.categoryTransport}`}>
              <div>
                <p className={styles.categoryName}>Transport</p>
                <p className={styles.categoryDescription}>Flights, trains, buses</p>
              </div>
              <p className={styles.categoryAmount}>${budget.transport.toLocaleString()}</p>
            </div>
            <div className={`${styles.categoryItem} ${styles.categoryStay}`}>
              <div>
                <p className={styles.categoryName}>Stay</p>
                <p className={styles.categoryDescription}>Hotels, hostels, Airbnb</p>
              </div>
              <p className={styles.categoryAmount}>${budget.stay.toLocaleString()}</p>
            </div>
            <div className={`${styles.categoryItem} ${styles.categoryFood}`}>
              <div>
                <p className={styles.categoryName}>Food</p>
                <p className={styles.categoryDescription}>Restaurants, groceries</p>
              </div>
              <p className={styles.categoryAmount}>${budget.food.toLocaleString()}</p>
            </div>
            <div className={`${styles.categoryItem} ${styles.categoryActivities}`}>
              <div>
                <p className={styles.categoryName}>Activities</p>
                <p className={styles.categoryDescription}>Tours, tickets, experiences</p>
              </div>
              <p className={styles.categoryAmount}>${activityCosts.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Budget;

