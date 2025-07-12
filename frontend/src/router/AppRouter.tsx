import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';

// Layout components
import Navbar from '@/components/Navbar';

// Page components
import LandingPage from '@/components/LandingPage';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';
import Dashboard from '@/components/Dashboard';
import AddItemForm from '@/components/AddItemForm';
import BrowsePage from '@/components/BrowsePage';
import ItemDetailPage from '@/components/ItemDetailPage';
import AdminPanel from '@/components/AdminPanel';
import NotFound from '@/pages/NotFound';

// Auth wrapper components
import ProtectedRoute from './ProtectedRoute';
import AuthRoute from './AuthRoute';

const AppRouter = () => {
  const { data: user, isLoading: userLoading } = useUser();
  const { toast } = useToast();

  const handleLogout = () => {
    apiService.logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    // Force page reload to clear all cached data
    window.location.reload();
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen">
        {user && (
          <Navbar
            user={user}
            onLogout={handleLogout}
          />
        )}
        
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Auth routes - only accessible when not logged in */}
          <Route
            path="/login"
            element={
              <AuthRoute user={user}>
                <LoginForm />
              </AuthRoute>
            }
          />
          <Route
            path="/register"
            element={
              <AuthRoute user={user}>
                <RegisterForm />
              </AuthRoute>
            }
          />
          
          {/* Protected routes - only accessible when logged in */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute user={user}>
                <Dashboard user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-item"
            element={
              <ProtectedRoute user={user}>
                <AddItemForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/browse"
            element={
              <ProtectedRoute user={user}>
                <BrowsePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/item/:id"
            element={
              <ProtectedRoute user={user}>
                <ItemDetailPage />
              </ProtectedRoute>
            }
          />
          
          {/* Admin routes - only accessible by admin users */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute user={user} requireAdmin>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          
          {/* 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};

export default AppRouter;
