import React, { useState } from 'react';
import VideoHistoryChart from './VideoHistoryChart';
import WatchTimeChart from './WatchTimeChart';
import ScreenTimeChart from './ScreenTimeChart';
import { useVideoStatistics } from '../../services/statisticsService';

const AdvancedStatisticsDashboard: React.FC = () => {
  const statistics = useVideoStatistics();
  const [activeTab, setActiveTab] = useState<'history' | 'watchtime' | 'screentime'>('history');

  const tabs = [
    { id: 'history' as const, label: 'Video History', icon: '📊' },
    { id: 'watchtime' as const, label: 'Watch Time', icon: '⏱️' },
    { id: 'screentime' as const, label: 'Screen Time', icon: '📱' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'history':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <VideoHistoryChart height={400} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">
                  {statistics.dailyStats.length}
                </div>
                <div className="text-sm text-blue-800">Days Tracked</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">
                  {statistics.totalVideosWatched}
                </div>
                <div className="text-sm text-green-800">Total Videos</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(statistics.averageWatchTime / 60)}m
                </div>
                <div className="text-sm text-purple-800">Avg Watch Time</div>
              </div>
            </div>
          </div>
        );
      
      case 'watchtime':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <WatchTimeChart height={500} />
            </div>
          </div>
        );
      
      case 'screentime':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <ScreenTimeChart height={500} />
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (statistics.dailyStats.length === 0) {
    return (
      <div className="advanced-statistics-dashboard">
        <div className="bg-white rounded-lg p-8 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Data Available</h2>
          <p className="text-gray-600">
            Start watching videos to see your statistics and analytics.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="advanced-statistics-dashboard">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {renderContent()}

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {Math.round(statistics.totalWatchTime / 3600)}h
          </div>
          <div className="text-sm text-blue-800 font-medium">Total Screen Time</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {statistics.completedVideos}
          </div>
          <div className="text-sm text-green-800 font-medium">Completed Videos</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {Math.round(statistics.engagementRate)}%
          </div>
          <div className="text-sm text-purple-800 font-medium">Engagement Rate</div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">
            {statistics.dailyStats.length}
          </div>
          <div className="text-sm text-orange-800 font-medium">Active Days</div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedStatisticsDashboard;
