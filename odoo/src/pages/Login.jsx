import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import { authenticateUser } from '../data/users';
import useStore from '../store/useStore';
import styles from './Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();
  const { setCurrentUser } = useStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isSignup) {
      // Simple signup - just create a mock user session
      const newUser = {
        id: Date.now().toString(),
        name: email.split('@')[0],
        email,
        password,
      };
      localStorage.setItem('currentUserId', newUser.id);
      setCurrentUser(newUser);
      navigate('/dashboard');
    } else {
      const user = authenticateUser(email, password);
      if (user) {
        setCurrentUser(user);
        navigate('/dashboard');
      } else {
        setError('Invalid email or password');
      }
    }
  };

  return (
    <AuthLayout>
      <div className={styles.container}>
        <h2 className={styles.title}>
          {isSignup ? 'Create Account' : 'Welcome Back'}
        </h2>
        
        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
              placeholder="you@example.com"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
              placeholder="••••••••"
            />
          </div>

          {!isSignup && (
            <div style={{ textAlign: 'right' }}>
              <Link to="/forgot-password" className={styles.forgotLink}>
                Forgot password?
              </Link>
            </div>
          )}

          <button type="submit" className={styles.submitButton}>
            {isSignup ? 'Sign Up' : 'Log In'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button
            onClick={() => setIsSignup(!isSignup)}
            className={styles.toggleButton}
          >
            {isSignup ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
          </button>
        </div>

        <div className={styles.demoText}>
          <p>Demo: Use john@example.com / password123</p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;

