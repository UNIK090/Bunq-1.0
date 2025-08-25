export interface Video {
  id: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
  description: string;
  publishedAt: string;
  duration?: string;
  playlistId?: string;
}

export interface VideoProgress {
  videoId: string;
  timestamp: number;
  duration: number;
  lastWatched: string;
  completed: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  videos: Video[];
  createdAt: string;
}

export interface UserStats {
  totalWatchTime: number;
  completedVideos: number;
  currentStreak: number;
  longestStreak: number;
}

export interface CalendarEvent {
  id: string;
  summary: string;
  description: string;
  start: {
    dateTime: string;
  };
  end: {
    dateTime: string;
  };
}

export interface DailyVideoActivity {
  id: string;
  videoId: string;
  video: Video;
  date: string; // ISO date string (YYYY-MM-DD)
  watchTime: number; // seconds watched
  completed: boolean;
  timestamp: number; // last position in video
  createdAt: string;
}

export interface NotificationSettings {
  enabled: boolean;
  remindersBefore: number; // minutes before scheduled time
  dailyGoalReminders: boolean;
  completionNotifications: boolean;
}

export interface AppNotification {
  id: string;
  type: "reminder" | "completion" | "streak" | "goal";
  title: string;
  message: string;
  videoId?: string;
  activityId?: string;
  scheduledFor: string; // ISO datetime
  read: boolean;
  createdAt: string;
}

export interface Annotation {
  id: string;
  timestamp: number;
  text: string;
  color: string;
  createdAt: Date;
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: string;
  lastLoginAt: string;
  preferences: {
    theme: "light" | "dark" | "system";
    notifications: NotificationSettings;
    dailyGoal: number;
  };
}
