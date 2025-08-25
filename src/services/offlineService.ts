import { database } from "./firebase";
import { ref, get, set, onValue, off } from "firebase/database";

export interface ConnectionState {
  isOnline: boolean;
  lastOnline: number;
  retryCount: number;
}

class OfflineService {
  private connectionRef = ref(database, ".info/connected");
  private connectionState: ConnectionState = {
    isOnline: navigator.onLine,
    lastOnline: Date.now(),
    retryCount: 0,
  };

  constructor() {
    this.setupConnectionMonitoring();
    this.setupOnlineOfflineListeners();
  }

  private setupConnectionMonitoring() {
    onValue(this.connectionRef, (snapshot) => {
      const isConnected = snapshot.val();
      this.updateConnectionState(isConnected);
    });
  }

  private setupOnlineOfflineListeners() {
    window.addEventListener('online', () => {
      this.updateConnectionState(true);
    });

    window.addEventListener('offline', () => {
      this.updateConnectionState(false);
    });
  }

  private updateConnectionState(isOnline: boolean) {
    this.connectionState = {
      isOnline,
      lastOnline: isOnline ? Date.now() : this.connectionState.lastOnline,
      retryCount: isOnline ? 0 : this.connectionState.retryCount + 1,
    };
  }

  public getConnectionState(): ConnectionState {
    return this.connectionState;
  }

  public async cacheVideoData(videoId: string, data: any) {
    try {
      const cacheKey = `video_${videoId}`;
      await localStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now(),
      }));
    } catch (error) {
      console.error("Failed to cache video data:", error);
    }
  }

  public async getCachedVideoData(videoId: string): Promise<any | null> {
    try {
      const cacheKey = `video_${videoId}`;
      const cached = localStorage.getItem(cacheKey);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      // Cache expires after 24 hours
      if (Date.now() - timestamp > 24 * 60 * 60 * 1000) {
        localStorage.removeItem(cacheKey);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Failed to get cached video data:", error);
      return null;
    }
  }

  public async clearCache() {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('video_')) {
        localStorage.removeItem(key);
      }
    });
  }

  public shouldRetry(): boolean {
    return this.connectionState.retryCount < 3;
  }

  public getRetryDelay(): number {
    return Math.min(1000 * Math.pow(2, this.connectionState.retryCount), 30000);
  }
}

export const offlineService = new OfflineService();
