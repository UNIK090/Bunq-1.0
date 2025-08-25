import React, { useState, useEffect } from "react";
import { Bell, X, CheckCircle, Clock, Trophy, Target } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { AppNotification } from "../../types";
import { formatDistanceToNow } from "date-fns";

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
}) => {
  const { notifications, markNotificationAsRead, getUnreadNotifications } =
    useAppStore();

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const unread = getUnreadNotifications();
    setUnreadCount(unread.length);
  }, [notifications, getUnreadNotifications]);

  const handleMarkAsRead = (notificationId: string) => {
    markNotificationAsRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    const unreadNotifications = getUnreadNotifications();
    unreadNotifications.forEach((notification) => {
      markNotificationAsRead(notification.id);
    });
  };

  const getNotificationIcon = (type: AppNotification["type"]) => {
    switch (type) {
      case "completion":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "reminder":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "streak":
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case "goal":
        return <Target className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:static lg:inset-auto lg:z-auto">
      {/* Mobile backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 lg:hidden"
        onClick={onClose}
      />

      {/* Notification panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-xl lg:relative lg:h-auto lg:max-h-96 lg:rounded-lg lg:border lg:border-gray-200 lg:dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-indigo-500" />
            <h2 className="text-lg font-semibold">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Notifications list */}
        <div className="max-h-80 overflow-y-auto">
          {sortedNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-gray-500 dark:text-gray-400 mb-1">
                No notifications yet
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                You'll see updates about your learning progress here
              </p>
            </div>
          ) : (
            <div className="divide-y dark:divide-gray-700">
              {sortedNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                    !notification.read
                      ? "bg-indigo-50 dark:bg-indigo-900/20"
                      : ""
                  }`}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3
                          className={`text-sm font-medium ${
                            !notification.read
                              ? "text-gray-900 dark:text-gray-100"
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0 ml-2" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {sortedNotifications.length > 0 && (
          <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              {sortedNotifications.length} total notification
              {sortedNotifications.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
