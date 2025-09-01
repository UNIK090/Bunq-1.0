import { AppNotification } from "../types";
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import app from './firebase';

class NotificationService {
  private static instance: NotificationService;

  private constructor() {
    this.initializeNotifications();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private async initializeNotifications() {
    if ("Notification" in window) {
      if (Notification.permission === "default") {
        await this.requestPermission();
      }
    }

    // Handle incoming FCM messages
    onMessage(this.messaging, (payload) => {
      console.log('Message received. ', payload);
      this.showNotification({
        id: payload.messageId || Date.now().toString(),
        type: 'social',
        title: payload.notification?.title || 'Notification',
        message: payload.notification?.body || '',
        scheduledFor: new Date().toISOString(),
        read: false,
        createdAt: new Date().toISOString(),
      });
    });
  }

  public async requestPermission(): Promise<NotificationPermission> {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications");
      return "denied";
    }

    const permission = await Notification.requestPermission();
    return permission;
  }

  public isNotificationSupported(): boolean {
    return "Notification" in window;
  }

  public hasPermission(): boolean {
    return (
      this.isNotificationSupported() && Notification.permission === "granted"
    );
  }

  public showNotification(
    notification: AppNotification,
    options?: {
      icon?: string;
      onClick?: () => void;
      onClose?: () => void;
    },
  ): void {
    if (!this.hasPermission()) {
      console.warn("Notification permission not granted");
      return;
    }

    const browserNotification = new Notification(notification.title, {
      body: notification.message,
      icon: options?.icon || "/favicon.ico",
      badge: "/favicon.ico",
      requireInteraction: notification.type === "reminder",
      tag: notification.id,
    });

    browserNotification.onclick = () => {
      window.focus();
      options?.onClick?.();
      browserNotification.close();
    };

    browserNotification.onclose = () => {
      options?.onClose?.();
    };

    // Auto-close after 5 seconds for non-reminder notifications
    if (notification.type !== "reminder") {
      setTimeout(() => {
        browserNotification.close();
      }, 5000);
    }
  }

  public scheduleNotification(
    notification: AppNotification,
    delay: number,
    options?: {
      icon?: string;
      onClick?: () => void;
      onClose?: () => void;
    },
  ): number {
    return window.setTimeout(() => {
      this.showNotification(notification, options);
    }, delay);
  }

  public cancelScheduledNotification(timeoutId: number): void {
    clearTimeout(timeoutId);
  }

  public showVideoCompletionNotification(
    videoTitle: string,
    thumbnail: string,
  ): void {
    const notification: AppNotification = {
      id: Date.now().toString(),
      type: "completion",
      title: "🎉 Video Completed!",
      message: `Great job! You've completed "${videoTitle}"`,
      scheduledFor: new Date().toISOString(),
      read: false,
      createdAt: new Date().toISOString(),
    };

    this.showNotification(notification, {
      icon: thumbnail,
    });
  }

  public showReminderNotification(
    reminderTitle: string,
    message: string,
  ): void {
    const notification: AppNotification = {
      id: Date.now().toString(),
      type: "reminder",
      title: "⏰ Learning Reminder",
      message: `Time for: ${reminderTitle}`,
      scheduledFor: new Date().toISOString(),
      read: false,
      createdAt: new Date().toISOString(),
    };

    this.showNotification(notification);
  }

  public showStreakNotification(currentStreak: number): void {
    const notification: AppNotification = {
      id: Date.now().toString(),
      type: "streak",
      title: "🔥 Streak Achievement!",
      message: `Amazing! You're on a ${currentStreak}-day learning streak!`,
      scheduledFor: new Date().toISOString(),
      read: false,
      createdAt: new Date().toISOString(),
    };

    this.showNotification(notification);
  }

  public showDailyGoalNotification(
    completedVideos: number,
    goalVideos: number,
  ): void {
    const notification: AppNotification = {
      id: Date.now().toString(),
      type: "goal",
      title: "🎯 Daily Goal Achieved!",
      message: `Excellent! You've completed ${completedVideos}/${goalVideos} videos today!`,
      scheduledFor: new Date().toISOString(),
      read: false,
      createdAt: new Date().toISOString(),
    };

    this.showNotification(notification);
  }

  // Firebase Cloud Messaging
  private messaging = getMessaging(app);

  public async requestFCMPermission(): Promise<string | null> {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await getToken(this.messaging, { vapidKey: import.meta.env.VITE_FCM_VAPID_KEY });
        return token;
      }
    } catch (error) {
      console.error('Error getting FCM token:', error);
    }
    return null;
  }

  // Social Notifications
  public showNewFollowerNotification(followerName: string): void {
    const notification: AppNotification = {
      id: Date.now().toString(),
      type: "social",
      title: "New Follower",
      message: `${followerName} started following you!`,
      scheduledFor: new Date().toISOString(),
      read: false,
      createdAt: new Date().toISOString(),
    };
    this.showNotification(notification);
  }

  public showLikeNotification(likerName: string, target: string): void {
    const notification: AppNotification = {
      id: Date.now().toString(),
      type: "social",
      title: "New Like",
      message: `${likerName} liked your ${target}!`,
      scheduledFor: new Date().toISOString(),
      read: false,
      createdAt: new Date().toISOString(),
    };
    this.showNotification(notification);
  }

  public showCommentNotification(commenterName: string, target: string): void {
    const notification: AppNotification = {
      id: Date.now().toString(),
      type: "social",
      title: "New Comment",
      message: `${commenterName} commented on your ${target}!`,
      scheduledFor: new Date().toISOString(),
      read: false,
      createdAt: new Date().toISOString(),
    };
    this.showNotification(notification);
  }

  public showAchievementNotification(achievementTitle: string): void {
    const notification: AppNotification = {
      id: Date.now().toString(),
      type: "social",
      title: "Achievement Unlocked",
      message: `Congratulations! You unlocked "${achievementTitle}"!`,
      scheduledFor: new Date().toISOString(),
      read: false,
      createdAt: new Date().toISOString(),
    };
    this.showNotification(notification);
  }
}

export const notificationService = NotificationService.getInstance();
