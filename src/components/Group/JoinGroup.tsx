import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';

const JoinGroup: React.FC = () => {
  const [code, setCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { joinGroup } = useAppStore();

  const handleJoinGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!code.trim()) {
      setError('Please enter a group code');
      return;
    }

    // Validate code format (6 characters)
    if (code.length !== 6) {
      setError('Group code must be exactly 6 characters');
      return;
    }

    setIsJoining(true);
    try {
      await joinGroup(code);
      setSuccess('Successfully joined the group!');
      setCode('');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to join group. Please check the code and try again.');
    } finally {
      setIsJoining(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setCode(value.slice(0, 6)); // Limit to 6 characters
    setError('');
    setSuccess('');
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Join a Study Group</h2>
      <form onSubmit={handleJoinGroup} className="space-y-4">
        <div>
          <label htmlFor="groupCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Group Code (6 characters) *
          </label>
          <input
            type="text"
            id="groupCode"
            value={code}
            onChange={handleCodeChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white uppercase"
            placeholder="Enter 6-character code"
            pattern="[A-Z0-9]{6}"
            maxLength={6}
            required
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Enter the 6-character code provided by the group owner
          </p>
        </div>
        
        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-md">
            <p className="text-red-700 dark:text-red-200 text-sm">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="p-3 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded-md">
            <p className="text-green-700 dark:text-green-200 text-sm">{success}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isJoining}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isJoining ? 'Joining...' : 'Join Group'}
        </button>
      </form>
    </div>
  );
};

export default JoinGroup;

joinGroup: async (code) => {
  const state = get();

  // Validate code format (6 characters)
  if (!code || code.length !== 6) {
    console.error('Invalid group code format. Must be 6 characters.');
    return;
  }

  // Check if group already exists in local state
  const existingGroup = state.groups.find(g => g.code === code);
  if (existingGroup) {
    set({ currentGroup: existingGroup });
    return;
  }

  try {
    // Fetch group from database by code
    const group = await realtimeService.getGroupByCode(code);
    if (!group) {
      throw new Error('Group not found');
    }

    // The group object contains the name set by the creator
    set((state) => ({
      groups: [...state.groups, group],
      currentGroup: group,
    }));

    // Optionally: Add current user as a member in the database
    await realtimeService.addGroupMember(group.id, state.currentUser);

    // Optionally: Send join notification
    // await realtimeService.sendMessageToGroup(group.id, joinMessage);

  } catch (error) {
    console.error('Error joining group:', error);
    // Optionally: set error state for UI
  }
}
