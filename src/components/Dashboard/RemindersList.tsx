import React from 'react';
import { Clock } from 'lucide-react';

interface Reminder {
  id: string;
  title: string;
  date: string;
  time: string;
}

interface RemindersListProps {
  reminders: Reminder[];
}

const RemindersList: React.FC<RemindersListProps> = ({ reminders }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Upcoming Reminders</h2>
      {reminders.length > 0 ? (
        <ul className="space-y-2">
          {reminders.map((reminder) => (
            <li key={reminder.id} className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm">{reminder.title}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {reminder.date} at {reminder.time}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">No upcoming reminders</p>
      )}
    </div>
  );
};

export default RemindersList;