import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Plus, Users, Lock, Globe } from 'lucide-react';

const GroupCreation: React.FC = () => {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [createdGroupId, setCreatedGroupId] = useState<string | null>(null);
  
  const { createGroup, groups } = useAppStore();

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    setIsCreating(true);
    try {
      const groupCode = Math.random().toString(36).substring(2, 8).toUpperCase(); // Generate a unique 6-character code
      const newGroupId = await createGroup(groupName, description, isPublic, groupCode); // Pass the unique code
      setCreatedGroupId(newGroupId);
      setGroupName('');
      setDescription('');
    } catch (error) {
      console.error('Error creating group:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const createdGroup = createdGroupId ? groups.find(g => g.id === createdGroupId) : null;

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="flex items-center justify-center mb-6">
        <Users className="h-8 w-8 text-indigo-600 mr-2" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Study Group</h2>
      </div>

      {createdGroup ? (
        <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="text-green-600 dark:text-green-400 mb-4">
            <Users className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-2">
            Group Created Successfully!
          </h3>
          <p className="text-green-700 dark:text-green-400 mb-4">
            Share this code with your friends to join:
          </p>
          <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border-2 border-dashed border-green-300">
            <code className="text-2xl font-mono font-bold text-green-800 dark:text-green-300">
              {createdGroup.code}
            </code>
          </div>
          <button
            onClick={() => setCreatedGroupId(null)}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Create Another Group
          </button>
        </div>
      ) : (
        <form onSubmit={handleCreateGroup} className="space-y-4">
          <div>
            <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Group Name *
            </label>
            <input
              type="text"
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter group name"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="What will this group study?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Group Visibility
            </label>
            <div className="space-y-2">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  checked={isPublic}
                  onChange={() => setIsPublic(true)}
                  className="sr-only"
                />
                <div className={`flex items-center p-3 border-2 rounded-lg w-full transition-colors ${
                  isPublic 
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}>
                  <Globe className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Public</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Anyone can join with the code
                    </div>
                  </div>
                </div>
              </label>

              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  checked={!isPublic}
                  onChange={() => setIsPublic(false)}
                  className="sr-only"
                />
                <div className={`flex items-center p-3 border-2 rounded-lg w-full transition-colors ${
                  !isPublic 
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}>
                  <Lock className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Private</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Only invited members can join
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isCreating || !groupName.trim()}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isCreating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Create Group
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default GroupCreation;
