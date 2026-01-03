import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Globe, Home, Plane, MapPin, Target, User, Settings, LogOut } from 'lucide-react';
import useStore from '../store/useStore';
import styles from './MainLayout.module.css';

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/my-trips', label: 'My Trips', icon: Plane },
    { path: '/cities', label: 'Cities', icon: MapPin },
    { path: '/activities', label: 'Activities', icon: Target },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  if (currentUser?.email === 'admin@example.com' || currentUser?.id === '1') {
    navItems.push({ path: '/admin', label: 'Admin', icon: Settings });
  }

  return (
    <div className={styles.container}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.navbarContent}>
          <div className={styles.navbarLeft}>
            <Link to="/dashboard" className={styles.logo}>
              <Globe className={styles.logoIcon} size={24} />
              <span>GlobeTrotter</span>
            </Link>
          </div>
          <div className={styles.navbarRight}>
            <span className={styles.userName}>{currentUser?.name || 'User'}</span>
            <button onClick={handleLogout} className={styles.logoutButton}>
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className={styles.mainContainer}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <nav className={styles.sidebarNav}>
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`${styles.navItem} ${isActive(item.path) ? styles.navItemActive : ''}`}
                >
                  <IconComponent className={styles.navIcon} size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

