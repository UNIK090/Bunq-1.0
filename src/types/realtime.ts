export interface RealTimeProgress {
  userId: string;
  moduleId: string;
  completedLessons: number;
  totalLessons: number;
  lastAccessed: Date;
  timeSpent: number; // in minutes
  streak: number;
  completionRate: number;
}

export interface RealTimeStatistics {
  userId: string;
  totalVideosWatched: number;
  totalWatchTime: number; // in minutes
  averageSessionDuration: number;
  weeklyProgress: {
    week: string;
    videos: number;
    minutes: number;
  }[];
  skillProgress: {
    skill: string;
    level: number;
    progress: number;
  }[];
  achievements: {
    id: string;
    name: string;
    description: string;
    unlockedAt: Date;
    icon: string;
  }[];
}

export interface VideoWatchEvent {
  id: string;
  userId: string;
  videoId: string;
  videoTitle: string;
  timestamp: number;
  duration: number;
  watchTime: number;
  completed: boolean;
  eventType: 'start' | 'progress' | 'complete' | 'pause';
  createdAt: Date;
}

export interface RealTimeLearningPath {
  userId: string;
  modules: {
    id: string;
    title: string;
    progress: number;
    status: 'locked' | 'available' | 'in_progress' | 'completed';
    estimatedCompletion: Date;
    nextLesson: {
      id: string;
      title: string;
      duration: number;
    } | null;
  }[];
  overallProgress: number;
  estimatedCompletionDate: Date;
}
