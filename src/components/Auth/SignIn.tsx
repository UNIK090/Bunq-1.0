import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Chrome, BookOpen, TrendingUp, Calendar, Bell } from 'lucide-react';

const SignIn: React.FC = () => {
  const { signInWithGoogle, loading } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      // After successful sign-in, navigate to the dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error signing in:', error);
      // Handle sign-in error (e.g., show an error message)
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
      <div className="flex min-h-screen">
        {/* Left Side - Sign In Form */}
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            {/* Logo */}
            <div className="flex items-center space-x-3 mb-8">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Skillra
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  YouTube Learning Tracker
                </p>
              </div>
            </div>

            {/* Welcome Text */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Welcome back
              </h2>
              <p className="mt-3 text-gray-600 dark:text-gray-400">
                Sign in to your account to continue your learning journey and track your progress.
              </p>
            </div>

            {/* Features List */}
            <div className="mb-8 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Track your learning progress
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-lg">
                  <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Calendar integration with activities
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 dark:bg-purple-900/20 p-2 rounded-lg">
                  <Bell className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Smart notifications and reminders
                </span>
              </div>
            </div>

            {/* Sign In Button */}
            <div className="space-y-4">
              <button
                onClick={handleSignIn}
                disabled={loading}
                className="group relative flex w-full justify-center items-center space-x-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <>
                    <Chrome className="h-5 w-5 text-red-500" />
                    <span>Continue with Google</span>
                  </>
                )}
              </button>

              {/* Alternative Sign In Methods */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 px-2 text-gray-500 dark:text-gray-400">
                      Secure authentication powered by Firebase
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                By signing in, you agree to our{' '}
                <a href="#" className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Hero Image */}
        <div className="hidden lg:block relative flex-1">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700">
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          {/* Hero Content */}
          <div className="relative flex h-full flex-col justify-center items-center text-white p-12">
            <div className="max-w-md text-center">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full mb-6">
                  <BookOpen className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-4xl font-bold mb-4">
                  Master New Skills
                </h2>
                <p className="text-xl text-indigo-100 mb-8">
                  Transform your YouTube watching into structured learning with progress tracking and smart reminders.
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="grid grid-cols-1 gap-4 text-left">
                <div className="flex items-start space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Calendar Integration</h3>
                    <p className="text-sm text-indigo-100">See your daily learning activities at a glance</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Progress Tracking</h3>
                    <p className="text-sm text-indigo-100">Monitor your learning streaks and achievements</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Bell className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Smart Notifications</h3>
                    <p className="text-sm text-indigo-100">Stay motivated with personalized reminders</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-20 left-20 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-32 right-16 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
            <div className="absolute top-1/2 right-32 w-8 h-8 bg-white/20 rounded-full"></div>
          </div>

          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;