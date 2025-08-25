import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { useVideoStatistics, formatWatchTime } from '../../services/statisticsService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface VideoHistoryChartProps {
  period?: '7d' | '30d' | '90d' | 'all';
  height?: number;
}

const VideoHistoryChart: React.FC<VideoHistoryChartProps> = ({ 
  period = '30d', 
  height = 300 
}) => {
  const statistics = useVideoStatistics();

  const getFilteredData = () => {
    if (period === 'all') {
      return statistics.dailyStats;
    }

    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    return statistics.dailyStats.slice(-days);
  };

  const filteredData = getFilteredData();

  const chartData = {
    labels: filteredData.map(stat => {
      const date = new Date(stat.date);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }),
    datasets: [
      {
        label: 'Watch Time (minutes)',
        data: filteredData.map(stat => Math.round(stat.watchTime / 60)),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(75, 192, 192)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Videos Watched',
        data: filteredData.map(stat => stat.videosWatched),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(255, 99, 132)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        yAxisID: 'y1',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.datasetIndex === 0) {
              label += formatWatchTime(context.parsed.y * 60);
            } else {
              label += `${context.parsed.y} videos`;
            }
            return label;
          }
        }
      },
      title: {
        display: true,
        text: `Video Watch History (${period})`,
        font: {
          size: 16,
          weight: 'bold' as const
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Watch Time (minutes)'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Videos Watched'
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          stepSize: 1
        }
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    }
  };

  if (filteredData.length === 0) {
    return (
      <div className="video-history-chart" style={{ height }}>
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">No video history data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="video-history-chart" style={{ height }}>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default VideoHistoryChart;
