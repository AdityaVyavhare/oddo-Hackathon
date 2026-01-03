import { Link } from "react-router-dom";
import { Globe, Compass, Map, Sparkles } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import styles from "./AuthLayout.module.css";

const AuthLayout = ({ children }) => {
  return (
    <div className={styles.container}>
      {/* Theme Toggle */}
      <div className={styles.themeToggleWrapper}>
        <ThemeToggle />
      </div>

      {/* Hero Background Elements */}
      <div className={styles.bgElements}>
        <div className={styles.bgCircle1}></div>
        <div className={styles.bgCircle2}></div>
        <div className={styles.bgCircle3}></div>
      </div>

      <div className={styles.wrapper}>
        {/* Logo & Branding */}
        <div className={styles.header}>
          <Link to="/" className={styles.logoLink}>
            <div className={styles.logoIconWrapper}>
              <Globe className={styles.logoIcon} size={40} />
            </div>
            <div>
              <h1 className={styles.logo}>GlobeTrotter</h1>
              <p className={styles.tagline}>Your Journey Begins Here</p>
            </div>
          </Link>
        </div>

        {/* Main Card */}
        <div className={styles.card}>{children}</div>

        {/* Features */}
        <div className={styles.features}>
          <div className={styles.feature}>
            <Compass size={20} />
            <span>Smart Planning</span>
          </div>
          <div className={styles.feature}>
            <Map size={20} />
            <span>Global Destinations</span>
          </div>
          <div className={styles.feature}>
            <Sparkles size={20} />
            <span>Premium Experience</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
