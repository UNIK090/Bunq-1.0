import React from 'react';
import { Play, CheckCircle, Clock, Calendar, Eye } from 'lucide-react';
import { DailyVideoActivity } from '../../types';
import { formatDistanceToNow } from 'date-fns';

interface VideoActivityCardProps {
  activity: DailyVideoActivity;
  onClick: () => void;
  className?: string;
}

const VideoActivityCard: React.FC<VideoActivityCardProps> = ({
  activity,
  onClick,
  className = ''
}) => {
  const formatWatchTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    if (minutes === 0) {
      return `${remainingSeconds}s`;
    }

    if (minutes < 60) {
      return remainingSeconds > 0
        ? `${minutes}m ${remainingSeconds}s`
        : `${minutes}m`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${hours}h`;
  };

  const getCompletionPercentage = (): number => {
    if (!activity.video.duration) return 0;

    // Extract duration from YouTube format (PT#M#S)
    const duration = activity.video.duration;
    let totalSeconds = 0;

    if (duration) {
      const match = duration.match(/PT(\d+M)?(\d+S)?/);
      if (match) {
        const minutes = match[1] ? parseInt(match[1]) : 0;
        const seconds = match[2] ? parseInt(match[2]) : 0;
        totalSeconds = minutes * 60 + seconds;
      }
    }

    if (totalSeconds === 0) return 0;

    return Math.min((activity.watchTime / totalSeconds) * 100, 100);
  };

  const completionPercentage = getCompletionPercentage();

  return (
    <div
      onClick={onClick}
      className={`
        bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700
        hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200
        hover:shadow-md group ${className}
      `}
    >
      <div className="p-4">
        <div className="flex items-start space-x-3">
          {/* Video Thumbnail */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-14 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
              <img
                src={activity.video.thumbnail}
                alt={activity.video.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>

            {/* Play Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all duration-200 rounded-lg flex items-center justify-center">
              <div className="bg-white bg-opacity-90 rounded-full p-2 transform group-hover:scale-110 transition-transform duration-200">
                <Play className="h-4 w-4 text-gray-800" />
              </div>
            </div>

            {/* Completion Badge */}
            {activity.completed && (
              <div className="absolute -top-1 -right-1">
                <CheckCircle className="h-5 w-5 text-green-500 bg-white rounded-full" />
              </div>
            )}
          </div>

          {/* Video Details */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm leading-5 text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {activity.video.title}
            </h3>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
              {activity.video.channelTitle}
            </p>

            {/* Progress Bar */}
            {completionPercentage > 0 && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                  <span>{Math.round(completionPercentage)}% watched</span>
                  <span>{formatWatchTime(activity.watchTime)}</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      activity.completed
                        ? 'bg-green-500'
                        : 'bg-indigo-500'
                    }`}
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center text-xs text-gray-400 dark:text-gray-500 space-x-3">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>
                    {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>

              {activity.completed && (
                <div className="flex items-center text-xs text-green-600 dark:text-green-400 font-medium">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Completed
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="h-3 w-3" />
            <span>{new Date(activity.date).toLocaleDateString()}</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors"
          >
            {activity.completed ? 'Watch again' : 'Continue watching'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoActivityCard;
