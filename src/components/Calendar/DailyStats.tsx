import React from 'react';
import { Clock, CheckCircle, Target, TrendingUp, Eye } from 'lucide-react';
import { DailyVideoActivity } from '../../types';

interface DailyStatsProps {
  activities: DailyVideoActivity[];
  date: string;
}

const DailyStats: React.FC<DailyStatsProps> = ({ activities, date }) => {
  const formatWatchTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getTotalWatchTime = (): number => {
    return activities.reduce((total, activity) => total + activity.watchTime, 0);
  };

  const getCompletedCount = (): number => {
    return activities.filter(activity => activity.completed).length;
  };

  const getUniqueChannels = (): number => {
    const channels = new Set(activities.map(activity => activity.video.channelTitle));
    return channels.size;
  };

  const getAverageProgress = (): number => {
    if (activities.length === 0) return 0;

    const totalProgress = activities.reduce((sum, activity) => {
      // Estimate progress based on watch time vs typical video length
      const estimatedDuration = 600; // 10 minutes default
      const progress = Math.min((activity.watchTime / estimatedDuration) * 100, 100);
      return sum + progress;
    }, 0);

    return Math.round(totalProgress / activities.length);
  };

  const totalWatchTime = getTotalWatchTime();
  const completedCount = getCompletedCount();
  const uniqueChannels = getUniqueChannels();
  const averageProgress = getAverageProgress();

  if (activities.length === 0) {
    return (
      <div className="text-center py-6">
        <Eye className="h-8 w-8 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No learning activity on this day
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
          {new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
          })}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Learning Summary
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Total Watch Time */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-blue-500" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Watch Time
            </span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-1">
            {formatWatchTime(totalWatchTime)}
          </p>
        </div>

        {/* Completed Videos */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Completed
            </span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-1">
            {completedCount}/{activities.length}
          </p>
        </div>

        {/* Unique Channels */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-purple-500" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Channels
            </span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-1">
            {uniqueChannels}
          </p>
        </div>

        {/* Average Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-indigo-500" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Avg Progress
            </span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-1">
            {averageProgress}%
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600 dark:text-gray-400">Daily Goal Progress</span>
          <span className="text-gray-900 dark:text-gray-100 font-medium">
            {completedCount} completed
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
            style={{
              width: `${Math.min((completedCount / Math.max(activities.length, 3)) * 100, 100)}%`
            }}
          />
        </div>
      </div>

      {/* Activity Distribution */}
      {activities.length > 1 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Activity Timeline
          </h4>
          <div className="flex space-x-1">
            {activities.slice(0, 10).map((activity, index) => (
              <div
                key={activity.id}
                className={`flex-1 h-2 rounded-full ${
                  activity.completed
                    ? 'bg-green-400'
                    : activity.watchTime > 0
                      ? 'bg-yellow-400'
                      : 'bg-gray-300 dark:bg-gray-600'
                }`}
                title={`${activity.video.title} - ${activity.completed ? 'Completed' : 'In Progress'}`}
              />
            ))}
            {activities.length > 10 && (
              <div className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                +{activities.length - 10} more
              </div>
            )}
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>Earlier</span>
            <span>Later</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyStats;
