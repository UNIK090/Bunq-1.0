import React, { useState } from 'react';
import { Bell, Clock, CheckCircle, Trophy, Target, X, Settings } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { notificationService } from '../../services/notificationService';
import toast from 'react-hot-toast';

interface NotificationSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ isOpen, onClose }) => {
  const { notificationSettings, updateNotificationSettings } = useAppStore();
  const [tempSettings, setTempSettings] = useState(notificationSettings);
  const [hasPermission, setHasPermission] = useState(notificationService.hasPermission());

  const handleRequestPermission = async () => {
    try {
      const permission = await notificationService.requestPermission();
      setHasPermission(permission === 'granted');

      if (permission === 'granted') {
        toast.success('Notifications enabled successfully!');
        setTempSettings(prev => ({ ...prev, enabled: true }));
      } else if (permission === 'denied') {
        toast.error('Notification permission denied. You can enable it in your browser settings.');
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.error('Failed to request notification permission.');
    }
  };

  const handleSaveSettings = () => {
    updateNotificationSettings(tempSettings);
    toast.success('Notification settings saved!');
    onClose();
  };

  const handleTestNotification = () => {
    if (!hasPermission) {
      toast.error('Please enable notifications first');
      return;
    }

    notificationService.showVideoCompletionNotification(
      'Sample Video Title - This is a test notification',
      '/favicon.ico'
    );
  };

  const notificationTypes = [
    {
      id: 'completionNotifications',
      title: 'Video Completion',
      description: 'Get notified when you complete a video',
      icon: <CheckCircle className="h-5 w-5 text-green-500" />
    },
    {
      id: 'dailyGoalReminders',
      title: 'Daily Goal Reminders',
      description: 'Reminders about your daily learning goals',
      icon: <Target className="h-5 w-5 text-purple-500" />
    }
  ];

  const reminderOptions = [
    { value: 5, label: '5 minutes before' },
    { value: 10, label: '10 minutes before' },
    { value: 15, label: '15 minutes before' },
    { value: 30, label: '30 minutes before' },
    { value: 60, label: '1 hour before' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-indigo-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Notification Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Browser Permission Status */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Browser Notifications
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {hasPermission
                    ? 'Notifications are enabled in your browser'
                    : 'Enable browser notifications to receive alerts'
                  }
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {hasPermission ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400">
                    Enabled
                  </span>
                ) : (
                  <button
                    onClick={handleRequestPermission}
                    className="text-xs px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Enable
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Master Enable/Disable */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Enable Notifications
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Turn all notifications on or off
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={tempSettings.enabled && hasPermission}
                onChange={(e) => setTempSettings(prev => ({
                  ...prev,
                  enabled: e.target.checked
                }))}
                disabled={!hasPermission}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* Notification Types */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Notification Types
            </h3>

            {notificationTypes.map((type) => (
              <div key={type.id} className="flex items-center justify-between">
                <div className="flex items-start space-x-3">
                  {type.icon}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {type.title}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {type.description}
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempSettings[type.id as keyof typeof tempSettings] as boolean}
                    onChange={(e) => setTempSettings(prev => ({
                      ...prev,
                      [type.id]: e.target.checked
                    }))}
                    disabled={!tempSettings.enabled || !hasPermission}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600 peer-disabled:opacity-50"></div>
                </label>
              </div>
            ))}
          </div>

          {/* Reminder Timing */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center">
              <Clock className="h-4 w-4 mr-2 text-blue-500" />
              Reminder Timing
            </h3>
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                Send reminders
              </label>
              <select
                value={tempSettings.remindersBefore}
                onChange={(e) => setTempSettings(prev => ({
                  ...prev,
                  remindersBefore: parseInt(e.target.value)
                }))}
                disabled={!tempSettings.enabled || !hasPermission}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50"
              >
                {reminderOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Test Notification */}
          {hasPermission && tempSettings.enabled && (
            <div className="pt-4 border-t dark:border-gray-700">
              <button
                onClick={handleTestNotification}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
              >
                Send Test Notification
              </button>
            </div>
          )}

          {/* Help Text */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
            <p className="text-xs text-blue-800 dark:text-blue-300">
              <strong>Tip:</strong> Notifications help you stay on track with your learning goals.
              You can always adjust these settings later or disable specific notification types.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveSettings}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
