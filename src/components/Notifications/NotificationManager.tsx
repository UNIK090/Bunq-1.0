import React, { useState, useEffect } from "react";
import { useAppStore } from "../../store/useAppStore";
import { AppNotification } from "../../types";
import NotificationToast from "./NotificationToast";

const NotificationManager: React.FC = () => {
  const { notifications, markNotificationAsRead } = useAppStore();
  const [activeToasts, setActiveToasts] = useState<AppNotification[]>([]);

  useEffect(() => {
    const unreadNotifications = notifications.filter(
      (notification) => !notification.read
    );

    setActiveToasts(unreadNotifications);
  }, [notifications]);

  const handleCloseToast = (notificationId: string) => {
    setActiveToasts((prev) =>
      prev.filter((toast) => toast.id !== notificationId)
    );
    markNotificationAsRead(notificationId);
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {activeToasts.map((notification) => (
        <NotificationToast
          key={`${notification.id}-${notification.createdAt}`}
          notification={notification}
          onClose={() => handleCloseToast(notification.id)}
        />
      ))}
    </div>
  );
};

export default NotificationManager;