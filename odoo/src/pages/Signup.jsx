import { Navigate } from 'react-router-dom';
import Login from './Login';

// Signup uses the same component as Login with toggle
const Signup = () => {
  return <Navigate to="/login" replace />;
};

export default Signup;


