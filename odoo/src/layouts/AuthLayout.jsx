import { Link } from "react-router-dom";
import { Compass, Map, Sparkles } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import Logo from "../components/Logo";
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
            <Logo variant="full" height={48} />
          </Link>
          <p className={styles.tagline}>Your Journey Begins Here</p>
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
