import React, { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
} from "date-fns";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Play, Plus, Clock, Eye, X, Settings } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { useNavigate } from "react-router-dom";
import { DailyVideoActivity } from "../../types";
import toast from "react-hot-toast";
import { notificationService } from "../../services/notificationService";
import VideoActivityCard from "./VideoActivityCard";
import DailyStats from "./DailyStats";
import NotificationSettings from "../Notifications/NotificationSettings";

const CalendarView: React.FC = () => {
  const navigate = useNavigate();
  const {
    getActivitiesForDate,
    setCurrentVideo,
    notificationSettings,
  } = useAppStore();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedDayActivities, setSelectedDayActivities] = useState<DailyVideoActivity[]>([]);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h2 className="text-xl font-bold">{format(currentDate, 'MMMM yyyy')}</h2>
        <button onClick={nextMonth} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const dateFormat = "EEEEE";
    const days = [];
    let startDate = startOfWeek(currentDate);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-bold text-sm">
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    return <div className="grid grid-cols-7 gap-1 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const formattedDate = format(cloneDay, 'yyyy-MM-dd');
        const activities = getActivitiesForDate(formattedDate);
        
        days.push(
          <div
            key={day.toString()}
            className={`p-1 border ${
              !isSameMonth(day, monthStart)
                ? "text-gray-400 bg-gray-100 dark:bg-gray-800"
                : isToday(day)
                ? "bg-blue-100 dark:bg-blue-900"
                : ""
            } min-h-[100px] cursor-pointer`}
            onClick={() => handleDateClick(cloneDay)}
          >
            <div className="text-right">{format(day, 'd')}</div>
            <div className="mt-1 space-y-1">
              {activities.slice(0, 2).map((activity) => (
                <div
                  key={activity.id}
                  className="relative w-full h-8 rounded overflow-hidden"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVideoClick(activity);
                  }}
                >
                  <img
                    src={activity.video.thumbnail}
                    alt={activity.video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Play className="text-white h-4 w-4" />
                  </div>
                </div>
              ))}
              {activities.length > 2 && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  +{activities.length - 2} more
                </div>
              )}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-1">
          {days}
        </div>
      );
      days = [];
    }
    return <div className="space-y-1">{rows}</div>;
  };

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    const dateString = format(date, "yyyy-MM-dd");
    const activities = getActivitiesForDate(dateString);
    setSelectedDayActivities(activities);
  };

  const handleVideoClick = (activity: DailyVideoActivity) => {
    setCurrentVideo(activity.video);
    navigate('/player');
  };

  useEffect(() => {
    if (selectedDate) {
      const dateString = format(selectedDate, "yyyy-MM-dd");
      const activities = getActivitiesForDate(dateString);
      setSelectedDayActivities(activities);
    }
  }, [selectedDate, getActivitiesForDate]);

  const [reminderForm, setReminderForm] = useState({
    title: "",
    date: format(new Date(), "yyyy-MM-dd"),
    time: "12:00",
    duration: "30",
  });

  const handleCreateReminder = () => {
    // TODO: Implement reminder creation logic
    toast.success("Reminder created successfully!");
    setShowModal(false);
  };

  // Initialize notifications on component mount
  useEffect(() => {
    if (notificationSettings.enabled && !notificationService.hasPermission()) {
      notificationService.requestPermission();
    }
  }, [notificationSettings.enabled]);

  return (
    <div className="h-screen flex flex-col space-y-3 p-4">
      <div className="flex justify-between items-center flex-shrink-0">
        <h1 className="text-xl font-bold">Learning Schedule</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm"
        >
          <Plus className="h-4 w-4 mr-1" />
          New Reminder
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          {renderHeader()}
          {renderDays()}
          {renderCells()}
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center mb-2 flex-shrink-0">
            <Eye className="h-4 w-4 mr-2 text-indigo-500" />
            <h2 className="text-base font-medium">
              {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
            </h2>
          </div>

          {selectedDayActivities.length > 0 ? (
            <div className="space-y-2 flex-1 min-h-0">
              <DailyStats
                activities={selectedDayActivities}
                date={selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""}
              />

              <div className="space-y-2 flex-1 overflow-hidden">
                <div className="flex items-center justify-between flex-shrink-0">
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Video Activities
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {selectedDayActivities.length} video
                    {selectedDayActivities.length !== 1 ? "s" : ""}
                  </div>
                </div>
                
                {/* Scrollable video activities container */}
                <div className="relative flex-1 overflow-hidden">
                  <div className="space-y-2 overflow-y-auto max-h-96 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
                    {selectedDayActivities.map((activity) => (
                      <VideoActivityCard
                        key={activity.id}
                        activity={activity}
                        onClick={() => handleVideoClick(activity)}
                        className="animate-fade-in"
                      />
                    ))}
                  </div>
                  
                  {/* Scroll indicators */}
                  {selectedDayActivities.length > 5 && (
                    <>
                      <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white dark:from-gray-800 to-transparent pointer-events-none" />
                      <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white dark:from-gray-800 to-transparent pointer-events-none" />
                    </>
                  )}
                  
                  {/* Scroll buttons for better navigation */}
                  {selectedDayActivities.length > 8 && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col space-y-1">
                      <button
                        onClick={() => {
                          const container = document.querySelector('.overflow-y-auto');
                          if (container) {
                            container.scrollBy({ top: -200, behavior: 'smooth' });
                          }
                        }}
                        className="p-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                        title="Scroll up"
                      >
                        <ChevronUp className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => {
                          const container = document.querySelector('.overflow-y-auto');
                          if (container) {
                            container.scrollBy({ top: 200, behavior: 'smooth' });
                          }
                        }}
                        className="p-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                        title="Scroll down"
                      >
                        <ChevronDown className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 flex-1 flex flex-col items-center justify-center">
              <Clock className="h-8 w-8 mx-auto text-gray-400 dark:text-gray-500 mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                No videos watched on this day
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Start watching videos to see your activity here
              </p>
            </div>
          )}

          <div className="mt-3 pt-2 border-t dark:border-gray-700 flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-medium text-gray-700 dark:text-gray-300">
                Notifications
              </h3>
              <button
                onClick={() => setShowNotificationSettings(true)}
                className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Notification Settings"
              >
                <Settings className="h-3 w-3 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600 dark:text-gray-400">
                  Status:
                </span>
                <span
                  className={`font-medium ${
                    notificationSettings.enabled &&
                    notificationService.hasPermission()
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {notificationSettings.enabled &&
                  notificationService.hasPermission()
                    ? "Enabled"
                    : "Disabled"}
                </span>
              </div>
              <button
                onClick={() => setShowNotificationSettings(true)}
                className="w-full text-xs text-indigo-600 dark:text-indigo-400 hover:underline text-left"
              >
                Configure notifications →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Reminder Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-50 dark:bg-black dark:bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">
            <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-bold">Add Learning Reminder</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Reminder Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={reminderForm.title}
                    onChange={(e) =>
                      setReminderForm({
                        ...reminderForm,
                        title: e.target.value,
                      })
                    }
                    className="w-full p-2 border dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                    placeholder="e.g., Complete React Tutorial"
                  />
                </div>

                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={reminderForm.date}
                    onChange={(e) =>
                      setReminderForm({ ...reminderForm, date: e.target.value })
                    }
                    className="w-full p-2 border dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label
                    htmlFor="time"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Time
                  </label>
                  <input
                    type="time"
                    id="time"
                    value={reminderForm.time}
                    onChange={(e) =>
                      setReminderForm({ ...reminderForm, time: e.target.value })
                    }
                    className="w-full p-2 border dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label
                    htmlFor="duration"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Duration (minutes)
                  </label>
                  <select
                    id="duration"
                    value={reminderForm.duration}
                    onChange={(e) =>
                      setReminderForm({
                        ...reminderForm,
                        duration: e.target.value,
                      })
                    }
                    className="w-full p-2 border dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="90">1.5 hours</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notification"
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="notification"
                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                  >
                    Send notification 10 minutes before
                  </label>
                </div>
              </div>
            </div>

            <div className="p-4 border-t dark:border-gray-700 flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-gray-800 dark:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateReminder}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Create Reminder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Settings Modal */}
      <NotificationSettings
        isOpen={showNotificationSettings}
        onClose={() => setShowNotificationSettings(false)}
      />
    </div>
  );
};

export default CalendarView;