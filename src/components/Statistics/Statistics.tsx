import React, { useState } from 'react';
import AdvancedStatistics from './AdvancedStatistics';
import StreakVisualization from './StreakVisualization';
import AdvancedStatisticsDashboard from './AdvancedStatisticsDashboard';

const StatisticsDashboard: React.FC = () => {
  const [viewMode, setViewMode] = useState<'basic' | 'advanced'>('advanced');

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Statistics Dashboard</h1>
        
        <div className="flex space-x-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('basic')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'basic'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Basic View
          </button>
          <button
            onClick={() => setViewMode('advanced')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'advanced'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Advanced Analytics
          </button>
        </div>
      </div>

      {viewMode === 'basic' ? (
        <div className="space-y-6">
          <AdvancedStatistics />
          <StreakVisualization />
        </div>
      ) : (
        <AdvancedStatisticsDashboard />
      )}
    </div>
  );
};

export default StatisticsDashboard;
