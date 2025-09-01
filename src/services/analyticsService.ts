import { getAnalytics, logEvent } from 'firebase/analytics';
import app from './firebase';
import { AnalyticsEvent } from '../types';

const analytics = getAnalytics(app);

export class AnalyticsService {
  static logEvent(event: AnalyticsEvent) {
    logEvent(analytics, event.event, event.parameters);
  }

  static logSocialInteraction(type: string, data: any) {
    this.logEvent({
      event: 'social_interaction',
      parameters: { type, ...data },
      timestamp: new Date().toISOString(),
    });
  }

  static logUserEngagement(action: string, data: any) {
    this.logEvent({
      event: 'user_engagement',
      parameters: { action, ...data },
      timestamp: new Date().toISOString(),
    });
  }

  // Add more tracking methods
}
