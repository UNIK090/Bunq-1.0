<<<<<<< HEAD
import { getDatabase, ref, onValue, push, set, update, remove, serverTimestamp } from 'firebase/database';
await update(presRef, {
...presence,
state: 'online',
lastActive: serverTimestamp(),
});
=======
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
import { onSnapshot, query, where, orderBy, limit } from 'firebase/firestore';
import { socialInteractionsCollection, achievementsCollection, leaderboardsCollection, commentsCollection } from './firebase';
import { SocialInteraction, Comment, Achievement } from '../types';


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

  // Social Real-time Updates
  subscribeToSocialInteractions(userId: string, callback: (interactions: SocialInteraction[]) => void) {
    const q = query(socialInteractionsCollection, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const interactions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SocialInteraction));
      callback(interactions);
    });
  }

  subscribeToComments(targetId: string, callback: (comments: Comment[]) => void) {
    const q = query(commentsCollection, where('targetId', '==', targetId), orderBy('createdAt', 'asc'));
    return onSnapshot(q, (snapshot) => {
      const comments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment));
      callback(comments);
    });
  }

  subscribeToAchievements(userId: string, callback: (achievements: Achievement[]) => void) {
    const q = query(achievementsCollection, where('userId', '==', userId), orderBy('unlockedAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const achievements = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Achievement));
      callback(achievements);
    });
  }

  subscribeToLeaderboard(callback: (leaderboard: any[]) => void) {
    const q = query(leaderboardsCollection, orderBy('score', 'desc'), limit(50));
    return onSnapshot(q, (snapshot) => {
      const leaderboard = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(leaderboard);
    });
  }

  // Placeholder for group statistics
  subscribeToGroupStatistics(groupId: string, callback: (stats: any) => void) {
    // Implement group statistics subscription
    callback({});
    return () => {}; // unsubscribe
  }

  // Placeholder for group playlists
  subscribeToGroupPlaylists(groupId: string, callback: (playlists: any[]) => void) {
    callback([]);
    return () => {};
  }

>>>>>>> 8ce3be7 (Bunq1.0)
}


async clearPresence(groupId: string, userId: string) {
const presRef = ref(this.db, `groups/${groupId}/presence/${userId}`);
await remove(presRef);
}


subscribeToPresence(groupId: string, callback: (users: Record<string, any>) => void) {
const presRef = ref(this.db, `groups/${groupId}/presence`);
onValue(presRef, (snap) => {
callback(snap.val() || {});
});
return () => {};
}


// ------------------ Typing ------------------
async setTyping(groupId: string, userId: string, isTyping: boolean) {
const typingRef = ref(this.db, `groups/${groupId}/typing/${userId}`);
await update(typingRef, { isTyping, updatedAt: serverTimestamp() });
}


subscribeToTyping(groupId: string, callback: (typing: Record<string, { isTyping: boolean }>) => void) {
const typingRef = ref(this.db, `groups/${groupId}/typing`);
onValue(typingRef, (snap) => callback(snap.val() || {}));
return () => {};
}


// ------------------ Playback sync ------------------
async sendPlaybackEvent(groupId: string, event: { type: 'play' | 'pause' | 'seek'; videoId: string; position: number; userId: string; userName?: string }) {
const evRef = ref(this.db, `groups/${groupId}/playbackEvents`);
const newRef = push(evRef);
await set(newRef, { ...event, createdAt: serverTimestamp() });
}


subscribeToPlayback(groupId: string, callback: (events: any[]) => void) {
const evRef = ref(this.db, `groups/${groupId}/playbackEvents`);
onValue(evRef, (snap) => {
const val = snap.val() || {};
const list = Object.values(val).map((v: any) => ({ ...v }));
list.sort((a: any, b: any) => (a.createdAt || 0) - (b.createdAt || 0));
callback(list);
});
return () => {};
}
}


export default RealtimeService;