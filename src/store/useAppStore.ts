import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Playlist,
  Video,
  VideoProgress,
  UserStats,
  DailyVideoActivity,
  AppNotification,
  NotificationSettings,
  Annotation,
} from "../types";
import { 
  RealTimeProgress, 
  RealTimeStatistics, 
  RealTimeLearningPath,
  VideoWatchEvent 
} from "../types/realtime";
import { realtimeService } from "../services/realtimeService";

interface AppState {
  darkMode: boolean;
  userName: string;
  playlists: Playlist[];
  videoProgress: Record<string, VideoProgress>;
  currentVideo: Video | null;
  userStats: UserStats;
  searchResults: Video[];
  isSearching: boolean;
  dailyActivities: DailyVideoActivity[];
  notifications: AppNotification[];
  notificationSettings: NotificationSettings;
  annotations: Record<string, Annotation[]>;
  realTimeProgress: Record<string, RealTimeProgress>;
  realTimeStatistics: RealTimeStatistics | null;
  realTimeLearningPath: RealTimeLearningPath | null;
  toggleDarkMode: () => void;
  setUserName: (name: string) => void;
  setIsSearching: (isSearching: boolean) => void;
  setSearchResults: (videos: Video[]) => void;
  addPlaylist: (playlist: Playlist) => void;
  updatePlaylist: (playlistId: string, updates: Partial<Playlist>) => void;
  removePlaylist: (playlistId: string) => void;
  addVideoToPlaylist: (playlistId: string, video: Video) => void;
  removeVideoFromPlaylist: (playlistId: string, videoId: string) => void;
  setCurrentVideo: (video: Video | null) => void;
  updateVideoProgress: (
    videoId: string,
    timestamp: number,
    duration: number,
  ) => void;
  updateUserStats: (stats: Partial<UserStats>) => void;
  addDailyActivity: (activity: DailyVideoActivity) => void;
  getActivitiesForDate: (date: string) => DailyVideoActivity[];
  addNotification: (notification: AppNotification) => void;
  markNotificationAsRead: (notificationId: string) => void;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  getUnreadNotifications: () => AppNotification[];
  addAnnotation: (videoId: string, annotation: Annotation) => void;
  updateAnnotation: (videoId: string, annotationId: string, updates: Partial<Annotation>) => void;
  deleteAnnotation: (videoId: string, annotationId: string) => void;
  getAnnotationsForVideo: (videoId: string) => Annotation[];
  setRealTimeProgress: (progress: Record<string, RealTimeProgress>) => void;
  setRealTimeStatistics: (stats: RealTimeStatistics) => void;
  setRealTimeLearningPath: (path: RealTimeLearningPath) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      darkMode: false,
      userName: '',
      annotations: {},
      playlists: [],
      videoProgress: {},
      currentVideo: null,
      userStats: {
        totalWatchTime: 0,
        completedVideos: 0,
        currentStreak: 1,
        longestStreak: 1,
      },
      searchResults: [],
      isSearching: false,
      dailyActivities: [],
      notifications: [],
      notificationSettings: {
        enabled: true,
        remindersBefore: 10,
        dailyGoalReminders: true,
        completionNotifications: true,
      },
      realTimeProgress: {},
      realTimeStatistics: null,
      realTimeLearningPath: null,

      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

      setUserName: (name) => set({ userName: name }),
      setIsSearching: (isSearching) => set({ isSearching }),

      setSearchResults: (videos) => set({ searchResults: videos }),

      addPlaylist: (playlist) =>
        set((state) => ({
          playlists: [...state.playlists, playlist],
        })),

      updatePlaylist: (playlistId, updates) =>
        set((state) => ({
          playlists: state.playlists.map((playlist) =>
            playlist.id === playlistId ? { ...playlist, ...updates } : playlist,
          ),
        })),

      removePlaylist: (playlistId) =>
        set((state) => ({
          playlists: state.playlists.filter(
            (playlist) => playlist.id !== playlistId,
          ),
        })),

      addVideoToPlaylist: (playlistId, video) =>
        set((state) => ({
          playlists: state.playlists.map((playlist) =>
            playlist.id === playlistId
              ? {
                  ...playlist,
                  videos: [
                    ...playlist.videos.filter((v) => v.id !== video.id),
                    video,
                  ],
                }
              : playlist,
          ),
        })),

      removeVideoFromPlaylist: (playlistId, videoId) =>
        set((state) => ({
          playlists: state.playlists.map((playlist) =>
            playlist.id === playlistId
              ? {
                  ...playlist,
                  videos: playlist.videos.filter(
                    (video) => video.id !== videoId,
                  ),
                }
              : playlist,
          ),
        })),

      setCurrentVideo: (video) => set({ currentVideo: video }),

      updateVideoProgress: (videoId, timestamp, duration) =>
        set((state) => {
          const completed = timestamp >= duration * 0.9;
          const existingProgress = state.videoProgress[videoId];
          const lastWatched = new Date().toISOString();

          // Calculate incremental watch time for stats
          const previousTimestamp = existingProgress?.timestamp || 0;
          const incrementalWatchTime = Math.max(
            0,
            timestamp - previousTimestamp,
          );

          // Update stats if the video is completed and wasn't before
          const stats = { ...state.userStats };
          stats.totalWatchTime += incrementalWatchTime;

          if (completed && (!existingProgress || !existingProgress.completed)) {
            stats.completedVideos += 1;

            // Add completion notification if enabled
            if (state.notificationSettings.completionNotifications) {
              const video = state.currentVideo;
              if (video) {
                const notification: AppNotification = {
                  id: Date.now().toString(),
                  type: "completion",
                  title: "Video Completed! 🎉",
                  message: `You've completed "${video.title}"`,
                  videoId,
                  scheduledFor: new Date().toISOString(),
                  read: false,
                  createdAt: new Date().toISOString(),
                };

                // Add notification to state
                state.notifications.push(notification);

                // Show browser notification if supported
                if (
                  "Notification" in window &&
                  Notification.permission === "granted"
                ) {
                  new Notification(notification.title, {
                    body: notification.message,
                    icon: video.thumbnail,
                  });
                }
              }
            }
          }

          // Update or create daily activity
          const today = new Date().toISOString().split("T")[0];
          const existingActivityIndex = state.dailyActivities.findIndex(
            (activity) =>
              activity.videoId === videoId && activity.date === today,
          );

          const video = state.currentVideo;
          if (video) {
            const activityData: DailyVideoActivity = {
              id:
                existingActivityIndex >= 0
                  ? state.dailyActivities[existingActivityIndex].id
                  : Date.now().toString(),
              videoId,
              video,
              date: today,
              watchTime: timestamp,
              completed,
              timestamp,
              createdAt:
                existingActivityIndex >= 0
                  ? state.dailyActivities[existingActivityIndex].createdAt
                  : new Date().toISOString(),
            };

            if (existingActivityIndex >= 0) {
              state.dailyActivities[existingActivityIndex] = activityData;
            } else {
              state.dailyActivities.push(activityData);
            }
          }

          // Log real-time video watch event
          if (video && incrementalWatchTime > 0) {
            const eventType = completed ? 'complete' : 
                             previousTimestamp === 0 ? 'start' : 'progress';
            
            const watchEvent: Omit<VideoWatchEvent, 'id' | 'createdAt'> = {
              userId: 'demo-user', // For now, use demo user
              videoId,
              videoTitle: video.title,
              timestamp,
              duration,
              watchTime: incrementalWatchTime,
              completed,
              eventType,
            };

            // Log to real-time database (fire and forget)
            realtimeService.logVideoWatchEvent('demo-user', watchEvent)
              .catch(console.error);
          }

          return {
            videoProgress: {
              ...state.videoProgress,
              [videoId]: {
                videoId,
                timestamp,
                duration,
                lastWatched,
                completed,
              },
            },
            userStats: stats,
            dailyActivities: [...state.dailyActivities],
            notifications: [...state.notifications],
          };
        }),

      updateUserStats: (stats) =>
        set((state) => ({
          userStats: { ...state.userStats, ...stats },
        })),

      addDailyActivity: (activity) =>
        set((state) => ({
          dailyActivities: [...state.dailyActivities, activity],
        })),

      getActivitiesForDate: (date) => {
        const state = get();
        return state.dailyActivities.filter(
          (activity) => activity.date === date,
        );
      },

      addNotification: (notification) =>
        set((state) => ({
          notifications: [...state.notifications, notification],
        })),

      markNotificationAsRead: (notificationId) =>
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === notificationId
              ? { ...notification, read: true }
              : notification,
          ),
        })),

      updateNotificationSettings: (settings) =>
        set((state) => ({
          notificationSettings: { ...state.notificationSettings, ...settings },
        })),

      getUnreadNotifications: () => {
        const state = get();
        return state.notifications.filter((notification) => !notification.read);
      },

      addAnnotation: (videoId, annotation) =>
        set((state) => ({
          annotations: {
            ...state.annotations,
            [videoId]: [...(state.annotations[videoId] || []), annotation],
          },
        })),

      updateAnnotation: (videoId, annotationId, updates) =>
        set((state) => ({
          annotations: {
            ...state.annotations,
            [videoId]: (state.annotations[videoId] || []).map((annotation) =>
              annotation.id === annotationId
                ? { ...annotation, ...updates }
                : annotation
            ),
          },
        })),

      deleteAnnotation: (videoId, annotationId) =>
        set((state) => ({
          annotations: {
            ...state.annotations,
            [videoId]: (state.annotations[videoId] || []).filter(
              (annotation) => annotation.id !== annotationId
            ),
          },
        })),

      getAnnotationsForVideo: (videoId) => {
        const state = get();
        return state.annotations[videoId] || [];
      },
      
      setRealTimeProgress: (progress) => set({ realTimeProgress: progress }),
      setRealTimeStatistics: (stats) => set({ realTimeStatistics: stats }),
      setRealTimeLearningPath: (path) => set({ realTimeLearningPath: path }),
    }),
    {
      name: "youtube-learning-tracker-storage",
    },
  ),
);
