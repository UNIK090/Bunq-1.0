import React, { useState } from 'react';
import UserModeration from './UserModeration';
import ContentManagement from './ContentManagement';
import AnalyticsDashboard from './AnalyticsDashboard';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'content' | 'analytics'>('users');

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="mb-4">
        <button
          className={`mr-4 px-4 py-2 rounded ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('users')}
        >
          User Moderation
        </button>
        <button
          className={`mr-4 px-4 py-2 rounded ${activeTab === 'content' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('content')}
        >
          Content Management
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'analytics' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>
      <div>
        {activeTab === 'users' && <UserModeration />}
        {activeTab === 'content' && <ContentManagement />}
        {activeTab === 'analytics' && <AnalyticsDashboard />}
      </div>
    </div>
  );
};

export default AdminDashboard;
