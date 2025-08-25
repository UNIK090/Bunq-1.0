import React, { useState } from 'react';
import { TrendingUp, Clock, Eye, CheckCircle, Calendar, Award, Target } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';

interface StatsCard {
  title: string;
  value: string | number;
  change: string;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'neutral';
}

const StatisticsDashboard: React.FC = () => {
  const { getActivitiesForDate } = useAppStore();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

  // Mock data - in real app, this would come from your store
  const statsData: StatsCard[] = [
    {
      title: 'Total Watch Time',
      value: '24h 35m',
      change: '+12%',
      icon: <Clock className="h-5 w-5" />,
      trend: 'up'
    },
    {
      title: 'Videos Completed',
      value: 47,
      change: '+8',
      icon: <CheckCircle className="h-5 w-5" />,
      trend: 'up'
    },
    {
      title: 'Learning Streak',
      value: '7 days',
      change: '+2 days',
      icon: <Calendar className="h-5 w-5" />,
      trend: 'up'
    },
    {
      title: 'Average Score',
      value: '87%',
      change: '+5%',
      icon: <Award className="h-5 w-5" />,
      trend: 'up'
    }
  ];

  const weeklyData = [
    { day: 'Mon', hours: 2.5, videos: 3 },
    { day: 'Tue', hours: 3.2, videos: 4 },
    { day: 'Wed', hours: 1.8, videos: 2 },
    { day: 'Thu', hours: 4.1, videos: 5 },
    { day: 'Fri', hours: 2.9, videos: 3 },
    { day: 'Sat', hours: 3.5, videos: 4 },
    { day: 'Sun', hours: 2.7, videos: 3 }
  ];

  const topSkills = [
    { name: 'React', progress: 85, color: 'bg-blue-500' },
    { name: 'JavaScript', progress: 92, color: 'bg-yellow-500' },
    { name: 'TypeScript', progress: 78, color: 'bg-blue-600' },
    { name: 'Node.js', progress: 65, color: 'bg-green-500' },
    { name: 'CSS/Tailwind', progress: 88, color: 'bg-purple-500' }
  ];

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↑';
      case 'down': return '↓';
      default: return '→';
    }
  };

  return (
    <div className="h-screen flex flex-col p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Statistics Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your learning progress and performance metrics
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="mb-6">
        <div className="flex space-x-2">
          {(['week', 'month', 'year'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statsData.map((stat) => (
          <div
            key={stat.title}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                {stat.icon}
              </div>
              <span className={`text-sm font-medium ${getTrendColor(stat.trend)}`}>
                {getTrendIcon(stat.trend)} {stat.change}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {stat.title}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        {/* Weekly Activity Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Weekly Activity
          </h3>
          <div className="space-y-4">
            {weeklyData.map((day) => (
              <div key={day.day} className="flex items-center">
                <span className="w-12 text-sm text-gray-600 dark:text-gray-400">
                  {day.day}
                </span>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${(day.hours / 5) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {day.hours}h
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Skills Progress
          </h3>
          <div className="space-y-4">
            {topSkills.map((skill) => (
              <div key={skill.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {skill.name}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {skill.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`${skill.color} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${skill.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-indigo-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Daily Goal</p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">3 videos</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <Eye className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">This Week</p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">19.7 hours</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Efficiency</p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">92%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsDashboard;
