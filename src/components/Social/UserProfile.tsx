import React from 'react';
import { UserProfile } from '../../types';

interface UserProfileProps {
  profile: UserProfile;
}

const UserProfileComponent: React.FC<UserProfileProps> = ({ profile }) => {
  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
      <div className="flex items-center space-x-4">
        <img
          className="h-24 w-24 rounded-full object-cover"
          src={profile.photoURL || '/default-avatar.png'}
          alt={profile.displayName}
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{profile.displayName}</h1>
          {profile.bio && <p className="mt-2 text-gray-600 dark:text-gray-300">{profile.bio}</p>}
          <div className="mt-4 flex space-x-6 text-gray-700 dark:text-gray-400">
            <div>
              <span className="font-semibold">{profile.socialStats.followersCount}</span> Followers
            </div>
            <div>
              <span className="font-semibold">{profile.socialStats.followingCount}</span> Following
            </div>
            <div>
              <span className="font-semibold">{profile.socialStats.videosWatched}</span> Videos Watched
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileComponent;
