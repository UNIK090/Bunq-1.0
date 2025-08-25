import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import Playlists from './components/Playlists/Playlists';
import SearchDashboard from './components/Video/SearchDashboard';
import VideoPlayer from './components/Video/VideoPlayer';
import CalendarView from './components/Calendar/CalendarView';
import LearningPath from './components/LearningPath/LearningPath';
import Statistics from './components/Statistics/Statistics';
import SettingsDashboard from './components/Settings/SettingsDashboard';
import SignIn from './components/Auth/SignIn';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import { useRealtimeData } from './hooks/useRealtimeData';
import ErrorBoundary from './components/ErrorBoundary';
import Chat from './components/Chat'; // Importing the Chat component
import Loading from './components/Loading/Loading';

const AuthenticatedRoutes = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/playlists" element={<Playlists />} />
        <Route path="/player" element={<VideoPlayer />} />
        <Route path="/calendar" element={<CalendarView />} />
        <Route path="/learning-path" element={<LearningPath />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/settings" element={<SettingsDashboard />} />
        <Route path="/search" element={<SearchDashboard />} />
        <Route path="/chat" element={<Chat />} /> {/* Adding Chat route */}
      </Routes>
    </Layout>
  );
};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  useRealtimeData();

  useEffect(() => {
    // Simulate loading time for the animation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Adjusting to 1 second for testing

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/auth" element={<SignIn />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <AuthenticatedRoutes />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
