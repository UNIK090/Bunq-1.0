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
  type: "reminder" | "completion" | "streak" | "goal" | "social";
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
  bio?: string;
  createdAt: string;
  lastLoginAt: string;
  preferences: {
    theme: "light" | "dark" | "system";
    notifications: NotificationSettings;
    dailyGoal: number;
  };
  socialStats: {
    followersCount: number;
    followingCount: number;
    totalWatchTime: number;
    videosWatched: number;
    playlistsCreated: number;
    achievements: Achievement[];
  };
  isPublic: boolean;
  isAdmin?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  category: 'learning' | 'social' | 'engagement' | 'milestone';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface SocialInteraction {
  id: string;
  userId: string;
  targetUserId: string;
  type: 'follow' | 'like' | 'share';
  targetType: 'playlist' | 'video' | 'comment';
  targetId: string;
  createdAt: string;
}

export interface PublicPlaylist extends Playlist {
  isPublic: boolean;
  likesCount: number;
  sharesCount: number;
  viewsCount: number;
  tags: string[];
  description: string;
  creator: {
    uid: string;
    displayName: string;
    photoURL?: string;
  };
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorPhotoURL?: string;
  targetType: 'video' | 'playlist';
  targetId: string;
  likesCount: number;
  repliesCount: number;
  createdAt: string;
  updatedAt: string;
  parentId?: string; // For replies
}



export interface DailySchedule {
  day: number;
  date: string;
  watchTime: number;
  startTime?: string;
  endTime?: string;
  completed: boolean;
}

export interface VideoSchedule {
  id: string;
  videoId: string;
  video: Video;
  targetDays: number;
  totalDuration: number;
  dailyWatchTime: number;
  schedule: DailySchedule[];
  createdAt: string;
  // AI analysis data (optional for backward compatibility)
  analysis?: {
    complexity: 'beginner' | 'intermediate' | 'advanced';
    topics: string[];
    estimatedStudyTime: number;
    keyConcepts: string[];
    prerequisites: string[];
    learningObjectives: string[];
    recommendedPace: 'slow' | 'normal' | 'fast';
    difficultyScore: number;
  };
  studyPlan?: {
    totalDays: number;
    dailyGoals: {
      day: number;
      focus: string;
      estimatedTime: number;
      objectives: string[];
      resources?: string[];
    }[];
    milestones: {
      day: number;
      achievement: string;
    }[];
    recommendedSchedule: {
      day: number;
      startTime: string;
      endTime: string;
    }[];
  };
  calendarEventsCreated?: boolean;
}

export interface AdminUser {
  uid: string;
  email: string;
  isAdmin: boolean;
  banned: boolean;
}

export interface AnalyticsEvent {
  event: string;
  parameters: Record<string, any>;
  timestamp: string;
}

export interface DailySchedule {
  day: number;
  date: string;
  watchTime: number;
  startTime?: string;
  endTime?: string;
  completed: boolean;
}

export interface VideoSchedule {
  id: string;
  videoId: string;
  video: Video;
  targetDays: number;
  totalDuration: number;
  dailyWatchTime: number;
  schedule: DailySchedule[];
  createdAt: string;
}
