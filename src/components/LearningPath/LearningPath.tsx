import React, { useState } from 'react';
import { Book, Clock, Trophy, Play, CheckCircle, Lock } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

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

const LearningPath: React.FC = () => {
  const { getActivitiesForDate } = useAppStore();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const learningModules: LearningModule[] = [
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'Advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getProgressPercentage = (module: LearningModule) => {
    return Math.round((module.completedLessons / module.lessons) * 100);
  };

  return (
    <div className="h-screen flex flex-col p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Learning Path
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your progress through structured learning modules
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        {learningModules.map((module) => (
          <div
            key={module.id}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border ${
              module.locked ? 'opacity-60' : ''
            } ${module.completed ? 'border-green-200 dark:border-green-800' : 'border-gray-200 dark:border-gray-700'}`}
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
              {module.locked && <Lock className="h-5 w-5 text-gray-400" />}
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
                    {module.completedLessons}/{module.lessons} lessons
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage(module)}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {module.completed && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {module.completed ? 'Completed' : `${getProgressPercentage(module)}% Complete`}
                  </span>
                </div>
                <button
                  disabled={module.locked}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    module.locked
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : module.completed
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  } transition-colors`}
                >
                  {module.locked ? 'Locked' : module.completed ? 'Review' : 'Continue'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningPath;
