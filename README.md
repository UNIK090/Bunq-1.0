# Skillra - YouTube Learning Tracker with Calendar Integration

A comprehensive YouTube learning tracker that helps you organize, track, and schedule your educational video content with calendar integration, real-time notifications, and secure Google authentication.

## ✨ Features

### 🔐 Authentication
- **Google Sign-In**: Secure authentication with Firebase
- **User Profiles**: Personal learning data synced to your account
- **Privacy First**: All data associated with your Google account
- **Seamless Experience**: One-click sign-in with beautiful UI

### 🎥 Video Management
- **YouTube Integration**: Search and add videos from YouTube
- **Custom Playlists**: Create and organize your learning playlists
- **Progress Tracking**: Track your viewing progress for each video
- **Resume Playback**: Pick up where you left off

### 📅 Calendar Integration
- **Daily Activity View**: See all videos watched on any given day
- **Video Thumbnails**: Visual calendar with video thumbnails for each day
- **Click-to-Play**: Click on any calendar activity to resume watching
- **Daily Statistics**: View learning progress, watch time, and completion stats
- **Weekly Overview**: Navigate through weeks to see your learning journey

### 🔔 Smart Notifications
- **Real-time Browser Notifications**: Get notified about learning milestones
- **Video Completion Alerts**: Celebrate when you finish videos
- **Learning Reminders**: Set custom reminders for your learning schedule
- **Streak Notifications**: Stay motivated with streak achievements
- **Daily Goal Tracking**: Monitor progress toward daily learning goals

### 📊 Progress Analytics
- **Watch Time Tracking**: Monitor total time spent learning
- **Completion Rates**: Track how many videos you've completed
- **Learning Streaks**: Build and maintain learning habits
- **Channel Diversity**: See how many different channels you learn from
- **Daily Insights**: Detailed breakdowns of daily learning activity

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern web browser with notification support

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd skillra-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Add your API keys to the `.env` file:
   ```
   # YouTube API
   VITE_YOUTUBE_API_KEY=your_youtube_api_key_here
   
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🎯 How to Use

### First Time Setup

1. **Firebase Authentication Setup**
   - Follow the detailed [Firebase Setup Guide](./FIREBASE_SETUP.md)
   - Create a Firebase project and enable Google Authentication
   - Configure your environment variables

2. **Sign In**
   - Open the application in your browser
   - Click "Continue with Google" on the sign-in page
   - Grant necessary permissions
   - You're ready to start learning!

### Setting Up Notifications

1. **Enable Browser Notifications**
   - Go to the Calendar view
   - Click on the settings icon in the notification section
   - Click "Enable" to grant browser notification permissions

2. **Configure Notification Settings**
   - Choose which types of notifications you want to receive
   - Set reminder timing (5-60 minutes before scheduled events)
   - Test notifications to ensure they're working

### Using the Calendar Feature

1. **Viewing Daily Activities**
   - Navigate to the Calendar view
   - Click on any date to see learning activities for that day
   - Video thumbnails appear on dates with activity

2. **Resuming Video Playback**
   - Click on any video thumbnail in the calendar
   - The video will load at your last watched position
   - Continue learning from where you left off

3. **Tracking Progress**
   - View daily statistics including watch time and completion rates
   - See progress bars for each video
   - Monitor learning streaks and goals

### Creating Learning Schedules

1. **Add Learning Reminders**
   - Click "New Reminder" in the calendar view
   - Set title, date, time, and duration
   - Enable notifications for timely alerts

2. **Setting Daily Goals**
   - Configure daily learning targets
   - Get notified when you reach your goals
   - Build consistent learning habits

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Authentication**: Firebase Auth with Google Sign-In
- **Database**: Firebase Firestore (optional for cloud sync)
- **Styling**: Tailwind CSS
- **State Management**: Zustand with persistence + React Context for auth
- **Routing**: React Router v6 with protected routes
- **Date Handling**: date-fns
- **Notifications**: Web Notifications API + React Hot Toast
- **Icons**: Lucide React
- **Build Tool**: Vite
- **API Integration**: YouTube Data API v3

## 📱 Responsive Design

The application is fully responsive and works seamlessly across:
- Desktop browsers
- Tablets
- Mobile devices
- Dark and light themes

## 🔧 Configuration

### Notification Settings

```typescript
interface NotificationSettings {
  enabled: boolean;              // Master enable/disable
  remindersBefore: number;       // Minutes before scheduled time
  dailyGoalReminders: boolean;   // Daily goal notifications
  completionNotifications: boolean; // Video completion alerts
}
```

### Calendar Integration

The calendar automatically tracks:
- Videos watched each day
- Watch time and completion status
- Progress toward daily goals
- Learning streaks and patterns

## 🎨 Customization

### Themes
- Light and dark theme support
- Automatic theme persistence
- System theme detection

### Notifications
- Customizable notification types
- Adjustable timing and frequency
- Browser notification integration
- In-app toast notifications

## 📊 Data Storage

Data storage is flexible and secure:
- **Local Storage**: For offline functionality and quick access
- **Firebase Firestore**: For cloud sync and cross-device access (optional)
- **Authentication Data**: Securely managed by Firebase Auth
- **Session Storage**: For temporary UI state

Your learning data is associated with your Google account, ensuring privacy and portability.

## 🔒 Privacy & Security

- **Firebase Authentication**: Industry-standard security with Google OAuth
- **Data Encryption**: All data encrypted in transit and at rest
- **YouTube API**: Only used for searching and fetching video metadata
- **No Tracking**: No analytics or user tracking implemented  
- **HTTPS Required**: Secure connections for all features
- **Privacy Control**: You own and control all your learning data

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Include browser version and steps to reproduce

## 🔮 Roadmap

- [x] Google Authentication with Firebase
- [ ] Cross-device data synchronization
- [ ] Google Calendar integration
- [ ] Export learning data
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] Collaborative learning features
- [ ] Integration with more video platforms
- [ ] Offline mode capabilities

## 🙏 Acknowledgments

- YouTube API for video data
- React community for excellent tools
- All contributors and users

---

**Happy Learning! 🎓**

Transform your YouTube watching into structured learning with Skillra's powerful calendar integration and smart notifications.