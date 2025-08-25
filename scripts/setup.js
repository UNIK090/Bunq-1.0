#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bold: '\x1b[1m'
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

function showWelcome() {
  console.log('\n' + colorize('🎓 Welcome to Skillra Setup!', 'cyan'));
  console.log(colorize('YouTube Learning Tracker with Calendar Integration\n', 'white'));
  console.log(colorize('This script will help you configure your environment variables for:', 'yellow'));
  console.log('  • YouTube API integration');
  console.log('  • Firebase Authentication');
  console.log('  • Google Sign-In functionality\n');
}

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(colorize(prompt, 'cyan'), (answer) => {
      resolve(answer.trim());
    });
  });
}

async function getYouTubeApiKey() {
  console.log(colorize('\n📺 YouTube API Configuration', 'magenta'));
  console.log('You need a YouTube Data API v3 key from Google Cloud Console.');
  console.log('Guide: https://developers.google.com/youtube/v3/getting-started\n');

  const apiKey = await question('Enter your YouTube API key: ');
  return apiKey;
}

async function getFirebaseConfig() {
  console.log(colorize('\n🔥 Firebase Configuration', 'magenta'));
  console.log('You need to create a Firebase project and enable Authentication.');
  console.log('Guide: See FIREBASE_SETUP.md in the project root\n');

  const config = {};

  config.apiKey = await question('Enter your Firebase API key: ');
  config.authDomain = await question('Enter your Firebase Auth Domain (project-id.firebaseapp.com): ');
  config.projectId = await question('Enter your Firebase Project ID: ');
  config.storageBucket = await question('Enter your Firebase Storage Bucket (project-id.appspot.com): ');
  config.messagingSenderId = await question('Enter your Firebase Messaging Sender ID: ');
  config.appId = await question('Enter your Firebase App ID: ');

  return config;
}

function createEnvFile(youtubeApiKey, firebaseConfig) {
  const envContent = `# YouTube API Configuration
VITE_YOUTUBE_API_KEY=${youtubeApiKey}

# Firebase Configuration
VITE_FIREBASE_API_KEY=${firebaseConfig.apiKey}
VITE_FIREBASE_AUTH_DOMAIN=${firebaseConfig.authDomain}
VITE_FIREBASE_PROJECT_ID=${firebaseConfig.projectId}
VITE_FIREBASE_STORAGE_BUCKET=${firebaseConfig.storageBucket}
VITE_FIREBASE_MESSAGING_SENDER_ID=${firebaseConfig.messagingSenderId}
VITE_FIREBASE_APP_ID=${firebaseConfig.appId}
`;

  const envPath = path.join(process.cwd(), '.env');

  try {
    fs.writeFileSync(envPath, envContent);
    console.log(colorize('\n✅ Environment file created successfully!', 'green'));
    console.log(`File location: ${envPath}`);
  } catch (error) {
    console.error(colorize('\n❌ Error creating .env file:', 'red'), error.message);
    return false;
  }

  return true;
}

function showNextSteps() {
  console.log(colorize('\n🚀 Setup Complete! Next steps:', 'green'));
  console.log('\n1. Start the development server:');
  console.log(colorize('   npm run dev', 'cyan'));

  console.log('\n2. Open your browser:');
  console.log(colorize('   http://localhost:5173', 'cyan'));

  console.log('\n3. Test authentication:');
  console.log('   • Click "Continue with Google" on the sign-in page');
  console.log('   • Grant necessary permissions');
  console.log('   • Start learning!');

  console.log(colorize('\n📚 Additional Resources:', 'yellow'));
  console.log('   • README.md - Complete setup guide');
  console.log('   • FIREBASE_SETUP.md - Firebase configuration guide');
  console.log('   • setup.md - Quick setup reference');

  console.log(colorize('\n🎯 Features to explore:', 'blue'));
  console.log('   • Add videos from YouTube');
  console.log('   • Create custom playlists');
  console.log('   • Track your learning progress');
  console.log('   • View calendar activities');
  console.log('   • Configure notifications');

  console.log(colorize('\nHappy learning! 🎓\n', 'green'));
}

async function checkExistingEnv() {
  const envPath = path.join(process.cwd(), '.env');

  if (fs.existsSync(envPath)) {
    console.log(colorize('⚠️  Found existing .env file', 'yellow'));
    const overwrite = await question('Do you want to overwrite it? (y/N): ');
    return overwrite.toLowerCase() === 'y' || overwrite.toLowerCase() === 'yes';
  }

  return true;
}

async function main() {
  try {
    showWelcome();

    const shouldProceed = await checkExistingEnv();
    if (!shouldProceed) {
      console.log(colorize('Setup cancelled. Your existing .env file is preserved.', 'yellow'));
      process.exit(0);
    }

    const youtubeApiKey = await getYouTubeApiKey();
    if (!youtubeApiKey) {
      console.log(colorize('❌ YouTube API key is required!', 'red'));
      process.exit(1);
    }

    const firebaseConfig = await getFirebaseConfig();
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
      console.log(colorize('❌ Firebase configuration is required!', 'red'));
      process.exit(1);
    }

    const success = createEnvFile(youtubeApiKey, firebaseConfig);
    if (!success) {
      process.exit(1);
    }

    showNextSteps();

  } catch (error) {
    console.error(colorize('\n❌ Setup failed:', 'red'), error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Handle process termination gracefully
process.on('SIGINT', () => {
  console.log(colorize('\n\n👋 Setup cancelled by user', 'yellow'));
  rl.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log(colorize('\n\n👋 Setup terminated', 'yellow'));
  rl.close();
  process.exit(0);
});

// Run the setup
main();
