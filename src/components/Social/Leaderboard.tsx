import React from 'react';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  displayName: string;
  photoURL?: string;
  score: number;
  rank: number;
  category: 'watchTime' | 'videosWatched' | 'streaks' | 'achievements';
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  category: 'watchTime' | 'videosWatched' | 'streaks' | 'achievements';
  title: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ entries, category, title }) => {
  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'watchTime': return <TrendingUp className="h-5 w-5" />;
      case 'videosWatched': return <Award className="h-5 w-5" />;
      case 'streaks': return <Trophy className="h-5 w-5" />;
      case 'achievements': return <Medal className="h-5 w-5" />;
      default: return <Award className="h-5 w-5" />;
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'watchTime': return 'Watch Time (hours)';
      case 'videosWatched': return 'Videos Watched';
      case 'streaks': return 'Current Streak (days)';
      case 'achievements': return 'Achievements Unlocked';
      default: return 'Score';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2: return <Medal className="h-6 w-6 text-gray-400" />;
      case 3: return <Award className="h-6 w-6 text-amber-600" />;
      default: return <span className="text-lg font-bold text-gray-500">#{rank}</span>;
    }
  };

  const formatScore = (score: number, cat: string) => {
    if (cat === 'watchTime') {
      return `${Math.round(score / 3600)}h`;
    }
    return score.toLocaleString();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center space-x-2 mb-6">
        {getCategoryIcon(category)}
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
      </div>

      <div className="space-y-4">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className={`flex items-center space-x-4 p-4 rounded-lg transition-colors ${
              entry.rank <= 3
                ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800'
                : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
          >
            <div className="flex items-center justify-center w-10">
              {getRankIcon(entry.rank)}
            </div>

            <img
              src={entry.photoURL || '/default-avatar.png'}
              alt={entry.displayName}
              className="w-10 h-10 rounded-full object-cover"
            />

            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {entry.displayName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {getCategoryLabel(category)}: {formatScore(entry.score, category)}
              </p>
            </div>

            {entry.rank <= 3 && (
              <div className="text-right">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {entries.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No entries yet. Be the first to climb the leaderboard!</p>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
