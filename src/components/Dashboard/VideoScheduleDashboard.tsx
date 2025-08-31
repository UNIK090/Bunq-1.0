import React, { useState } from 'react';
import { Clock, Calendar, Play, Plus, Trash2, AlertCircle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { getVideoDetails } from '../../services/youtubeApi';
import { Video } from '../../types';

interface DailySchedule {
  day: number;
  date: string;
  watchTime: number;
  startTime?: string;
  endTime?: string;
  completed: boolean;
}

interface VideoSchedule {
  id: string;
  videoId: string;
  video: Video;
  targetDays: number;
  totalDuration: number;
  dailyWatchTime: number;
  schedule: DailySchedule[];
  createdAt: string;
}

const VideoScheduleDashboard: React.FC = () => {
  const { darkMode } = useAppStore();
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [targetDays, setTargetDays] = useState(7);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSchedule, setCurrentSchedule] = useState<VideoSchedule | null>(null);
  const [customStartTime, setCustomStartTime] = useState('09:00');

  const extractVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/,
      /(?:youtube\.com\/embed\/)([^?]+)/,
      /(?:youtube\.com\/v\/)([^?]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  };

  const parseDurationToSeconds = (duration: string): number => {
    const parts = duration.split(':').map(Number);
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    }
    return 0;
  };

  const formatSecondsToTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const generateSchedule = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const videoId = extractVideoId(youtubeUrl);
      if (!videoId) {
        throw new Error('Invalid YouTube URL');
      }

      const video = await getVideoDetails(videoId);
      if (!video || !video.duration) {
        throw new Error('Could not fetch video details');
      }

      const totalSeconds = parseDurationToSeconds(video.duration);
      const dailySeconds = Math.ceil(totalSeconds / targetDays);

      const schedule: DailySchedule[] = [];
      const today = new Date();
      
      for (let i = 0; i < targetDays; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        schedule.push({
          day: i + 1,
          date: date.toISOString().split('T')[0],
          watchTime: dailySeconds,
          completed: false
        });
      }

      const videoSchedule: VideoSchedule = {
        id: Date.now().toString(),
        videoId,
        video,
        targetDays,
        totalDuration: totalSeconds,
        dailyWatchTime: dailySeconds,
        schedule,
        createdAt: new Date().toISOString()
      };

      setCurrentSchedule(videoSchedule);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const updateStartTime = (dayIndex: number, startTime: string) => {
    if (!currentSchedule) return;
    
    const updatedSchedule = [...currentSchedule.schedule];
    updatedSchedule[dayIndex] = {
      ...updatedSchedule[dayIndex],
      startTime
    };
    
    setCurrentSchedule({
      ...currentSchedule,
      schedule: updatedSchedule
    });
  };

  const markDayComplete = (dayIndex: number) => {
    if (!currentSchedule) return;
    
    const updatedSchedule = [...currentSchedule.schedule];
    updatedSchedule[dayIndex] = {
      ...updatedSchedule[dayIndex],
      completed: !updatedSchedule[dayIndex].completed
    };
    
    setCurrentSchedule({
      ...currentSchedule,
      schedule: updatedSchedule
    });
  };

  return (
    <div className={`h-full p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 flex items-center">
          <Clock className="h-8 w-8 mr-3 text-indigo-600" />
          Video Schedule Planner
        </h1>

        {/* Input Form */}
        <div className={`p-6 rounded-lg shadow mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-xl font-semibold mb-4">Create New Schedule</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                YouTube Video URL
              </label>
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className={`w-full p-3 rounded border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Target Days to Complete
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={targetDays}
                onChange={(e) => setTargetDays(Number(e.target.value))}
                className={`w-full p-3 rounded border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Default Start Time (optional)
            </label>
            <input
              type="time"
              value={customStartTime}
              onChange={(e) => setCustomStartTime(e.target.value)}
              className={`w-full p-3 rounded border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
            />
          </div>

          <button
            onClick={generateSchedule}
            disabled={isLoading || !youtubeUrl}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              isLoading || !youtubeUrl
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            } text-white`}
          >
            {isLoading ? 'Generating Schedule...' : 'Generate Schedule'}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}
        </div>

        {/* Schedule Display */}
        {currentSchedule && (
          <div className={`p-6 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">{currentSchedule.video.title}</h2>
                <p className="text-gray-500">
                  {formatSecondsToTime(currentSchedule.totalDuration)} total • {currentSchedule.targetDays} days • {formatSecondsToTime(currentSchedule.dailyWatchTime)} per day
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  {currentSchedule.schedule.filter(day => day.completed).length}/{currentSchedule.targetDays} days
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentSchedule.schedule.map((day, index) => (
                <div
                  key={day.day}
                  className={`p-4 rounded-lg border ${
                    day.completed
                      ? 'bg-green-100 border-green-300 dark:bg-green-900 dark:border-green-700'
                      : darkMode
                      ? 'bg-gray-700 border-gray-600'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Day {day.day}</h3>
                    <button
                      onClick={() => markDayComplete(index)}
                      className={`p-1 rounded ${
                        day.completed
                          ? 'bg-green-600 text-white'
                          : darkMode
                          ? 'bg-gray-600 text-gray-300'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {day.completed ? '✓' : '○'}
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-2">
                    {new Date(day.date).toLocaleDateString()}
                  </p>
                  
                  <p className="font-mono text-lg mb-3">
                    {formatSecondsToTime(day.watchTime)}
                  </p>

                  <div className="mb-2">
                    <label className="block text-xs text-gray-500 mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={day.startTime || customStartTime}
                      onChange={(e) => updateStartTime(index, e.target.value)}
                      className={`w-full p-2 rounded border text-sm ${
                        darkMode 
                          ? 'bg-gray-600 border-gray-500 text-white' 
                          : 'bg-gray-50 border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>

                  {day.startTime && (
                    <p className="text-xs text-gray-500">
                      Ends at: {(() => {
                        const [hours, minutes] = day.startTime!.split(':').map(Number);
                        const endTime = new Date();
                        endTime.setHours(hours, minutes + Math.floor(day.watchTime / 60), day.watchTime % 60);
                        return endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      })()}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Schedule Summary
              </h3>
              <p className="text-sm">
                You'll watch {formatSecondsToTime(currentSchedule.dailyWatchTime)} daily to complete this {formatSecondsToTime(currentSchedule.totalDuration)} video in {currentSchedule.targetDays} days.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoScheduleDashboard;
