import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { formatDistanceToNow } from 'date-fns';
import { Video } from '../../types';

const RecentVideos: React.FC = () => {
  const navigate = useNavigate();
  const { dailyActivities } = useAppStore();

  // Sort activities by date, most recent first
  const sortedActivities = useMemo(() => {
    return [...dailyActivities].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ).slice(0, 5); // Get the 5 most recent activities
  }, [dailyActivities]);

  const handleVideoClick = (video: Video) => {
    navigate(`/player/${video.id}`);
  };

  if (sortedActivities.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No recently watched videos.</p>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Search for videos and add them to your playlists to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedActivities.map((activity) => (
        <div 
          key={activity.id} 
          className="flex items-center space-x-4 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer"
          onClick={() => handleVideoClick(activity.video)}
        >
          <img src={activity.video.thumbnail} alt={activity.video.title} className="w-24 h-16 object-cover rounded" />
          <div className="flex-grow">
            <h3 className="font-semibold">{activity.video.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Watched {formatDistanceToNow(new Date(activity.createdAt))} ago
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentVideos;