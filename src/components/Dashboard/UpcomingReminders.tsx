import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { format } from 'date-fns';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ArrowRight, 
  Plus 
} from 'lucide-react';

const UpcomingReminders: React.FC = () => {
  const navigate = useNavigate();
  const { notifications } = useAppStore();

  // Filter and sort upcoming reminders
  const upcomingReminders = notifications
    .filter(notification => notification.type === 'reminder' && new Date(notification.scheduledFor) > new Date())
    .sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime())
    .slice(0, 5); // Get the 5 nearest upcoming reminders

  const goToCalendar = () => {
    navigate('/calendar');
  };

  return (
    <div>
      <div className="space-y-4">
        {upcomingReminders.map((reminder) => (
          <div key={reminder.id} className="flex items-start p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-full mr-3">
              <CalendarIcon className="h-5 w-5 text-indigo-500" />
            </div>
            
            <div className="flex-1">
              <h3 className="font-medium mb-1">{reminder.title}</h3>
              
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Clock className="h-4 w-4 mr-1" />
                <span>
                  {format(new Date(reminder.scheduledFor), 'MMM dd, yyyy HH:mm')}
                </span>
              </div>
            </div>
          </div>
        ))}
        {upcomingReminders.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400">No upcoming reminders</p>
        )}
      </div>
      
      <div className="mt-6 flex flex-col space-y-2">
        <button
          onClick={goToCalendar}
          className="w-full bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900 dark:hover:bg-indigo-800 text-indigo-600 dark:text-indigo-300 font-medium py-2 px-4 rounded-md flex items-center justify-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Reminder
        </button>
        
        <button
          onClick={goToCalendar}
          className="w-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 hover:underline text-sm py-1 px-4"
        >
          View All Reminders
          <ArrowRight className="h-3 w-3 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default UpcomingReminders;