import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import NotificationCenter from './NotificationCenter';

const NotificationBell: React.FC = () => {
  const { getUnreadNotifications } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const updateUnreadCount = () => {
      const unread = getUnreadNotifications();
      setUnreadCount(unread.length);
    };

    updateUnreadCount();

    // Update count every 5 seconds to catch any new notifications
    const interval = setInterval(updateUnreadCount, 5000);

    return () => clearInterval(interval);
  }, [getUnreadNotifications]);

  const handleToggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={handleToggleNotifications}
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />

        {/* Unread count badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Center */}
      <div className="absolute right-0 top-12 z-50">
        <NotificationCenter
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </div>
    </div>
  );
};

export default NotificationBell;
