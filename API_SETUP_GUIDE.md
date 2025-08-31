# API Setup Guide for YouTube Learning Tracker

This guide will help you set up the required API keys for the AI assistant functionality.

## Required API Keys

1. **OpenAI API Key** - For primary AI chat functionality
2. **Hugging Face API Key** - For fallback AI chat functionality
3. **YouTube Data API v3 Key** - For video search functionality
4. **Firebase Configuration** - For realtime database and authentication

## Step 1: Set up OpenAI API

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the API key

## Step 2: Set up Hugging Face API (Recommended Fallback)

1. Go to [Hugging Face](https://huggingface.co/)
2. Sign up or log in to your account
3. Go to your profile settings > Access Tokens
4. Create a new token with "read" permissions
5. Copy the API token

## Step 3: Set up YouTube Data API v3

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the YouTube Data API v3:
   - Go to "APIs & Services" > "Library"
   - Search for "YouTube Data API v3"
   - Click "Enable"
4. Create credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the API key
5. Restrict the API key (recommended):
   - Click on the API key you created
   - Under "Application restrictions", select "HTTP referrers"
   - Add your domain (e.g., `localhost:5173` for development)
   - Under "API restrictions", select "Restrict key"
   - Choose "YouTube Data API v3"

## Step 4: Set up Firebase (if not already done)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Realtime Database
4. Get your Firebase configuration from Project Settings

## Step 5: Configure Environment Variables

Create or update your `.env` file in the root directory with the following variables:

```env
# OpenAI API
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Hugging Face API (Fallback)
VITE_HUGGINGFACE_API_KEY=your_huggingface_api_key_here

# YouTube Data API
VITE_YOUTUBE_API_KEY=your_youtube_api_key_here

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com/
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Step 6: Restart the Development Server

After updating the `.env` file, restart your development server:

```bash
npm run dev
```

## How the AI Service Works

The chat service now uses a multi-tier approach:
1. **Primary**: OpenAI API (if configured and available)
2. **Fallback**: Hugging Face API (if OpenAI fails or quota exceeded)
3. **Final Fallback**: Local mock responses for common programming queries

## Troubleshooting

### Common Issues:

1. **API Key Not Working**: 
   - Ensure the API key is correctly copied without extra spaces
   - Check if the API key has proper permissions/restrictions

2. **CORS Errors**:
   - For YouTube API, ensure your domain is added to HTTP referrers
   - For development, use `localhost:5173` (Vite default port)

3. **404 Errors**:
   - Check if the API endpoints are correct
   - Verify that the APIs are enabled in the respective consoles

4. **Environment Variables Not Loading**:
   - Ensure variables are prefixed with `VITE_`
   - Restart the development server after changing `.env` file
   - Check that the `.env` file is in the root directory

### Testing API Connectivity:

You can test if your APIs are working by:

1. **OpenAI**: Try a simple curl request:
   ```bash
   curl https://api.openai.com/v1/models \
     -H "Authorization: Bearer YOUR_OPENAI_API_KEY"
   ```

2. **Hugging Face**: Try a simple request:
   ```bash
   curl https://api-inference.huggingface.co/models/microsoft/DialoGPT-large \
     -H "Authorization: Bearer YOUR_HUGGINGFACE_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"inputs": "Hello"}'
   ```

3. **YouTube**: Try a simple search:
   ```bash
   curl "https://www.googleapis.com/youtube/v3/search?part=snippet&q=test&key=YOUR_YOUTUBE_API_KEY"
   ```

## Support

If you continue to experience issues:
1. Check the browser console for detailed error messages
2. Verify all API keys are active and have proper quotas
3. Ensure all required APIs are enabled in their respective consoles
4. The system will automatically fall back to mock responses if APIs are unavailable
