import React from 'react';
import { Pie } from 'react-chartjs-2';
import { useAppStore } from '../../store/useAppStore';
import { VideoProgress } from '../../types';

const AdvancedStatistics: React.FC = () => {
  const { videoProgress } = useAppStore();

  // Calculate average watch time and engagement rate
  const totalWatchTime = Object.values(videoProgress).reduce((acc: number, curr: VideoProgress) => acc + curr.duration, 0);
  const averageWatchTime = totalWatchTime / Object.keys(videoProgress).length || 0;
  const completedVideos = Object.values(videoProgress).filter(v => v.completed).length;
  const engagementRate = (completedVideos / Object.keys(videoProgress).length) * 100 || 0;

  // Data for pie charts
  const watchTimeData = {
    labels: ['Average Watch Time', 'Remaining Time'],
    datasets: [{
      data: [averageWatchTime, 100 - averageWatchTime], // Assuming 100 is the max for visualization
      backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
    }],
  };

  const engagementData = {
    labels: ['Engaged', 'Not Engaged'],
    datasets: [{
      data: [completedVideos, Object.keys(videoProgress).length - completedVideos],
      backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
    }],
  };

  return (
    <div>
      <h2>Advanced Statistics</h2>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div style={{ width: '200px', height: '200px' }}>
          <h3>Average Watch Time</h3>
          <Pie data={watchTimeData} />
        </div>
        <div style={{ width: '200px', height: '200px' }}>
          <h3>Engagement Rate</h3>
          <Pie data={engagementData} />
        </div>
      </div>
    </div>
  );
};

export default AdvancedStatistics;
