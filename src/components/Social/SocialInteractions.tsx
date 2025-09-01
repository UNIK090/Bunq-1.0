import React, { useState } from 'react';
import { Heart, Share2, UserPlus, UserMinus } from 'lucide-react';
import { SocialInteraction } from '../../types';

interface SocialInteractionsProps {
  targetId: string;
  targetType: 'playlist' | 'video' | 'comment';
  likesCount: number;
  sharesCount: number;
  isLiked?: boolean;
  isShared?: boolean;
  isFollowing?: boolean;
  onLike?: (targetId: string) => void;
  onShare?: (targetId: string) => void;
  onFollow?: (targetId: string) => void;
}

const SocialInteractions: React.FC<SocialInteractionsProps> = ({
  targetId,
  targetType,
  likesCount,
  sharesCount,
  isLiked = false,
  isShared = false,
  isFollowing = false,
  onLike,
  onShare,
  onFollow
}) => {
  const [localLiked, setLocalLiked] = useState(isLiked);
  const [localShared, setLocalShared] = useState(isShared);
  const [localFollowing, setLocalFollowing] = useState(isFollowing);
  const [localLikesCount, setLocalLikesCount] = useState(likesCount);
  const [localSharesCount, setLocalSharesCount] = useState(sharesCount);

  const handleLike = () => {
    setLocalLiked(!localLiked);
    setLocalLikesCount(prev => localLiked ? prev - 1 : prev + 1);
    onLike?.(targetId);
  };

  const handleShare = () => {
    setLocalShared(!localShared);
    setLocalSharesCount(prev => localShared ? prev - 1 : prev + 1);
    onShare?.(targetId);
  };

  const handleFollow = () => {
    setLocalFollowing(!localFollowing);
    onFollow?.(targetId);
  };

  return (
    <div className="flex items-center space-x-4 py-2">
      {/* Like Button */}
      <button
        onClick={handleLike}
        className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${
          localLiked
            ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
        }`}
      >
        <Heart className={`h-4 w-4 ${localLiked ? 'fill-current' : ''}`} />
        <span className="text-sm font-medium">{localLikesCount}</span>
      </button>

      {/* Share Button */}
      <button
        onClick={handleShare}
        className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${
          localShared
            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
        }`}
      >
        <Share2 className="h-4 w-4" />
        <span className="text-sm font-medium">{localSharesCount}</span>
      </button>

      {/* Follow Button (only for user profiles) */}
      {targetType === 'playlist' && onFollow && (
        <button
          onClick={handleFollow}
          className={`flex items-center space-x-1 px-4 py-1 rounded-full font-medium transition-colors ${
            localFollowing
              ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
              : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-400 dark:hover:bg-indigo-800'
          }`}
        >
          {localFollowing ? (
            <>
              <UserMinus className="h-4 w-4" />
              <span className="text-sm">Following</span>
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              <span className="text-sm">Follow</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default SocialInteractions;
