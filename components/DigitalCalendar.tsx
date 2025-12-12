import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';

const DigitalCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const today = new Date();
  const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;

  const days = [];
  // Empty slots for previous month
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50/50 border border-gray-100/50"></div>);
  }
  // Days of current month
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = isCurrentMonth && today.getDate() === d;
    days.push(
      <div 
        key={d} 
        className={`
            h-24 border border-gray-100 p-2 relative group hover:bg-blue-50/50 transition-colors
            ${isToday ? 'bg-blue-50' : 'bg-white'}
        `}
      >
        <span className={`
            w-7 h-7 flex items-center justify-center rounded-full text-sm font-semibold
            ${isToday ? 'bg-blue-600 text-white' : 'text-gray-700'}
        `}>
            {d}
        </span>
        {isToday && (
            <span className="absolute bottom-2 right-2 text-xs text-blue-600 font-medium hidden sm:block">Today</span>
        )}
      </div>
    );
  }

  const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[calc(100vh-8rem)]">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                    <CalendarIcon size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">{monthNames[month]} {year}</h2>
                    <p className="text-gray-500 text-sm flex items-center gap-1">
                        <Clock size={12} /> Digital Calendar
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ChevronLeft/></button>
                <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Today</button>
                <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ChevronRight/></button>
            </div>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {day}
                </div>
            ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7 flex-1 overflow-y-auto custom-scrollbar bg-gray-50">
            {days}
        </div>
    </div>
  );
};

export default DigitalCalendar;