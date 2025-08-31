import React, { useState } from 'react';
import GroupCreation from './GroupCreation';
import JoinGroup from './JoinGroup';
import GroupList from './GroupList';
import { Plus, UserPlus } from 'lucide-react';

const GroupsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        Study Groups
      </h1>
      
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          onClick={() => setActiveTab('create')}
          className={`flex items-center px-4 py-2 border-b-2 font-medium text-sm ${
            activeTab === 'create'
              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Group
        </button>
        <button
          onClick={() => setActiveTab('join')}
          className={`flex items-center px-4 py-2 border-b-2 font-medium text-sm ${
            activeTab === 'join'
              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Join Group
        </button>
      </div>

      {/* Tab Content */}
      <div className="mb-8">
        {activeTab === 'create' && <GroupCreation />}
        {activeTab === 'join' && <JoinGroup />}
      </div>

      <GroupList />
    </div>
  );
};

export default GroupsPage;
