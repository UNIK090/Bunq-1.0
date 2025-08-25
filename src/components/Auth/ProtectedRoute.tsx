import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import SignIn from './SignIn';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 dark:bg-indigo-900/20 rounded-full mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Loading Skillra
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Preparing your learning dashboard...
          </p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show sign in page
  if (!user) {
    return <SignIn />;
  }

  // If user is authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
