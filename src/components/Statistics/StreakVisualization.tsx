import React from 'react';
import { useAppStore } from '../../store/useAppStore';

const StreakVisualization: React.FC = () => {
  const { userStats } = useAppStore();

  // Generate last 7 days of streak data (mock data for visualization)
  const generateStreakData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date().getDay();
    const streakData = [];
    
    for (let i = 6; i >= 0; i--) {
      const dayIndex = (today - i + 7) % 7;
      const hasActivity = Math.random() > 0.3; // 70% chance of activity
      streakData.push({
        day: days[dayIndex],
        hasActivity,
        streak: hasActivity ? userStats.currentStreak : 0
      });
    }
    return streakData;
  };

  const streakData = generateStreakData();

  return (
    <div className="streak-container">
      <h3>Learning Streak 🔥</h3>
      <div className="streak-grid">
        {streakData.map((data, index) => (
          <div
            key={index}
            className={`streak-day ${data.hasActivity ? 'active' : 'inactive'}`}
            title={`${data.day}: ${data.hasActivity ? 'Active' : 'No activity'}`}
          >
            <span className="streak-day-label">{data.day}</span>
            <div className={`streak-box ${data.hasActivity ? 'active-box' : 'inactive-box'}`} />
          </div>
        ))}
      </div>
      <div className="streak-info">
        <p>Current Streak: <strong>{userStats.currentStreak} days</strong></p>
        <p>Longest Streak: <strong>{userStats.longestStreak} days</strong></p>
      </div>
      <style jsx>{`
        .streak-box {
          width: 20px;
          height: 20px;
          border-radius: 3px;
          margin: 2px;
        }
        .active-box {
          background-color: #40c463;
          border: 1px solid #30a14e;
        }
        .inactive-box {
          background-color: #ebedf0;
          border: 1px solid #d1d5da;
        }
      `}</style>
    </div>
  );
};

export default StreakVisualization;
