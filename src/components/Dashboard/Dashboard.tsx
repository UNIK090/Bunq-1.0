import React, { useEffect, useState } from "react";
import {
  Play,
  Clock,
  CheckCircle,
  BarChart,
  Calendar as CalendarIcon,
  Flame,
} from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import VideoSearchToggle from "../Video/VideoSearchToggle";
import RecentVideos from "./RecentVideos";
import UpcomingReminders from "./UpcomingReminders";
import SearchVideos from "../Video/SearchVideos";


// Define the type for the StatsCard props
interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

// StatsCard helper component
const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color }) => (
  <div className={`${color} rounded-lg shadow p-4 flex items-center`}>
    <div className="mr-4">{icon}</div>
    <div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

// Main Dashboard component
const Dashboard: React.FC = () => {
  const {
    userStats,
    isSearching,
    darkMode,
    
    realTimeLearningPath,
  } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    // Cleanup the timer
    return () => clearTimeout(timer);
  }, []);

  const formatWatchTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">Loading...</div>
    );
  }

  return (
    <div
      className={`h-full flex flex-col space-y-4 p-6 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold dark:text-white">Dashboard</h1>
        <VideoSearchToggle />
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Watch Time"
          value={formatWatchTime(userStats.totalWatchTime)}
          icon={<Clock className="h-8 w-8 text-blue-500" />}
          color={darkMode ? "bg-gray-800" : "bg-white"}
        />
        <StatsCard
          title="Completed Videos"
          value={userStats.completedVideos.toString()}
          icon={<CheckCircle className="h-8 w-8 text-green-500" />}
          color={darkMode ? "bg-gray-800" : "bg-white"}
        />
        <StatsCard
          title="Current Streak"
          value={`${userStats.currentStreak} days`}
          icon={<Flame className="h-8 w-8 text-orange-500" />}
          color={darkMode ? "bg-gray-800" : "bg-white"}
        />
        <StatsCard
          title="Longest Streak"
          value={`${userStats.longestStreak} days`}
          icon={<BarChart className="h-8 w-8 text-purple-500" />}
          color={darkMode ? "bg-gray-800" : "bg-white"}
        />
      </div>

      {/* Main content area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-grow">
        {/* Video section */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Play className="h-5 w-5 mr-2" />
            {isSearching ? "Find Videos" : "Recent Videos"}
          </h2>
          {isSearching ? <SearchVideos /> : <RecentVideos />}
        </div>

        {/* Reminders section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2" />
            Upcoming Reminders
          </h2>
          <UpcomingReminders />
        </div>
      </div>

      
    </div>
  );
};

export default Dashboard;