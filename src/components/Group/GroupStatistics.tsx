import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { realtimeService } from '../../services/realtimeService';
import { BarChart3, Users, Clock, TrendingUp, Calendar, Award } from 'lucide-react';

interface GroupStatisticsProps {
  groupId: string;
}

const GroupStatistics: React.FC<GroupStatisticsProps> = ({ groupId }) => {
  const [groupStats, setGroupStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');

  const { groupStatistics } = useAppStore();

  useEffect(() => {
    const unsubscribe = realtimeService.subscribeToGroupStatistics(groupId, (stats) => {
      setGroupStats(stats);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [groupId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!groupStats) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No Statistics Available
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Start watching videos together to generate statistics
        </p>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const filteredActivity = groupStats.weeklyActivity?.filter((activity: any) => {
    const activityDate = new Date(activity.date);
    const now = new Date();
    
    if (timeRange === 'week') {
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      return activityDate >= weekAgo;
    } else if (timeRange === 'month') {
      const monthAgo = new Date(now);
      monthAgo.setMonth(now.getMonth() - 1);
      return activityDate >= monthAgo;
    }
    return true;
  }) || [];

  const totalWatchTime = filteredActivity.reduce((sum: number, activity: any) => sum + activity.watchTime, 0);
  const totalSessions = filteredActivity.reduce((sum: number, activity: any) => sum + activity.sessions, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Group Statistics</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as 'week' | 'month' | 'all')}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-indigo-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Watch Time</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatTime(totalWatchTime)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Sessions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalSessions}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Members</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {groupStats.activeMembers || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Award className="h-8 w-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Videos Watched</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {groupStats.totalVideosWatched || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Weekly Activity
        </h3>
        
        {filteredActivity.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Calendar className="h-12 w-12 mx-auto mb-2" />
            <p>No activity data available</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredActivity.map((activity: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(activity.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {activity.sessions} session{activity.sessions !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatTime(activity.watchTime)}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">watch time</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Member Statistics */}
      {groupStats.memberStats && groupStats.memberStats.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Member Contributions
          </h3>
          
          <div className="space-y-3">
            {groupStats.memberStats.map((member: any, index: number) => (
              <div key={member.userId} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center flex-1">
                  <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                    {member.displayName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {member.displayName || 'Unknown User'}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {member.videosWatched} videos watched
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatTime(member.totalWatchTime)}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {member.sessionsAttended} sessions
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupStatistics;
