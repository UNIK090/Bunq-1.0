import React, { useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useVideoStatistics, formatWatchTime } from '../../services/statisticsService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ScreenTimeChartProps {
  height?: number;
}

const ScreenTimeChart: React.FC<ScreenTimeChartProps> = ({ height = 400 }) => {
  const statistics = useVideoStatistics();
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  const getScreenTimeData = () => {
    switch (timeframe) {
      case 'daily':
        return statistics.dailyStats.slice(-7); // Last 7 days
      case 'weekly':
        return statistics.weeklyStats.slice(-4); // Last 4 weeks
      case 'monthly':
        return statistics.monthlyStats.slice(-6); // Last 6 months
      default:
        return statistics.weeklyStats;
    }
  };

    const screenTimeData = getScreenTimeData();

    const barChartData = {
      labels: screenTimeData.map(stat => {
        if ('date' in stat) {
          const date = new Date(stat.date);
          return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          });
        } else if ('week' in stat) {
          return `Week ${stat.week.split('-W')[1]}`;
        } else {
          const date = new Date(stat.month + '-01');
          return date.toLocaleDateString('en-US', { 
            month: 'short', 
            year: 'numeric' 
          });
        }
      }),
    datasets: [
      {
        label: 'Screen Time (hours)',
        data: screenTimeData.map(stat => Math.round(stat.watchTime / 3600 * 10) / 10), // Convert to hours with 1 decimal
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        borderRadius: 4,
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `Screen Time ${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} Overview`,
        font: {
          size: 14,
          weight: 'bold' as const
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `Screen Time: ${context.parsed.y} hours`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: timeframe === 'daily' ? 'Date' : timeframe === 'weekly' ? 'Week' : 'Month'
        },
        grid: {
          display: false
        }
      },
      y: {
        title: {
          display: true,
          text: 'Hours'
        },
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  // Engagement metrics for pie chart
  const engagementData = {
    labels: ['Completed Videos', 'Incomplete Videos'],
    datasets: [
      {
        data: [
          statistics.completedVideos,
          Math.max(0, statistics.totalVideosWatched - statistics.completedVideos)
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 99, 132, 0.8)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1,
      }
    ]
  };

  const engagementOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Video Completion Rate',
        font: {
          size: 14,
          weight: 'bold' as const
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
            return `${context.label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  if (statistics.dailyStats.length === 0) {
    return (
      <div className="screen-time-chart" style={{ height }}>
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">No screen time data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="screen-time-chart" style={{ height }}>
      {/* Timeframe Selector */}
      <div className="flex justify-center mb-6">
        <div className="flex space-x-2 bg-gray-100 rounded-lg p-1">
          {(['daily', 'weekly', 'monthly'] as const).map((time) => (
            <button
              key={time}
              onClick={() => setTimeframe(time)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                timeframe === time
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {time.charAt(0).toUpperCase() + time.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <Bar data={barChartData} options={barChartOptions} height={250} />
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <Pie data={engagementData} options={engagementOptions} height={250} />
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-xl font-bold text-blue-600">
            {Math.round(statistics.totalWatchTime / 3600)}h
          </div>
          <div className="text-sm text-blue-800">Total Screen Time</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-xl font-bold text-green-600">
            {statistics.completedVideos}
          </div>
          <div className="text-sm text-green-800">Completed Videos</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="text-xl font-bold text-purple-600">
            {Math.round(statistics.engagementRate)}%
          </div>
          <div className="text-sm text-purple-800">Engagement Rate</div>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 text-center">
          <div className="text-xl font-bold text-orange-600">
            {Math.round(statistics.averageWatchTime / 60)}m
          </div>
          <div className="text-sm text-orange-800">Avg Session</div>
        </div>
      </div>
    </div>
  );
};

export default ScreenTimeChart;
