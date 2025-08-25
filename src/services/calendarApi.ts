import { CalendarEvent } from '../types';

// This will store the Google API client instance
let gapi: any = null;

// Initialize Google API client
export const initGoogleApi = async (): Promise<void> => {
  // In a real implementation, you would use gapi-script or the Google API client directly
  // This is a simplified version for demonstration purposes
  
  try {
    // Check if the Google API script is already loaded
    if (window.gapi) {
      gapi = window.gapi;
      await new Promise<void>((resolve) => {
        gapi.load('client:auth2', () => {
          resolve();
        });
      });

      await gapi.client.init({
        apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
        clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        scope: 'https://www.googleapis.com/auth/calendar',
      });

      console.log('Google API initialized');
    } else {
      console.error('Google API not available');
    }
  } catch (error) {
    console.error('Error initializing Google API:', error);
  }
};

// Check if user is signed in to Google
export const isSignedIn = (): boolean => {
  if (!gapi || !gapi.auth2) return false;
  return gapi.auth2.getAuthInstance().isSignedIn.get();
};

// Sign in to Google
export const signIn = async (): Promise<boolean> => {
  if (!gapi || !gapi.auth2) return false;
  
  try {
    await gapi.auth2.getAuthInstance().signIn();
    return true;
  } catch (error) {
    console.error('Error signing in to Google:', error);
    return false;
  }
};

// Sign out from Google
export const signOut = async (): Promise<void> => {
  if (!gapi || !gapi.auth2) return;
  
  try {
    await gapi.auth2.getAuthInstance().signOut();
  } catch (error) {
    console.error('Error signing out from Google:', error);
  }
};

// Create a calendar event for a study reminder
export const createStudyReminder = async (
  title: string,
  description: string,
  startTime: Date,
  durationMinutes: number
): Promise<CalendarEvent | null> => {
  if (!gapi || !gapi.client || !isSignedIn()) return null;
  
  const endTime = new Date(startTime);
  endTime.setMinutes(endTime.getMinutes() + durationMinutes);
  
  const event = {
    summary: title,
    description,
    start: {
      dateTime: startTime.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    end: {
      dateTime: endTime.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 10 },
      ],
    },
  };
  
  try {
    const response = await gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });
    
    return response.result as CalendarEvent;
  } catch (error) {
    console.error('Error creating calendar event:', error);
    return null;
  }
};

// Get upcoming study reminders
export const getUpcomingReminders = async (
  maxResults: number = 10
): Promise<CalendarEvent[]> => {
  if (!gapi || !gapi.client || !isSignedIn()) return [];
  
  try {
    const response = await gapi.client.calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults,
      singleEvents: true,
      orderBy: 'startTime',
      q: 'Learning Reminder', // Search for events with this text in title/description
    });
    
    return response.result.items as CalendarEvent[];
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return [];
  }
};

// Type definition for the global window object to include gapi
declare global {
  interface Window {
    gapi: any;
  }
}