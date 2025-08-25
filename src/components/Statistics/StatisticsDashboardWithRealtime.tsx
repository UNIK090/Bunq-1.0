import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  Clock, 
  Award, 
  Calendar, 
  PlayCircle, 
  Target,
  BarChart3,
  Users
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { realtimeService } from '../../services/realtimeService';
import { RealTimeStatistics } from '../../types/realtime';

const StatisticsDashboardWithRealtime: React.FC = () => {
  const { realTimeStatistics, setRealTimeStatistics } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For now, we'll use mock data since we don't have user auth
    const mockUserId = 'demo-user';
    
    const unsubscribe = realtimeService.subscribeToStatistics(
      mockUserId,
      (data) => {
        setRealTimeStatistics(data);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [setRealTimeStatistics]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const stats = realTimeStatistics || {
    totalVideosWatched: 0,
    totalWatchTime: 0,
    averageSessionDuration: 0,
    weeklyProgress: [],
    skillProgress: [],
    achievements: []
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="h-screen overflow-y-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Statistics Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your learning progress and achievements
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
              <PlayCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Videos Watched
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats.totalVideosWatched}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
              <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Watch Time
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatTime(stats.totalWatchTime)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
              <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Avg Session
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatTime(stats.averageSessionDuration)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900">
              <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Achievements
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats.achievements.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Weekly Progress
          </h3>
          <div className="space-y-4">
            {stats.weeklyProgress.length > 0 ? (
              stats.weeklyProgress.map((week, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{week.week}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-900 dark:text-gray-100">{week.videos} videos</span>
                    <span className="text-sm text-gray-500">{formatTime(week.minutes)}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No weekly data available
              </p>
            )}
          </div>
        </div>

        {/* Skill Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Skill Progress
          </h3>
          <div className="space-y-4">
            {stats.skillProgress.length > 0 ? (
              stats.skillProgress.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {skill.skill}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Level {skill.level}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${skill.progress}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No skill data available
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Recent Achievements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.achievements.length > 0 ? (
            stats.achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex items-center mb-2">
                  <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900">
                    <Award className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {achievement.name}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8 col-span-full">
              No achievements yet. Keep learning to unlock them!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatisticsDashboardWithRealtime;
