import { DailyVideoActivity, VideoProgress } from '../types';
import { useAppStore } from '../store/useAppStore';

export interface VideoStatistics {
  totalWatchTime: number;
  totalVideosWatched: number;
  completedVideos: number;
  averageWatchTime: number;
  engagementRate: number;
  dailyStats: DailyStat[];
  weeklyStats: WeeklyStat[];
  monthlyStats: MonthlyStat[];
  categoryStats: CategoryStat[];
  timeOfDayStats: TimeOfDayStat[];
}

export interface DailyStat {
  date: string;
  watchTime: number;
  videosWatched: number;
  completedVideos: number;
}

export interface WeeklyStat {
  week: string;
  watchTime: number;
  videosWatched: number;
  completedVideos: number;
  averageDailyWatchTime: number;
  days: number;
}

export interface MonthlyStat {
  month: string;
  watchTime: number;
  videosWatched: number;
  completedVideos: number;
  averageDailyWatchTime: number;
  days: number;
}

export interface CategoryStat {
  category: string;
  watchTime: number;
  videosWatched: number;
  completedVideos: number;
}

export interface TimeOfDayStat {
  hour: number;
  watchTime: number;
  videosWatched: number;
  completedVideos: number;
}

export const calculateVideoStatistics = (dailyActivities: DailyVideoActivity[], videoProgress: Record<string, VideoProgress>): VideoStatistics => {
  // Calculate basic statistics
  const totalWatchTime = dailyActivities.reduce((acc, activity) => acc + activity.watchTime, 0);
  const totalVideosWatched = new Set(dailyActivities.map(activity => activity.videoId)).size;
  const completedVideos = Object.values(videoProgress).filter(v => v.completed).length;
  const averageWatchTime = totalVideosWatched > 0 ? totalWatchTime / totalVideosWatched : 0;
  const engagementRate = totalVideosWatched > 0 ? (completedVideos / totalVideosWatched) * 100 : 0;

  // Group by date for daily stats
  const dailyStatsMap = new Map<string, DailyStat>();
  dailyActivities.forEach(activity => {
    const date = activity.date;
    const existing = dailyStatsMap.get(date) || {
      date,
      watchTime: 0,
      videosWatched: 0,
      completedVideos: 0
    };

    existing.watchTime += activity.watchTime;
    existing.videosWatched += 1;
    if (activity.completed) {
      existing.completedVideos += 1;
    }

    dailyStatsMap.set(date, existing);
  });

  const dailyStats = Array.from(dailyStatsMap.values()).sort((a, b) => a.date.localeCompare(b.date));

  // Group by week for weekly stats
  const weeklyStatsMap = new Map<string, { week: string; watchTime: number; videosWatched: number; completedVideos: number; days: number }>();
  dailyStats.forEach(daily => {
    const week = getWeekNumber(new Date(daily.date));
    const existing = weeklyStatsMap.get(week) || {
      week,
      watchTime: 0,
      videosWatched: 0,
      completedVideos: 0,
      days: 0
    };

    existing.watchTime += daily.watchTime;
    existing.videosWatched += daily.videosWatched;
    existing.completedVideos += daily.completedVideos;
    existing.days += 1;

    weeklyStatsMap.set(week, existing);
  });

  const weeklyStats = Array.from(weeklyStatsMap.values()).map(week => ({
    week: week.week,
    watchTime: week.watchTime,
    videosWatched: week.videosWatched,
    completedVideos: week.completedVideos,
    averageDailyWatchTime: week.days > 0 ? week.watchTime / week.days : 0,
    days: week.days
  })).sort((a, b) => a.week.localeCompare(b.week));

  // Group by month for monthly stats
  const monthlyStatsMap = new Map<string, { month: string; watchTime: number; videosWatched: number; completedVideos: number; days: number }>();
  dailyStats.forEach(daily => {
    const month = daily.date.substring(0, 7); // YYYY-MM
    const existing = monthlyStatsMap.get(month) || {
      month,
      watchTime: 0,
      videosWatched: 0,
      completedVideos: 0,
      days: 0
    };

    existing.watchTime += daily.watchTime;
    existing.videosWatched += daily.videosWatched;
    existing.completedVideos += daily.completedVideos;
    existing.days += 1;

    monthlyStatsMap.set(month, existing);
  });

  const monthlyStats = Array.from(monthlyStatsMap.values()).map(month => ({
    month: month.month,
    watchTime: month.watchTime,
    videosWatched: month.videosWatched,
    completedVideos: month.completedVideos,
    averageDailyWatchTime: month.days > 0 ? month.watchTime / month.days : 0,
    days: month.days
  })).sort((a, b) => a.month.localeCompare(b.month));

  // Time of day analysis
  const timeOfDayStatsMap = new Map<number, TimeOfDayStat>();
  dailyActivities.forEach(activity => {
    const hour = new Date(activity.createdAt).getHours();
    const existing = timeOfDayStatsMap.get(hour) || {
      hour,
      watchTime: 0,
      videosWatched: 0,
      completedVideos: 0
    };

    existing.watchTime += activity.watchTime;
    existing.videosWatched += 1;
    if (activity.completed) {
      existing.completedVideos += 1;
    }

    timeOfDayStatsMap.set(hour, existing);
  });

  const timeOfDayStats = Array.from(timeOfDayStatsMap.values())
    .sort((a, b) => a.hour - b.hour);

  return {
    totalWatchTime,
    totalVideosWatched,
    completedVideos,
    averageWatchTime,
    engagementRate,
    dailyStats,
    weeklyStats,
    monthlyStats,
    categoryStats: [], // Will be implemented later with video categorization
    timeOfDayStats
  };
};

export const getWatchTimeTrend = (dailyStats: DailyStat[], period: number = 7): number => {
  if (dailyStats.length < 2) return 0;
  
  const recentStats = dailyStats.slice(-period);
  const previousStats = dailyStats.slice(-period * 2, -period);
  
  const recentAverage = recentStats.reduce((sum, stat) => sum + stat.watchTime, 0) / recentStats.length;
  const previousAverage = previousStats.length > 0 
    ? previousStats.reduce((sum, stat) => sum + stat.watchTime, 0) / previousStats.length 
    : recentAverage;
  
  return previousAverage > 0 ? ((recentAverage - previousAverage) / previousAverage) * 100 : 0;
};

export const formatWatchTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export const formatTimeOfDay = (hour: number): string => {
  if (hour === 0) return '12 AM';
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return '12 PM';
  return `${hour - 12} PM`;
};

const getWeekNumber = (date: Date): string => {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  return `${date.getFullYear()}-W${weekNumber.toString().padStart(2, '0')}`;
};

// Hook for using statistics in components
export const useVideoStatistics = (): VideoStatistics => {
  const { dailyActivities, videoProgress } = useAppStore();
  return calculateVideoStatistics(dailyActivities, videoProgress);
};
