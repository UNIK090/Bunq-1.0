# Firebase Setup Guide for Skillra

This guide will help you set up Firebase Authentication for the Skillra YouTube Learning Tracker application.

## Prerequisites

- A Google account
- Node.js and npm installed
- Basic understanding of Firebase console

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "skillra-learning-tracker")
4. Choose whether to enable Google Analytics (optional but recommended)
5. Select or create a Google Analytics account if you enabled it
6. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project console, click on "Authentication" in the left sidebar
2. Click on the "Get started" button
3. Go to the "Sign-in method" tab
4. Enable "Google" as a sign-in provider:
   - Click on "Google"
   - Toggle the "Enable" switch
   - Select a project support email
   - Click "Save"

## Step 3: Configure Web App

1. In the project overview, click on the web icon (</>) to add a web app
2. Register your app:
   - App nickname: "Skillra Web App"
   - Check "Also set up Firebase Hosting" if you plan to deploy with Firebase
   - Click "Register app"

3. Copy the Firebase configuration object that looks like this:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789"
};
```

## Step 4: Set Up Environment Variables

1. Create a `.env` file in your project root (if it doesn't exist)
2. Add your Firebase configuration:

```env
# YouTube API Configuration
VITE_YOUTUBE_API_KEY=your_youtube_api_key_here

# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456789
```

## Step 5: Configure Authorized Domains

1. In Firebase Console, go to Authentication > Settings
2. Scroll down to "Authorized domains"
3. Add your domains:
   - For development: `localhost`
   - For production: `yourdomain.com`

## Step 6: Test Authentication

1. Start your development server:
```bash
npm run dev
```

2. Open your browser and navigate to `http://localhost:5173`
3. You should see the sign-in page
4. Click "Continue with Google" to test authentication

## Security Rules (Optional)

If you plan to use Firestore database for user data, set up security rules:

1. Go to Firestore Database in Firebase Console
2. Click "Create database" if you haven't already
3. Set up security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Troubleshooting

### Common Issues

**1. Authentication popup blocked**
- Make sure popups are allowed in your browser
- Try disabling popup blockers for localhost

**2. Configuration errors**
- Double-check all environment variables
- Ensure there are no extra spaces or quotes
- Restart the development server after changing .env

**3. Unauthorized domain error**
- Add your domain to authorized domains in Firebase Console
- For development, add `localhost` as an authorized domain

**4. API key restrictions**
- In Google Cloud Console, make sure your Firebase API key isn't restricted
- Or add your domain to the allowed referrers

### Development vs Production

**Development Setup:**
- Use `localhost` as authorized domain
- API keys can be unrestricted for development
- Enable Firebase emulator suite for testing (optional)

**Production Setup:**
- Add your production domain to authorized domains
- Restrict API keys to your production domain
- Set up proper security rules
- Enable Firebase hosting or use your preferred hosting provider

## Additional Configuration

### Enable Additional Providers (Optional)

You can enable other sign-in methods:

1. **Email/Password:**
   - Go to Authentication > Sign-in method
   - Enable "Email/Password"
   - Configure email templates if needed

2. **Anonymous Authentication:**
   - Enable for guest users
   - Useful for temporary access

3. **Other Providers:**
   - Facebook, Twitter, GitHub, etc.
   - Each requires additional setup

### Firebase Features to Explore

- **Firestore Database:** Store user preferences and learning data
- **Cloud Functions:** Server-side logic for advanced features
- **Firebase Analytics:** Track user engagement
- **Performance Monitoring:** Monitor app performance
- **Crashlytics:** Track and fix crashes

## Next Steps

1. ✅ Firebase project created
2. ✅ Authentication enabled
3. ✅ Web app configured
4. ✅ Environment variables set
5. ✅ Testing completed

Your Firebase authentication is now ready! Users can sign in with their Google accounts and access the Skillra learning tracker.

## Support

For additional help:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Firebase Console](https://console.firebase.google.com/)

Happy learning! 🎓