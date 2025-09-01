import React from 'react';

const AnalyticsDashboard: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Analytics Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded">
          <h3 className="font-semibold">User Engagement</h3>
          <p>Charts and metrics here</p>
        </div>
        <div className="p-4 border rounded">
          <h3 className="font-semibold">Social Interactions</h3>
          <p>Interaction data here</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
