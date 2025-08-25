import { 
  onValue, 
  ref, 
  update,
  serverTimestamp,
  push,
  set 
} from 'firebase/database';
import { database } from './firebase';
import { 
  RealTimeProgress, 
  RealTimeStatistics, 
  RealTimeLearningPath,
  VideoWatchEvent 
} from '../types/realtime';

export class RealtimeService {
  private db = database;

  // Learning Path Real-time Updates
  subscribeToLearningPath(userId: string, callback: (data: RealTimeLearningPath) => void) {
    const pathRef = ref(this.db, `learningPath/${userId}`);
    return onValue(pathRef, (snapshot) => {
      const data = snapshot.val();
      callback(data || this.getDefaultLearningPath(userId));
    });
  }

  // Progress Real-time Updates
  subscribeToProgress(userId: string, callback: (progress: Record<string, RealTimeProgress>) => void) {
    const progressRef = ref(this.db, `progress/${userId}`);
    return onValue(progressRef, (snapshot) => {
      callback(snapshot.val() || {});
    });
  }

  // Statistics Real-time Updates
  subscribeToStatistics(userId: string, callback: (stats: RealTimeStatistics) => void) {
    const statsRef = ref(this.db, `statistics/${userId}`);
    return onValue(statsRef, (snapshot) => {
      const data = snapshot.val();
      callback(data || this.getDefaultStatistics(userId));
    });
  }

  // Update progress in real-time
  async updateProgress(userId: string, moduleId: string, progress: Partial<RealTimeProgress>) {
    const progressRef = ref(this.db, `progress/${userId}/${moduleId}`);
    await update(progressRef, {
      ...progress,
      lastAccessed: serverTimestamp(),
    });
  }

  // Update learning path in real-time
  async updateLearningPath(userId: string, learningPath: Partial<RealTimeLearningPath>) {
    const pathRef = ref(this.db, `learningPath/${userId}`);
    await update(pathRef, {
      ...learningPath,
      updatedAt: serverTimestamp(),
    });
  }

  // Update statistics in real-time
  async updateStatistics(userId: string, stats: Partial<RealTimeStatistics>) {
    const statsRef = ref(this.db, `statistics/${userId}`);
    await update(statsRef, {
      ...stats,
      updatedAt: serverTimestamp(),
    });
  }

  private getDefaultLearningPath(userId: string): RealTimeLearningPath {
    return {
      userId,
      modules: [],
      overallProgress: 0,
      estimatedCompletionDate: new Date(),
    };
  }

  private getDefaultStatistics(userId: string): RealTimeStatistics {
    return {
      userId,
      totalVideosWatched: 0,
      totalWatchTime: 0,
      averageSessionDuration: 0,
      weeklyProgress: [],
      skillProgress: [],
      achievements: [],
    };
  }

  // Video Watch Time Tracking
  async logVideoWatchEvent(userId: string, event: Omit<VideoWatchEvent, 'id' | 'createdAt'>) {
    const eventsRef = ref(this.db, `videoEvents/${userId}`);
    const newEventRef = push(eventsRef);
    
    const fullEvent: VideoWatchEvent = {
      ...event,
      id: newEventRef.key!,
      createdAt: new Date()
    };
    
    await set(newEventRef, fullEvent);
    return fullEvent;
  }

  // Subscribe to real-time video watch events
  subscribeToVideoEvents(userId: string, callback: (events: VideoWatchEvent[]) => void) {
    const eventsRef = ref(this.db, `videoEvents/${userId}`);
    return onValue(eventsRef, (snapshot) => {
      const data = snapshot.val();
      const events: VideoWatchEvent[] = data ? Object.values(data) : [];
      callback(events);
    });
  }

  // Get real-time watch statistics for dashboard
  async getRealTimeWatchStats(userId: string): Promise<{
    currentSessionTime: number;
    todayWatchTime: number;
    weeklyWatchTime: number;
    activeVideos: number;
  }> {
    return new Promise((resolve) => {
      const eventsRef = ref(this.db, `videoEvents/${userId}`);
      onValue(eventsRef, (snapshot) => {
        const data = snapshot.val();
        const events: VideoWatchEvent[] = data ? Object.values(data) : [];

        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());

        const todayEvents = events.filter(event => 
          new Date(event.createdAt).toISOString().split('T')[0] === today
        );
        
        const weekEvents = events.filter(event => 
          new Date(event.createdAt) >= weekStart
        );

        const currentSessionEvents = events.filter(event => 
          new Date(event.createdAt).getTime() > Date.now() - 30 * 60 * 1000 // Last 30 minutes
        );

        resolve({
          currentSessionTime: currentSessionEvents.reduce((sum, event) => sum + event.watchTime, 0),
          todayWatchTime: todayEvents.reduce((sum, event) => sum + event.watchTime, 0),
          weeklyWatchTime: weekEvents.reduce((sum, event) => sum + event.watchTime, 0),
          activeVideos: new Set(todayEvents.map(event => event.videoId)).size
        });
      }, { onlyOnce: true });
    });
  }

  // Update statistics with real-time video data
  async updateStatisticsWithVideoData(userId: string, videoEvents: VideoWatchEvent[]) {
    const statsRef = ref(this.db, `statistics/${userId}`);
    const currentStats = await this.getCurrentStatistics(userId);
    
    const totalWatchTime = videoEvents.reduce((sum, event) => sum + event.watchTime, 0);
    const totalVideosWatched = new Set(videoEvents.map(event => event.videoId)).size;
    
    const updatedStats: Partial<RealTimeStatistics> = {
      totalWatchTime,
      totalVideosWatched,
      averageSessionDuration: totalVideosWatched > 0 ? totalWatchTime / totalVideosWatched : 0
    };

    await update(statsRef, {
      ...updatedStats,
      updatedAt: serverTimestamp(),
    });
  }

  private async getCurrentStatistics(userId: string): Promise<RealTimeStatistics> {
    const statsRef = ref(this.db, `statistics/${userId}`);
    return new Promise((resolve) => {
      onValue(statsRef, (snapshot) => {
        const data = snapshot.val();
        resolve(data || this.getDefaultStatistics(userId));
      }, { onlyOnce: true });
    });
  }
}

export const realtimeService = new RealtimeService();
