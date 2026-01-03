import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';
import styles from './AuthLayout.module.css';

const AuthLayout = ({ children }) => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Link to="/" className={styles.logoLink}>
          <Globe className={styles.logoIcon} size={32} />
          <h1 className={styles.logo}>GlobeTrotter</h1>
        </Link>
        <div className={styles.card}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

