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
import VideoScheduleDashboard from './components/Dashboard/VideoScheduleDashboard';
<<<<<<< HEAD
=======
import AIVideoScheduler from './components/Dashboard/AIVideoScheduler';
import Leaderboard from './components/Social/Leaderboard';
import UserProfile from './components/Social/UserProfile';
import AchievementShowcase from './components/Social/AchievementShowcase';
import FlashcardSystem from './components/Learning/FlashcardSystem';
import AdminDashboard from './components/Admin/AdminDashboard';
>>>>>>> 8ce3be7 (Bunq1.0)

const AuthenticatedRoutes = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const isAdmin = (user as any).isAdmin ?? false;

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
<<<<<<< HEAD
        <Route path="/groups/create" element={<GroupCreation />} />
        <Route path="/groups/join" element={<JoinGroup />} />
        <Route path="/groups/watch/:groupId" element={<GroupVideoPlayerWrapper />} />
        <Route path="/video-schedule" element={<VideoScheduleDashboard />} />
=======
        <Route path="/video-schedule" element={<VideoScheduleDashboard />} />
        <Route path="/ai-video-scheduler" element={<AIVideoScheduler />} />
        <Route path="/leaderboard" element={<Leaderboard entries={[]} category="watchTime" title="Top Learners" />} />
        <Route path="/social" element={<UserProfile profile={{
          uid: 'demo',
          email: 'demo@example.com',
          displayName: 'Demo User',
          photoURL: '',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          preferences: { theme: 'light', notifications: { enabled: true, remindersBefore: 15, dailyGoalReminders: true, completionNotifications: true }, dailyGoal: 60 },
          socialStats: { followersCount: 0, followingCount: 0, totalWatchTime: 0, videosWatched: 0, playlistsCreated: 0, achievements: [] },
          isPublic: true
        }} />} />
        <Route path="/flashcards" element={<FlashcardSystem flashcards={[]} onUpdateProgress={() => {}} />} />
        <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <Navigate to="/" replace />} />
>>>>>>> 8ce3be7 (Bunq1.0)
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
