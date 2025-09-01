import React from 'react';
import { Achievement } from '../../types';
import { Trophy, Star, Award, Target } from 'lucide-react';

interface AchievementShowcaseProps {
  achievements: Achievement[];
}

const AchievementShowcase: React.FC<AchievementShowcaseProps> = ({ achievements }) => {
  const getIcon = (category: string) => {
    switch (category) {
      case 'learning': return <Trophy className="h-6 w-6" />;
      case 'social': return <Star className="h-6 w-6" />;
      case 'engagement': return <Award className="h-6 w-6" />;
      case 'milestone': return <Target className="h-6 w-6" />;
      default: return <Award className="h-6 w-6" />;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'rare': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'epic': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'legendary': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Achievements</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center hover:shadow-md transition-shadow"
          >
            <div className="flex justify-center mb-2">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-full">
                {getIcon(achievement.category)}
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
              {achievement.title}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              {achievement.description}
            </p>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(achievement.rarity)}`}>
              {achievement.rarity}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementShowcase;
