import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Users, Clock, Video, User, Calendar, ArrowRight, Trash2 } from 'lucide-react';

const GroupList: React.FC = () => {
  const { groups, currentGroup, setCurrentGroup, deleteGroup } = useAppStore();

  if (groups.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No Groups Yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Create or join a study group to start learning together!
        </p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getRecentActivity = (group: any) => {
    if (group.videoSessions.length === 0) return 'No recent activity';
    
    const latestSession = group.videoSessions
      .sort((a: any, b: any) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())[0];
    
    return `Last watched: ${latestSession.videoTitle}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Study Groups</h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {groups.length} group{groups.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="grid gap-4">
        {groups.map((group) => (
          <div
            key={group.id}
            className={`p-6 bg-white dark:bg-gray-800 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
              currentGroup?.id === group.id
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
            }`}
            onClick={() => setCurrentGroup(group)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {group.name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Users className="h-4 w-4 mr-1" />
                      {group.members.length} members
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Are you sure you want to delete "${group.name}"?`)) {
                          deleteGroup(group.id);
                        }
                      }} 
                      className="text-red-500 hover:text-red-700 transition-colors p-1"
                      title="Delete Group"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {group.description && (
                  <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm">
                    {group.description}
                  </p>
                )}

                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Created {formatDate(group.createdAt)}
                  </div>
                  <div className="flex items-center">
                    <Video className="h-4 w-4 mr-1" />
                    {group.videoSessions.length} sessions
                  </div>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {getRecentActivity(group)}
                </p>

                <div className="flex items-center mt-4">
                  <div className="flex -space-x-2">
                    {group.members.slice(0, 4).map((member: any, index: number) => (
                      <div
                        key={member.userId}
                        className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white dark:border-gray-800"
                        style={{ zIndex: 10 - index }}
                        title={member.displayName}
                      >
                        {member.photoURL ? (
                          <img
                            src={member.photoURL}
                            alt={member.displayName}
                            className="w-full h-full rounded-full"
                          />
                        ) : (
                          <User className="h-3 w-3" />
                        )}
                      </div>
                    ))}
                    {group.members.length > 4 && (
                      <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 text-xs font-medium border-2 border-white dark:border-gray-800">
                        +{group.members.length - 4}
                      </div>
                    )}
                  </div>
                </div>
              </div>

<div className="ml-4 flex items-center" onClick={() => {
  setCurrentGroup(group);
  // Navigate to the group details page
  window.location.href = `/groups/watch/${group.id}`;
}}>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
              </div>
            </div>

            {group.videoSessions.some((session: any) => session.isActive) && (
              <div className="mt-3 p-2 bg-green-100 dark:bg-green-900/30 rounded-md">
                <div className="flex items-center text-sm text-green-800 dark:text-green-300">
                  <Clock className="h-3 w-3 mr-1" />
                  Active session in progress
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {currentGroup && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
            Currently viewing: {currentGroup.name}
          </h4>
          <p className="text-sm text-blue-700 dark:text-blue-400">
            You can now access group features and statistics
          </p>
        </div>
      )}
    </div>
  );
};

export default GroupList;
