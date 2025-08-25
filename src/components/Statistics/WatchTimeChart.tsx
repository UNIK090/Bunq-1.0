import React from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
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
import { useVideoStatistics, formatWatchTime, formatTimeOfDay } from '../../services/statisticsService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface WatchTimeChartProps {
  height?: number;
}

const WatchTimeChart: React.FC<WatchTimeChartProps> = ({ height = 400 }) => {
  const statistics = useVideoStatistics();

  // Time of day data for bar chart
  const timeOfDayData = {
    labels: statistics.timeOfDayStats.map(stat => formatTimeOfDay(stat.hour)),
    datasets: [
      {
        label: 'Watch Time (minutes)',
        data: statistics.timeOfDayStats.map(stat => Math.round(stat.watchTime / 60)),
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        borderRadius: 4,
      }
    ]
  };

  const timeOfDayOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Watch Time by Time of Day',
        font: {
          size: 14,
          weight: 'bold' as const
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `Watch Time: ${formatWatchTime(context.parsed.y * 60)}`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time of Day'
        },
        grid: {
          display: false
        }
      },
      y: {
        title: {
          display: true,
          text: 'Minutes Watched'
        },
        beginAtZero: true,
        ticks: {
          stepSize: 30
        }
      }
    }
  };

  // Weekly distribution data for doughnut chart
  const weeklyDistributionData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: Array(7).fill(0),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(199, 199, 199, 0.8)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(199, 199, 199, 1)'
        ],
        borderWidth: 1,
      }
    ]
  };

  // Calculate weekly distribution from daily stats
  const calculateWeeklyDistribution = () => {
    const distribution = Array(7).fill(0);
    statistics.dailyStats.forEach(stat => {
      const date = new Date(stat.date);
      const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
      distribution[dayOfWeek] += stat.watchTime;
    });
    return distribution.map(time => Math.round(time / 60)); // Convert to minutes
  };

  weeklyDistributionData.datasets[0].data = calculateWeeklyDistribution();

  const weeklyDistributionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Weekly Watch Distribution',
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
            return `${context.label}: ${value} min (${percentage}%)`;
          }
        }
      }
    }
  };

  if (statistics.dailyStats.length === 0) {
    return (
      <div className="watch-time-chart" style={{ height }}>
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">No watch time data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="watch-time-chart" style={{ height }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <Bar data={timeOfDayData} options={timeOfDayOptions} height={200} />
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <Doughnut data={weeklyDistributionData} options={weeklyDistributionOptions} height={200} />
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {formatWatchTime(statistics.totalWatchTime)}
          </div>
          <div className="text-sm text-blue-800">Total Watch Time</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {statistics.totalVideosWatched}
          </div>
          <div className="text-sm text-green-800">Videos Watched</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {Math.round(statistics.averageWatchTime / 60)} min
          </div>
          <div className="text-sm text-purple-800">Avg per Video</div>
        </div>
      </div>
    </div>
  );
};

export default WatchTimeChart;
