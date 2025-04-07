import React from 'react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { FiChevronLeft, FiChevronRight, FiCalendar, FiClock, FiGrid } from 'react-icons/fi';
import { useDateStore } from '@/store/useDateStore';
import { useViewStore } from '@/store/useViewStore';
import { ViewType } from '@/types/todo';

const CalendarHeader: React.FC = () => {
  const { currentDate, goToPrevMonth, goToNextMonth } = useDateStore();
  const { currentView, setCurrentView } = useViewStore();

  const handlePrevMonth = () => {
    goToPrevMonth();
  };

  const handleNextMonth = () => {
    goToNextMonth();
  };

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
  };

  return (
    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
      <div className="flex items-center">
        <h2 className="text-lg font-semibold">
          {format(currentDate, 'yyyy年M月', { locale: zhCN })}
        </h2>
        <div className="ml-4 flex space-x-1">
          <button
            onClick={handlePrevMonth}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
          >
            <FiChevronLeft size={18} />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
          >
            <FiChevronRight size={18} />
          </button>
        </div>
      </div>
      
      <div className="flex space-x-1 bg-white/10 rounded-md p-1 backdrop-blur-sm">
        <button
          onClick={() => handleViewChange('day')}
          className={`px-3 py-1.5 rounded-md text-sm flex items-center ${
            currentView === 'day' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'hover:bg-white/10 transition-colors'
          }`}
        >
          <FiClock className="mr-1.5" />
          日
        </button>
        <button
          onClick={() => handleViewChange('week')}
          className={`px-3 py-1.5 rounded-md text-sm flex items-center ${
            currentView === 'week' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'hover:bg-white/10 transition-colors'
          }`}
        >
          <FiCalendar className="mr-1.5" />
          周
        </button>
        <button
          onClick={() => handleViewChange('month')}
          className={`px-3 py-1.5 rounded-md text-sm flex items-center ${
            currentView === 'month' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'hover:bg-white/10 transition-colors'
          }`}
        >
          <FiGrid className="mr-1.5" />
          月
        </button>
      </div>
    </div>
  );
};

export default CalendarHeader; 