import React, { useState, useEffect } from 'react';
import { AdminUser } from '../../types';
import { AdminService } from '../../services/adminService';

const UserModeration: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const userList = await AdminService.getUsers();
      setUsers(userList);
    };
    fetchUsers();
  }, []);

  const handleBan = async (userId: string) => {
    await AdminService.banUser(userId);
    setUsers(users.map(user => user.uid === userId ? { ...user, banned: true } : user));
  };

  const handleUnban = async (userId: string) => {
    await AdminService.unbanUser(userId);
    setUsers(users.map(user => user.uid === userId ? { ...user, banned: false } : user));
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">User Moderation</h2>
      <div className="space-y-4">
        {users.map(user => (
          <div key={user.uid} className="flex items-center justify-between p-4 border rounded">
            <div>
              <p className="font-semibold">{user.email}</p>
              <p className="text-sm text-gray-600">ID: {user.uid}</p>
              <p className="text-sm">Admin: {user.isAdmin ? 'Yes' : 'No'} | Banned: {user.banned ? 'Yes' : 'No'}</p>
            </div>
            <div className="space-x-2">
              {user.banned ? (
                <button onClick={() => handleUnban(user.uid)} className="px-4 py-2 bg-green-500 text-white rounded">Unban</button>
              ) : (
                <button onClick={() => handleBan(user.uid)} className="px-4 py-2 bg-red-500 text-white rounded">Ban</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserModeration;
