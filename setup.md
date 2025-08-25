# Skillra Setup Guide

Welcome to Skillra! This guide will help you set up the YouTube Learning Tracker with Calendar Integration and Notifications.

## Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Add your YouTube API key to the `.env` file:
```
VITE_YOUTUBE_API_KEY=your_youtube_api_key_here
```

### 3. Get YouTube API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the YouTube Data API v3:
   - Go to "APIs & Services" > "Library"
   - Search for "YouTube Data API v3"
   - Click on it and press "Enable"
4. Create credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the generated API key
5. (Optional) Restrict the API key:
   - Click on the API key to edit it
   - Under "Application restrictions", select "HTTP referrers"
   - Add your domain (e.g., `localhost:5173` for development)

### 4. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## First Time Setup

### 1. Enable Notifications
- Click on the bell icon in the navigation bar
- Grant notification permissions when prompted
- Configure notification settings in Calendar > Settings

### 2. Add Your First Video
- Use the search function to find YouTube videos
- Add videos to your custom playlists
- Start watching to begin tracking your progress

### 3. Explore the Calendar
- Navigate to the Calendar view
- Watch videos to see daily activity tracking
- Click on any date to see your learning history

## Features Overview

### 🎥 Video Management
- Search YouTube videos
- Create custom playlists
- Track viewing progress
- Resume from last position

### 📅 Calendar Integration
- Visual daily activity view
- Video thumbnails on calendar
- Click-to-play functionality
- Daily learning statistics

### 🔔 Smart Notifications
- Browser notifications
- Video completion alerts
- Learning reminders
- Streak notifications

### 📊 Progress Tracking
- Watch time monitoring
- Completion rates
- Learning streaks
- Daily insights

## Troubleshooting

### Common Issues

**YouTube API Quota Exceeded**
- Each API key has daily quotas
- If exceeded, wait 24 hours or create a new key
- Consider implementing caching for production use

**Notifications Not Working**
- Ensure HTTPS is used (required for notifications)
- Check browser notification permissions
- Try the test notification feature

**Videos Not Loading**
- Verify your YouTube API key is correct
- Check browser console for errors
- Ensure the video is publicly available

**Calendar Not Showing Activities**
- Activities are tracked when you watch videos
- Make sure you're using the built-in video player
- Check that videos are completing properly

### Performance Tips

1. **Clear Old Data**: Periodically clear old learning data if performance degrades
2. **Browser Cache**: Clear browser cache if experiencing issues
3. **API Limits**: Be mindful of YouTube API quotas in production

## Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Project Structure
```
src/
├── components/
│   ├── Calendar/          # Calendar and daily activity components
│   ├── Dashboard/         # Main dashboard and stats
│   ├── Layout/           # Navigation and layout components
│   ├── Notifications/    # Notification system components
│   ├── Playlists/        # Playlist management
│   └── Video/           # Video player and search
├── services/             # API and external services
├── store/               # State management (Zustand)
└── types/               # TypeScript type definitions
```

### Adding New Features

1. **New Notification Types**: Add to `NotificationService` and update types
2. **Calendar Enhancements**: Extend `CalendarView` and `DailyStats` components
3. **Video Features**: Modify `VideoPlayer` and update progress tracking
4. **Data Storage**: Update Zustand store and persistence layer

## Production Deployment

### Environment Variables
- Set `VITE_YOUTUBE_API_KEY` in production environment
- Configure HTTPS for notification functionality
- Set up proper domain restrictions for API key

### Build Commands
```bash
npm run build    # Creates production build in dist/
npm run preview  # Test production build locally
```

### Deployment Platforms
- **Vercel**: Zero-config deployment with automatic HTTPS
- **Netlify**: Simple drag-and-drop deployment
- **GitHub Pages**: Free hosting for static sites
- **Custom Server**: Deploy dist/ folder to any web server

## Security Considerations

- API keys are exposed in client-side code (normal for public APIs)
- Restrict API keys to specific domains in production
- All user data stays in browser localStorage
- No server-side data collection or tracking

## Support

If you encounter issues:

1. Check this setup guide
2. Review the main README.md
3. Check browser developer console for errors
4. Create an issue in the repository

Happy learning with Skillra! 🎓