import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { realtimeService } from '../../services/realtimeService';
import { TrendingUp, Target, Calendar, Users, BarChart3 } from 'lucide-react';

interface GroupProgressAnalysisProps {
  groupId: string;
}

const GroupProgressAnalysis: React.FC<GroupProgressAnalysisProps> = ({ groupId }) => {
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');

  useEffect(() => {
    const unsubscribe = realtimeService.subscribeToGroupStatistics(groupId, (stats) => {
      if (stats) {
        const analysis = analyzeGroupProgress(stats, timeRange);
        setAnalysisData(analysis);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [groupId, timeRange]);

  const analyzeGroupProgress = (stats: any, range: string) => {
    const now = new Date();
    let startDate: Date;
    
    if (range === 'week') {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
    } else if (range === 'month') {
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
    } else {
      startDate = new Date(0); // All time
    }

    const filteredActivity = stats.weeklyActivity?.filter((activity: any) => 
      new Date(activity.date) >= startDate
    ) || [];

    const totalWatchTime = filteredActivity.reduce((sum: number, activity: any) => sum + activity.watchTime, 0);
    const totalSessions = filteredActivity.reduce((sum: number, activity: any) => sum + activity.sessions, 0);
    const avgSessionDuration = totalSessions > 0 ? totalWatchTime / totalSessions : 0;

    // Calculate trends
    const recentWeeks = filteredActivity.slice(-4); // Last 4 weeks
    const trend = recentWeeks.length >= 2 
      ? (recentWeeks[recentWeeks.length - 1].watchTime - recentWeeks[0].watchTime) / recentWeeks[0].watchTime * 100
      : 0;

    // Member participation analysis
    const memberParticipation = stats.memberStats?.map((member: any) => ({
      ...member,
      participationRate: totalWatchTime > 0 ? (member.totalWatchTime / totalWatchTime) * 100 : 0
    })) || [];

    return {
      totalWatchTime,
      totalSessions,
      avgSessionDuration,
      trend,
      memberParticipation,
      activityByDay: analyzeActivityByDay(filteredActivity),
      peakHours: analyzePeakHours(filteredActivity),
      completionRate: calculateCompletionRate(stats)
    };
  };

  const analyzeActivityByDay = (activity: any[]) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const activityByDay = days.map(day => ({ day, watchTime: 0, sessions: 0 }));

    activity.forEach(item => {
      const date = new Date(item.date);
      const dayIndex = date.getDay();
      activityByDay[dayIndex].watchTime += item.watchTime;
      activityByDay[dayIndex].sessions += item.sessions;
    });

    return activityByDay;
  };

  const analyzePeakHours = (activity: any[]) => {
    // This would require timestamp data in the activity
    // For now, return mock data or implement when timestamp data is available
    return [
      { hour: '9-11 AM', watchTime: 1200, sessions: 3 },
      { hour: '2-4 PM', watchTime: 1800, sessions: 4 },
      { hour: '7-9 PM', watchTime: 2400, sessions: 6 },
    ];
  };

  const calculateCompletionRate = (stats: any) => {
    // This would require tracking video completion data
    // For now, return a mock value
    return 75; // 75% completion rate
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No Analysis Available
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Start group activities to generate progress analysis
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Progress Analysis</h2>
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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-indigo-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Watch Time</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatTime(analysisData.totalWatchTime)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analysisData.completionRate}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Session</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatTime(analysisData.avgSessionDuration)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Trend</p>
              <p className={`text-2xl font-bold ${
                analysisData.trend > 0 ? 'text-green-600' : analysisData.trend < 0 ? 'text-red-600' : 'text-gray-900'
              }`}>
                {analysisData.trend > 0 ? '+' : ''}{analysisData.trend.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Activity by Day */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Activity by Day of Week
        </h3>
        <div className="grid grid-cols-7 gap-2">
          {analysisData.activityByDay.map((dayData: any, index: number) => (
            <div key={index} className="text-center">
              <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                {dayData.day}
              </div>
              <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-lg p-2">
                <div className="text-xs text-indigo-800 dark:text-indigo-200 font-semibold">
                  {formatTime(dayData.watchTime)}
                </div>
                <div className="text-xs text-indigo-600 dark:text-indigo-400">
                  {dayData.sessions} sessions
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Member Participation */}
      {analysisData.memberParticipation.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Member Participation
          </h3>
          <div className="space-y-3">
            {analysisData.memberParticipation
              .sort((a: any, b: any) => b.participationRate - a.participationRate)
              .map((member: any, index: number) => (
                <div key={member.userId} className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                      {member.displayName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {member.displayName || 'Unknown User'}
                      </p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(member.participationRate, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {member.participationRate.toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {formatTime(member.totalWatchTime)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Peak Hours */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Peak Watching Hours
        </h3>
        <div className="space-y-3">
          {analysisData.peakHours.map((hourData: any, index: number) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {hourData.hour}
              </span>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatTime(hourData.watchTime)}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {hourData.sessions} sessions
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupProgressAnalysis;
