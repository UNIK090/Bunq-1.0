import React, { useState, useEffect } from 'react';
import { Book, Clock, Trophy, Play, CheckCircle, Lock } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { realtimeService } from '../../services/realtimeService';

interface LearningModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  completed: boolean;
  locked: boolean;
  lessons: number;
  completedLessons: number;
}

const LearningPathWithRealtime: React.FC = () => {
  const { realTimeLearningPath, setRealTimeLearningPath } = useAppStore();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Static fallback data
  const staticModules: LearningModule[] = [
    {
      id: '1',
      title: 'JavaScript Fundamentals',
      description: 'Master the basics of JavaScript programming',
      duration: '2 weeks',
      difficulty: 'Beginner',
      completed: true,
      locked: false,
      lessons: 12,
      completedLessons: 12
    },
    {
      id: '2',
      title: 'React Basics',
      description: 'Learn the fundamentals of React framework',
      duration: '3 weeks',
      difficulty: 'Beginner',
      completed: true,
      locked: false,
      lessons: 15,
      completedLessons: 15
    },
    {
      id: '3',
      title: 'Advanced React Patterns',
      description: 'Deep dive into advanced React concepts and patterns',
      duration: '4 weeks',
      difficulty: 'Intermediate',
      completed: false,
      locked: false,
      lessons: 20,
      completedLessons: 8
    },
    {
      id: '4',
      title: 'TypeScript Mastery',
      description: 'Comprehensive TypeScript course for React developers',
      duration: '3 weeks',
      difficulty: 'Intermediate',
      completed: false,
      locked: false,
      lessons: 18,
      completedLessons: 0
    },
    {
      id: '5',
      title: 'Node.js Backend',
      description: 'Build scalable backend applications with Node.js',
      duration: '4 weeks',
      difficulty: 'Advanced',
      completed: false,
      locked: true,
      lessons: 25,
      completedLessons: 0
    }
  ];

  useEffect(() => {
    // For demo purposes, we'll use a mock user ID
    const userId = 'demo-user';
    
    const unsubscribe = realtimeService.subscribeToLearningPath(
      userId,
      (data) => {
        setRealTimeLearningPath(data);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [setRealTimeLearningPath]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'Advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getProgressPercentage = (module: LearningModule) => {
    if (realTimeLearningPath?.modules && realTimeLearningPath.modules.length > 0) {
      const realModule = realTimeLearningPath.modules.find(m => m.id === module.id);
      return realModule ? realModule.progress : 0;
    }
    return Math.round((module.completedLessons / module.lessons) * 100);
  };

  const getModuleStatus = (module: LearningModule) => {
    if (realTimeLearningPath?.modules && realTimeLearningPath.modules.length > 0) {
      const realModule = realTimeLearningPath.modules.find(m => m.id === module.id);
      return realModule ? realModule.status : (module.locked ? 'locked' : 'available');
    }
    return module.locked ? 'locked' : (module.completed ? 'completed' : 'available');
  };

  const modules = realTimeLearningPath?.modules && realTimeLearningPath.modules.length > 0 
    ? realTimeLearningPath.modules.map(realModule => {
        const staticModule = staticModules.find(m => m.id === realModule.id);
        return {
          ...staticModule!,
          ...realModule,
          completedLessons: Math.round((realModule.progress / 100) * (staticModule?.lessons || 0)),
        };
      })
    : staticModules;

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Learning Path
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your progress through structured learning modules
        </p>
        {realTimeLearningPath && (
          <div className="mt-2">
            <span className="text-sm text-indigo-600 dark:text-indigo-400">
              Overall Progress: {Math.round(realTimeLearningPath.overallProgress)}%
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        {modules.map((module) => {
          const status = getModuleStatus(module);
          const progress = getProgressPercentage(module);
          
          return (
            <div
              key={module.id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border ${
                status === 'locked' ? 'opacity-60' : ''
              } ${status === 'completed' ? 'border-green-200 dark:border-green-800' : 'border-gray-200 dark:border-gray-700'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {module.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    {module.description}
                  </p>
                </div>
                {status === 'locked' && <Lock className="h-5 w-5 text-gray-400" />}
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Clock className="h-4 w-4 mr-1" />
                    {module.duration}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(module.difficulty)}`}>
                    {module.difficulty}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="text-gray-900 dark:text-gray-100 font-medium">
                      {Math.round((progress / 100) * module.lessons)}/{module.lessons} lessons
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {status === 'completed' && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {status === 'completed' ? 'Completed' : `${progress}% Complete`}
                    </span>
                  </div>
                  <button
                    disabled={status === 'locked'}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      status === 'locked'
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : status === 'completed'
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    } transition-colors`}
                  >
                    {status === 'locked' ? 'Locked' : status === 'completed' ? 'Review' : 'Continue'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LearningPathWithRealtime;
