
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const { isAuthenticated } = useAuth();
  
  // If user is authenticated, redirect to homepage, otherwise to login
  if (isAuthenticated) {
    return <Navigate to="/homepage" replace />;
  }
  
  return <Navigate to="/login" replace />;
};

export default Index;
