import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Helper to get the number of days in a month
const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

// Helper to get the first day of the month (0 for Sunday, 1 for Monday, etc.)
const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay();
};

const CalendarGrid = () => {
  const [currentDate, setCurrentDate] = React.useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);

  const calendarDays = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="border-r border-b border-gray-200"></div>);
  }

  // Add the actual days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday =
      day === new Date().getDate() &&
      month === new Date().getMonth() &&
      year === new Date().getFullYear();

    calendarDays.push(
      <div key={day} className="relative h-28 border-r border-b border-gray-200 p-2">
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-full text-sm ${
            isToday ? 'bg-blue-600 text-white' : 'text-gray-700'
          }`}
        >
          {day}
        </span>
      </div>
    );
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="mx-auto max-w-4xl p-4 font-sans">
      <div className="flex items-center justify-between py-2">
        <h2 className="text-xl font-semibold text-gray-800">
          {monthName} {year}
        </h2>
        <div className="flex items-center space-x-2">
          <button onClick={handlePrevMonth} className="rounded p-1 hover:bg-gray-100">
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <button onClick={handleNextMonth} className="rounded p-1 hover:bg-gray-100">
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-center text-sm font-semibold text-gray-500">
        {weekDays.map((day) => (
          <div key={day} className="py-2 border-b border-gray-200">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 border-l border-t border-gray-200">
        {calendarDays}
      </div>
    </div>
  );
};

export default CalendarGrid;