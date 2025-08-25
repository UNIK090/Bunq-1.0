import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, Clock, Trophy, Target, Bell } from "lucide-react";
import { AppNotification } from "../../types";

interface NotificationToastProps {
  notification: AppNotification;
  onClose: () => void;
  onRead: () => void;
  autoClose?: boolean;
  duration?: number;
}

const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onClose,
  onRead,
  autoClose = true,
  duration = 5000,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (autoClose && notification.type !== "reminder") {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, notification.type]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleClick = () => {
    if (!notification.read) {
      onRead();
    }
    handleClose();
  };

  const getIcon = () => {
    switch (notification.type) {
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

  const getBackgroundColor = () => {
    switch (notification.type) {
      case "completion":
        return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
      case "reminder":
        return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
      case "streak":
        return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800";
      case "goal":
        return "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800";
      default:
        return "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700";
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`
            fixed top-4 right-4 z-50 max-w-sm w-full
            rounded-lg border shadow-lg cursor-pointer
            hover:shadow-xl transition-shadow duration-200
            ${getBackgroundColor()}
          `}
        >
          <div onClick={handleClick} className="p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {notification.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {notification.message}
                </p>

                {/* Action buttons for reminders */}
                {notification.type === "reminder" && (
                  <div className="mt-3 flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClose();
                      }}
                      className="text-xs px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/70 transition-colors"
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle "Start Learning" action
                        handleClose();
                      }}
                      className="text-xs px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Start Learning
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClose();
                }}
                className="flex-shrink-0 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Progress bar for auto-close */}
          {autoClose && notification.type !== "reminder" && (
            <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-b-lg overflow-hidden">
              <div
                className="h-full bg-gray-400 dark:bg-gray-500 rounded-b-lg animate-pulse"
                style={{
                  animation: `shrink ${duration}ms linear forwards`,
                }}
              />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationToast;